import React from 'react';

// Titles of the portfolio JSON are plain text with two markers: a line break is "\n" and {braces} mark the accent word(s).
// "From curiosity\nto {creation.}" -> From curiosity<br />to <span>creation.</span>
export function renderTitle(title) {
  const lines = String(title || '').split('\n');
  return lines.map(function (line, lineIndex) {
    const parts = line.split(/(\{[^}]*\})/g).filter(Boolean).map(function (part, partIndex) {
      if (part.startsWith('{') && part.endsWith('}')) {
        return <span key={partIndex}>{part.slice(1, -1)}</span>;
      } else {
        return part;
      }
    });
    return <React.Fragment key={lineIndex}>{lineIndex > 0 && <br />}{parts}</React.Fragment>;
  });
}

// "Building practical\nsoftware" -> Building practical<br />software
export function renderLines(text) {
  return String(text || '').split('\n').map(function (line, index) {
    return <React.Fragment key={index}>{index > 0 && <br />}{line}</React.Fragment>;
  });
}
