import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../../webservices/adminApi';

export default function Dashboard({ session }) {
  const [counts, setCounts] = useState(null);
  const [error, setError] = useState('');

  useEffect(function () {
    adminApi.getDashboard().then(setCounts).catch(error_ => setError(error_.message));
  }, []);

  const cards = counts ? [['Users', counts.users], ['Active users', counts.activeUsers], ['Images', counts.assets], ['Enquiries', counts.enquiries], ['Chat sessions', counts.chatSessions]] : [];

  return (
    <>
      <h1>Dashboard</h1>
      {error && <p className="adm-error">{error}</p>}
      <div className="adm-grid">{!counts && !error && [0, 1, 2, 3, 4].map(index => <div className="adm-card adm-stat" key={index} aria-busy="true"><i className="adm-skel" style={{ width: 60, height: 30 }} /><i className="adm-skel" style={{ width: 100, height: 12 }} /></div>)}{cards.map(([label, value]) => <div className="adm-card adm-stat" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
      <h2>Shortcuts</h2>
      <div className="adm-row">
        <Link className="adm-btn adm-btn-primary" to="/admin/users">Manage users</Link>
        <Link className="adm-btn" to={`/admin/users/${session.userId}`}>My portfolio editor</Link>
        <a className="adm-btn" href="/" target="_blank" rel="noreferrer">View the site</a>
      </div>
    </>
  );
}
