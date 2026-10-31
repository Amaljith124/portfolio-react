import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../webservices/adminApi';
import Modal from '../Modal/Modal';

// Super admin: removes chat sessions together with their log (messages). Choose what to remove, see how many sessions and messages that is
// (a preview that deletes nothing), then type DELETE. Enquiries made from a removed chat are kept.
export default function CleanSessionsModal({ users, onClose, onCleaned }) {
  const [scope, setScope] = useState('all'); // all | portfolio | older
  const [userId, setUserId] = useState('');
  const [days, setDays] = useState(30);
  const [limitPortfolio, setLimitPortfolio] = useState(false);
  const [counts, setCounts] = useState(null);
  const [typed, setTyped] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);

  // what the current choice matches (sent as the request body)
  const body = {
    userId: scope === 'portfolio' || (scope === 'older' && limitPortfolio) ? userId || undefined : undefined,
    olderThanDays: scope === 'older' ? Number(days) : undefined
  };
  const incomplete = (scope === 'portfolio' && !userId) || (scope === 'older' && limitPortfolio && !userId) || (scope === 'older' && !(Number(days) >= 1));

  // preview: ask the server how many sessions and messages the choice matches
  useEffect(function () {
    setCounts(null);
    setTyped('');
    setError('');
    if (!incomplete) {
      let cancelled = false;
      const timer = setTimeout(function () {
        adminApi.cleanChatSessions({ ...body, dryRun: true })
          .then(function (result) {
            if (!cancelled) {
              setCounts(result);
            } else {
              // the choice changed meanwhile
            }
          })
          .catch(function (requestError) {
            if (!cancelled) {
              setError(requestError.message);
            } else {
              // the choice changed meanwhile
            }
          });
      }, 250);
      return function () {
        cancelled = true;
        clearTimeout(timer);
      };
    } else {
      return undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, userId, days, limitPortfolio]);

  function remove() {
    setBusy(true);
    setError('');
    adminApi.cleanChatSessions({ ...body, dryRun: false, confirm: 'DELETE' })
      .then(function (result) {
        setDone(result);
        onCleaned();
      })
      .catch(requestError => setError(requestError.message))
      .finally(() => setBusy(false));
  }

  const ready = counts && counts.sessions > 0 && typed === 'DELETE' && !busy;

  return (
    <Modal title="Clean chat sessions" onClose={onClose}>
      {done ? (
        <div className="adm-form">
          <p className="adm-ok">Removed {done.sessions} session(s) and {done.messages} message(s).</p>
          <div className="adm-row"><button className="adm-btn adm-btn-primary" onClick={onClose}>Close</button></div>
        </div>
      ) : (
        <div className="adm-form">
          <p className="adm-muted">Removes chat sessions and their session log (all their messages). It cannot be undone. Contact requests (enquiries) made from a removed chat are kept.</p>
          <div className="adm-radios">
            <label><input type="radio" name="scope" checked={scope === 'all'} onChange={() => setScope('all')} /> Every session of every portfolio</label>
            <label><input type="radio" name="scope" checked={scope === 'portfolio'} onChange={() => setScope('portfolio')} /> Every session of one portfolio</label>
            <label><input type="radio" name="scope" checked={scope === 'older'} onChange={() => setScope('older')} /> Sessions with no activity for more than
              <input type="number" min="1" max="3650" value={days} onChange={event => setDays(event.target.value)} className="adm-days" disabled={scope !== 'older'} /> days</label>
          </div>
          {(scope === 'portfolio' || scope === 'older') && (
            <div className="adm-row">
              {scope === 'older' && <label className="adm-inline"><input type="checkbox" checked={limitPortfolio} onChange={event => setLimitPortfolio(event.target.checked)} /> only in one portfolio</label>}
              {(scope === 'portfolio' || limitPortfolio) && (
                <select value={userId} onChange={event => setUserId(event.target.value)} aria-label="Portfolio">
                  <option value="">Choose a portfolio...</option>
                  {users.map(user => <option key={user.userId} value={user.userId}>{user.name} (/{user.slug})</option>)}
                </select>
              )}
            </div>
          )}
          <div className={`adm-preview-count ${counts && counts.sessions > 0 ? 'is-warn' : ''}`} aria-live="polite">
            {incomplete ? 'Choose what to remove.' : counts ? (counts.sessions === 0 ? 'Nothing matches: there is nothing to remove.' : `This will remove ${counts.sessions} session(s) and ${counts.messages} message(s).`) : error ? '' : 'Counting...'}
          </div>
          {counts && counts.sessions > 0 && (
            <label>Type <strong>DELETE</strong> to confirm<input value={typed} onChange={event => setTyped(event.target.value)} autoComplete="off" spellCheck="false" /></label>
          )}
          {error && <p className="adm-error">{error}</p>}
          <div className="adm-row">
            <button className="adm-btn" onClick={onClose}>Cancel</button>
            <button className="adm-btn adm-btn-danger" disabled={!ready} onClick={remove}>{busy ? 'Removing...' : 'Remove sessions'}</button>
            {busy && <span className="adm-spinner" aria-label="Removing" />}
          </div>
        </div>
      )}
    </Modal>
  );
}
