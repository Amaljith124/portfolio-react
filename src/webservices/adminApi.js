import { makeRequest, API_ROOT } from './webservices';
import { getSession } from './adminSession';

// Session helpers live in adminSession.js (webservices.js needs them too); re-exported so the admin pages keep their imports.
export { getSession, saveSession, clearSession, isAdminRole, SIGNED_OUT_EVENT } from './adminSession';

// Every admin call goes through the common makeRequest of webservices.js with its admin flag set (bearer token, session expiry).
function request(path, options = {}) {
  return makeRequest(`${API_ROOT}/admin${path}`, options, true);
}

export const adminApi = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getDashboard: () => request('/dashboard'),
  getTemplates: () => request('/templates'),
  listUsers: search => request(`/users?search=${encodeURIComponent(search || '')}`),
  createUser: body => request('/users', { method: 'POST', body: JSON.stringify(body) }),
  getUser: userId => request(`/users/${userId}`),
  updateUser: (userId, body) => request(`/users/${userId}/update`, { method: 'POST', body: JSON.stringify(body) }),
  saveTheme: (userId, theme) => request(`/users/${userId}/theme`, { method: 'POST', body: JSON.stringify({ theme }) }),
  // super admin only: every chat session, one as a chat, and the clean-up (dryRun true = count only)
  listChatSessions: ({ userId, search, page }) => request(`/chat-sessions?page=${page || 1}&search=${encodeURIComponent(search || '')}${userId ? `&userId=${userId}` : ''}`),
  getChatSession: sessionId => request(`/chat-sessions/${sessionId}`),
  cleanChatSessions: body => request('/chat-sessions/clean', { method: 'POST', body: JSON.stringify(body) }),
  getKnowledgeStatus: userId => request(`/users/${userId}/knowledge`),
  ingestKnowledge: userId => request(`/users/${userId}/knowledge/ingest`, { method: 'POST' }),
  createMagicLink: (userId, expiresInDays) => request(`/users/${userId}/magic-link`, { method: 'POST', body: JSON.stringify({ expiresInDays }) }),
  revokeMagicLink: userId => request(`/users/${userId}/magic-link/revoke`, { method: 'POST' }),
  deleteAsset: (userId, assetId) => request(`/users/${userId}/assets/${assetId}/delete`, { method: 'POST' })
};

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;

// The three steps of an upload: presigned URL from Node, the file straight to R2, then Node verifies and stores it.
// Resolves the stored asset { assetId, objectKey, publicUrl, width, height ... }.
// visibility: 'public' (served from the public image domain) or 'private' (only signed, short-lived URLs).
export function uploadImage(userId, file, altText, visibility = 'public') {
  return new Promise(function (resolve, reject) {
    if (IMAGE_TYPES.indexOf(file.type) === -1) {
      reject(new Error('Only JPEG, PNG and WebP images are allowed.'));
    } else if (file.size > IMAGE_MAX_BYTES) {
      reject(new Error('The image must be at most 5 MB.'));
    } else {
      request(`/users/${userId}/assets/upload-url`, { method: 'POST', body: JSON.stringify({ contentType: file.type, sizeBytes: file.size, visibility: visibility }) })
        .then(function (upload) {
          fetch(upload.uploadUrl, { method: 'PUT', headers: upload.headers, body: file })
            .then(function (putResponse) {
              if (putResponse.ok) {
                request(`/users/${userId}/assets/confirm`, { method: 'POST', body: JSON.stringify({ assetId: upload.assetId, contentType: file.type, altText: altText || '', visibility: visibility }) })
                  .then(resolve)
                  .catch(function (error) {
                    console.error('[adminApi.uploadImage] confirming the upload failed', error);
                    reject(error);
                  });
              } else {
                reject(new Error('The image could not be uploaded to storage.'));
              }
            })
            .catch(function (error) {
              console.error('[adminApi.uploadImage] uploading to storage failed', error);
              reject(new Error('The image could not be uploaded to storage (check the bucket CORS rule).'));
            });
        })
        .catch(function (error) {
          console.error('[adminApi.uploadImage] requesting the upload URL failed', error);
          reject(error);
        });
    }
  });
}
