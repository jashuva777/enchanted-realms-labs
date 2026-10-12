import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Download, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { SyllabusModule } from '@/lib/syllabus';
import notes from '@/assets/course-notes.json';
export function ModuleReader({ module, close }: { module: SyllabusModule; close: () => void }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduced = useReducedMotion();
  const topic = module.pages[index];
  const pdf = notes.modules.find(item => item.number === module.number);
  function turn(next: number) { if (next < 0 || next >= module.pages.length) return; setDirection(next > index ? 1 : -1); setIndex(next); }
  if (!topic) return null;
  return <Dialog open onOpenChange={open => { if (!open) close(); }}><DialogContent className="reader-dialog" onKeyDown={e => { if (e.target instanceof HTMLSelectElement) return; if (e.key === 'ArrowRight') turn(index + 1); if (e.key === 'ArrowLeft') turn(index - 1); }}><DialogHeader><p className="eyebrow"><BookOpen size={12} />MODULE {module.number} · {module.periods} PERIODS</p><DialogTitle className="pt-2 text-2xl leading-snug">{module.title}</DialogTitle><DialogDescription>{module.description}</DialogDescription></DialogHeader>
    <div className="reader-toolbar"><select className="reader-select" aria-label="Choose topic" value={index} onChange={e => turn(Number(e.target.value))}>{module.pages.map((p, i) => <option key={p.title} value={i}>{String(i + 1).padStart(2, '0')} · {p.title}</option>)}</select>{pdf && <Button asChild variant="outline" size="sm"><a href={pdf.url} download={`mbu-module-${module.number}-notes.pdf`}><Download />PDF notes</a></Button>}</div>
    <div className="book-stage"><AnimatePresence mode="wait" initial={false} custom={direction}><motion.article key={index} className="book-page" aria-label={`Topic page ${index + 1}`} custom={direction} variants={{ enter: (d: number) => ({ opacity: 0, rotateY: reduced ? 0 : d * 65 }), center: { opacity: 1, rotateY: 0 }, exit: (d: number) => ({ opacity: 0, rotateY: reduced ? 0 : -d * 65 }) }} initial="enter" animate="center" exit="exit" transition={{ duration: reduced ? 0 : .28, ease: 'easeInOut' }}><span className="eyebrow">TOPIC {String(index + 1).padStart(2, '0')}</span><h3>{topic.title}</h3><p>{topic.summary}</p><div className="book-example"><strong>IN PRACTICE</strong><p>{topic.example}</p></div></motion.article></AnimatePresence></div>
    <div className="reader-pagination"><Button variant="outline" size="sm" disabled={index === 0} onClick={() => turn(index - 1)}><ArrowLeft />Previous</Button><span className="font-mono text-[10px] text-muted-foreground" aria-live="polite">Page {index + 1} of {module.pages.length}</span><Button variant="outline" size="sm" disabled={index === module.pages.length - 1} onClick={() => turn(index + 1)}>Next<ArrowRight /></Button></div>
  </DialogContent></Dialog>;
}
