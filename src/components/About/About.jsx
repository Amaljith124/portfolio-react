import React from 'react';
import { ArrowRight } from 'lucide-react';
import Reveal from '../Reveal/Reveal';
import SectionHeading from '../SectionHeading/SectionHeading';
import './About.scss';

const journey = [
  { date: '2019 – 2023', title: 'B.Tech, Computer Science & Engineering', detail: 'S.N.M. Institute of Management & Technology, Maliankara.' },
  { date: '2023', title: "Joined Y's TechSolutions", detail: 'Started as a fresher and grew through hands-on delivery and production work.' },
  { date: '2023 – Present', title: 'Full Stack Developer', detail: 'Working across backend systems, AI applications, cloud services and product development.' }
];

// Renders two grid cells (copy + timeline) of the "intro row" in Home, next to Skills.
export default function About() {
  return (
    <>
      <Reveal className="about-copy" direction="left">
        <SectionHeading eyebrow="About me" title={<>From curiosity<br />to <span>creation.</span></>} />
        <p>I'm Amaljith Anaswaran, a Full Stack Developer who enjoys building practical software, working with AI and solving real-world problems. My strongest focus is backend engineering, integrations and applied AI.</p>
        <a className="button button-outline about-button" href="#journey">Learn More About Me <ArrowRight size={15} /></a>
      </Reveal>
      <Reveal className="journey-list stagger" id="journey" delay={140}>
        {journey.map(item => <article className="journey-item" key={item.date}><span className="journey-dot" /><small>{item.date}</small><div><strong>{item.title}</strong><p>{item.detail}</p></div></article>)}
      </Reveal>
    </>
  );
}
