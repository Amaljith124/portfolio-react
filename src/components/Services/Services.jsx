import React from 'react';
import { ArrowUpRight, BrainCircuit, Code2, Database, Link2, Server } from 'lucide-react';
import SectionHeading from '../SectionHeading/SectionHeading';
import './Services.scss';

const services = [
  { icon: Server, title: 'Backend development', text: 'REST APIs, backend workflows and reliable application services.', service: 'backend-development' },
  { icon: BrainCircuit, title: 'AI integration', text: 'LLM applications, RAG pipelines and practical AI agent workflows.', service: 'ai-integration' },
  { icon: Link2, title: 'API integrations', text: 'Third-party APIs, webhooks and service-to-service integrations.', service: 'api-integrations' },
  { icon: Database, title: 'Database development', text: 'PostgreSQL schema design, data modelling and query workflows.', service: 'database-development' },
  { icon: Code2, title: 'Full-stack development', text: 'End-to-end web applications with a backend-first approach.', service: 'full-stack-development' }
];

export const PREFILL_EVENT = 'portfolio:prefill-service';

export default function Services() {
  function choose(service) {
    window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: service }));
  }

  return <section className="services-section section-wrap" id="services">
    <SectionHeading eyebrow="How I can help" title="Services & collaboration" description="Practical engineering support for teams and businesses building useful products." />
    <div className="services-grid stagger">{services.map(({ icon: Icon, title, text, service }) => <a className="service-card" href="#contact" onClick={() => choose(service)} key={service}><Icon size={24} /><h3>{title}</h3><p>{text}</p><span>Discuss a project <ArrowUpRight size={14} /></span></a>)}</div>
  </section>;
}
