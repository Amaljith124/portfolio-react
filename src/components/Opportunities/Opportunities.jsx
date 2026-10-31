import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import SectionHeading from '../SectionHeading/SectionHeading';
import { usePortfolio } from '../../context/PortfolioContext';
import { getIcon } from '../../utils/icons';
import './Opportunities.scss';

export default function Opportunities() {
  const { portfolio, basePath } = usePortfolio();
  const section = portfolio.opportunities || {};
  const items = section.items || [];
  const email = portfolio.profile.email || '';

  // "{email}" in a link is the owner's contact email; "#section" links stay on this portfolio's page
  function linkFor(href) {
    const link = String(href || '').replace('{email}', email);
    return link.startsWith('#') ? `${basePath}${link}` : link;
  }

  return <section className="opportunities-section section-wrap" id="opportunities">
    <SectionHeading eyebrow={section.eyebrow} title={section.title} description={section.description} />
    <div className="opportunity-grid stagger">
      {items.map(({ icon, tag, title, text, linkLabel, href }) => { const Icon = getIcon(icon); return <article key={title}><Icon size={25} /><small>{tag}</small><h3>{title}</h3><p>{text}</p><a href={linkFor(href)}>{linkLabel} <ArrowUpRight size={15} /></a></article>; })}
    </div>
  </section>;
}
