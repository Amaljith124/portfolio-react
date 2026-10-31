// Theme token name -> CSS custom property. The same table is in backend/constants/portfolio.js (themeColorTokens).
export const colorVars = {
  background: '--bg',
  surface: '--surface',
  surfaceElevated: '--surface-soft',
  text: '--text',
  mutedText: '--muted',
  border: '--border',
  borderStrong: '--border-strong',
  primary: '--accent',
  primaryHover: '--accent-bright',
  primarySoft: '--accent-soft',
  onPrimary: '--on-accent',
  solidBackground: '--solid-bg',
  solidForeground: '--solid-fg',
  glow: '--glow',
  grid: '--grid',
  shadow: '--shadow',
  navBackground: '--nav-bg',
  heroGlowA: '--hero-glow-a',
  heroGlowB: '--hero-glow-b',
  haloA: '--halo-a',
  haloB: '--halo-b',
  portraitShadow: '--portrait-shadow',
  accent: '--accent-secondary'
};

const radiusVars = { card: '--radius-card', button: '--radius-button' };

const fontVars = { bodyFont: '--font-body', headingFont: '--font-heading' };

function kebab(name) {
  return name.replace(/[A-Z]/g, letter => '-' + letter.toLowerCase());
}

// The custom properties of one mode ('dark' | 'light') of a resolved theme: the names the SCSS uses (--bg, --accent ...),
// the same colours as --color-* aliases and the fonts.
export function themeToCssVars(theme, mode) {
  const vars = {};
  const colors = mode === 'light' ? (theme && theme.light && theme.light.colors) : (theme && theme.colors);

  Object.keys(colors || {}).forEach(function (name) {
    if (colorVars[name]) {
      vars[colorVars[name]] = colors[name];
      vars['--color-' + kebab(name)] = colors[name];
    } else {
      // unknown token: ignored
    }
  });
  Object.keys((theme && theme.radius) || {}).forEach(function (name) {
    if (radiusVars[name]) {
      vars[radiusVars[name]] = theme.radius[name];
    } else {
      // unknown token: ignored
    }
  });
  Object.keys((theme && theme.typography) || {}).forEach(function (name) {
    if (fontVars[name]) {
      vars[fontVars[name]] = theme.typography[name];
    } else {
      // unknown token: ignored
    }
  });
  return vars;
}

export function applyCssVars(vars, previousNames) {
  const root = document.documentElement;
  previousNames.forEach(name => root.style.removeProperty(name));
  Object.keys(vars).forEach(name => root.style.setProperty(name, vars[name]));
  return Object.keys(vars);
}

export function clearCssVars(names) {
  names.forEach(name => document.documentElement.style.removeProperty(name));
}

// resolvedTheme = deepMerge(template default, user override); used by the admin live preview (the server does the same).
export function mergeTheme(base, override) {
  const merged = { ...(base || {}) };
  Object.keys(override || {}).forEach(function (key) {
    const value = override[key];
    if (value && typeof value === 'object' && !Array.isArray(value) && merged[key] && typeof merged[key] === 'object') {
      merged[key] = mergeTheme(merged[key], value);
    } else {
      merged[key] = value;
    }
  });
  return merged;
}
