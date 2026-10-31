import React, { useRef, useState } from 'react';
import { adminApi, IMAGE_TYPES, uploadImage } from '../../../webservices/adminApi';
import { getAtPath, previewUrl, setAtPath } from '../../../utils/imageTools';

// One image of the portfolio (the portrait or a project image): preview, replace and remove.
// state = { user, assets } of the editor; path = where the image sits in portfolioData; onChanged() reloads the editor.
// Replace: upload -> save the portfolio with the new key -> delete the old image (the database reference is updated first).
export default function ImageSlot({ label, userId, state, path, keepFlags, onChanged }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const portfolio = state.user.portfolioData;
  const current = getAtPath(portfolio, path);
  const url = previewUrl(current, state.assets);

  function saveAndCleanUp(nextNode, oldObjectKey) {
    const nextPortfolio = setAtPath(portfolio, path, nextNode);
    return adminApi.updateUser(userId, { portfolioData: nextPortfolio })
      .then(function () {
        const old = oldObjectKey ? state.assets.find(asset => asset.objectKey === oldObjectKey) : null;
        if (old) {
          // the portfolio no longer points at it: remove the old file (a still-referenced image is refused by the server)
          return adminApi.deleteAsset(userId, old.assetId).catch(function (deleteError) {
            console.error('[ImageSlot.saveAndCleanUp] removing the old image failed', deleteError);
          });
        } else {
          return null;
        }
      });
  }

  function onFile(event) {
    const file = event.target.files[0];
    event.target.value = '';
    if (file) {
      setBusy(true);
      setError('');
      uploadImage(userId, file, (current && current.alt) || label)
        .then(function (asset) {
          const next = { ...(keepFlags ? { cutout: current && current.cutout } : {}), objectKey: asset.objectKey, alt: (current && current.alt) || label };
          saveAndCleanUp(next, current && current.objectKey)
            .then(onChanged)
            .catch(requestError => setError(requestError.message))
            .finally(() => setBusy(false));
        })
        .catch(function (requestError) {
          setError(requestError.message);
          setBusy(false);
        });
    } else {
      // no file chosen
    }
  }

  function remove() {
    setBusy(true);
    setError('');
    const next = keepFlags ? { alt: (current && current.alt) || label, cutout: current && current.cutout } : undefined;
    saveAndCleanUp(next, current && current.objectKey)
      .then(onChanged)
      .catch(requestError => setError(requestError.message))
      .finally(() => setBusy(false));
  }

  return (
    <div className="adm-slot">
      <div className="adm-thumb">{url ? <img src={url} alt={label} /> : <span>{current && current.objectKey ? 'No public URL (set R2_PUBLIC_BASE_URL)' : 'No image'}</span>}</div>
      <div>
        <strong>{label}</strong>
        <div className="adm-row">
          <button type="button" className="adm-btn" disabled={busy} onClick={() => input.current.click()}>{url || (current && current.objectKey) ? 'Replace' : 'Upload'}</button>
          {(url || (current && (current.objectKey || current.src))) && <button type="button" className="adm-btn" disabled={busy} onClick={remove}>Remove</button>}
        </div>
        <input ref={input} type="file" accept={IMAGE_TYPES.join(',')} hidden onChange={onFile} />
        {busy && <small className="adm-muted">Working...</small>}
        {error && <p className="adm-error">{error}</p>}
      </div>
    </div>
  );
}
