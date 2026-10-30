import React from 'react';
import { useInView } from '../../hooks/useInView';
import './Reveal.scss';

// Fades and slides its children in the first time they scroll into view.
// direction: up | left | right | zoom. Put the class "stagger" on a grid inside to animate its children one after another.
export default function Reveal({ as: Tag = 'div', direction = 'up', delay = 0, threshold = 0.14, className = '', children, ...rest }) {
  const [ref, inView] = useInView(threshold);

  return <Tag ref={ref} className={`reveal reveal-${direction} ${inView ? 'is-visible' : ''} ${className}`.trim()} style={{ '--reveal-delay': `${delay}ms` }} {...rest}>{children}</Tag>;
}
