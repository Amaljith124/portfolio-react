import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import './Footer.scss';

export default function Footer() {
  const { portfolio, basePath } = usePortfolio();
  const profile = portfolio.profile;
  const links = profile.links || {};

  return <footer className="site-footer section-wrap"><div><span className="footer-mark">{profile.initials}</span><p>{profile.footerTagline}</p></div><div className="footer-links">{links.github && <a href={links.github} target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a>}{links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn</a>}{profile.email && <a href={`mailto:${profile.email}`}><Mail size={17} /> Email</a>}<Link to={`${basePath}/#home`}><ArrowUp size={17} /> Back to top</Link></div><small>© {new Date().getFullYear()} {profile.name}. All rights reserved.</small></footer>;
}
