import { useState, useEffect, useRef } from 'react';
import {
  collection, doc, onSnapshot, getDocs, setDoc, deleteDoc, writeBatch,
} from 'firebase/firestore';
import { db } from './firebase.js';

// 簡易 localStorage 持久化 state（無後端時的退路，也作為快取）
export function usePersistedState(key, seed) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* corrupted — fall back to seed */ }
    return seed;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

// ─────────────────────────────────────────────────────────────
// Firestore 即時同步集合
// 介面與 useState 相容：setter 收到新陣列後，依 keyField diff 寫回
// - 首次使用（集合為空）自動寫入種子資料
// - onSnapshot 即時同步其他裝置的變更
// - _ord 欄位維持「新的在前」排序
// - Firestore 不可用時退回 localStorage 快取
// ─────────────────────────────────────────────────────────────
export function useSyncedCollection(name, seed, keyField) {
  const cacheKey = `hud_cache_${name}`;
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return seed;
  });
  const ready = useRef(false);

  useEffect(() => {
    if (!db) return undefined;
    const col = collection(db, name);
    let unsub;
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDocs(col);
        if (snap.empty && seed.length) {
          const batch = writeBatch(db);
          seed.forEach((item, i) => {
            batch.set(doc(col, String(item[keyField])), { ...item, _ord: seed.length - i });
          });
          await batch.commit();
        }
        if (cancelled) return;
        unsub = onSnapshot(col, (s) => {
          ready.current = true;
          const arr = s.docs.map(d => d.data()).sort((a, b) => (b._ord || 0) - (a._ord || 0));
          setValue(arr);
          try { localStorage.setItem(cacheKey, JSON.stringify(arr)); } catch (e) { /* quota */ }
        }, (e) => console.warn(`Firestore 監聽失敗 (${name})`, e));
      } catch (e) {
        console.warn(`Firestore 同步失敗 (${name})，使用本機資料`, e);
      }
    })();
    return () => { cancelled = true; unsub && unsub(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const update = (updater) => {
    setValue(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try { localStorage.setItem(cacheKey, JSON.stringify(next)); } catch (e) { /* quota */ }
      if (db && ready.current) {
        const prevMap = new Map(prev.map(x => [String(x[keyField]), x]));
        const nextMap = new Map(next.map(x => [String(x[keyField]), x]));
        nextMap.forEach((item, k) => {
          const old = prevMap.get(k);
          if (!old || JSON.stringify(old) !== JSON.stringify(item)) {
            const withOrd = item._ord ? item : { ...item, _ord: Date.now() };
            setDoc(doc(db, name, k), withOrd).catch(e => console.warn(`寫入失敗 (${name}/${k})`, e));
          }
        });
        prevMap.forEach((_, k) => {
          if (!nextMap.has(k)) {
            deleteDoc(doc(db, name, k)).catch(e => console.warn(`刪除失敗 (${name}/${k})`, e));
          }
        });
      }
      return next;
    });
  };

  return [value, update];
}
