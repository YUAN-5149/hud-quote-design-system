import { useState, useEffect } from 'react';

// 簡易 localStorage 持久化 state — 之後可換成 Firestore adapter
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
