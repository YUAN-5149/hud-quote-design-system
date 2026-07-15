// 白名單與登入 session
// 白名單存 Firestore（多裝置共用帳號），session 存本機（各裝置獨立登入）
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase.js';

export const ADMIN_PASS = 'hud-admin-2026';
const WL_KEY = 'hud_whitelist_v1';
const SESSION_KEY = 'hud_session_v1';

export const WL_SEED = [
  { phone: '0912345678', name: '王師傅', role: '工班', addedAt: '2026-03-12', note: '北區主力' },
  { phone: '0922778899', name: '陳工頭', role: '工班', addedAt: '2026-03-15', note: '弱電施工' },
  { phone: '0933221100', name: '李業務', role: '業務', addedAt: '2026-04-02', note: '' },
  { phone: '0955667788', name: '林會計', role: '會計', addedAt: '2026-04-08', note: '請款窗口' },
];

function loadLocalWhitelist() {
  try {
    const raw = localStorage.getItem(WL_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* corrupted — reseed */ }
  localStorage.setItem(WL_KEY, JSON.stringify(WL_SEED));
  return WL_SEED;
}

// 登入驗證用：優先讀 Firestore，失敗退回本機
export async function fetchWhitelist() {
  if (db) {
    try {
      const snap = await getDocs(collection(db, 'whitelist'));
      if (!snap.empty) return snap.docs.map(d => d.data());
    } catch (e) {
      console.warn('讀取白名單失敗，使用本機名單', e);
    }
  }
  return loadLocalWhitelist();
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
