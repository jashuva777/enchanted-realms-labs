import { createFileRoute, Link } from '@tanstack/react-router';
import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, ArrowRight, ArrowDown, Network, Layers3, Code2, Database, ChartNoAxesCombined, Activity, BookOpen, FlaskConical, Clock3, Cpu, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModuleReader } from '@/components/portal/ModuleReader';
import portrait from '@/assets/sangam-jashuva.jpeg.asset.json';
import notes from '@/assets/course-notes.json';
import { resources } from '@/lib/syllabus';
import logo from '@/assets/mbu-logo.png.asset.json';
import { PortalNav, PortalFooter, Socials } from '@/components/portal/PortalChrome';
import { modules, experiments, tools, pageMeta } from '@/lib/portal-data';

const DataScene = lazy(() => import('@/components/portal/DataScene'));
export const Route = createFileRoute('/')({
  head: () => pageMeta('Data Science Learning Portal — Sangam Jashuva · MBU', 'Sangam Jashuva’s Mohan Babu University Data Science portal. Explore all five syllabus modules, downloadable PDF notes, eight interactive Python experiments, and study resources.'),
  component: Index,
});
function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: .55 }}>{children}</motion.div>;
}
function PhotoSlot({ professor = false }: { professor?: boolean }) {
  const [exists, setExists] = useState(false);
  useEffect(() => { if (!professor) return; const image = new Image(); image.onload = () => setExists(true); image.src = '/professor.jpg'; return () => { image.onload = null; }; }, [professor]);
  if (!professor) return <div className="avatar"><img src={portrait.url} alt="Sangam Jashuva" /></div>;
  return <div className="professor-avatar">SB{exists && <img src="/professor.jpg" alt="Mr. S. Bosu Babu" />}</div>;
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
            <div className="hero-meta"><span className="flex items-center gap-2"><BookOpen size={12} />05 MODULES</span><span className="flex items-center gap-2"><FlaskConical size={12} />{String(experiments.length).padStart(2, '0')} EXPERIMENTS</span><span className="flex items-center gap-2"><Cpu size={12} />07 TOOLS</span></div>
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
        <div className="course-stats"><div><strong>05<span className="ml-2 text-primary">/</span></strong><p>Syllabus modules</p></div><div><strong>{String(experiments.length).padStart(2, '0')}<span className="ml-2 text-gold">/</span></strong><p>Hands-on experiments</p></div><div><strong className="text-primary">5th</strong><p>Current semester</p></div></div>
      </div></section>
      <section id="modules" className="page-section"><div className="portal-container"><Reveal><div className="section-heading"><div><div className="eyebrow"><BookOpen size={12} />THE FOUNDATION</div><h2>A little theory. A lot of possibility.</h2><p>Five modules · Your complete Data Science syllabus, across 45 periods.</p></div><span className="section-caption"><span className="status-dot" />05 MODULES</span></div></Reveal>
        <div className="module-grid">{modules.map((module, i) => { const Icon = icons[i] ?? BookOpen; const pdf = notes.modules.find(item => item.number === module.number); return <Reveal key={module.title}><motion.article className="module-card syllabus-card" whileHover={reduced ? {} : { rotateX: 3, rotateY: -3, y: -3 }}><div className="flex items-center justify-between"><div className="module-icon"><Icon size={19} /></div><span className="font-mono text-[9px] text-muted-foreground">{module.periods} PERIODS</span></div><div className="module-label">MODULE {module.number}</div><h3>{module.title}</h3><p>{module.description}</p><div className="syllabus-footer"><Button variant="link" size="sm" className="pl-0" onClick={() => setLesson(i)} aria-label={`Read Module ${module.number}`}><BookOpen />Read topics<ArrowRight /></Button>{pdf && <Button asChild variant="ghost" size="icon"><a href={pdf.url} download={`mbu-module-${module.number}-notes.pdf`} aria-label={`Download Module ${module.number} PDF notes`} title="Download PDF notes"><Download /></a></Button>}<span className="module-number">{module.pages.length} TOPICS</span></div></motion.article></Reveal>; })}</div>
      </div></section>
      <section id="experiments" className="page-section"><div className="portal-container"><Reveal><div className="section-heading"><div><div className="eyebrow"><FlaskConical size={12} />LEARNING BY DOING</div><h2>Meet your next experiment.</h2><p>From your first dataset to your first model. One discovery at a time.</p></div><span className="section-caption"><Code2 size={13} />PYTHON LAB</span></div></Reveal>
        <div className="experiment-grid">{experiments.map(exp => <Reveal key={exp.id}><article className="experiment-card"><div className="flex items-center justify-between"><span className="font-mono text-[10px] text-primary">{exp.id}</span><span className="font-mono text-[8px] text-muted-foreground">{exp.tag}</span></div><h3>{exp.title}</h3><p>{exp.description}</p><div className="experiment-footer"><span className="flex items-center gap-1.5 font-mono text-[9px] text-muted-foreground"><Clock3 size={12} />{exp.duration}</span><Button asChild variant="link" size="sm" className="pr-0 text-[11px]"><Link to="/experiments/$experimentId" params={{ experimentId: exp.id }}>Open lab<ArrowUpRight /></Link></Button></div></article></Reveal>)}</div>
      </div></section>
      <section id="tools" className="page-section"><div className="portal-container"><Reveal><div className="section-heading"><div><div className="eyebrow"><Cpu size={12} />YOUR DATA TOOLKIT</div><h2>Good questions. Great tools.</h2><p>The essentials for every step of your data science journey.</p></div><span className="section-caption"><Sparkles size={13} />07 ESSENTIALS</span></div></Reveal><Reveal className="tool-grid">{tools.map(tool => <a key={tool.name} className="tool-card" href={tool.url} target="_blank" rel="noopener noreferrer" title={`${tool.name} documentation`}><span className="tool-symbol">{tool.symbol}</span><span className="text-[12px]">{tool.name}</span><span className="flex items-center gap-1 font-mono text-[8px] text-muted-foreground">DOCUMENTATION<ArrowUpRight size={10} /></span></a>)}</Reveal></div></section>
      <section id="resources" className="page-section"><div className="portal-container"><Reveal><div className="section-heading"><div><div className="eyebrow"><BookOpen size={12} />STUDY RESOURCES</div><h2>Your reference shelf.</h2><p>Course notes and open reading for deeper understanding.</p></div><span className="section-caption">05 MODULES · 45 PERIODS</span></div></Reveal><div className="resource-grid">{resources.map(resource => <Reveal key={resource.title}><article className="resource-card"><BookOpen className="text-gold" size={22} /><h3>{resource.title}</h3><p>{resource.description}</p><Button asChild variant="outline" size="sm"><a href={resource.type === 'pdf' ? notes.all.url : resource.url} download={resource.type === 'pdf' ? 'mbu-data-science-course-notes.pdf' : undefined} target={resource.type === 'pdf' ? undefined : '_blank'} rel="noopener noreferrer">{resource.type === 'pdf' ? <><Download />Download all notes</> : <>Open reference<ArrowUpRight /></>}</a></Button></article></Reveal>)}</div></div></section>
    </main><PortalFooter />
    {lesson !== null && modules[lesson] && <ModuleReader key={lesson} module={modules[lesson]} close={() => setLesson(null)} />}
  </>;
}
