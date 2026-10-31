import React from 'react';
import { ArrowRight } from 'lucide-react';
import Reveal from '../Reveal/Reveal';
import SectionHeading from '../SectionHeading/SectionHeading';
import { usePortfolio } from '../../context/PortfolioContext';
import { renderTitle } from '../../utils/richTitle';
import './About.scss';

// Renders two grid cells (copy + timeline) of the "intro row" in Home, next to Skills.
export default function About() {
  const { portfolio, basePath } = usePortfolio();
  const about = portfolio.about || {};
  const journey = about.journey || [];

  return (
    <>
      <Reveal className="about-copy" direction="left">
        <SectionHeading eyebrow={about.eyebrow} title={renderTitle(about.title)} />
        <p>{about.text}</p>
        {about.buttonLabel && <a className="button button-outline about-button" href={`${basePath}#journey`}>{about.buttonLabel} <ArrowRight size={15} /></a>}
      </Reveal>
      <Reveal className="journey-list stagger" id="journey" delay={140}>
        {journey.map(item => <article className="journey-item" key={item.date}><span className="journey-dot" /><small>{item.date}</small><div><strong>{item.title}</strong><p>{item.detail}</p></div></article>)}
      </Reveal>
    </>
  );
}
