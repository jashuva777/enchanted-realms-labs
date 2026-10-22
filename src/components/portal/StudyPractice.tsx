import { useState } from 'react';
import { MessageCircleQuestion, Files, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { modules } from '@/lib/syllabus';
import { filterStudyQuestions, questionMarkOptions } from '@/lib/study-practice';

function ModuleFilter({ value, onChange, label, all = false }: { value: string; onChange: (value: string) => void; label: string; all?: boolean }) {
  return <Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label} className="w-full sm:w-64"><SelectValue /></SelectTrigger><SelectContent>{all && <SelectItem value="all">All modules</SelectItem>}{modules.map(module => <SelectItem key={module.number} value={String(module.number)}>Module {module.number} · {module.title}</SelectItem>)}</SelectContent></Select>;
}

export function VivaPractice() {
  const [module, setModule] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState<string[]>([]);
  const questions = filterStudyQuestions(module, search);
  const pageCount = Math.max(1, Math.ceil(questions.length / 10));
  const visible = questions.slice(page * 10, page * 10 + 10);
  const reset = () => { setPage(0); setOpen([]); };
  return <section id="viva-practice" className="page-section"><div className="portal-container">
    <div className="section-heading"><div><div className="eyebrow"><MessageCircleQuestion size={14} />ORAL EXAM PREPARATION</div><h2>Viva practice</h2></div><span className="section-caption">05 MODULES</span></div>
    <div className="mb-5 flex flex-wrap items-center gap-3"><div className="relative min-w-0 flex-1 basis-64"><Search size={16} className="pointer-events-none absolute left-3 top-3 text-muted-foreground" /><Input aria-label="Search viva questions" placeholder="Search viva questions…" value={search} onChange={event => { setSearch(event.target.value); reset(); }} className="h-10 pl-10" /></div><ModuleFilter label="Viva module" value={module} onChange={value => { setModule(value); reset(); }} all /><span className="font-mono text-xs text-muted-foreground" role="status">{questions.length} questions</span></div>
    <Accordion type="multiple" value={open} onValueChange={setOpen} className="space-y-3">{visible.map(item => <AccordionItem key={item.id} value={item.id} className="rounded-md border border-border bg-card px-4"><AccordionTrigger className="gap-3 hover:no-underline"><span className="flex min-w-0 items-center gap-3"><span className="shrink-0 rounded border border-primary/25 bg-primary/5 px-2 py-1 font-mono text-[10px] text-primary">{item.id}</span><span>{item.question}</span></span></AccordionTrigger><AccordionContent className="border-t border-border pt-4"><p className="mb-2 font-mono text-[10px] text-gold">SUGGESTED ANSWER · MODULE {item.module}</p><p className="leading-7 text-muted-foreground">{item.answer}</p><p className="mt-3 leading-6"><span className="font-medium text-primary">Example: </span>{item.example}</p></AccordionContent></AccordionItem>)}</Accordion>
    {!questions.length && <p className="py-10 text-center text-muted-foreground">No questions match your search.</p>}
    <div className="mt-5 flex items-center justify-between gap-3"><Button variant="outline" size="sm" disabled={page === 0} onClick={() => { setPage(page - 1); setOpen([]); }}><ChevronLeft />Previous</Button><span className="font-mono text-xs text-muted-foreground">Page {page + 1} of {pageCount}</span><Button variant="outline" size="sm" disabled={page + 1 >= pageCount} onClick={() => { setPage(page + 1); setOpen([]); }}>Next<ChevronRight /></Button></div>
  </div></section>;
}

export function QuestionPapers() {
  const [module, setModule] = useState('1');
  const [search, setSearch] = useState('');
  const questions = filterStudyQuestions(module, search);
  const selected = modules.find(item => item.number === Number(module));
  return <section id="question-papers" className="page-section"><div className="portal-container">
    <div className="section-heading"><div><div className="eyebrow"><Files size={14} />EXAM PREPARATION</div><h2>Question papers</h2><p>Syllabus-based practice questions · Not official university past papers.</p></div><span className="section-caption">2 & 8 MARKS</span></div>
    <div className="mb-6 flex flex-wrap gap-3"><ModuleFilter label="Question paper module" value={module} onChange={setModule} /><div className="relative min-w-0 flex-1 basis-64"><Search size={16} className="pointer-events-none absolute left-3 top-3 text-muted-foreground" /><Input aria-label="Search question papers" placeholder="Search topics…" value={search} onChange={event => setSearch(event.target.value)} className="h-10 pl-10" /></div></div>
    <Tabs defaultValue="2"><div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5"><h3 className="text-lg font-medium">Module {module} · {selected?.title}</h3><TabsList aria-label="Question marks">{questionMarkOptions.map(marks => <TabsTrigger key={marks} value={String(marks)}>{marks} marks</TabsTrigger>)}</TabsList></div>
      {questionMarkOptions.map(marks => <TabsContent key={marks} value={String(marks)}><div className="flex justify-between py-5 font-mono text-xs text-muted-foreground"><span>{marks === 2 ? 'SHORT ANSWER' : 'LONG ANSWER'}</span><span>{questions.length} questions · {marks} marks each</span></div><ol className="divide-y divide-border">{questions.map((item, index) => <li key={item.id} className="flex gap-4 py-5"><span className="w-8 shrink-0 font-mono text-sm text-primary">{String(index + 1).padStart(2, '0')}.</span><div className="min-w-0 flex-1"><p className="text-sm leading-7">{marks === 2 ? item.question : item.longQuestion}</p><p className="mt-2 font-mono text-[10px] text-muted-foreground">{item.topic}</p></div><span className="shrink-0 font-mono text-xs text-gold">[{marks}]</span></li>)}</ol>{!questions.length && <p className="py-10 text-center text-muted-foreground">No questions match your search.</p>}</TabsContent>)}
    </Tabs>
  </div></section>;
}