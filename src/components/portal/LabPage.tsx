import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Play, RotateCcw, Square, Terminal, Clock3, Youtube, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { experiments } from '@/lib/portal-data';
import { PortalNav, PortalFooter } from './PortalChrome';
export function LabPage({ experiment }: { experiment: typeof experiments[number] }) {
  const [code, setCode] = useState(experiment.code);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('Ready');
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(false);
  const worker = useRef<Worker | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimer = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; };
  useEffect(() => { setCode(experiment.code); setOutput(''); setStatus('Ready'); setRunning(false); worker.current?.terminate(); worker.current = null; return () => { worker.current?.terminate(); if (timer.current) clearTimeout(timer.current); }; }, [experiment.id, experiment.code]);
  function stop() { worker.current?.terminate(); worker.current = null; clearTimer(); setRunning(false); setStatus('Stopped'); }
  function run() {
    setOutput(''); setError(false); setRunning(true); setStatus('Starting…');
    if (!worker.current) worker.current = new Worker(new URL('../../workers/python.worker.js', import.meta.url));
    worker.current.onmessage = ({ data }) => {
      if (data.type === 'status') setStatus(data.text);
      if (data.type === 'output') setOutput(data.text);
      if (data.type === 'done' || data.type === 'error') { clearTimer(); setOutput(data.text); setError(data.type === 'error'); setRunning(false); setStatus(data.type === 'error' ? 'Error' : 'Completed'); }
    };
    worker.current.onerror = () => { stop(); setError(true); setOutput('Python could not load. Check your internet connection and try again.'); setStatus('Error'); };
    timer.current = setTimeout(() => { stop(); setError(true); setOutput('Execution timed out after 90 seconds. Check your code and run again.'); setStatus('Timed out'); }, 90000);
    worker.current.postMessage({ code });
  }
  return <><PortalNav lab /><main className="portal-container lab-main">
    <Button asChild variant="ghost" className="mb-8 pl-0 text-muted-foreground"><Link to="/" hash="experiments"><ArrowLeft />All experiments</Link></Button>
    <div className="eyebrow"><Terminal size={13} />{experiment.id} <span className="text-muted-foreground">/ {experiment.tag}</span></div>
    <h1 className="mt-4 text-4xl font-medium max-sm:text-3xl">{experiment.title}</h1><p className="mt-3 text-sm text-muted-foreground">{experiment.description}</p>
    <div className="lab-grid"><aside className="lab-info"><div className="flex items-center gap-2 font-mono text-[10px] text-gold"><Clock3 size={13} />{experiment.duration} · BEGINNER</div><h2>Aim</h2><p>{experiment.aim}</p><h2>Procedure</h2><ol>{experiment.procedure.map(p => <li className="mb-3" key={p}>{p}</li>)}</ol><div className="video-placeholder"><Youtube size={25} className="mx-auto mb-3 text-muted-foreground" /><p>Video walkthrough</p><p className="mt-1 font-mono text-[9px]">YouTube video not added yet</p></div></aside>
    <div><div className="editor-shell"><div className="editor-header"><span className="text-muted-foreground">experiment.py <span className="ml-3 text-gold">Python 3</span></span><div className="flex items-center gap-2"><Button variant="ghost" size="icon" aria-label="Reset code" title="Reset code" disabled={running} onClick={() => { setCode(experiment.code); setOutput(''); setStatus('Ready'); setError(false); }}><RotateCcw /></Button>{running ? <Button size="sm" variant="secondary" onClick={stop}><Square />Stop</Button> : <Button size="sm" onClick={run}><Play />Run code</Button>}</div></div>
    <textarea aria-label="Python code editor" spellCheck={false} className="code-editor" value={code} onChange={e => setCode(e.target.value)} onKeyDown={e => { if (e.key === 'Tab') { e.preventDefault(); const input = e.currentTarget; const start = input.selectionStart; const end = input.selectionEnd; setCode(code.slice(0, start) + '    ' + code.slice(end)); requestAnimationFrame(() => { input.selectionStart = start + 4; input.selectionEnd = start + 4; }); } }} />
    <div className="editor-header"><span className="flex items-center gap-2"><Terminal size={13} />Output</span><span role="status" className={`flex items-center gap-2 ${error ? 'text-destructive' : 'text-primary'}`}>{running ? <Loader2 size={12} className="animate-spin" /> : status === 'Completed' ? <CheckCircle2 size={12} /> : null}{status}</span></div><pre aria-label="Python output" aria-live="polite" className={`output-panel ${error ? 'text-destructive' : 'text-foreground'}`}>{output || <span className="text-muted-foreground">{running ? 'Python is getting ready…' : 'Output will appear here.'}</span>}</pre></div><p className="mt-4 font-mono text-[9px] text-muted-foreground">PYODIDE / BROWSER RUNTIME · {experiment.id}</p></div></div>
  </main><PortalFooter /></>;
}
