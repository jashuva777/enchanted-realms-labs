import { createFileRoute, Link } from '@tanstack/react-router';
import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, ArrowRight, ArrowDown, Network, Layers3, Code2, Database, ChartNoAxesCombined, Activity, BookOpen, FlaskConical, Clock3, Cpu, GraduationCap, X, Download, CircleCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import logo from '@/assets/mbu-logo.png.asset.json';
import { PortalNav, PortalFooter, Socials } from '@/components/portal/PortalChrome';
import { modules, experiments, tools, pageMeta } from '@/lib/portal-data';

const DataScene = lazy(() => import('@/components/portal/DataScene'));
export const Route = createFileRoute('/')({
  head: () => pageMeta('Data Science Learning Portal — Sangam Jashuva · MBU', 'Sangam Jashuva’s Mohan Babu University Data Science portal. Explore Unit 1, six interactive Python experiments, and your data science toolkit.'),
  component: Index,
});
function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: .55 }}>{children}</motion.div>;
}
function PhotoSlot({ professor = false }: { professor?: boolean }) {
  const [exists, setExists] = useState(false);
  useEffect(() => { const image = new Image(); image.onload = () => setExists(true); image.src = professor ? '/professor.jpg' : '/profile.jpg'; return () => { image.onload = null; }; }, [professor]);
  return <div className={professor ? 'professor-avatar' : 'avatar'}>{professor ? 'SB' : 'SJ'}{exists && <img src={professor ? '/professor.jpg' : '/profile.jpg'} alt={professor ? 'Mr. S. Bosu Babu' : 'Sangam Jashuva'} />}</div>;
}
function Index() {
  const [mounted, setMounted] = useState(false);
  const [typed, setTyped] = useState('');
  const [lesson, setLesson] = useState<number | null>(null);
  const reduced = useReducedMotion();
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const text = 'Explore data. Discover patterns. Build possibilities.';
    if (reduced) { setTyped(text); return; }
    let i = 0; const timer = setInterval(() => { i++; setTyped(text.slice(0, i)); if (i >= text.length) clearInterval(timer); }, 45);
    return () => clearInterval(timer);
  }, [reduced]);
  const icons = [Network, Layers3, Code2, Database, ChartNoAxesCombined, Activity];
  const current = lesson === null ? null : modules[lesson];
  function downloadLesson() {
    if (!current) return;
    const content = `MBU DATA SCIENCE · UNIT 1\n${current.title}\n\n${current.topics.join('\n')}\n\n${current.lesson}\n\nExample\n${current.example}\n\nSubject: 22DS102006`;
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${current.title.toLowerCase().replaceAll(' ', '-')}.txt`; anchor.click(); URL.revokeObjectURL(url);
  }
  return <><PortalNav />
    <main>
      <section id="home" className="hero">
        <div className="hero-scene" aria-label="Animated three-dimensional data network">{mounted && <Suspense fallback={<img src={logo.url} alt="" className="absolute right-1/3 top-1/3 w-32 opacity-20" />}><DataScene /></Suspense>}</div>
        <div className="portal-container hero-layout">
          <div>
            <img className="university-logo" src={logo.url} alt="MBU Mohan Babu University — Dream. Believe. Achieve." />
            <div className="eyebrow"><span className="status-dot" />CSE · DATA SCIENCE <span className="text-muted-foreground">/</span> 22DS102006</div>
            <h1>Data Science<br /><span>Learning Portal</span><span className="text-gold">.</span></h1>
            <p className="typing-line">{typed}</p>
            <div className="hero-actions"><Button asChild><Link to="/" hash="modules"><BookOpen />Explore modules<ArrowUpRight /></Link></Button><Button asChild variant="outline"><Link to="/" hash="experiments"><FlaskConical />Enter the lab<ArrowRight /></Link></Button></div>
            <div className="hero-meta"><span className="flex items-center gap-2"><BookOpen size={12} />01 UNIT</span><span className="flex items-center gap-2"><FlaskConical size={12} />06 EXPERIMENTS</span><span className="flex items-center gap-2"><Cpu size={12} />07 TOOLS</span></div>
          </div>
          <motion.aside className="student-card" aria-label="Student details" initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: .7 }}>
            <div className="flex justify-between font-mono text-[9px]"><span className="text-muted-foreground">STUDENT PROFILE</span><span className="flex items-center gap-1.5 text-primary"><span className="status-dot" />MBU</span></div>
            <PhotoSlot />
            <h2 className="text-center text-[23px] font-medium">Sangam Jashuva</h2><p className="mt-2 text-center font-mono text-[11px] text-primary">24102A030108</p>
            <div className="mt-6 border-t border-border pt-1"><dl><div className="student-detail"><dt>Program</dt><dd>B.Tech · 3rd Year</dd></div><div className="student-detail"><dt>Branch</dt><dd>CSE (Data Science)</dd></div><div className="student-detail"><dt>Semester</dt><dd>05 <span className="text-muted-foreground">/ 08</span></dd></div><div className="student-detail"><dt>University</dt><dd>Mohan Babu University</dd></div></dl></div>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4"><span className="font-mono text-[8px] text-muted-foreground">LET’S CONNECT</span><Socials /></div>
          </motion.aside>
        </div>
        <div className="portal-container hero-bottom"><span className="flex items-center gap-2"><ArrowDown size={12} />SCROLL TO DISCOVER</span><span className="flex items-center gap-2"><span className="status-dot" />A SPACE FOR CURIOSITY</span></div>
      </section>
      <section className="course-strip" aria-label="Assistant professor and course details"><div className="portal-container course-strip-inner">
        <motion.div className="flex items-center gap-4" whileHover={reduced ? {} : { rotateY: 4, rotateX: -3 }}><PhotoSlot professor /><div><p className="mb-1 font-mono text-[8px] text-gold">YOUR COURSE MENTOR</p><h2 className="text-base font-medium">Mr. S. Bosu Babu</h2><p className="mt-1 text-[11px] text-muted-foreground">Assistant Professor <span className="mx-1">·</span> Data Science</p></div></motion.div>
        <div className="course-stats"><div><strong>01<span className="ml-2 text-primary">/</span></strong><p>Learning unit</p></div><div><strong>06<span className="ml-2 text-gold">/</span></strong><p>Hands-on experiments</p></div><div><strong className="text-primary">5th</strong><p>Current semester</p></div></div>
      </div></section>
      <section id="modules" className="page-section"><div className="portal-container"><Reveal><div className="section-heading"><div><div className="eyebrow"><BookOpen size={12} />THE FOUNDATION</div><h2>A little theory. A lot of possibility.</h2><p>Unit 1 · The fundamentals that turn curiosity into understanding.</p></div><span className="section-caption"><span className="status-dot" />06 MODULES</span></div></Reveal>
        <div className="module-grid">{modules.map((module, i) => { const Icon = icons[i]; return <Reveal key={module.title}><motion.article className="module-card" whileHover={reduced ? {} : { rotateX: 3, rotateY: -3, y: -3 }}><div className="module-icon"><Icon size={19} /></div><Button variant="ghost" size="icon" className="module-open" aria-label={`Open ${module.title}`} title={`Open ${module.title}`} onClick={() => setLesson(i)}><ArrowUpRight /></Button><h3>{module.title}</h3><p>{module.description}</p><span className="module-number">{String(i + 1).padStart(2, '0')} / 06</span></motion.article></Reveal>; })}</div>
      </div></section>
      <section id="experiments" className="page-section"><div className="portal-container"><Reveal><div className="section-heading"><div><div className="eyebrow"><FlaskConical size={12} />LEARNING BY DOING</div><h2>Meet your next experiment.</h2><p>From your first dataset to your first model. One discovery at a time.</p></div><span className="section-caption"><Code2 size={13} />PYTHON LAB</span></div></Reveal>
        <div className="experiment-grid">{experiments.map(exp => <Reveal key={exp.id}><article className="experiment-card"><div className="flex items-center justify-between"><span className="font-mono text-[10px] text-primary">{exp.id}</span><span className="font-mono text-[8px] text-muted-foreground">{exp.tag}</span></div><h3>{exp.title}</h3><p>{exp.description}</p><div className="experiment-footer"><span className="flex items-center gap-1.5 font-mono text-[9px] text-muted-foreground"><Clock3 size={12} />{exp.duration}</span><Button asChild variant="link" size="sm" className="pr-0 text-[11px]"><Link to="/experiments/$experimentId" params={{ experimentId: exp.id }}>Open lab<ArrowUpRight /></Link></Button></div></article></Reveal>)}</div>
      </div></section>
      <section id="tools" className="page-section"><div className="portal-container"><Reveal><div className="section-heading"><div><div className="eyebrow"><Cpu size={12} />YOUR DATA TOOLKIT</div><h2>Good questions. Great tools.</h2><p>The essentials for every step of your data science journey.</p></div><span className="section-caption"><Sparkles size={13} />07 ESSENTIALS</span></div></Reveal><Reveal className="tool-grid">{tools.map(tool => <a key={tool.name} className="tool-card" href={tool.url} target="_blank" rel="noopener noreferrer" title={`${tool.name} documentation`}><span className="tool-symbol">{tool.symbol}</span><span className="text-[12px]">{tool.name}</span><span className="flex items-center gap-1 font-mono text-[8px] text-muted-foreground">DOCUMENTATION<ArrowUpRight size={10} /></span></a>)}</Reveal></div></section>
    </main><PortalFooter />
    <Dialog open={lesson !== null} onOpenChange={open => { if (!open) setLesson(null); }}><DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl"><DialogHeader><p className="eyebrow">UNIT 1 · MODULE {lesson === null ? '' : String(lesson + 1).padStart(2, '0')}</p><DialogTitle className="pt-3 text-2xl">{current?.title}</DialogTitle><DialogDescription>{current?.description}</DialogDescription></DialogHeader>{current && <div className="lesson-content"><h3>Key topics</h3><ul className="space-y-2">{current.topics.map(topic => <li key={topic} className="flex items-center gap-2"><CircleCheck size={13} className="text-primary" />{topic}</li>)}</ul><h3>Overview</h3><p>{current.lesson}</p><h3>In practice</h3><p>{current.example}</p><Button className="mt-6" onClick={downloadLesson}><Download />Download notes</Button></div>}</DialogContent></Dialog>
  </>;
}
