import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Play, RotateCcw, Square, Terminal, Clock3, Youtube, CheckCircle2, Loader2, Download, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { experiments } from '@/lib/portal-data';
import { PortalNav, PortalFooter } from './PortalChrome';
export function LabPage({ experiment }: { experiment: typeof experiments[number] }) {
  const [code, setCode] = useState(experiment.code);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('Ready');
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoError, setVideoError] = useState('');
  const [exports, setExports] = useState<{ name: string; url: string }[]>([]);
  const exportUrls = useRef<string[]>([]);
  const worker = useRef<Worker | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimer = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; };
  useEffect(() => { setCode(experiment.code); setOutput(''); setStatus('Ready'); setRunning(false); setVideoUrl(''); setVideoError(''); setExports([]); worker.current?.terminate(); worker.current = null; return () => { worker.current?.terminate(); if (timer.current) clearTimeout(timer.current); exportUrls.current.forEach(url => URL.revokeObjectURL(url)); exportUrls.current = []; }; }, [experiment.id, experiment.code]);
  function clearExports() { exportUrls.current.forEach(url => URL.revokeObjectURL(url)); exportUrls.current = []; setExports([]); }
  function openVideo() {
    try {
      const url = new URL(videoUrl);
      if (url.protocol !== 'https:' || !['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'].includes(url.hostname)) throw new Error();
      window.open(url.href, '_blank', 'noopener,noreferrer'); setVideoError('');
    } catch { setVideoError('Enter a valid https:// YouTube link.'); }
  }
  function stop() { worker.current?.terminate(); worker.current = null; clearTimer(); setRunning(false); setStatus('Stopped'); }
  function run() {
    clearExports(); setOutput(''); setError(false); setRunning(true); setStatus('Starting…');
    if (!worker.current) worker.current = new Worker(new URL('../../workers/python.worker.js', import.meta.url));
    worker.current.onmessage = ({ data }) => {
      if (data.type === 'status') setStatus(data.text);
      if (data.type === 'output') setOutput(data.text);
      if (data.type === 'done' || data.type === 'error') { clearTimer(); setOutput(data.text); setError(data.type === 'error'); setRunning(false); setStatus(data.type === 'error' ? 'Error' : 'Completed');
        if (data.type === 'done') { const files = (data.files ?? []).map((file: { name: string; bytes: Uint8Array }) => ({ name: file.name, url: URL.createObjectURL(new Blob([new Uint8Array(file.bytes)])) })); exportUrls.current = files.map((file: { url: string }) => file.url); setExports(files); }
      }
    };
    worker.current.onerror = () => { stop(); setError(true); setOutput('Python could not load. Check your internet connection and try again.'); setStatus('Error'); };
    timer.current = setTimeout(() => { stop(); setError(true); setOutput('Execution timed out after 90 seconds. Check your code and run again.'); setStatus('Timed out'); }, 90000);
    worker.current.postMessage({ code, files: experiment.files?.filter(file => file.runtime).map(file => ({ ...file, url: new URL(file.url, window.location.origin).href })) ?? [] });
  }
  return <><PortalNav lab /><main className="portal-container lab-main">
    <Button asChild variant="ghost" className="mb-8 pl-0 text-muted-foreground"><Link to="/" hash="experiments"><ArrowLeft />All experiments</Link></Button>
    <div className="eyebrow"><Terminal size={13} />{experiment.id} <span className="text-muted-foreground">/ {experiment.tag}</span></div>
    <h1 className="mt-4 text-4xl font-medium max-sm:text-3xl">{experiment.title}</h1><p className="mt-3 text-sm text-muted-foreground">{experiment.description}</p>
    <div className="lab-grid"><aside className="lab-info"><div className="flex items-center gap-2 font-mono text-[10px] text-gold"><Clock3 size={13} />{experiment.duration} · BEGINNER</div><h2>Aim</h2><p>{experiment.aim}</p><h2>Procedure</h2><ol>{experiment.procedure.map(p => <li className="mb-3" key={p}>{p}</li>)}</ol>
      {experiment.files && <><h2>Lab files</h2><ul className="space-y-1">{experiment.files.map(file => <li key={file.name}><Button asChild variant="link" size="sm" className="max-w-full justify-start px-0 text-xs"><a href={file.url} download={file.name}><Download size={12} /><span className="truncate">{file.name}</span></a></Button></li>)}</ul></>}
      <h2 className="flex items-center gap-2"><Youtube size={18} />Video walkthrough</h2>
      {experiment.videoSearch && <Button asChild variant="outline" size="sm" className="mb-4"><a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(experiment.videoSearch)}`} target="_blank" rel="noopener noreferrer">Find related videos<ArrowUpRight /></a></Button>}
      <label htmlFor="youtube-link" className="mb-2 block text-xs text-muted-foreground">YouTube video link</label><Input id="youtube-link" type="url" value={videoUrl} placeholder="https://www.youtube.com/watch?v=…" onChange={e => { setVideoUrl(e.target.value); setVideoError(''); }} aria-invalid={Boolean(videoError)} /><Button variant="outline" size="sm" className="mt-3" disabled={!videoUrl.trim()} onClick={openVideo}><Youtube />Open video<ArrowUpRight /></Button>{videoError && <p role="alert" className="mt-2 text-destructive">{videoError}</p>}
      </aside>
    <div className="min-w-0"><div className="editor-shell"><div className="editor-header"><span className="text-muted-foreground">experiment.py <span className="ml-3 text-gold">Python 3</span></span><div className="flex items-center gap-2"><Button variant="ghost" size="icon" aria-label="Reset code" title="Reset code" disabled={running} onClick={() => { clearExports(); setCode(experiment.code); setOutput(''); setStatus('Ready'); setError(false); }}><RotateCcw /></Button>{running ? <Button size="sm" variant="secondary" onClick={stop}><Square />Stop</Button> : <Button size="sm" onClick={run}><Play />Run code</Button>}</div></div>
    <textarea aria-label="Python code editor" spellCheck={false} className="code-editor" value={code} onChange={e => setCode(e.target.value)} onKeyDown={e => { if (e.key === 'Tab') { e.preventDefault(); const input = e.currentTarget; const start = input.selectionStart; const end = input.selectionEnd; setCode(code.slice(0, start) + '    ' + code.slice(end)); requestAnimationFrame(() => { input.selectionStart = start + 4; input.selectionEnd = start + 4; }); } }} />
    <div className="editor-header"><span className="flex items-center gap-2"><Terminal size={13} />Output</span><span role="status" className={`flex items-center gap-2 ${error ? 'text-destructive' : 'text-primary'}`}>{running ? <Loader2 size={12} className="animate-spin" /> : status === 'Completed' ? <CheckCircle2 size={12} /> : null}{status}</span></div><pre aria-label="Python output" aria-live="polite" className={`output-panel ${error ? 'text-destructive' : 'text-foreground'}`}>{output || <span className="text-muted-foreground">{running ? 'Python is getting ready…' : 'Output will appear here.'}</span>}</pre></div>{exports.length > 0 && <section className="mt-6"><h2 className="mb-3 text-sm font-medium">Exported files</h2><div className="flex flex-wrap gap-3">{exports.map(file => <Button key={file.name} asChild variant="outline" size="sm"><a href={file.url} download={file.name}><Download />{file.name}</a></Button>)}</div></section>}<p className="mt-4 font-mono text-[9px] text-muted-foreground">PYODIDE / BROWSER RUNTIME · {experiment.id}</p></div></div>
  </main><PortalFooter /></>;
}
