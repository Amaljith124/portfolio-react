import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../../webservices/adminApi';
import CleanSessionsModal from '../../../components/Admin/CleanSessionsModal/CleanSessionsModal';

function when(value) {
  return value ? new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '';
}

// Super admin: every chat session of every portfolio. Open one to read it as a chat; "Clean sessions" removes sessions and their log.
export default function Sessions() {
  const [data, setData] = useState({ sessions: [], total: 0, page: 1, pageSize: 25 });
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [userId, setUserId] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cleaning, setCleaning] = useState(false);

  const load = useCallback(function () {
    setLoading(true);
    adminApi.listChatSessions({ userId, search, page })
      .then(function (result) {
        setData(result);
        setError('');
      })
      .catch(requestError => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [userId, search, page]);

  useEffect(function () {
    adminApi.listUsers('').then(setUsers).catch(requestError => setError(requestError.message));
  }, []);

  useEffect(function () {
    const timer = setTimeout(load, 250);
    return function () {
      clearTimeout(timer);
    };
  }, [load]);

  const pages = Math.max(1, Math.ceil(data.total / data.pageSize));

  return (
    <>
      <div className="adm-row adm-between">
        <h1>Chat sessions</h1>
        <button className="adm-btn adm-btn-danger" onClick={() => setCleaning(true)}>Clean sessions...</button>
      </div>
      <div className="adm-row">
        <input className="adm-search" type="search" placeholder="Search visitor name or email" value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} />
        <select value={userId} onChange={event => { setUserId(event.target.value); setPage(1); }} aria-label="Portfolio">
          <option value="">All portfolios</option>
          {users.map(user => <option key={user.userId} value={user.userId}>{user.name} (/{user.slug})</option>)}
        </select>
        <span className="adm-muted">{data.total} session(s)</span>
      </div>
      {error && <p className="adm-error">{error}</p>}
      <div className="adm-card adm-table-wrap">
        <table className="adm-table">
          <thead><tr><th>Visitor</th><th>Portfolio</th><th>Messages</th><th>Last message</th><th>Last activity</th><th /></tr></thead>
          <tbody>
            {loading && data.sessions.length === 0 && [0, 1, 2, 3].map(row => <tr key={`s${row}`} aria-hidden="true">{[0, 1, 2, 3, 4, 5].map(cell => <td key={cell}><i className="adm-skel" style={{ width: cell === 3 ? 220 : 90, height: 14 }} /></td>)}</tr>)}
            {data.sessions.map(item => (
              <tr key={item.sessionId}>
                <td><Link to={`/admin/sessions/${item.sessionId}`}>{item.visitorName || 'Anonymous'}</Link><br /><small className="adm-muted">{item.visitorEmail || 'no email (older chat)'}</small></td>
                <td>{item.ownerName ? <>{item.ownerName} <small className="adm-muted">/{item.ownerSlug}</small></> : '—'}</td>
                <td>{item.messageCount}</td>
                <td className="adm-clip">{item.lastMessage || '—'}</td>
                <td>{when(item.updatedDate)}</td>
                <td><Link className="adm-btn" to={`/admin/sessions/${item.sessionId}`}>Open chat</Link></td>
              </tr>
            ))}
            {!loading && data.sessions.length === 0 && <tr><td colSpan="6">No chat sessions found.</td></tr>}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="adm-row">
          <button className="adm-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Newer</button>
          <span className="adm-muted">Page {page} of {pages}</span>
          <button className="adm-btn" disabled={page >= pages} onClick={() => setPage(page + 1)}>Older →</button>
        </div>
      )}
      {cleaning && <CleanSessionsModal users={users} onClose={() => setCleaning(false)} onCleaned={() => { setPage(1); load(); }} />}
    </>
  );
}
