import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../../webservices/adminApi';
import Modal from '../../../components/Admin/Modal/Modal';
import UserForm from '../../../components/Admin/UserForm/UserForm';

export default function Users({ session }) {
  const [users, setUsers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { mode: 'create' } | { mode: 'edit', userId }

  const load = useCallback(function (term) {
    setLoading(true);
    adminApi.listUsers(term)
      .then(function (list) {
        setUsers(list);
        setError('');
      })
      .catch(requestError => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(function () {
    adminApi.getTemplates().then(setTemplates).catch(requestError => setError(requestError.message));
  }, []);

  useEffect(function () {
    const timer = setTimeout(() => load(search), 250);
    return function () {
      clearTimeout(timer);
    };
  }, [search, load]);

  function toggleActive(user) {
    adminApi.updateUser(user.userId, { isActive: !user.isActive })
      .then(() => load(search))
      .catch(requestError => setError(requestError.message));
  }

  return (
    <>
      <div className="adm-row adm-between">
        <h1>Users</h1>
        <button className="adm-btn adm-btn-primary" onClick={() => setModal({ mode: 'create' })}>+ Create user</button>
      </div>
      <input className="adm-search" type="search" placeholder="Search name, email, phone or slug" value={search} onChange={event => setSearch(event.target.value)} />
      {error && <p className="adm-error">{error}</p>}
      <div className="adm-card adm-table-wrap">
        <table className="adm-table">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Portfolio</th><th>Role</th><th>Assistant</th><th>Status</th><th /></tr></thead>
          <tbody>
            {users.map(user => (
              <tr key={user.userId} className={user.isActive ? '' : 'is-off'}>
                <td><Link to={`/admin/users/${user.userId}`}>{user.name}</Link></td>
                <td>{user.email}</td>
                <td>{user.phoneNumber || '—'}</td>
                <td><a href={user.slug === 'amaljith' ? '/' : `/p/${user.slug}`} target="_blank" rel="noreferrer">/{user.slug}</a> <small>{user.templateKey}</small></td>
                <td>{user.role.replace('_', ' ')}</td>
                <td>{user.features && user.features.isAssistantEnabled ? 'On' : 'Off'}</td>
                <td><span className={`adm-pill ${user.isActive ? 'is-on' : ''}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="adm-actions">
                  <button className="adm-btn" onClick={() => setModal({ mode: 'edit', userId: user.userId })}>Edit</button>
                  <Link className="adm-btn" to={`/admin/users/${user.userId}`}>Open editor</Link>
                  {user.userId !== session.userId && <button className="adm-btn" onClick={() => toggleActive(user)}>{user.isActive ? 'Deactivate' : 'Activate'}</button>}
                </td>
              </tr>
            ))}
            {loading && users.length === 0 && [0, 1, 2].map(row => <tr key={`s${row}`} aria-hidden="true">{[0, 1, 2, 3, 4, 5, 6, 7].map(cell => <td key={cell}><i className="adm-skel" style={{ width: cell === 7 ? 120 : 80, height: 14 }} /></td>)}</tr>)}
            {!loading && users.length === 0 && <tr><td colSpan="8">No users found.</td></tr>}
          </tbody>
        </table>
      </div>
      {modal && (
        <Modal title={modal.mode === 'create' ? 'Create user' : 'Edit user'} onClose={() => setModal(null)}>
          <UserForm mode={modal.mode} userId={modal.userId} session={session} templates={templates} onSaved={function () {
            setModal(null);
            load(search);
          }} />
        </Modal>
      )}
    </>
  );
}
