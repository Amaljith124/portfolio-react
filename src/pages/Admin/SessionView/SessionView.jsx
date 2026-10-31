import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { adminApi } from '../../../webservices/adminApi';

function stamp(value) {
  return new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

// Super admin: one chat session read as a chat - the visitor on one side, Byte on the other, in order, with the time of each message.
export default function SessionView() {
  const { sessionId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(function () {
    setData(null);
    adminApi.getChatSession(sessionId).then(setData).catch(requestError => setError(requestError.message));
  }, [sessionId]);

  if (error) {
    return <><Link to="/admin/sessions" className="adm-muted">← Chat sessions</Link><p className="adm-error">{error}</p></>;
  } else if (!data) {
    return <div aria-busy="true" role="status"><i className="adm-skel" style={{ width: 260, height: 30 }} /><i className="adm-skel" style={{ width: '100%', height: 320, marginTop: 24 }} /></div>;
  } else {
    const { session, messages } = data;
    let lastDay = '';
    return (
      <>
        <Link to="/admin/sessions" className="adm-muted">← Chat sessions</Link>
        <div className="adm-row adm-between">
          <div>
            <h1>{session.visitorName || 'Anonymous visitor'}</h1>
            <span className="adm-muted">{session.visitorEmail || 'no email (chat from before the name and email step)'} · portfolio {session.ownerName ? <>{session.ownerName} (/{session.ownerSlug})</> : '—'} · started {stamp(session.createdDate)} · {messages.length} message(s)</span>
          </div>
        </div>
        <div className="adm-card adm-transcript" aria-label="Conversation">
          {messages.length === 0 && <p className="adm-muted">This session has no messages yet.</p>}
          {messages.map(message => {
            const day = new Date(message.createdDate).toDateString();
            const separator = day !== lastDay ? <div className="adm-day" key={`d-${message.messageId}`}>{day}</div> : null;
            lastDay = day;
            return (
              <React.Fragment key={message.messageId}>
                {separator}
                <div className={`adm-msg ${message.role === 'assistant' ? 'is-byte' : 'is-visitor'}`}>
                  <span className="adm-msg-who">{message.role === 'assistant' ? 'Byte' : (session.visitorName || 'Visitor')}</span>
                  <p>{message.message}</p>
                  <time>{new Date(message.createdDate).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</time>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </>
    );
  }
}
