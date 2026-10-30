import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getProject } from '../webservices/webservices';
import './ProjectDetail.scss';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(function () {
    getProject(slug)
      .then(setProject)
      .catch(function (requestError) {
        setError(requestError.message || 'Project could not be loaded.');
      });
  }, [slug]);

  if (error) {
    return <main className="project-detail section-wrap"><p>{error}</p><Link to="/">Back home</Link></main>;
  } else {
    if (!project) {
      return <main className="project-detail section-wrap"><p>Loading project...</p></main>;
    } else {
      return <main className="project-detail section-wrap">
        <Link to="/#projects" className="back-link"><ArrowLeft size={16} /> Back to projects</Link>
        <div className="section-eyebrow">{project.category}</div>
        <h1>{project.title}</h1>
        <p className="detail-summary">{project.summary}</p>
        <div className="detail-panel"><h2>Overview</h2><p>{project.description || project.summary}</p><h2>My contribution</h2><ul>{project.contribution.map(item => <li key={item}>{item}</li>)}</ul><h2>Technologies</h2><div className="detail-tags">{project.technologies.map(item => <span key={item}>{item}</span>)}</div></div>
        <a className="text-link" href="mailto:amaljithanaswar@gmail.com?subject=Project%20discussion">Discuss a similar project <ArrowUpRight size={15} /></a>
      </main>;
    }
  }
}
