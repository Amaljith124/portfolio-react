import React, { useRef } from 'react';
import { ArrowDown, ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { getIcon } from '../../utils/icons';
import { renderLines, renderTitle } from '../../utils/richTitle';
import './Hero.scss';

export default function Hero() {
  const heroRef = useRef(null);
  const { portfolio, basePath } = usePortfolio();
  const profile = portfolio.profile;
  const links = profile.links || {};
  const portrait = profile.portrait || {};
  const cutout = portrait.cutout !== false;
  const chips = portfolio.skillChips || [];
  const services = portfolio.heroServices || [];

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
          <div className="eyebrow rise" style={{ '--d': '60ms' }}><span className="status-dot" /> {profile.eyebrow}</div>
          <h1 className="rise" style={{ '--d': '150ms' }}>{renderTitle(profile.heroTitle || profile.name)}</h1>
          <p className="hero-intro rise" style={{ '--d': '260ms' }}>{profile.intro}</p>
          <div className="skill-chips">{chips.map(({ label, icon, color }, index) => { const Icon = getIcon(icon); return <span key={label} style={{ '--chip-color': color, '--i': index }}><Icon size={15} />{label}</span>; })}</div>
          <div className="hero-actions rise" style={{ '--d': '640ms' }}>
            <a className="button button-solid" href={`${basePath}#projects`}>View My Work <ArrowDown size={16} className="icon-down" /></a>
            <a className="button button-outline" href={`${basePath}#contact`}>Contact Me <ArrowRight size={16} /></a>
          </div>
          <div className="hero-meta rise" style={{ '--d': '740ms' }}>
            <div className="social-links">
              {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>}
              {links.github && <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>}
              {profile.email && <a href={`mailto:${profile.email}`} aria-label="Email"><Mail size={18} /></a>}
            </div>
            {profile.location && <span className="meta-location">{profile.location}</span>}
            {profile.availability && <span className="meta-available"><i className="status-dot" /> {profile.availability}</span>}
          </div>
        </div>

        <div className={`hero-visual ${cutout ? 'has-cutout' : ''}`}>
          <div className="portrait-stage rise" style={{ '--d': '200ms' }}>
            <div className="portrait-ring" />
            <div className="portrait-halo" />
            <div className={`portrait-frame ${cutout ? 'is-cutout' : ''}`}>{portrait.src && <img src={portrait.src} alt={portrait.alt || profile.name} />}</div>
          </div>
          <div className="floating-note">
            {renderLines(profile.floatingNote)}
            <svg viewBox="0 0 80 64" aria-hidden="true"><path d="M70 4 C 44 6, 18 20, 10 50" /><path d="M5 36 L10 53 L24 46" /></svg>
          </div>
        </div>

        <div className="hero-services">
          {services.map(({ icon, title, text }, index) => { const Icon = getIcon(icon); return <article className="service-tile" key={title} style={{ '--d': `${380 + index * 120}ms` }}><Icon size={34} strokeWidth={1.6} /><div><h3>{title}</h3><p>{text}</p></div></article>; })}
        </div>
      </section>
    </div>
  );
}
