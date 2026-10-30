import React from 'react';
import { BrainCircuit, Cloud, Code2, Database, Link2, Server } from 'lucide-react';
import Reveal from '../Reveal/Reveal';
import SectionHeading from '../SectionHeading/SectionHeading';
import './Skills.scss';

const groups = [
  { icon: Server, title: 'Backend', detail: 'Node.js, Express.js, Python, FastAPI, Flask' },
  { icon: Database, title: 'Databases', detail: 'PostgreSQL, SQL, data modelling and query work' },
  { icon: Code2, title: 'Frontend & mobile', detail: 'React, React Native, JavaScript, HTML and CSS' },
  { icon: Cloud, title: 'Cloud', detail: 'AWS, S3, Lambda, AWS Connect and transcription services' },
  { icon: BrainCircuit, title: 'Applied AI', detail: 'LLMs, RAG, FAISS, embeddings, MMR and tool calling' },
  { icon: Link2, title: 'Integrations', detail: 'REST APIs, webhooks and third-party services' }
];

export default function Skills() {
  return <Reveal className="skills-block" id="skills" delay={240}>
    <SectionHeading eyebrow="Skills" title="Technologies I work with" />
    <div className="skills-grid stagger">{groups.map(({ icon: Icon, title, detail }) => <article className="skill-card" key={title}><Icon size={24} strokeWidth={1.7} /><h3>{title}</h3><p>{detail}</p></article>)}</div>
  </Reveal>;
}
