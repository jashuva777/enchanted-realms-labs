let runtime;
self.onmessage = async ({ data }) => {
  try {
    if (!runtime) {
      self.postMessage({ type: 'status', text: 'Loading Python runtime…' });
      importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');
      runtime = await self.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/' });
    }
    const lines = [];
    runtime.setStdout({ batched: text => { lines.push(text); self.postMessage({ type: 'output', text: lines.join('\n') }); } });
    runtime.setStderr({ batched: text => { lines.push(text); self.postMessage({ type: 'output', text: lines.join('\n') }); } });
    self.postMessage({ type: 'status', text: 'Preparing imports…' });
    await runtime.loadPackagesFromImports(data.code);
    if ((data.files ?? []).some(file => file.name.endsWith('.xlsx')) || /read_excel|ExcelWriter|to_excel|openpyxl/.test(data.code)) await runtime.loadPackage('openpyxl');
    runtime.FS.mkdirTree('/lab');
    runtime.FS.chdir('/lab');
    for (const name of runtime.FS.readdir('/lab')) {
      if (name !== '.' && name !== '..' && runtime.FS.isFile(runtime.FS.stat(name).mode)) runtime.FS.unlink(name);
    }
    self.postMessage({ type: 'status', text: 'Loading datasets…' });
    const originals = new Map();
    await Promise.all((data.files ?? []).map(async file => {
      if (!/^[a-zA-Z0-9_.-]+$/.test(file.name)) throw new Error('Invalid dataset filename');
      const response = await fetch(file.url);
      if (!response.ok) throw new Error(`Could not load ${file.name} (${response.status})`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      runtime.FS.writeFile(file.name, bytes);
      originals.set(file.name, bytes);
    }));
    self.postMessage({ type: 'status', text: 'Running…' });
    const globals = runtime.toPy({});
    try { await runtime.runPythonAsync(data.code, { globals }); } finally { globals.destroy(); }
    const files = [];
    for (const name of runtime.FS.readdir('/lab')) {
      if (name === '.' || name === '..' || !runtime.FS.isFile(runtime.FS.stat(`/lab/${name}`).mode)) continue;
      const bytes = runtime.FS.readFile(`/lab/${name}`);
      const original = originals.get(name);
      if (!original || bytes.length !== original.length || bytes.some((byte, index) => byte !== original[index])) files.push({ name, bytes });
    }
    self.postMessage({ type: 'done', text: lines.join('\n') || 'Completed successfully. No output.', files });
  } catch (error) { self.postMessage({ type: 'error', text: String(error) }); }
};
