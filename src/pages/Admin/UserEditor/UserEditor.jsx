import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { adminApi, IMAGE_TYPES, isAdminRole, uploadImage } from '../../../webservices/adminApi';
import { iconNames } from '../../../utils/icons';
import UserForm from '../../../components/Admin/UserForm/UserForm';
import ThemeEditor from '../../../components/Admin/ThemeEditor/ThemeEditor';
import ImageSlot from '../../../components/Admin/ImageSlot/ImageSlot';
import { previewUrl } from '../../../utils/imageTools';
import portfolioExample from '../../../data/portfolioExample.json';

const tabs = [['profile', 'Profile & features'], ['portfolio', 'Portfolio content'], ['images', 'Images'], ['knowledge', 'Knowledge document'], ['theme', 'Theme']];

function PortfolioTab({ userId, state, onChanged }) {
  const serverText = JSON.stringify(state.user.portfolioData, null, 2);
  const [text, setText] = useState(serverText);

  useEffect(function () {
    setText(serverText);
  }, [serverText]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  function format() {
    // JSON.parse throws on bad text: the Promise executor turns that into a rejection that is shown below
    new Promise(resolve => resolve(JSON.parse(text)))
      .then(function (parsed) {
        setText(JSON.stringify(parsed, null, 2));
        setError('');
      })
      .catch(parseError => setError(`Not valid JSON: ${parseError.message}`));
  }

  function save() {
    setSaving(true);
    setError('');
    setMessage('');
    new Promise(resolve => resolve(JSON.parse(text)))
      .then(function (parsed) {
        adminApi.updateUser(userId, { portfolioData: parsed })
          .then(function () {
            setMessage('Portfolio saved.');
            onChanged();
          })
          .catch(requestError => setError(requestError.message))
          .finally(() => setSaving(false));
      })
      .catch(function (parseError) {
        setError(`Not valid JSON: ${parseError.message}`);
        setSaving(false);
      });
  }

  // puts the example into the editor (nothing is saved until "Save portfolio")
  function insertExample() {
    if (text === serverText || window.confirm('Replace the text in the editor with the example? Your unsaved changes in this box will be lost (what is saved stays as it is).')) {
      setText(JSON.stringify(portfolioExample, null, 2));
      setError('');
      setMessage('Example inserted. Edit it, then press "Save portfolio". Nothing is saved yet.');
    } else {
      // cancelled
    }
  }

  return (
    <>
      <details className="adm-guide">
        <summary>How this JSON works (field guide)</summary>
        <ul>
          <li><strong>Sections:</strong> profile (name is required), skillChips, heroServices, stats, about, skills, projectsSection, projects, services, opportunities, contact, assistant. A section you leave out does not appear.</li>
          <li><strong>Titles:</strong> <code>\n</code> is a line break and <code>{'{words}'}</code> in braces get the accent colour, e.g. <code>"Jane\n{'{Doe.}'}"</code>.</li>
          <li><strong>Icons:</strong> one of {iconNames.join(', ')}.</li>
          <li><strong>Links</strong> (href, github, linkedin) start with https://, http://, mailto:, # or /. <code>{'{email}'}</code> in a link becomes the user's email.</li>
          <li><strong>Projects:</strong> each needs a unique <code>slug</code> (lowercase letters, numbers, dashes) and a <code>title</code>.</li>
          <li><strong>services.items[].service:</strong> backend-development, ai-integration, api-integrations, database-development, full-stack-development or other.</li>
          <li><strong>Images:</strong> upload them on the Images tab; they add an <code>objectKey</code> to the JSON. Do not type image addresses by hand. The email on the site comes from the account, not from this JSON.</li>
        </ul>
      </details>
      <p className="adm-muted">The whole portfolio as JSON. Titles use <code>\n</code> for a line break and <code>{'{braces}'}</code> for the accent words. Images are referenced by <code>objectKey</code> - use the Images tab to upload and replace them. The server validates every field.</p>
      <textarea className="adm-json" value={text} onChange={event => setText(event.target.value)} spellCheck="false" rows="32" />
      {error && <p className="adm-error">{error}</p>}
      {message && <p className="adm-ok">{message}</p>}
      <div className="adm-row">
        <button className="adm-btn" onClick={insertExample}>Insert example</button>
        <button className="adm-btn" onClick={format}>Format</button>
        <button className="adm-btn" onClick={() => setText(serverText)}>Discard changes</button>
        <button className="adm-btn adm-btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save portfolio'}</button>
      </div>
    </>
  );
}

const statusText = {
  none: 'No document',
  pending: 'Not indexed yet - save and update the index so the assistant can use the latest text',
  processing: 'Indexing...',
  ready: 'Indexed - the assistant uses this version',
  failed: 'Indexing failed - the previous indexed version is still used'
};

// The knowledge document of the user (plain text, sections separated by a line with only ---). Saving stores the text; "Save and update
// index" also chunks it, creates the Gemini embeddings and stores them for retrieval. Only this user and admins can read or change it.
function KnowledgeTab({ userId, state, onChanged }) {
  const saved = state.user.knowledgeDocument || '';
  const [text, setText] = useState(saved);
  const [knowledge, setKnowledge] = useState(state.knowledge);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const limit = 200000;

  // after a save the server copy is the new baseline (the message below stays visible)
  useEffect(function () {
    setText(saved);
  }, [saved]);

  useEffect(function () {
    setKnowledge(state.knowledge);
  }, [state.knowledge]);

  // while the server is indexing, ask for the status every 2 seconds
  useEffect(function () {
    if (knowledge && knowledge.status === 'processing') {
      const timer = setTimeout(function () {
        adminApi.getKnowledgeStatus(userId).then(setKnowledge).catch(requestError => setError(requestError.message));
      }, 2000);
      return function () {
        clearTimeout(timer);
      };
    } else {
      return undefined;
    }
  }, [knowledge, userId]);

  function save(index) {
    setSaving(true);
    setError('');
    setMessage('');
    const body = { knowledgeDocument: text.trim() === '' ? null : text };
    (text === saved ? Promise.resolve() : adminApi.updateUser(userId, body))
      .then(function () {
        if (index) {
          return adminApi.ingestKnowledge(userId).then(function (result) {
            setMessage(result.status === 'processing' ? 'Saved. Indexing started...' : 'Saved. The index is up to date.');
          });
        } else {
          setMessage('Knowledge document saved.');
          return null;
        }
      })
      .then(function () {
        return adminApi.getKnowledgeStatus(userId).then(setKnowledge);
      })
      .then(onChanged)
      .catch(requestError => setError(requestError.message))
      .finally(() => setSaving(false));
  }

  return (
    <>
      <p className="adm-muted">Plain text the assistant draws on for this portfolio (experience, projects, services, FAQs). Separate topics with a line that contains only <code>---</code>. It is private: it is never part of the public portfolio, and other users cannot read it.</p>
      {knowledge && <p><span className={`adm-pill ${knowledge.status === 'ready' ? 'is-on' : ''}`}>{knowledge.status}</span> {statusText[knowledge.status]}{knowledge.chunkCount > 0 ? ` · ${knowledge.chunkCount} chunks` : ''}{knowledge.message ? ` · ${knowledge.message}` : ''}</p>}
      <textarea className="adm-json" value={text} onChange={event => setText(event.target.value)} rows="24" maxLength={limit} placeholder={'Professional experience\n\nI have ...\n\n---\n\nSkills\n\nNode.js, PostgreSQL, ...'} />
      <div className="adm-row adm-between"><span className="adm-muted">{text.length.toLocaleString()} / {limit.toLocaleString()} characters</span></div>
      {error && <p className="adm-error">{error}</p>}
      {message && <p className="adm-ok">{message}</p>}
      <div className="adm-row">
        <button className="adm-btn" onClick={() => setText(saved)} disabled={text === saved}>Discard changes</button>
        <button className="adm-btn" onClick={() => save(false)} disabled={saving || text === saved}>Save only</button>
        <button className="adm-btn adm-btn-primary" onClick={() => save(true)} disabled={saving || (knowledge && knowledge.status === 'processing') || (text === saved && knowledge && knowledge.status === 'ready')}>{saving ? 'Working...' : 'Save and update index'}</button>
        {(saving || (knowledge && knowledge.status === 'processing')) && <span className="adm-spinner" aria-label="Working" />}
      </div>
    </>
  );
}

function ImagesTab({ userId, state, onChanged }) {
  const projects = state.user.portfolioData.projects || [];
  const [error, setError] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [uploading, setUploading] = useState(false);
  const input = useRef(null);

  function onFile(event) {
    const file = event.target.files[0];
    event.target.value = '';
    if (file) {
      setUploading(true);
      setError('');
      uploadImage(userId, file, '', visibility)
        .then(onChanged)
        .catch(requestError => setError(requestError.message))
        .finally(() => setUploading(false));
    } else {
      // no file chosen
    }
  }

  function removeAsset(asset) {
    adminApi.deleteAsset(userId, asset.assetId).then(onChanged).catch(requestError => setError(requestError.message));
  }

  return (
    <>
      <h3>Portfolio images</h3>
      <ImageSlot label="Portrait" userId={userId} state={state} path={['profile', 'portrait']} keepFlags onChanged={onChanged} />
      {projects.map((project, index) => <ImageSlot key={project.slug} label={`Project: ${project.title}`} userId={userId} state={state} path={['projects', index, 'image']} onChanged={onChanged} />)}
      <h3>Image library</h3>
      <p className="adm-muted">Uploaded files of this portfolio. JPEG, PNG or WebP, up to 5 MB. An image that is still used cannot be deleted - replace it above first. Public images are served from the public image domain; private ones only through short-lived signed links.</p>
      <div className="adm-row">
        <select value={visibility} onChange={event => setVisibility(event.target.value)} aria-label="Visibility of the new image"><option value="public">Public</option><option value="private">Private</option></select>
        <button className="adm-btn" disabled={uploading} onClick={() => input.current.click()}>{uploading ? 'Uploading...' : 'Upload to library'}</button>
        {uploading && <span className="adm-spinner" aria-label="Uploading" />}
        <input ref={input} type="file" accept={IMAGE_TYPES.join(',')} hidden onChange={onFile} />
      </div>
      {error && <p className="adm-error">{error}</p>}
      <div className="adm-library">
        {state.assets.map(asset => (
          <div className="adm-card" key={asset.assetId}>
            <div className="adm-thumb">{previewUrl({ objectKey: asset.objectKey }, state.assets) ? <img src={previewUrl({ objectKey: asset.objectKey }, state.assets)} alt={asset.altText || ''} /> : <span>No preview</span>}</div>
            <small>{asset.width}×{asset.height} · {Math.round(asset.sizeBytes / 1024)} KB · <span className={`adm-pill ${asset.visibility === 'private' ? '' : 'is-on'}`}>{asset.visibility}</span></small>
            <button className="adm-btn" onClick={() => removeAsset(asset)}>Delete</button>
          </div>
        ))}
        {state.assets.length === 0 && <p className="adm-muted">No uploaded images yet.</p>}
      </div>
    </>
  );
}

export default function UserEditor({ session }) {
  const { userId } = useParams();
  const admin = isAdminRole(session.role);
  const [tab, setTab] = useState('profile');
  const [state, setState] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState('');

  const load = useCallback(function () {
    adminApi.getUser(userId)
      .then(function (result) {
        setState(result);
        setError('');
      })
      .catch(requestError => setError(requestError.message));
  }, [userId]);

  useEffect(function () {
    setState(null);
    load();
  }, [load]);

  useEffect(function () {
    if (admin) {
      adminApi.getTemplates().then(setTemplates).catch(requestError => setError(requestError.message));
    } else {
      // only admins list templates
    }
  }, [admin]);

  if (!state) {
    return error ? <p className="adm-error">{error}</p> : (
      <div aria-busy="true" role="status"><i className="adm-skel" style={{ width: 280, height: 34 }} /><i className="adm-skel" style={{ width: 380, height: 14, marginTop: 12 }} /><i className="adm-skel" style={{ width: '100%', height: 360, marginTop: 28 }} /></div>
    );
  } else {
    const user = state.user;
    return (
      <>
        <div className="adm-row adm-between">
          <div>
            {admin && <Link to="/admin/users" className="adm-muted">← Users</Link>}
            <h1>{user.name}</h1>
            <span className="adm-muted">{user.email} · /{user.slug} · {user.isActive ? 'active' : 'inactive'}</span>
          </div>
          <a className="adm-btn" href={user.slug === 'amaljith' ? '/' : `/p/${user.slug}`} target="_blank" rel="noreferrer">View portfolio ↗</a>
        </div>
        <div className="adm-tabs" role="tablist">{tabs.map(([id, label]) => <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'is-active' : ''} onClick={() => setTab(id)}>{label}</button>)}</div>
        <div className="adm-card adm-panel">
          {/* every tab stays mounted (hidden) so unsaved text is not lost when switching tabs */}
          <div hidden={tab !== 'profile'}><UserForm mode="edit" userId={userId} session={session} templates={templates} embedded onSaved={load} /></div>
          <div hidden={tab !== 'portfolio'}><PortfolioTab userId={userId} state={state} onChanged={load} /></div>
          <div hidden={tab !== 'images'}><ImagesTab userId={userId} state={state} onChanged={load} /></div>
          <div hidden={tab !== 'knowledge'}><KnowledgeTab userId={userId} state={state} onChanged={load} /></div>
          <div hidden={tab !== 'theme'}><ThemeEditor userId={userId} user={user} onChanged={load} /></div>
        </div>
      </>
    );
  }
}
