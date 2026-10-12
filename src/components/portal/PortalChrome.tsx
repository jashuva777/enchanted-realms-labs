import { Link } from '@tanstack/react-router';
import { Github, Linkedin, Instagram, Code2, ArrowUpRight, GraduationCap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/mbu-logo.png.asset.json';
import { socialLinks } from '@/lib/portal-data';
export function Socials() {
  const icons = [Linkedin, Github, Code2, Instagram];
  return <div className="flex items-center gap-2">{socialLinks.map((social, i) => { const Icon = icons[i] ?? Code2; return <Button key={social.name} asChild variant="ghost" size="icon" className="social-button"><a href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name} title={social.name}><Icon size={16} /></a></Button>; })}</div>;
}
export function PortalNav({ lab = false }: { lab?: boolean }) {
  const [active, setActive] = useState('home');
  useEffect(() => {
    if (lab) return;
    const update = () => {
      if (window.scrollY > 100 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5) { setActive('tools'); return; }
      let current = 'home';
      ['home', 'modules', 'experiments', 'tools'].forEach(id => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= 160) current = id; });
      setActive(current);
    };
    window.addEventListener('scroll', update, { passive: true }); update();
    return () => window.removeEventListener('scroll', update);
  }, [lab]);
  return <header className="portal-nav"><div className="portal-container nav-inner">
    <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="MBU Data Science home"><img src={logo.url} className="brand-symbol" alt="MBU" /><div className="nav-word"><div className="text-sm font-semibold">MBU <span className="font-normal text-muted-foreground">/</span> Data Science</div><div className="mt-1 font-mono text-[8px] text-muted-foreground">LEARNING PORTAL</div></div></Link>
    <nav aria-label="Main navigation" className="flex items-center gap-7 max-sm:gap-5">{['Home', 'Modules', 'Experiments', 'Tools'].map(item => <Link key={item} to="/" hash={item.toLowerCase()} activeOptions={{ includeHash: true }} onClick={() => setActive(item.toLowerCase())} className={`nav-link ${!lab && active === item.toLowerCase() ? 'is-current' : ''}`}>{item}</Link>)}</nav>
    <div className="nav-status flex items-center gap-2 font-mono text-[9px] text-muted-foreground"><span className="status-dot" />SEMESTER 05<GraduationCap size={14} className="ml-2 text-gold" /></div>
  </div></header>;
}
export function PortalFooter() { return <footer className="portal-container site-footer"><div className="flex items-center gap-3"><img src={logo.url} className="brand-symbol" alt="Mohan Babu University" /><span>© Mohan Babu University</span></div><span className="font-mono text-[9px]">DREAM. BELIEVE. ACHIEVE.</span><div className="flex items-center gap-4"><Socials /><a href="https://www.mbu.asia/" target="_blank" rel="noopener noreferrer" aria-label="Visit Mohan Babu University" title="Mohan Babu University"><ArrowUpRight size={15} /></a></div></footer>; }
