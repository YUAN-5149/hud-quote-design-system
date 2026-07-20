import { useState, useEffect } from 'react';

// 介面配色主題 — 定義、套用與記憶
// 記憶存本機（每台裝置各自偏好；工地手機用高對比、辦公室桌機用亮色不互相干擾）
const KEY = 'hud_theme_v1';

export const THEMES = [
  {
    id: 'hud',
    name: 'HUD 暗青',
    desc: '預設 · 深底青光，室內與夜間',
    swatch: ['#040810', '#0A111E', '#00E5FF'],
  },
  {
    id: 'contrast',
    name: '高對比黑白',
    desc: '純黑白最大對比，工地陽光下最清楚',
    swatch: ['#000000', '#161616', '#FFFFFF'],
  },
  {
    id: 'light',
    name: '明亮白藍',
    desc: '白底藍字，室內辦公與對帳',
    swatch: ['#F4F7FC', '#FFFFFF', '#0B62D6'],
  },
  {
    id: 'amber',
    name: '暖琥珀夜間',
    desc: '低藍光暖色，夜間收工對帳護眼',
    swatch: ['#120C05', '#1B1309', '#FFAE3C'],
  },
  {
    id: 'paper',
    name: '紙感米白',
    desc: '米白紙感，長時間看報價明細不刺眼',
    swatch: ['#F2EDE1', '#FBF8F0', '#8C581E'],
  },
];

export const DEFAULT_THEME = 'hud';
const isValid = (id) => THEMES.some(t => t.id === id);

export function loadTheme() {
  try {
    const saved = localStorage.getItem(KEY);
    if (isValid(saved)) return saved;
  } catch (e) { /* 隱私模式等情況忽略 */ }
  return DEFAULT_THEME;
}

// 套用到 <html data-theme>；預設主題不加屬性，直接吃 tokens.css 原值
export function applyTheme(id) {
  const theme = isValid(id) ? id : DEFAULT_THEME;
  const root = document.documentElement;
  if (theme === DEFAULT_THEME) root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);

  // 同步瀏覽器 UI 色（PWA 狀態列、手機網址列）
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    const bg = getComputedStyle(root).getPropertyValue('--bg-base').trim();
    if (bg) meta.setAttribute('content', bg);
  }
  return theme;
}

// 供 App 使用：回傳 [theme, setTheme]，變更即套用並記憶
export function useTheme() {
  const [theme, setThemeState] = useState(loadTheme);

  useEffect(() => { applyTheme(theme); }, [theme]);

  const setTheme = (id) => {
    const next = isValid(id) ? id : DEFAULT_THEME;
    try { localStorage.setItem(KEY, next); } catch (e) { /* 忽略寫入失敗 */ }
    setThemeState(next);
  };

  return [theme, setTheme];
}
