import React from 'react';
import './SectionHeading.scss';

export default function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  return <div className={`section-heading align-${align}`}><div className="section-eyebrow">{eyebrow}</div><h2>{title}</h2>{description && <p>{description}</p>}</div>;
}
