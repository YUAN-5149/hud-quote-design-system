import React from 'react';
import { createRoot } from 'react-dom/client';
// tokens 與 app.css 的正典在 repo 根目錄與 ui_kits/ — 那兩處會以原始檔發佈到
// GitHub Pages（見 scripts/deploy-pages.ps1），也是 SKILL.md 對外宣告的介面。
// 這裡直接 import 正典，避免 app/src/styles 再放一份會各自漂移的複製。
import '../../colors_and_type.css';
import './styles/themes.css';
import '../../ui_kits/quotation/app.css';
import './styles/rwd.css';
import './styles/print.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
