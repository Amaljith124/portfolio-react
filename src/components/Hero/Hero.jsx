import React, { useRef } from 'react';
import { ArrowDown, ArrowRight, Atom, BrainCircuit, Braces, Cloud, Code2, Database, Github, Hexagon, Linkedin, Mail, Puzzle, Server, Sparkles, Webhook } from 'lucide-react';
import './Hero.scss';

const chips = [
  { label: 'Node.js', icon: Hexagon, color: '#5fb04e' },
  { label: 'Python', icon: Braces, color: '#f2c14e' },
  { label: 'PostgreSQL', icon: Database, color: '#4f9bff' },
  { label: 'React.js', icon: Atom, color: '#4cd6f5' },
  { label: 'AWS', icon: Cloud, color: '#ff9b3d' },
  { label: 'AI / GenAI', icon: Sparkles, color: '#a58bff' },
  { label: 'REST APIs', icon: Webhook, color: '#8fa3bd' },
  { label: 'Integrations', icon: Puzzle, color: '#4f9bff' }
];

const services = [
  { icon: Server, title: 'Backend Development', text: 'Scalable APIs, integrations and robust backend systems.' },
  { icon: BrainCircuit, title: 'Applied AI', text: 'LLM applications, RAG, AI agents and automation.' },
  { icon: Cloud, title: 'Cloud & Integrations', text: 'AWS, third-party APIs and production workflows.' },
  { icon: Code2, title: 'Full Stack Development', text: 'End-to-end web and mobile applications.' }
];

// Set cutout to true once public/images/amaljith-portrait.* is a transparent PNG/WebP (no background):
// the arch frame is dropped and the person stands in front of the blue halo.
const PORTRAIT = { src: '/images/amaljith-portrait.webp', cutout: true };

export default function Hero() {
  const heroRef = useRef(null);

  // The portrait and its halo drift slightly against the mouse, which gives the hero some depth.
  function handleMove(event) {
    const node = heroRef.current;
    if (node) {
      const rect = node.getBoundingClientRect();
      node.style.setProperty('--mx', ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3));
      node.style.setProperty('--my', ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3));
    } else {
      // not mounted yet
    }
  }

  function handleLeave() {
    const node = heroRef.current;
    if (node) {
      node.style.setProperty('--mx', 0);
      node.style.setProperty('--my', 0);
    } else {
      // not mounted yet
    }
  }

  return (
    <div className="hero-band" id="home">
      <span className="hero-orb orb-a" />
      <span className="hero-orb orb-b" />
      <section className="hero section-wrap" ref={heroRef} onMouseMove={handleMove} onMouseLeave={handleLeave}>
        <div className="hero-copy">
          <div className="eyebrow rise" style={{ '--d': '60ms' }}><span className="status-dot" /> FULL STACK DEVELOPER</div>
          <h1 className="rise" style={{ '--d': '150ms' }}>Amaljith<br /><span>Anaswaran.</span></h1>
          <p className="hero-intro rise" style={{ '--d': '260ms' }}>Backend-focused Full Stack Developer with 3 years of experience in product development, AI and cloud.</p>
          <div className="skill-chips">{chips.map(({ label, icon: Icon, color }, index) => <span key={label} style={{ '--chip-color': color, '--i': index }}><Icon size={15} />{label}</span>)}</div>
          <div className="hero-actions rise" style={{ '--d': '640ms' }}>
            <a className="button button-solid" href="#projects">View My Work <ArrowDown size={16} className="icon-down" /></a>
            <a className="button button-outline" href="#contact">Contact Me <ArrowRight size={16} /></a>
          </div>
          <div className="hero-meta rise" style={{ '--d': '740ms' }}>
            <div className="social-links">
              <a href="https://www.linkedin.com/in/amaljith-anaswaran-738a41192" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
              <a href="https://github.com/Amaljith124" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>
              <a href="mailto:amaljithanaswar@gmail.com" aria-label="Email"><Mail size={18} /></a>
            </div>
            <span className="meta-location">Based in Kodungallur, Kerala, India</span>
            <span className="meta-available"><i className="status-dot" /> Available for opportunities</span>
          </div>
        </div>

        <div className={`hero-visual ${PORTRAIT.cutout ? 'has-cutout' : ''}`}>
          <div className="portrait-stage rise" style={{ '--d': '200ms' }}>
            <div className="portrait-ring" />
            <div className="portrait-halo" />
            <div className={`portrait-frame ${PORTRAIT.cutout ? 'is-cutout' : ''}`}><img src={PORTRAIT.src} alt="Amaljith Anaswaran" /></div>
          </div>
          <div className="floating-note">
            Building practical<br />software and<br />AI-powered products.
            <svg viewBox="0 0 80 64" aria-hidden="true"><path d="M70 4 C 44 6, 18 20, 10 50" /><path d="M5 36 L10 53 L24 46" /></svg>
          </div>
        </div>

        <div className="hero-services">
          {services.map(({ icon: Icon, title, text }, index) => <article className="service-tile" key={title} style={{ '--d': `${380 + index * 120}ms` }}><Icon size={34} strokeWidth={1.6} /><div><h3>{title}</h3><p>{text}</p></div></article>)}
        </div>
      </section>
    </div>
  );
}
