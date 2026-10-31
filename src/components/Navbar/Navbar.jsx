import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { usePortfolio } from '../../context/PortfolioContext';
import './Navbar.scss';

const links = [
  ['Home', 'home'],
  ['About', 'about'],
  ['Projects', 'projects'],
  ['Services', 'services'],
  ['Opportunities', 'opportunities'],
  ['Contact', 'contact']
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { portfolio, basePath } = usePortfolio();
  const profile = portfolio.profile;
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const [progress, setProgress] = useState(0);

  useEffect(function () {
    function onScroll() {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 12);
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
      if (pathname.replace(/\/$/, '') === basePath) {
        let current = 'home';
        links.forEach(function ([, id]) {
          const node = document.getElementById(id);
          if (node && node.getBoundingClientRect().top <= 170) {
            current = id;
          } else {
            // this section is still below the reading line
          }
        });
        setActive(current);
      } else {
        setActive(pathname.startsWith(`${basePath}/projects`) ? 'projects' : '');
      }
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return function () {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname, basePath]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav-shell">
        <Link to={`${basePath}/#home`} className="brand" onClick={closeMenu}>
          <span className="brand-mark">{profile.initials}</span>
          <span className="brand-name">{profile.name}</span>
        </Link>
        <nav className={`nav-links ${menuOpen ? 'is-open' : ''}`} aria-label="Main">
          {links.map(([label, id]) => (
            <Link to={`${basePath}/#${id}`} key={id} className={active === id ? 'is-active' : ''} onClick={closeMenu}>{label}</Link>
          ))}
        </nav>
        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} role="switch" aria-checked={theme === 'dark'} aria-label="Toggle dark theme">
            <span className="knob" />
            <Sun size={15} className="sun" />
            <Moon size={15} className="moon" />
          </button>
          <Link className="button button-primary nav-cta" to={`${basePath}/#contact`} onClick={closeMenu}>Let's Work Together <ArrowRight size={16} /></Link>
          <button className="icon-button menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <span className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />
    </header>
  );
}
