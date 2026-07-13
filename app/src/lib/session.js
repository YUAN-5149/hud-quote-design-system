// 白名單與登入 session — localStorage 持久化
// 之後可替換為 Firebase Auth adapter
export const ADMIN_PASS = 'hud-admin-2026';
const WL_KEY = 'hud_whitelist_v1';
const SESSION_KEY = 'hud_session_v1';

const WL_SEED = [
  { phone: '0912345678', name: '王師傅', role: '工班', addedAt: '2026-03-12', note: '北區主力' },
  { phone: '0922778899', name: '陳工頭', role: '工班', addedAt: '2026-03-15', note: '弱電施工' },
  { phone: '0933221100', name: '李業務', role: '業務', addedAt: '2026-04-02', note: '' },
  { phone: '0955667788', name: '林會計', role: '會計', addedAt: '2026-04-08', note: '請款窗口' },
];

export function loadWhitelist() {
  try {
    const raw = localStorage.getItem(WL_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* corrupted — reseed */ }
  localStorage.setItem(WL_KEY, JSON.stringify(WL_SEED));
  return WL_SEED;
}

export function saveWhitelist(list) {
  localStorage.setItem(WL_KEY, JSON.stringify(list));
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return null;
}

export function saveSession(s) {
  if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  else localStorage.removeItem(SESSION_KEY);
}
