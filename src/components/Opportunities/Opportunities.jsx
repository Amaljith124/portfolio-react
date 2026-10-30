import React from 'react';
import { ArrowUpRight, BriefcaseBusiness, Handshake } from 'lucide-react';
import SectionHeading from '../SectionHeading/SectionHeading';
import './Opportunities.scss';

export default function Opportunities() {
  return <section className="opportunities-section section-wrap" id="opportunities">
    <SectionHeading eyebrow="What's next" title="Open to meaningful work" description="I'm interested in good engineering problems, thoughtful teams and collaborations that create useful products." />
    <div className="opportunity-grid stagger">
      <article><BriefcaseBusiness size={25} /><small>CAREER</small><h3>Backend & full-stack roles</h3><p>Backend Developer, Full Stack Developer, Python Developer and Applied AI / GenAI application roles.</p><a href="mailto:amaljithanaswar@gmail.com?subject=Career%20opportunity">Discuss an opportunity <ArrowUpRight size={15} /></a></article>
      <article><Handshake size={25} /><small>FREELANCE</small><h3>Project collaborations</h3><p>Backend APIs, AI integrations, third-party integrations and full-stack application development.</p><a href="#contact">Start a conversation <ArrowUpRight size={15} /></a></article>
    </div>
  </section>;
}
