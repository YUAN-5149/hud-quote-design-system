import React from 'react';

// 畫面發生錯誤時，顯示錯誤訊息與「重新載入」按鈕，而不是整頁空白。
// 錯誤訊息可截圖回報，方便追查。
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('畫面錯誤', error, info?.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    const where = (error.stack || '').split('\n').slice(0, 4).join('\n');
    return (
      <div style={{ maxWidth: 640, margin: '12vh auto', padding: 24, background: 'var(--bg-panel)', border: '1px solid var(--alert)', color: 'var(--fg-1)', fontFamily: 'var(--font-tc)' }}>
        <div className="mono-label" style={{ color: 'var(--alert)', marginBottom: 12 }}>系統錯誤 · SYSTEM FAULT</div>
        <p style={{ margin: '0 0 12px', fontSize: 15 }}>畫面發生錯誤。已輸入的資料若已按下儲存，通常已保存；請重新載入後確認。</p>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, color: 'var(--fg-3)', background: 'var(--bg-input)', padding: 12, margin: '0 0 16px' }}>{String(error.message || error)}{'\n'}{where}</pre>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>重新載入</button>
          <button type="button" className="btn btn-ghost" onClick={() => { try { localStorage.setItem('scr', 'dashboard'); } catch (e) { /* ignore */ } window.location.reload(); }}>回主控台</button>
        </div>
      </div>
    );
  }
}
