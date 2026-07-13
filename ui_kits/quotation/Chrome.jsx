// QuotationApp.jsx — UI Kit main app for 水電報價 HUD
// Demonstrates the full system: rail, topbar, dashboard, case list, quote builder, inspector.

const { useState, useEffect, useMemo } = React;

// ─────────────────────────────────────────────────────────────
// Icons (lucide via CDN - mounted after render)
// ─────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, className = '' }) => (
  <i data-lucide={name} width={size} height={size} className={className} />
);

// ─────────────────────────────────────────────────────────────
// Left Rail
// ─────────────────────────────────────────────────────────────
const RAIL_ITEMS = [
  { id: 'dashboard', icon: 'layout-grid', label: '主控台' },
  { id: 'cases', icon: 'folder-kanban', label: '案件' },
  { id: 'quotes', icon: 'file-text', label: '報價單' },
  { id: 'materials', icon: 'package', label: '材料' },
  { id: 'billing', icon: 'receipt', label: '請款' },
  { id: 'reports', icon: 'activity', label: '報表' },
  { id: 'whitelist', icon: 'shield-check', label: '白名單' },
];

function Rail({ active, onNav, session, onLogout }) {
  return (
    <aside className="rail">
      <div className="rail-logo">
        <svg viewBox="0 0 64 64" width="28" height="28" fill="none" stroke="#00E5FF" strokeWidth="1.5">
          <path d="M32 3 L57 17 L57 47 L32 61 L7 47 L7 17 Z"/>
          <path d="M32 20 C32 20, 26 28, 26 34 C26 38.5 28.7 41 32 41 C35.3 41 38 38.5 38 34 C38 28 32 20 32 20 Z"/>
          <path d="M32 28 L30 33 L33 33 L31 38" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {RAIL_ITEMS.map(item => (
        <button
          key={item.id}
          className={`rail-btn ${active === item.id ? 'active' : ''}`}
          onClick={() => onNav(item.id)}
          title={item.label}
        >
          <Icon name={item.icon} size={20} />
          <span className="rail-btn-lbl">{item.label}</span>
        </button>
      ))}
      <div style={{ flex: 1 }} />
      {onLogout && (
        <button className="rail-btn" title="登出" onClick={onLogout}>
          <Icon name="log-out" size={20} />
          <span className="rail-btn-lbl">登出</span>
        </button>
      )}
      <button className="rail-btn" title="設定">
        <Icon name="settings" size={20} />
      </button>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────
// Top Bar
// ─────────────────────────────────────────────────────────────
function TopBar({ screenLabel, session, onLogout }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const hhmmss = time.toTimeString().slice(0, 8);
  const ymd = `${time.getFullYear()}.${String(time.getMonth()+1).padStart(2,'0')}.${String(time.getDate()).padStart(2,'0')}`;
  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span className="mono-label">SECTOR</span>
        <span className="bc-sep">//</span>
        <span className="bc-current">{screenLabel}</span>
      </div>
      <div className="topbar-status">
        <span className="status-dot ok" />
        <span className="mono-label">SYSTEM ONLINE · 17 NODES</span>
        <span className="bc-sep">·</span>
        <span className="mono-label" style={{ color: 'var(--fg-1)' }}>{ymd}</span>
        <span className="bc-sep">·</span>
        <span className="mono-label" style={{ color: 'var(--accent)' }}>{hhmmss}</span>
        <span className="bc-sep">·</span>
        <span className="mono-label" style={{ color: session?.isAdmin ? 'var(--accent)' : 'var(--fg-1)' }}>
          OP · {session ? session.name : '陳師傅'}{session?.isAdmin ? ' [ADMIN]' : ''}
        </span>
        {onLogout && (
          <button className="btn btn-solid btn-sm" onClick={onLogout} style={{ marginLeft: 8 }}>
            <Icon name="log-out" size={12} /><span>登出</span>
          </button>
        )}
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// Status bar (bottom)
// ─────────────────────────────────────────────────────────────
function StatusBar({ session }) {
  return (
    <footer className="statusbar">
      <span className="mono-label">DB · SYNCED</span>
      <span className="sep">·</span>
      <span className="mono-label">LATENCY 14ms</span>
      <span className="sep">·</span>
      <span className="mono-label">REGION TPE-N</span>
      {session && (<>
        <span className="sep">·</span>
        <span className="mono-label" style={{ color: 'var(--ok)' }}>SESSION · {session.phone}</span>
      </>)}
      <span style={{ flex: 1 }} />
      <span className="mono-label" style={{ color: 'var(--fg-3)' }}>v2.4.1 · BUILD 18026</span>
    </footer>
  );
}

Object.assign(window, { Rail, TopBar, StatusBar, Icon });
