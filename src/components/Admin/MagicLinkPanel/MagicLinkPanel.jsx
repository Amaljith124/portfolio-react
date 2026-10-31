import React, { useState } from 'react';
import { adminApi } from '../../../webservices/adminApi';

export function magicUrl(token) {
  return `${window.location.origin}/portfolio/${token}`;
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : 'never';
}

// The raw link of a just created magic link. It is only available now: the server keeps just a hash of the token.
export function MagicLinkReveal({ token, expiresAt }) {
  const [copied, setCopied] = useState(false);
  const url = magicUrl(token);

  return (
    <div className="adm-reveal" role="status">
      <strong>Copy the link now - it is not shown again.</strong>
      <div className="adm-row">
        <input readOnly value={url} onFocus={event => event.target.select()} aria-label="Magic link" />
        <button type="button" className="adm-btn adm-btn-primary" onClick={() => navigator.clipboard.writeText(url).then(() => setCopied(true)).catch(() => setCopied(false))}>{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <span className="adm-muted">Opens the portfolio without a sign-in. Expires: {formatDate(expiresAt)}.</span>
    </div>
  );
}

// Magic link status (active / expired / none) with generate, rotate and revoke. Rotating replaces the previous link at once.
export default function MagicLinkPanel({ userId, user, onChanged }) {
  const [days, setDays] = useState(90);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState(null);

  const expired = user.hasMagicLink && user.magicLinkExpiresAt && new Date(user.magicLinkExpiresAt) < new Date();
  const status = !user.hasMagicLink ? 'No magic link' : expired ? `Expired on ${formatDate(user.magicLinkExpiresAt)}` : `Active - expires ${formatDate(user.magicLinkExpiresAt)}`;

  function generate() {
    if (!user.hasMagicLink || window.confirm('This replaces the current link: the old one stops working immediately. Continue?')) {
      setBusy(true);
      setError('');
      adminApi.createMagicLink(userId, Number(days))
        .then(function (link) {
          setCreated(link);
          onChanged();
        })
        .catch(requestError => setError(requestError.message))
        .finally(() => setBusy(false));
    } else {
      // cancelled
    }
  }

  function revoke() {
    if (window.confirm('Revoke the magic link? The link stops working immediately.')) {
      setBusy(true);
      setError('');
      adminApi.revokeMagicLink(userId)
        .then(function () {
          setCreated(null);
          onChanged();
        })
        .catch(requestError => setError(requestError.message))
        .finally(() => setBusy(false));
    } else {
      // cancelled
    }
  }

  return (
    <div className="adm-subsection">
      <h3>Magic link</h3>
      <p className="adm-muted">Status: <strong>{status}</strong>{user.hasMagicLink && user.magicLinkCreatedDate ? ` · created ${formatDate(user.magicLinkCreatedDate)}` : ''}</p>
      <div className="adm-row">
        <label className="adm-inline">Valid for <input type="number" min="1" max="365" value={days} onChange={event => setDays(event.target.value)} /> days</label>
        <button type="button" className="adm-btn adm-btn-primary" disabled={busy} onClick={generate}>{user.hasMagicLink ? 'Rotate link' : 'Generate link'}</button>
        {user.hasMagicLink && <button type="button" className="adm-btn" disabled={busy} onClick={revoke}>Revoke</button>}
        {busy && <span className="adm-spinner" aria-label="Working" />}
      </div>
      {created && <MagicLinkReveal token={created.token} expiresAt={created.expiresAt} />}
      {error && <p className="adm-error">{error}</p>}
    </div>
  );
}
