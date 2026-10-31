import React from 'react';
import './PortfolioSkeleton.scss';

const bar = (width, height = 14, extra = '') => <i className={`sk sk-bar ${extra}`} style={{ width, height }} />;

// Placeholder shown while a portfolio is being fetched (/p/<slug>, /portfolio/<token>): the same bands as the real page
// (navbar, hero, stats strip, content sections) as shimmering blocks, so the page does not jump when the content arrives.
export default function PortfolioSkeleton() {
  return (
    <div className="sk-page" role="status" aria-live="polite" aria-busy="true">
      <span className="sk-visually-hidden">Loading portfolio...</span>
      <header className="sk-nav section-wrap">
        <span className="sk sk-circle" style={{ width: 38, height: 38 }} />{bar(150, 14)}
        <span className="sk-grow" />{[0, 1, 2, 3].map(index => <span className="sk-hide-sm" key={index}>{bar(56, 12)}</span>)}
        <span className="sk sk-pill" style={{ width: 150, height: 44 }} />
      </header>

      <section className="sk-hero section-wrap">
        <div className="sk-hero-copy">
          {bar(150, 12)}
          {bar('78%', 62, 'sk-title')}{bar('62%', 62, 'sk-title')}
          {bar('92%', 16)}{bar('70%', 16)}
          <div className="sk-chips">{[0, 1, 2, 3, 4, 5].map(index => <span className="sk sk-pill" style={{ width: 96, height: 34 }} key={index} />)}</div>
          <div className="sk-row"><span className="sk sk-pill" style={{ width: 160, height: 48 }} /><span className="sk sk-pill" style={{ width: 140, height: 48 }} /></div>
        </div>
        <div className="sk-portrait"><span className="sk sk-circle" /></div>
        <div className="sk-tiles">{[0, 1, 2, 3].map(index => <div className="sk-tile" key={index}><span className="sk sk-circle" style={{ width: 34, height: 34 }} /><div>{bar('70%', 14)}{bar('95%', 11)}</div></div>)}</div>
      </section>

      <section className="sk-stats section-wrap">{[0, 1, 2, 3].map(index => <div className="sk-stat" key={index}><span className="sk sk-circle" style={{ width: 30, height: 30 }} /><div>{bar(110, 13)}{bar(150, 10)}</div></div>)}</section>

      <section className="sk-section section-wrap">
        {bar(90, 11)}{bar('34%', 30, 'sk-title')}{bar('55%', 13)}
        <div className="sk-cards">{[0, 1, 2, 3].map(index => <div className="sk-card" key={index}><span className="sk sk-art" />{bar('60%', 15)}{bar('90%', 11)}{bar('75%', 11)}</div>)}</div>
      </section>
    </div>
  );
}
