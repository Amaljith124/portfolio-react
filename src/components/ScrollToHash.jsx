import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

function scrollToTarget(hash, behavior) {
  const target = hash ? document.getElementById(hash.slice(1)) : null;
  if (target) {
    target.scrollIntoView({ behavior: behavior, block: 'start' });
  } else {
    window.scrollTo({ top: 0, behavior: behavior });
  }
}

// Scrolls to #section anchors after route changes, or to the top for plain route changes.
// Opening the site (or another page) with an anchor jumps straight there; menu links on the same page glide.
// For a jump the anchor is re-applied while the sections fade in, so late layout changes cannot push it out of place.
export default function ScrollToHash() {
  const { pathname, hash } = useLocation();
  const previousPath = useRef(null);

  useEffect(function () {
    const justOpened = performance.now() < 2500;
    const jump = previousPath.current !== pathname || justOpened;
    previousPath.current = pathname;
    scrollToTarget(hash, jump ? 'instant' : 'smooth');
    if (hash && jump) {
      const timers = [150, 450, 1000, 1500].map(delay => setTimeout(() => scrollToTarget(hash, 'instant'), delay));
      return function () {
        timers.forEach(clearTimeout);
      };
    } else {
      return undefined;
    }
  }, [pathname, hash]);

  return null;
}
