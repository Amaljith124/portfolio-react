import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import './ProjectDetail.scss';

export default function ProjectDetail() {
  const { projectSlug } = useParams();
  const { portfolio, basePath } = usePortfolio();
  const project = (portfolio.projects || []).find(item => item.slug === projectSlug);
  const email = portfolio.profile.email;

  if (!project) {
    // same answer as the Node server for an unknown slug (404 "No such project")
    return <main className="project-detail section-wrap"><p>No such project</p><Link to={basePath || '/'}>Back home</Link></main>;
  } else {
    return <main className="project-detail section-wrap">
      <Link to={`${basePath}/#projects`} className="back-link"><ArrowLeft size={16} /> Back to projects</Link>
      <div className="section-eyebrow">{project.category}</div>
      <h1>{project.title}</h1>
      <p className="detail-summary">{project.summary}</p>
      <div className="detail-panel"><h2>Overview</h2><p>{project.description || project.summary}</p><h2>My contribution</h2><ul>{(project.contribution || []).map(item => <li key={item}>{item}</li>)}</ul><h2>Technologies</h2><div className="detail-tags">{(project.technologies || []).map(item => <span key={item}>{item}</span>)}</div></div>
      {email && <a className="text-link" href={`mailto:${email}?subject=Project%20discussion`}>Discuss a similar project <ArrowUpRight size={15} /></a>}
    </main>;
  }
}
