import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, AudioLines, Bot, Layers, Trophy, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProjects } from '../../webservices/webservices';
import Reveal from '../Reveal/Reveal';
import SectionHeading from '../SectionHeading/SectionHeading';
import './Projects.scss';

const icons = {
  'ai-hotel-guest-support-agent': Bot,
  'ai-voice-appointment-booking': AudioLines,
  courtside: Trophy,
  'fasttrackehr-and-minutzz': Workflow
};

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const Icon = icons[project.slug] || Layers;

  // Gentle 3D tilt and a light spot that follows the pointer.
  function tilt(event) {
    const node = cardRef.current;
    if (node) {
      const rect = node.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      node.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
      node.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
      node.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(0)}%`);
      node.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(0)}%`);
    } else {
      // not mounted yet
    }
  }

  function reset() {
    const node = cardRef.current;
    if (node) {
      node.style.setProperty('--rx', '0deg');
      node.style.setProperty('--ry', '0deg');
    } else {
      // not mounted yet
    }
  }

  return <Link to={`/projects/${project.slug}`} className="project-card" ref={cardRef} onMouseMove={tilt} onMouseLeave={reset}>
    <div className={`project-art art-${(index % 4) + 1}`}>
      <span className="art-number">0{index + 1}</span>
      <i className="art-orbit" /><i className="art-orbit second" />
      <span className="art-icon"><Icon size={32} strokeWidth={1.6} /></span>
      <span className="art-label">{project.category}</span>
    </div>
    <div className="project-body">
      <h3>{project.title}</h3>
      <div className="project-tags">{project.technologies.slice(0, 4).map(tag => <span key={tag}>{tag}</span>)}</div>
      <p>{project.summary}</p>
      <span className="project-link">View case study <ArrowUpRight size={15} /></span>
    </div>
  </Link>;
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    getProjects()
      .then(setProjects)
      .catch(function () {
        setError('Projects could not be loaded right now.');
      })
      .finally(function () {
        setLoading(false);
      });
  }, []);

  return <section className="projects-section section-wrap" id="projects">
    <Reveal className="projects-heading">
      <SectionHeading eyebrow="Featured projects" title="Things I've built" description="A few highlights from my recent work. Each project represents a real-world problem, a practical solution and valuable learning." />
      {projects.length > 0 && <Link className="text-link" to={`/projects/${projects[0].slug}`}>Explore a case study <ArrowRight size={15} /></Link>}
    </Reveal>
    {loading && <p className="inline-note">Loading projects...</p>}
    {error && <p className="inline-error">{error}</p>}
    {!loading && !error && projects.length === 0 && <p className="inline-note">No projects to show yet.</p>}
    {projects.length > 0 && <Reveal className="projects-grid stagger" threshold={0.08}>{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.slug} />)}</Reveal>}
  </section>;
}
