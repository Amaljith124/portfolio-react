import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../webservices/adminApi';
import { mergeTheme, themeToCssVars } from '../../../utils/theme';

// Tokens with a colour picker (the rest are in "More tokens"). Values are the theme token names of the server.
const mainTokens = [['background', 'Background'], ['surface', 'Surface'], ['surfaceElevated', 'Surface (raised)'], ['text', 'Text'], ['mutedText', 'Muted text'], ['border', 'Border'], ['primary', 'Primary'], ['primaryHover', 'Primary hover']];
const moreTokens = [['borderStrong', 'Border (strong)'], ['primarySoft', 'Primary (soft)'], ['onPrimary', 'Text on primary'], ['solidBackground', 'Solid button'], ['solidForeground', 'Solid button text'], ['glow', 'Glow'], ['grid', 'Grid lines'], ['shadow', 'Shadow'], ['navBackground', 'Navbar'], ['heroGlowA', 'Hero glow A'], ['heroGlowB', 'Hero glow B'], ['haloA', 'Portrait halo A'], ['haloB', 'Portrait halo B'], ['portraitShadow', 'Portrait shadow'], ['accent', 'Accent (secondary)']];

// presets: partial overrides of the dark mode (the light mode keeps the template colours)
const presets = [
  ['Template default', null],
  ['Violet', { colors: { background: '#101014', surface: '#1b1b22', surfaceElevated: '#24242e', text: '#ffffff', primary: '#a78bfa', primaryHover: '#c4b5fd', primarySoft: '#2a2147', glow: '#a78bfa66', navBackground: '#101014c4' } }],
  ['Forest', { colors: { background: '#08110d', surface: '#0f1d16', surfaceElevated: '#16291f', primary: '#34d399', primaryHover: '#6ee7b7', primarySoft: '#10321f', glow: '#34d39966', navBackground: '#08110dc4' } }],
  ['Sunset', { colors: { background: '#140b0b', surface: '#211212', surfaceElevated: '#2e1a1a', primary: '#fb923c', primaryHover: '#fdba74', primarySoft: '#3a1f0e', glow: '#fb923c66', navBackground: '#140b0bc4' } }]
];

function ColorRow({ token, label, value, isOverridden, onChange, onClear }) {
  const isHex6 = /^#[0-9a-f]{6}$/i.test(value || '');
  return (
    <div className={`adm-color ${isOverridden ? 'is-changed' : ''}`}>
      <span>{label}</span>
      {isHex6 ? <input type="color" value={value} onChange={event => onChange(token, event.target.value)} aria-label={`${label} colour`} /> : <i className="adm-swatch" style={{ background: token === 'shadow' ? 'transparent' : value }} />}
      <input type="text" value={value || ''} onChange={event => onChange(token, event.target.value)} spellCheck="false" aria-label={`${label} value`} />
      {isOverridden && <button type="button" className="adm-btn adm-btn-ghost" onClick={() => onClear(token)} title="Back to the template value">↺</button>}
    </div>
  );
}

// Per-user theme override on top of the template default: presets, colour pickers, live preview and "reset to template default".
// Only the tokens you change are stored; everything else keeps following the template.
export default function ThemeEditor({ userId, user, onChanged }) {
  const base = user.templateDefaultTheme || {};
  const [override, setOverride] = useState(user.theme || {});

  // after a save (or a reset) the server copy is the new baseline
  useEffect(function () {
    setOverride(user.theme || {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(user.theme || {})]);
  const [mode, setMode] = useState('dark');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const resolved = mergeTheme(base, override);
  const group = mode === 'light' ? ['light', 'colors'] : ['colors'];
  const colorsOf = theme => (mode === 'light' ? (theme.light && theme.light.colors) : theme.colors) || {};
  const overrideColors = colorsOf(override);
  const resolvedColors = colorsOf(resolved);

  function setToken(token, value) {
    setOverride(function (current) {
      const next = JSON.parse(JSON.stringify(current));
      if (mode === 'light') {
        next.light = next.light || { colors: {} };
        next.light.colors = { ...next.light.colors, [token]: value };
      } else {
        next.colors = { ...(next.colors || {}), [token]: value };
      }
      return next;
    });
  }

  function setRadius(token, value) {
    setOverride(current => ({ ...current, radius: { ...(current.radius || {}), [token]: value } }));
  }

  function clearToken(token) {
    setOverride(function (current) {
      const next = JSON.parse(JSON.stringify(current));
      const colors = mode === 'light' ? (next.light && next.light.colors) : next.colors;
      if (colors) {
        delete colors[token];
      } else {
        // nothing to clear
      }
      return next;
    });
  }

  function save(theme, text) {
    setSaving(true);
    setError('');
    setMessage('');
    adminApi.saveTheme(userId, theme)
      .then(function () {
        setMessage(text);
        onChanged();
      })
      .catch(requestError => setError(requestError.message))
      .finally(() => setSaving(false));
  }

  // the preview is styled with the same custom properties the site gets
  const previewVars = themeToCssVars(resolved, mode);
  const row = ([token, label]) => <ColorRow key={token} token={token} label={label} value={resolvedColors[token]} isOverridden={Object.prototype.hasOwnProperty.call(overrideColors, token)} onChange={setToken} onClear={clearToken} />;

  return (
    <>
      <div className="adm-row">
        <div className="adm-seg"><button className={mode === 'dark' ? 'is-active' : ''} onClick={() => setMode('dark')}>Dark mode</button><button className={mode === 'light' ? 'is-active' : ''} onClick={() => setMode('light')}>Light mode</button></div>
        <span className="adm-muted">Changed tokens are highlighted; the rest follow the template.</span>
      </div>
      <div className="adm-row">{presets.map(([name, preset]) => <button key={name} className="adm-btn" onClick={() => setOverride(preset ? { ...override, colors: { ...(override.colors || {}), ...preset.colors } } : {})}>{name}</button>)}</div>
      <div className="adm-theme">
        <div>
          {mainTokens.map(row)}
          <details><summary>More tokens</summary>{moreTokens.map(row)}</details>
        </div>
        <div className="adm-preview" style={{ ...previewVars, background: 'var(--bg)', color: 'var(--text)' }}>
          <div className="adm-preview-nav" style={{ background: 'var(--nav-bg)', borderColor: 'var(--border)' }}><b style={{ color: 'var(--accent)' }}>AA</b> Name <span style={{ color: 'var(--muted)' }}>About · Projects · Contact</span></div>
          <h3>Live preview</h3>
          <p style={{ color: 'var(--muted)' }}>Muted paragraph text on the page background.</p>
          <div className="adm-preview-card" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)', borderRadius: 'var(--radius-card, 18px)' }}>
            <strong>A card</strong>
            <div className="adm-preview-inner" style={{ background: 'var(--surface-soft)' }}>Raised surface</div>
            <span className="adm-preview-btn" style={{ background: 'var(--accent)', color: 'var(--on-accent)', borderRadius: 'var(--radius-button, 12px)' }}>Primary button</span>
            <span className="adm-preview-btn" style={{ background: 'var(--accent-soft)', color: 'var(--accent-bright)' }}>Soft</span>
          </div>
        </div>
      </div>
      <h3>Corner radius</h3>
      <div className="adm-row">
        {[['button', 'Buttons'], ['card', 'Cards']].map(([token, label]) => (
          <label className="adm-inline" key={token}>{label}
            <input type="text" value={(resolved.radius || {})[token] || ''} onChange={event => setRadius(token, event.target.value)} spellCheck="false" aria-label={`${label} radius`} placeholder="12px" />
          </label>
        ))}
        <span className="adm-muted">e.g. 12px or 0.75rem (applies to both colour modes)</span>
      </div>
      {error && <p className="adm-error">{error}</p>}
      {message && <p className="adm-ok">{message}</p>}
      <div className="adm-row">
        <button className="adm-btn adm-btn-primary" disabled={saving} onClick={() => save(Object.keys(override).length ? override : null, 'Theme saved.')}>Save theme</button>
        {saving && <span className="adm-spinner" aria-label="Saving" />}
        <button className="adm-btn" disabled={saving} onClick={() => { setOverride({}); save(null, 'Reset: the template default theme is used again.'); }}>Reset to template default</button>
      </div>
    </>
  );
}
