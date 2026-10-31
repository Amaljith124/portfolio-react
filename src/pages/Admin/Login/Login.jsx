import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { adminApi, getSession, isAdminRole, saveSession } from '../../../webservices/adminApi';

export default function Login({ session, onSignedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (session) {
    return <Navigate to={isAdminRole(session.role) ? '/admin' : `/admin/users/${session.userId}`} replace />;
  } else {
    return (
      <div className="adm-login">
        <form className="adm-card" onSubmit={function (event) {
          event.preventDefault();
          setLoading(true);
          setError('');
          adminApi.login(email, password)
            .then(function (result) {
              saveSession(result.token, result.user);
              onSignedIn(getSession());
            })
            .catch(function (requestError) {
              setError(requestError.message);
            })
            .finally(function () {
              setLoading(false);
            });
        }}>
          <h1>Admin sign-in</h1>
          <label>Email<input type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="username" required /></label>
          <label>Password<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required /></label>
          {error && <p className="adm-error">{error}</p>}
          <button className="adm-btn adm-btn-primary" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
      </div>
    );
  }
}
