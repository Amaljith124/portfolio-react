// The admin session lives in sessionStorage (cleared when the tab closes). Only the bearer token is a secret; the server
// checks it, and the role / tenant, on every request - what the UI hides is never the security.
const keys = { token: 'portfolio-admin-token', userId: 'portfolio-admin-user-id', role: 'portfolio-admin-role', name: 'portfolio-admin-name', slug: 'portfolio-admin-slug' };
export const SIGNED_OUT_EVENT = 'portfolio-admin:signed-out';

export function getSession() {
  const token = sessionStorage.getItem(keys.token);
  if (token) {
    return { token: token, userId: sessionStorage.getItem(keys.userId), role: sessionStorage.getItem(keys.role), name: sessionStorage.getItem(keys.name), slug: sessionStorage.getItem(keys.slug) };
  } else {
    return null;
  }
}

export function saveSession(token, user) {
  sessionStorage.setItem(keys.token, token);
  sessionStorage.setItem(keys.userId, user.userId);
  sessionStorage.setItem(keys.role, user.role);
  sessionStorage.setItem(keys.name, user.name);
  sessionStorage.setItem(keys.slug, user.slug || '');
}

export function clearSession() {
  Object.values(keys).forEach(key => sessionStorage.removeItem(key));
}

export function isAdminRole(role) {
  return role === 'admin' || role === 'super_admin';
}
