import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import './Footer.scss';

export default function Footer() {
  return <footer className="site-footer section-wrap"><div><span className="footer-mark">AA</span><p>Building practical software, backend systems and AI-powered products.</p></div><div className="footer-links"><a href="https://github.com/Amaljith124" target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a><a href="https://www.linkedin.com/in/amaljith-anaswaran-738a41192" target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn</a><a href="mailto:amaljithanaswar@gmail.com"><Mail size={17} /> Email</a><Link to="/#home"><ArrowUp size={17} /> Back to top</Link></div><small>© {new Date().getFullYear()} Amaljith Anaswaran. All rights reserved.</small></footer>;
}
