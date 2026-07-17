import { useState, useEffect, useRef } from 'react';
import { gcisVerify } from '../lib/gcis.js';
import { validateGUI } from '../lib/format.js';

// 統編即時驗證 hook：8 碼＋檢核碼通過後（防抖 600ms）查商工登記
// 回傳 { state: 'idle'|'checking'|'ok'|'notFound'|'error'|'off', type, name, status }
export function useGuiVerify(proxy, gui) {
  const [result, setResult] = useState({ state: 'idle' });
  const seq = useRef(0);

  useEffect(() => {
    if (!/^\d{8}$/.test(gui || '') || !validateGUI(gui)) {
      setResult({ state: 'idle' });
      return undefined;
    }
    if (!(proxy || '').trim()) {
      setResult({ state: 'off' });
      return undefined;
    }
    const my = ++seq.current;
    setResult({ state: 'checking' });
    const timer = setTimeout(async () => {
      const r = await gcisVerify(proxy, gui);
      if (seq.current !== my) return; // 已有更新的輸入
      if (r.ok) setResult({ state: 'ok', type: r.type, name: r.name, status: r.status });
      else if (r.notFound) setResult({ state: 'notFound' });
      else if (r.off) setResult({ state: 'off' });
      else setResult({ state: 'error', error: r.error });
    }, 600);
    return () => clearTimeout(timer);
  }, [proxy, gui]);

  return result;
}

// 顯示驗證結果；onAdopt 提供時，查到名稱可一鍵帶入
export function GuiStatus({ verify, onAdopt }) {
  if (verify.state === 'idle' || verify.state === 'off') return null;
  if (verify.state === 'checking') {
    return <div className="gui-status mono-label">查詢商工登記中…</div>;
  }
  if (verify.state === 'ok') {
    const good = !verify.status || verify.status.includes('核准');
    return (
      <div className="gui-status" style={{ color: good ? 'var(--ok)' : 'var(--warn)' }}>
        <span className="mono-label" style={{ color: 'inherit' }}>
          {good ? '✓' : '!'} {verify.type}{verify.status ? ` · ${verify.status}` : ''}
        </span>
        {verify.name && <span className="gui-status-name">{verify.name}</span>}
        {verify.name && onAdopt && (
          <button type="button" className="gui-adopt" onClick={() => onAdopt(verify.name)}>
            帶入名稱
          </button>
        )}
      </div>
    );
  }
  if (verify.state === 'notFound') {
    return (
      <div className="gui-status" style={{ color: 'var(--alert)' }}>
        <span className="mono-label" style={{ color: 'inherit' }}>✗ 查無此統編登記</span>
      </div>
    );
  }
  return (
    <div className="gui-status" style={{ color: 'var(--fg-3)' }}>
      <span className="mono-label" style={{ color: 'inherit' }}>{verify.error || '查詢失敗'} — 已改用本機格式檢核</span>
    </div>
  );
}
