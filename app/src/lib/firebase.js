// Firebase 初始化 — Firestore 即時同步後端
// Web API key 屬公開識別資訊（非機密），存取控制由 Firestore 安全規則負責
import { initializeApp } from 'firebase/app';
import {
  initializeFirestore, persistentLocalCache, persistentMultipleTabManager,
} from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'hud-quote',
  appId: '1:832200738632:web:7acbb452b005b6738e957d',
  storageBucket: 'hud-quote.firebasestorage.app',
  apiKey: 'AIzaSyBhOrb09ruozx74B8XkaEEBpR0MwkY014c',
  authDomain: 'hud-quote.firebaseapp.com',
  messagingSenderId: '832200738632',
};

let db = null;
try {
  const app = initializeApp(firebaseConfig);
  // 離線快取：斷網時仍可讀寫，恢復連線自動同步
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  });
} catch (e) {
  console.warn('Firebase 初始化失敗，退回本機模式', e);
}

export { db };
