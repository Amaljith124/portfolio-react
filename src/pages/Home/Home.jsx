import React from 'react';
import Hero from '../../components/Hero/Hero';
import Stats from '../../components/Stats/Stats';
import About from '../../components/About/About';
import Skills from '../../components/Skills/Skills';
import Projects from '../../components/Projects/Projects';
import Services from '../../components/Services/Services';
import Opportunities from '../../components/Opportunities/Opportunities';
import Contact from '../../components/Contact/Contact';
import Reveal from '../../components/Reveal/Reveal';

export default function Home() {
  return <main>
    <Hero />
    <Stats />
    <section className="intro-row section-wrap" id="about">
      <About />
      <Skills />
    </section>
    <Projects />
    <Reveal><Services /></Reveal>
    <Reveal><Opportunities /></Reveal>
    <Reveal><Contact /></Reveal>
  </main>;
}
