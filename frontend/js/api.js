// ===== API Base =====
const API_BASE = 'https://taskmangement-eexv.onrender.com/api';

function getToken() { return localStorage.getItem('token'); }
function getUser() { return JSON.parse(localStorage.getItem('user') || 'null'); }
function setAuth(token, user) { localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(user)); }
function clearAuth() { localStorage.removeItem('token'); localStorage.removeItem('user'); }

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// ===== Auth API =====
const AuthAPI = {
  login: (email, password) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  changePassword: (data) => apiFetch('/auth/change-password', { method: 'PUT', body: JSON.stringify(data) }),
  me: () => apiFetch('/auth/me')
};

// ===== Task API =====
const TaskAPI = {
  getAll: () => apiFetch('/tasks'),
  getStats: () => apiFetch('/tasks/stats'),
  get: (id) => apiFetch(`/tasks/${id}`),
  create: (data) => apiFetch('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/tasks/${id}`, { method: 'DELETE' })
};

// ===== User API =====
const UserAPI = {
  getAll: () => apiFetch('/users'),
  getUserStats: (id) => apiFetch(`/users/${id}/stats`),
  updateProfile: (data) => apiFetch('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
  uploadPhoto: async (file) => {
    const token = getToken();
    const fd = new FormData(); fd.append('photo', file);
    const res = await fetch(`${API_BASE}/users/profile/photo`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
  create: (data) => apiFetch('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/users/${id}`, { method: 'DELETE' })
};

// ===== Message API =====
const MessageAPI = {
  send: (data) => apiFetch('/messages', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => apiFetch('/messages'),
  getUnreadCount: () => apiFetch('/messages/unread-count'),
  getMy: () => apiFetch('/messages/my'),
  reply: (id, reply) => apiFetch(`/messages/${id}`, { method: 'PUT', body: JSON.stringify({ reply }) })
};

// ===== Toast =====
function showToast(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// ===== Theme =====
function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
}
function toggleTheme() {
  const curr = document.documentElement.getAttribute('data-theme');
  const next = curr === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

// ===== Avatar helper =====
function avatarHtml(user, size = 36) {
  if (user?.profilePhoto) {
    return `<img src="${user.profilePhoto}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;" alt="">`;
  }
  const initials = (user?.name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:var(--gradient);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:${size * 0.35}px;color:#fff;flex-shrink:0;">${initials}</div>`;
}

// ===== Date helper =====
function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function timeAgo(d) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (m < 1440) return `${Math.floor(m/60)}h ago`;
  return `${Math.floor(m/1440)}d ago`;
}

// ===== Redirect guard =====
function requireAuth(role) {
  const user = getUser();
  const token = getToken();
  if (!user || !token) { window.location.href = '/index.html'; return false; }
  if (role && user.role !== role) {
    window.location.href = user.role === 'admin' ? '/pages/admin-dashboard.html' : '/pages/user-dashboard.html';
    return false;
  }
  return true;
}

initTheme();
