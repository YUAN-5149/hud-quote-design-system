// 登入與 session — Firebase Authentication（Email/Password 後端）
// 使用者以「手機號 + 通行碼」登入；手機號映射為內部帳號 <phone>@hud-quote.app
// 白名單成員首次登入（通行碼 = 完整手機號）自動開通帳號
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,
  reauthenticateWithCredential, updatePassword, EmailAuthProvider,
} from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from './firebase.js';

const SESSION_KEY = 'hud_session_v1';
const WL_KEY = 'hud_whitelist_v1';
const phoneToEmail = (phone) => `${phone}@hud-quote.app`;

export const WL_SEED = [
  { phone: '0937779487', name: '系統管理員', role: '管理', addedAt: '2026-07-15', note: '預設管理帳號' },
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

// 白名單為登入目錄（規則開放讀取）；Firestore 失敗時退回本機
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

// 回傳 { session } 或 { error }
export async function loginWithPhone(phone, passcode) {
  const wl = await fetchWhitelist();
  const found = wl.find(w => w.phone === phone);
  if (!found) return { error: '此號碼未在白名單 // NOT WHITELISTED' };

  if (!auth) {
    // 離線退路：無 Firebase 時以完整手機號為通行碼
    if (passcode !== phone) return { error: '通行碼錯誤 // ACCESS DENIED' };
  } else {
    const email = phoneToEmail(phone);
    try {
      await signInWithEmailAndPassword(auth, email, passcode);
    } catch (e) {
      const code = e?.code || '';
      const canBootstrap = passcode === phone &&
        (code === 'auth/user-not-found' || code === 'auth/invalid-credential' || code === 'auth/invalid-login-credentials');
      if (canBootstrap) {
        try {
          // 首次登入自動開通（初始通行碼 = 完整手機號）
          await createUserWithEmailAndPassword(auth, email, passcode);
        } catch (e2) {
          console.warn('帳號開通失敗', e2);
          return { error: '通行碼錯誤 // ACCESS DENIED' };
        }
      } else if (code === 'auth/too-many-requests') {
        return { error: '嘗試次數過多，請稍後再試 // RATE LIMITED' };
      } else {
        return { error: '通行碼錯誤 // ACCESS DENIED' };
      }
    }
  }

  return {
    session: {
      phone: found.phone,
      name: found.name,
      role: found.role,
      isAdmin: found.role === '管理',
      loginAt: new Date().toISOString(),
    },
  };
}

// 修改通行碼 — 先以現行通行碼重新驗證，再更新
// 回傳 { ok: true } 或 { error }
export async function changePasscode(currentPass, newPass) {
  if (!auth) return { error: '離線模式無法修改通行碼 // OFFLINE' };
  const user = auth.currentUser;
  if (!user) return { error: '登入階段已過期，請重新登入 // SESSION EXPIRED' };
  if (newPass.length < 6) return { error: '新通行碼至少 6 個字元' };
  if (newPass === currentPass) return { error: '新通行碼與現行通行碼相同' };

  try {
    const cred = EmailAuthProvider.credential(user.email, currentPass);
    await reauthenticateWithCredential(user, cred);
  } catch (e) {
    const code = e?.code || '';
    if (code === 'auth/too-many-requests') return { error: '嘗試次數過多，請稍後再試 // RATE LIMITED' };
    return { error: '現行通行碼錯誤 // WRONG PASSCODE' };
  }

  try {
    await updatePassword(user, newPass);
    return { ok: true };
  } catch (e) {
    if (e?.code === 'auth/weak-password') return { error: '新通行碼強度不足，請換一組' };
    console.warn('更新通行碼失敗', e);
    return { error: '更新失敗，請稍後再試 // UPDATE FAILED' };
  }
}

export async function logoutAuth() {
  if (auth) {
    try { await signOut(auth); } catch (e) { /* ignore */ }
  }
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
