import React from 'react';
import Reveal from '../Reveal/Reveal';
import SectionHeading from '../SectionHeading/SectionHeading';
import { usePortfolio } from '../../context/PortfolioContext';
import { getIcon } from '../../utils/icons';
import './Skills.scss';

export default function Skills() {
  const { portfolio } = usePortfolio();
  const skills = portfolio.skills || {};
  const groups = skills.groups || [];

  return <Reveal className="skills-block" id="skills" delay={240}>
    <SectionHeading eyebrow={skills.eyebrow} title={skills.title} />
    <div className="skills-grid stagger">{groups.map(({ icon, title, detail }) => { const Icon = getIcon(icon); return <article className="skill-card" key={title}><Icon size={24} strokeWidth={1.7} /><h3>{title}</h3><p>{detail}</p></article>; })}</div>
  </Reveal>;
}
