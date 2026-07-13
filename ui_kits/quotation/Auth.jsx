// Auth.jsx — Login + Whitelist management for 水電報價 HUD
// Demo admin passcode: hud-admin-2026

const ADMIN_PASS = 'hud-admin-2026';
const WL_KEY = 'hud_whitelist_v1';
const SESSION_KEY = 'hud_session_v1';

const WL_SEED = [
  { phone: '0912345678', name: '王師傅',  role: '工班', addedAt: '2026-03-12', note: '北區主力' },
  { phone: '0922778899', name: '陳工頭',  role: '工班', addedAt: '2026-03-15', note: '弱電施工' },
  { phone: '0933221100', name: '李業務',  role: '業務', addedAt: '2026-04-02', note: '' },
  { phone: '0955667788', name: '林會計',  role: '會計', addedAt: '2026-04-08', note: '請款窗口' },
];

function loadWhitelist() {
  try {
    const raw = localStorage.getItem(WL_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  localStorage.setItem(WL_KEY, JSON.stringify(WL_SEED));
  return WL_SEED;
}
function saveWhitelist(list) {
  localStorage.setItem(WL_KEY, JSON.stringify(list));
}
function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return null;
}
function saveSession(s) {
  if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  else localStorage.removeItem(SESSION_KEY);
}

// ─────────────────────────────────────────────────────────────
// Login Screen — full-viewport HUD console
// ─────────────────────────────────────────────────────────────
function LoginScreen({ onAuth }) {
  const [phone, setPhone] = React.useState('');
  const [pass, setPass]   = React.useState('');
  const [err, setErr]     = React.useState('');
  const [busy, setBusy]   = React.useState(false);
  const [stage, setStage] = React.useState('idle'); // idle | verifying | granted | denied

  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, [stage, err]);

  const tryLogin = (e) => {
    e && e.preventDefault();
    setErr('');
    if (!phone.trim() || !pass.trim()) {
      setErr('請輸入手機號碼與通行碼');
      return;
    }
    setBusy(true);
    setStage('verifying');

    // simulate handshake
    setTimeout(() => {
      // admin master pass
      if (pass === ADMIN_PASS) {
        const wl = loadWhitelist();
        const found = wl.find(w => w.phone === phone.trim());
        const session = {
          phone: phone.trim(),
          name:  found ? found.name : '系統管理員',
          role:  found ? found.role : 'ADMIN',
          isAdmin: true,
          loginAt: new Date().toISOString(),
        };
        setStage('granted');
        setTimeout(() => onAuth(session), 700);
        return;
      }
      // whitelisted users — phone == phone, pass == phone (last 4 digits also accepted)
      const wl = loadWhitelist();
      const found = wl.find(w => w.phone === phone.trim());
      if (found && (pass === found.phone || pass === found.phone.slice(-4))) {
        const session = {
          phone: found.phone, name: found.name, role: found.role,
          isAdmin: false, loginAt: new Date().toISOString(),
        };
        setStage('granted');
        setTimeout(() => onAuth(session), 700);
        return;
      }
      setStage('denied');
      setErr(found ? '通行碼錯誤 // ACCESS DENIED' : '此號碼未在白名單 // NOT WHITELISTED');
      setBusy(false);
      setTimeout(() => setStage('idle'), 1400);
    }, 600);
  };

  return (
    <div className="login-stage">
      <div className="login-bg-grid" />
      <div className="login-bg-scan" />

      <div className="login-shell">
        {/* Brand mark */}
        <div className="login-brand">
          <svg viewBox="0 0 64 64" width="44" height="44" fill="none" stroke="var(--accent)" strokeWidth="1.5">
            <path d="M32 3 L57 17 L57 47 L32 61 L7 47 L7 17 Z"/>
            <path d="M32 18 L46 26 L46 42 L32 50 L18 42 L18 26 Z" opacity="0.6"/>
            <circle cx="32" cy="34" r="4" fill="var(--accent)" stroke="none"/>
          </svg>
          <div className="login-brand-text">
            <div className="login-brand-title">水電報價</div>
            <div className="login-brand-sub">HYDRO·ELECTRIC // QUOTATION CONSOLE</div>
          </div>
        </div>

        {/* Auth panel */}
        <section className={`hud-panel login-panel ${stage === 'denied' ? 'login-deny' : ''} ${stage === 'granted' ? 'login-grant' : ''}`}>
          <div className="hud-panel-header">
            <span className="panel-title">SECURE LOGIN // 身分驗證</span>
            <span className="panel-meta">
              <span className={`status-dot ${stage === 'denied' ? 'dot-alert' : stage === 'granted' ? 'dot-ok' : ''}`} />
              {stage === 'verifying' ? 'VERIFYING' : stage === 'granted' ? 'GRANTED' : stage === 'denied' ? 'DENIED' : 'READY'}
            </span>
          </div>

          <form className="login-body" onSubmit={tryLogin}>
            <div className="login-corner tl"/><div className="login-corner tr"/>
            <div className="login-corner bl"/><div className="login-corner br"/>

            <div className="login-row">
              <div className="login-fld">
                <label className="mono-label">PHONE // 手機號碼</label>
                <div className="login-input-wrap">
                  <i data-lucide="smartphone" className="login-input-icon"></i>
                  <input
                    className="input login-input mono"
                    inputMode="numeric"
                    autoComplete="username"
                    placeholder="09XX XXX XXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\s/g, ''))}
                    disabled={busy}
                    autoFocus
                  />
                </div>
              </div>
              <div className="login-fld">
                <label className="mono-label">PASSCODE // 通行碼</label>
                <div className="login-input-wrap">
                  <i data-lucide="key-round" className="login-input-icon"></i>
                  <input
                    className="input login-input mono"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••••"
                    value={pass}
                    onChange={e => setPass(e.target.value)}
                    disabled={busy}
                  />
                </div>
              </div>
            </div>

            <div className="login-meta-row">
              <div className="login-meta-item">
                <span className="mono-label">CHANNEL</span>
                <span className="login-meta-v">SECURE-01</span>
              </div>
              <div className="login-meta-item">
                <span className="mono-label">CIPHER</span>
                <span className="login-meta-v">AES-256</span>
              </div>
              <div className="login-meta-item">
                <span className="mono-label">SESSION</span>
                <span className="login-meta-v">{(Math.random().toString(36).slice(2,8)).toUpperCase()}</span>
              </div>
              <div className="login-meta-item">
                <span className="mono-label">NODE</span>
                <span className="login-meta-v">TPE·HQ·07</span>
              </div>
            </div>

            {err && (
              <div className="login-err">
                <i data-lucide="shield-alert"></i>
                <span>{err}</span>
              </div>
            )}

            <div className="login-actions">
              <button type="submit" className="btn btn-primary login-submit" disabled={busy}>
                {stage === 'verifying' ? (
                  <><i data-lucide="loader" className="spin"></i><span>VERIFYING…</span></>
                ) : stage === 'granted' ? (
                  <><i data-lucide="shield-check"></i><span>ACCESS GRANTED</span></>
                ) : (
                  <><i data-lucide="log-in"></i><span>進入主控台 // ENTER</span><span className="btn-caret">›</span></>
                )}
              </button>
            </div>

            <div className="login-hint">
              <span className="mono-label">HINT</span>
              <span>白名單成員以手機號為帳號，通行碼為手機末四碼或完整號碼。管理員請輸入主通行碼。</span>
            </div>
          </form>
        </section>

        <div className="login-foot">
          <span className="mono-label">v2.6.0 · BUILD 4421</span>
          <span className="mono-label">© 2026 HYDRO-ELECTRIC OPS</span>
          <span className="mono-label">UNAUTHORIZED ACCESS LOGGED</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Whitelist Screen — manage allowed phone numbers
// ─────────────────────────────────────────────────────────────
function WhitelistScreen({ session, onLogout }) {
  const [list, setList] = React.useState(() => loadWhitelist());
  const [q, setQ] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState({ phone: '', name: '', role: '工班', note: '' });

  React.useEffect(() => { saveWhitelist(list); }, [list]);
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const filtered = list.filter(w =>
    !q || w.phone.includes(q) || (w.name||'').includes(q) || (w.role||'').includes(q)
  );

  const startAdd = () => {
    setEditing(null);
    setForm({ phone: '', name: '', role: '工班', note: '' });
    setOpen(true);
  };
  const startEdit = (w) => {
    setEditing(w.phone);
    setForm({ phone: w.phone, name: w.name, role: w.role, note: w.note || '' });
    setOpen(true);
  };
  const submit = () => {
    if (!/^09\d{8}$/.test(form.phone)) return alert('手機號碼格式錯誤 (09xxxxxxxx)');
    if (!form.name.trim()) return alert('請輸入姓名');
    const today = new Date().toISOString().slice(0,10);
    if (editing) {
      setList(list.map(w => w.phone === editing ? { ...w, ...form } : w));
    } else {
      if (list.some(w => w.phone === form.phone)) return alert('此號碼已在白名單');
      setList([{ ...form, addedAt: today }, ...list]);
    }
    setOpen(false);
  };
  const remove = (phone) => {
    if (!confirm(`從白名單移除 ${phone}？`)) return;
    setList(list.filter(w => w.phone !== phone));
  };

  const stats = {
    total: list.length,
    工班: list.filter(w => w.role === '工班').length,
    業務: list.filter(w => w.role === '業務').length,
    會計: list.filter(w => w.role === '會計').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top metrics */}
      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Panel title="總授權人數" meta="WHITELIST" accent>
          <Metric label="MEMBERS" value={stats.total} accent />
        </Panel>
        <Panel title="工班" meta="FIELD CREW">
          <Metric label="CREW" value={stats.工班} delta="施工現場" deltaKind="ok" />
        </Panel>
        <Panel title="業務" meta="SALES">
          <Metric label="SALES" value={stats.業務} delta="案件對接" deltaKind="ok" />
        </Panel>
        <Panel title="會計" meta="FINANCE">
          <Metric label="FIN" value={stats.會計} delta="請款管理" deltaKind="ok" />
        </Panel>
      </div>

      {/* Session card */}
      <Panel title="當前登入身分" meta="ACTIVE SESSION" accent>
        <div className="wl-session">
          <div className="wl-session-avatar">
            <i data-lucide={session.isAdmin ? 'shield-check' : 'user'}></i>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-tc)', fontSize: 18, color: 'var(--fg-1)', fontWeight: 600 }}>
                {session.name}
              </span>
              <Chip kind={session.isAdmin ? 'active' : 'info'}>
                {session.isAdmin ? 'ADMIN · 管理員' : session.role}
              </Chip>
            </div>
            <div className="mono-label" style={{ color: 'var(--fg-2)' }}>
              {session.phone} · LOGIN {new Date(session.loginAt).toLocaleString('zh-TW')}
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <button className="btn btn-solid" onClick={onLogout}>
            <i data-lucide="log-out"></i><span>登出</span>
          </button>
        </div>
      </Panel>

      {/* Whitelist table */}
      <Panel
        title={`白名單管理 // ${filtered.length} ENTRIES`}
        meta={session.isAdmin ? 'ADMIN MODE' : 'READ-ONLY'}
      >
        <div className="wl-toolbar">
          <div className="searchbar" style={{ flex: 1 }}>
            <i data-lucide="search" style={{ width: 14, height: 14 }}></i>
            <input
              placeholder="搜尋 / 手機號碼 / 姓名 / 角色"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>
          {session.isAdmin && (
            <button className="btn btn-primary" onClick={startAdd}>
              <i data-lucide="user-plus"></i><span>新增成員</span><span className="btn-caret">+</span>
            </button>
          )}
        </div>

        <table className="data-table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>PHONE</th>
              <th>姓名</th>
              <th style={{ fontSize: 12 }}>角色</th>
              <th style={{ fontSize: 12 }}>備註</th>
              <th style={{ fontSize: 12 }}>加入日期</th>
              <th style={{ textAlign: 'right', fontSize: 12 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(w => (
              <tr key={w.phone}>
                <td className="mono">{w.phone}</td>
                <td>{w.name}</td>
                <td><Chip kind={w.role === '會計' ? 'warn' : w.role === '業務' ? 'info' : 'ok'}>{w.role}</Chip></td>
                <td style={{ color: 'var(--fg-3)' }}>{w.note || '—'}</td>
                <td className="row-sub">{w.addedAt}</td>
                <td style={{ textAlign: 'right' }}>
                  {session.isAdmin ? (
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button className="btn btn-solid btn-sm" onClick={() => startEdit(w)}>
                        <i data-lucide="pencil" style={{ width: 12, height: 12 }}></i>
                        <span>編輯</span>
                      </button>
                      <button className="btn btn-solid btn-sm wl-del" onClick={() => remove(w.phone)}>
                        <i data-lucide="trash-2" style={{ width: 12, height: 12 }}></i>
                      </button>
                    </div>
                  ) : (
                    <span className="mono-label" style={{ color: 'var(--fg-3)' }}>READ-ONLY</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: 32, color: 'var(--fg-3)' }}>無符合的白名單成員</td></tr>
            )}
          </tbody>
        </table>
      </Panel>

      {/* Add/Edit modal */}
      {open && (
        <div className="hud-modal-veil" onClick={() => setOpen(false)}>
          <section className="hud-panel hud-modal" onClick={e => e.stopPropagation()} style={{ width: 480 }}>
            <div className="hud-panel-header">
              <span className="panel-title">{editing ? '編輯白名單成員' : '新增白名單成員'}</span>
              <span className="panel-meta">{editing ? 'EDIT' : 'NEW ENTRY'}</span>
            </div>
            <div className="hud-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="手機號碼 · PHONE">
                <Input
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value.replace(/\s/g,'') })}
                  placeholder="09XXXXXXXX"
                  disabled={!!editing}
                />
              </Field>
              <Field label="姓名 · NAME">
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="王師傅" />
              </Field>
              <Field label="角色 · ROLE">
                <Select
                  value={form.role}
                  onChange={v => setForm({ ...form, role: v })}
                  options={[
                    { value: '工班', label: '工班 · FIELD CREW' },
                    { value: '業務', label: '業務 · SALES' },
                    { value: '會計', label: '會計 · FINANCE' },
                    { value: '管理', label: '管理 · ADMIN' },
                  ]}
                />
              </Field>
              <Field label="備註 · NOTE">
                <Input value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="(選填)" />
              </Field>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <button className="btn btn-solid" onClick={() => setOpen(false)}>取消</button>
                <button className="btn btn-primary" onClick={submit}>
                  <i data-lucide="check"></i><span>{editing ? '儲存' : '加入白名單'}</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { LoginScreen, WhitelistScreen, loadSession, saveSession });
