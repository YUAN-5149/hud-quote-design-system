// 登入與 session — Firebase Authentication（Email/Password 後端）
// 使用者以「手機號 + 通行碼」登入；手機號映射為內部帳號 <phone>@hud-quote.app
//
// 帳號一律由管理員在 Firebase Console 預先建立（見 README「成員開通」）。
// 前端不得呼叫 createUserWithEmailAndPassword — 那是客戶端 API，任何人都能
// 為「尚未存在」的帳號設定密碼，等同於把白名單上的號碼開放給外人認領。
//
// 驗證順序：先過 Firebase Auth，再查白名單成員資格。
// 反過來做會強迫白名單開放匿名讀取，等於公開全部成員手機號。
import {
  signInWithEmailAndPassword, signOut,
  reauthenticateWithCredential, updatePassword, EmailAuthProvider,
} from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from './firebase.js';

const SESSION_KEY = 'hud_session_v1';
const WL_KEY = 'hud_whitelist_v1';
const phoneToEmail = (phone) => `${phone}@hud-quote.app`;

// 僅供未設定 Firebase 的離線預覽。正式環境的白名單來自 Firestore。
const WL_SEED = [
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

// 讀取白名單。需已登入 — Firestore 規則不再開放匿名讀取。
// 回傳 { list } 或 { error }；讀取失敗時不退回本機名單，
// 否則離線的本機種子資料會變成可繞過的授權依據。
export async function fetchWhitelist() {
  if (!db) return { list: loadLocalWhitelist() };
  try {
    const snap = await getDocs(collection(db, 'whitelist'));
    return { list: snap.docs.map(d => d.data()) };
  } catch (e) {
    console.warn('讀取白名單失敗', e);
    return { error: '無法讀取白名單 // DIRECTORY UNAVAILABLE' };
  }
}

// 回傳 { session } 或 { error }
export async function loginWithPhone(phone, passcode) {
  // 離線退路：未設定 Firebase 時只查本機名單，通行碼為完整手機號。
  // 僅供無後端的開發預覽，正式部署一定會有 auth。
  if (!auth) {
    const found = loadLocalWhitelist().find(w => w.phone === phone);
    if (!found) return { error: '此號碼未在白名單 // NOT WHITELISTED' };
    if (passcode !== phone) return { error: '通行碼錯誤 // ACCESS DENIED' };
    return { session: toSession(found) };
  }

  // 步驟一：先過 Firebase Auth。帳號不存在時一律視為通行碼錯誤，
  // 不透露該號碼是否在白名單上。
  try {
    await signInWithEmailAndPassword(auth, phoneToEmail(phone), passcode);
  } catch (e) {
    if (e?.code === 'auth/too-many-requests') {
      return { error: '嘗試次數過多，請稍後再試 // RATE LIMITED' };
    }
    return { error: '通行碼錯誤 // ACCESS DENIED' };
  }

  // 步驟二：憑證有效後才查成員資格。不是成員就登出，避免留下有效的 auth session。
  const { list, error } = await fetchWhitelist();
  if (error) {
    await logoutAuth();
    return { error };
  }

  // 白名單為空 = 尚未初始化。不放行 — 就算放行，Firestore 規則的 isMember()
  // 仍會擋掉所有讀寫，只會得到一個什麼都不能做的 session。
  if (!list.length) {
    await logoutAuth();
    return { error: '系統尚未初始化，請聯絡管理員 // NOT PROVISIONED' };
  }

  const found = list.find(w => w.phone === phone);
  if (!found) {
    await logoutAuth();
    return { error: '此號碼未在白名單 // NOT WHITELISTED' };
  }

  return { session: toSession(found) };
}

function toSession(w) {
  return {
    phone: w.phone,
    name: w.name,
    role: w.role,
    isAdmin: w.role === '管理',
    loginAt: new Date().toISOString(),
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
