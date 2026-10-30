import { useEffect, useRef, useState } from 'react';

// Returns [ref, inView]. inView turns true (once) when the element scrolls into view.
export function useInView(threshold = 0.14) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(function () {
    const node = ref.current;
    if (node && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        if (entries.some(entry => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        } else {
          // not visible yet - keep waiting
        }
      }, { threshold, rootMargin: '0px 0px -6% 0px' });
      observer.observe(node);
      return function () {
        observer.disconnect();
      };
    } else {
      setInView(true);
      return undefined;
    }
  }, [threshold]);

  return [ref, inView];
}
