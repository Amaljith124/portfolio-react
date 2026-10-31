import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import SectionHeading from '../SectionHeading/SectionHeading';
import { usePortfolio } from '../../context/PortfolioContext';
import { getIcon } from '../../utils/icons';
import './Services.scss';

export const PREFILL_EVENT = 'portfolio:prefill-service';

export default function Services() {
  const { portfolio, basePath } = usePortfolio();
  const section = portfolio.services || {};
  const services = section.items || [];
  function choose(service) {
    window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: service }));
  }

  return <section className="services-section section-wrap" id="services">
    <SectionHeading eyebrow={section.eyebrow} title={section.title} description={section.description} />
    <div className="services-grid stagger">{services.map(({ icon, title, text, service }) => { const Icon = getIcon(icon); return <a className="service-card" href={`${basePath}#contact`} onClick={() => choose(service)} key={service}><Icon size={24} /><h3>{title}</h3><p>{text}</p><span>Discuss a project <ArrowUpRight size={14} /></span></a>; })}</div>
  </section>;
}
