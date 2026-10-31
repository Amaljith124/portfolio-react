import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, isAdminRole } from '../../../webservices/adminApi';
import PortraitSlot from '../PortraitSlot/PortraitSlot';
import MagicLinkPanel, { MagicLinkReveal } from '../MagicLinkPanel/MagicLinkPanel';

const emptyForm = { name: '', email: '', phoneNumber: '', slug: '', role: 'user', templateId: '', isAssistantEnabled: false, isActive: true, password: '', generateMagicLink: false, magicLinkDays: 90 };

// The create / edit form. mode 'create' makes a user whose portfolio starts from the template's example data; mode 'edit' loads
// the user, shows the portrait with replace / remove and saves name, email, phone, active state, template, role and feature toggles.
// Used inside the modals of the user list and as the "Profile" tab of the editor (embedded).
export default function UserForm({ mode, userId, session, templates, onSaved, embedded }) {
  const admin = isAdminRole(session.role);
  const [form, setForm] = useState(emptyForm);
  const [loaded, setLoaded] = useState(mode === 'create');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [portfolioState, setPortfolioState] = useState(null); // { user, assets } for the portrait slot
  const [created, setCreated] = useState(null); // the new user with its one-time magic link

  useEffect(function () {
    if (mode === 'create') {
      const defaultTemplate = templates[0];
      setForm(current => ({ ...current, templateId: current.templateId || (defaultTemplate ? defaultTemplate.templateId : '') }));
    } else {
      // edit: the user is loaded below
    }
  }, [mode, templates]);

  function load() {
    adminApi.getUser(userId)
      .then(function (result) {
        const user = result.user;
        setPortfolioState(result);
        setForm({ name: user.name, email: user.email, phoneNumber: user.phoneNumber || '', slug: user.slug, role: user.role, templateId: user.templateId || '', isAssistantEnabled: !!(user.features && user.features.isAssistantEnabled), isActive: user.isActive, password: '' });
        setLoaded(true);
      })
      .catch(requestError => setError(requestError.message));
  }

  useEffect(function () {
    if (mode === 'edit') {
      load();
    } else {
      // create: nothing to load
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, userId]);

  function update(event) {
    const { name, type, checked, value } = event.target;
    setForm(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    let request;
    if (mode === 'create') {
      request = adminApi.createUser({
        name: form.name, email: form.email, phoneNumber: form.phoneNumber || null, slug: form.slug || undefined,
        role: session.role === 'super_admin' ? form.role : 'user', templateId: form.templateId || undefined,
        features: { isAssistantEnabled: form.isAssistantEnabled }, password: form.password || undefined,
        generateMagicLink: form.generateMagicLink || undefined, magicLinkExpiresInDays: form.generateMagicLink ? Number(form.magicLinkDays) : undefined
      });
    } else {
      const body = { name: form.name, phoneNumber: form.phoneNumber || null };
      if (admin) {
        Object.assign(body, { email: form.email, isActive: form.isActive, features: { isAssistantEnabled: form.isAssistantEnabled } });
        if (form.templateId) {
          body.templateId = form.templateId;
        } else {
          // no template chosen: unchanged
        }
        if (session.role === 'super_admin' && userId !== session.userId) {
          body.role = form.role;
        } else {
          // only another user's role can be changed by a super admin
        }
      } else {
        // a plain user changes their own name and phone only
      }
      if (form.password) {
        body.password = form.password;
      } else {
        // password unchanged
      }
      request = adminApi.updateUser(userId, body);
    }

    request
      .then(function (result) {
        setMessage('Saved.');
        setForm(current => ({ ...current, password: '' }));
        if (mode === 'create' && result && result.magicLink) {
          // keep the form open: the raw link is shown once and the admin closes it with "Done"
          setCreated(result);
        } else if (onSaved) {
          onSaved();
        } else {
          // embedded: stay on the page
        }
      })
      .catch(requestError => setError(requestError.message))
      .finally(() => setSaving(false));
  }

  if (created) {
    return (
      <div className="adm-form">
        <p className="adm-ok">User {created.name} created at /{created.slug}.</p>
        <MagicLinkReveal token={created.magicLink.token} expiresAt={created.magicLink.expiresAt} />
        <div className="adm-row"><button className="adm-btn adm-btn-primary" onClick={onSaved}>Done</button></div>
      </div>
    );
  } else if (!loaded) {
    return error ? <p className="adm-error">{error}</p> : <div className="adm-skel-form" aria-busy="true"><i className="adm-skel" /><i className="adm-skel" /><i className="adm-skel" /><i className="adm-skel" /></div>;
  } else {
    return (
      <form className="adm-form" onSubmit={submit}>
        <div className="adm-form-grid">
          <label>Name *<input name="name" value={form.name} onChange={update} required maxLength="120" /></label>
          <label>Email * <small>(login and public contact email)</small><input name="email" type="email" value={form.email} onChange={update} required maxLength="255" disabled={mode === 'edit' && !admin} /></label>
          <label>Phone number <small>(with country code, e.g. +919876543210)</small><input name="phoneNumber" value={form.phoneNumber} onChange={update} maxLength="32" placeholder="+91..." /></label>
          <label>Portfolio slug <small>{mode === 'create' ? '(blank = from the name)' : '(cannot be changed)'}</small><input name="slug" value={form.slug} onChange={update} disabled={mode === 'edit'} maxLength="60" pattern="[a-z0-9]+(-[a-z0-9]+)*" /></label>
          {admin && <label>Template<select name="templateId" value={form.templateId} onChange={update}>{templates.map(template => <option key={template.templateId} value={template.templateId}>{template.name}</option>)}</select></label>}
          {session.role === 'super_admin' && (mode === 'create' || userId !== session.userId) && <label>Role<select name="role" value={form.role} onChange={update}><option value="user">User</option><option value="admin">Admin</option><option value="super_admin">Super admin</option></select></label>}
          <label>{mode === 'create' ? 'Initial password' : 'New password'} <small>(min. 12 characters{mode === 'create' ? ', optional' : ', leave blank to keep'})</small><input name="password" type="password" value={form.password} onChange={update} autoComplete="new-password" minLength="12" maxLength="72" /></label>
        </div>
        {admin && (
          <div className="adm-checks">
            <label><input type="checkbox" name="isAssistantEnabled" checked={form.isAssistantEnabled} onChange={update} /> Assistant (chat) enabled</label>
            {mode === 'edit' && userId !== session.userId && <label><input type="checkbox" name="isActive" checked={form.isActive} onChange={update} /> Account active</label>}
          </div>
        )}
        {mode === 'create' && (
          <div className="adm-checks">
            <label><input type="checkbox" name="generateMagicLink" checked={form.generateMagicLink} onChange={update} /> Generate a magic link</label>
            {form.generateMagicLink && <label className="adm-inline">valid for <input type="number" name="magicLinkDays" min="1" max="365" value={form.magicLinkDays} onChange={update} /> days</label>}
          </div>
        )}
        {mode === 'create' && <p className="adm-muted">The portfolio is created from the selected template's example content; edit it afterwards in the portfolio editor.</p>}
        {mode === 'edit' && portfolioState && !embedded && (
          <div className="adm-subsection">
            <h3>Portrait</h3>
            <PortraitSlot userId={userId} state={portfolioState} onChanged={load} />
            <p className="adm-muted">All images and project images: <Link to={`/admin/users/${userId}`}>open the full editor</Link>.</p>
          </div>
        )}
        {mode === 'edit' && portfolioState && <MagicLinkPanel userId={userId} user={portfolioState.user} onChanged={load} />}
        {error && <p className="adm-error">{error}</p>}
        {message && <p className="adm-ok">{message}</p>}
        <div className="adm-row"><button className="adm-btn adm-btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : mode === 'create' ? 'Create user' : 'Save'}</button>{saving && <span className="adm-spinner" aria-label="Saving" />}</div>
      </form>
    );
  }
}
