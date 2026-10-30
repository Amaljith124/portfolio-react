import React from 'react';
import { Clock3, GraduationCap, Rocket, Zap } from 'lucide-react';
import Reveal from '../Reveal/Reveal';
import './Stats.scss';

const stats = [
  { icon: Clock3, value: '3 years', label: 'Professional experience' },
  { icon: GraduationCap, value: 'B.Tech CSE', label: '2019 – 2023' },
  { icon: Rocket, value: 'Production experience', label: 'Startup product development' },
  { icon: Zap, value: 'Always learning', label: 'Solving real-world problems' }
];

export default function Stats() {
  return <Reveal as="section" className="stats-strip stagger">{stats.map(({ icon: Icon, value, label }) => <div className="stat-item" key={value}><Icon size={30} strokeWidth={1.6} /><span><strong>{value}</strong><small>{label}</small></span></div>)}</Reveal>;
}
