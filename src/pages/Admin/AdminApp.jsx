import React, { useEffect, useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { clearSession, getSession, isAdminRole, SIGNED_OUT_EVENT } from '../../webservices/adminApi';
import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';
import Users from './Users/Users';
import UserEditor from './UserEditor/UserEditor';
import Sessions from './Sessions/Sessions';
import SessionView from './SessionView/SessionView';
import './Admin.scss';

// Protects every admin route: without a session the visitor is sent to /admin/login. (The server checks the token, role and
// tenant on every request as well - a hidden menu is not security.)
function Layout({ session, onSignOut }) {
  const admin = isAdminRole(session.role);

  return (
    <div className="adm-shell">
      <header className="adm-header">
        <Link to={admin ? '/admin' : `/admin/users/${session.userId}`} className="adm-brand">Portfolio admin</Link>
        <nav>
          {admin && <NavLink to="/admin" end>Dashboard</NavLink>}
          {admin && <NavLink to="/admin/users">Users</NavLink>}
          {session.role === 'super_admin' && <NavLink to="/admin/sessions">Chat sessions</NavLink>}
          {!admin && <NavLink to={`/admin/users/${session.userId}`}>My portfolio</NavLink>}
        </nav>
        <span className="adm-grow" />
        <span className="adm-who">{session.name} · {session.role.replace('_', ' ')}</span>
        <button className="adm-btn adm-btn-ghost" onClick={onSignOut}>Sign out</button>
      </header>
      <main className="adm-main">
        <Routes>
          <Route path="/" element={admin ? <Dashboard session={session} /> : <Navigate to={`/admin/users/${session.userId}`} replace />} />
          <Route path="users" element={admin ? <Users session={session} /> : <Navigate to={`/admin/users/${session.userId}`} replace />} />
          <Route path="users/:userId" element={<UserEditor session={session} />} />
          <Route path="sessions" element={session.role === 'super_admin' ? <Sessions /> : <Navigate to="/admin" replace />} />
          <Route path="sessions/:sessionId" element={session.role === 'super_admin' ? <SessionView /> : <Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function AdminApp() {
  const navigate = useNavigate();
  const [session, setSession] = useState(getSession());

  useEffect(function () {
    function onSignedOut() {
      setSession(null);
      navigate('/admin/login');
    }
    window.addEventListener(SIGNED_OUT_EVENT, onSignedOut);
    return function () {
      window.removeEventListener(SIGNED_OUT_EVENT, onSignedOut);
    };
  }, [navigate]);

  function signOut() {
    clearSession();
    setSession(null);
    navigate('/admin/login');
  }

  return (
    <Routes>
      <Route path="login" element={<Login session={session} onSignedIn={setSession} />} />
      <Route path="*" element={session ? <Layout session={session} onSignOut={signOut} /> : <Navigate to="/admin/login" replace />} />
    </Routes>
  );
}
