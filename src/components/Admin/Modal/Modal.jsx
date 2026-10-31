import React, { useEffect } from 'react';

export default function Modal({ title, onClose, children, wide }) {
  useEffect(function () {
    function onKey(event) {
      if (event.key === 'Escape') {
        onClose();
      } else {
        // other keys: nothing to do
      }
    }
    window.addEventListener('keydown', onKey);
    return function () {
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="adm-overlay" onMouseDown={onClose}>
      <div className={`adm-modal ${wide ? 'is-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title} onMouseDown={event => event.stopPropagation()}>
        <div className="adm-modal-head"><h2>{title}</h2><button className="adm-btn adm-btn-ghost" onClick={onClose} aria-label="Close">✕</button></div>
        {children}
      </div>
    </div>
  );
}
