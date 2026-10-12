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
    self.postMessage({ type: 'status', text: 'Running…' });
    const globals = runtime.toPy({});
    try { await runtime.runPythonAsync(data.code, { globals }); } finally { globals.destroy(); }
    self.postMessage({ type: 'done', text: lines.join('\n') || 'Completed successfully. No output.' });
  } catch (error) { self.postMessage({ type: 'error', text: String(error) }); }
};
