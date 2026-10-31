import React from 'react';
import Reveal from '../Reveal/Reveal';
import { usePortfolio } from '../../context/PortfolioContext';
import { getIcon } from '../../utils/icons';
import './Stats.scss';

export default function Stats() {
  const { portfolio } = usePortfolio();
  const stats = portfolio.stats || [];

  return <Reveal as="section" className="stats-strip stagger">{stats.map(({ icon, value, label }) => { const Icon = getIcon(icon); return <div className="stat-item" key={value}><Icon size={30} strokeWidth={1.6} /><span><strong>{value}</strong><small>{label}</small></span></div>; })}</Reveal>;
}
