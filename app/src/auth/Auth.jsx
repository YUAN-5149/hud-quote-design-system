import { useState } from 'react';
import { Panel, Metric, Chip, Field, Input, Select, Icon } from '../components/Primitives.jsx';
import { ADMIN_PASS, fetchWhitelist } from '../lib/session.js';

// ─────────────────────────────────────────────────────────────
// Login Screen — full-viewport HUD console
// ─────────────────────────────────────────────────────────────
export function LoginScreen({ onAuth }) {
  const [phone, setPhone] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState('idle'); // idle | verifying | granted | denied

  const tryLogin = async (e) => {
    e && e.preventDefault();
    setErr('');
    if (!phone.trim() || !pass.trim()) {
      setErr('請輸入手機號碼與通行碼');
      return;
    }
    setBusy(true);
    setStage('verifying');

    const wl = await fetchWhitelist();
    const found = wl.find(w => w.phone === phone.trim());

    // admin master pass
    if (pass === ADMIN_PASS) {
      const session = {
        phone: phone.trim(),
        name: found ? found.name : '系統管理員',
        role: found ? found.role : 'ADMIN',
        isAdmin: true,
        loginAt: new Date().toISOString(),
      };
      setStage('granted');
      setTimeout(() => onAuth(session), 700);
      return;
    }
    // whitelisted users — pass 為完整號碼或末四碼
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
                  <Icon name="smartphone" className="login-input-icon" />
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
                  <Icon name="key-round" className="login-input-icon" />
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
                <Icon name="shield-alert" />
                <span>{err}</span>
              </div>
            )}

            <div className="login-actions">
              <button type="submit" className="btn btn-primary login-submit" disabled={busy}>
                {stage === 'verifying' ? (
                  <><Icon name="loader" className="spin" /><span>VERIFYING…</span></>
                ) : stage === 'granted' ? (
                  <><Icon name="shield-check" /><span>ACCESS GRANTED</span></>
                ) : (
                  <><Icon name="log-in" /><span>進入主控台 // ENTER</span><span className="btn-caret">›</span></>
                )}
              </button>
            </div>

            <div className="login-hint">
              <span className="mono-label">DEMO</span>
              <span>測試帳號：手機 0912345678 · 通行碼 5678（末四碼）。管理員模式：任一手機號 + 通行碼 hud-admin-2026。</span>
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
export function WhitelistScreen({ session, onLogout, list, setList }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ phone: '', name: '', role: '工班', note: '' });

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
            <Icon name={session.isAdmin ? 'shield-check' : 'user'} size={24} />
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
            <Icon name="log-out" size={14} /><span>登出</span>
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
            <Icon name="search" size={14} />
            <input
              placeholder="搜尋 / 手機號碼 / 姓名 / 角色"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>
          {session.isAdmin && (
            <button className="btn btn-primary" onClick={startAdd}>
              <Icon name="user-plus" size={14} /><span>新增成員</span><span className="btn-caret">+</span>
            </button>
          )}
        </div>

        <div className="table-scroll">
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
                          <Icon name="pencil" size={12} />
                          <span>編輯</span>
                        </button>
                        <button className="btn btn-solid btn-sm wl-del" onClick={() => remove(w.phone)}>
                          <Icon name="trash-2" size={12} />
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
        </div>
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
                  <Icon name="check" size={14} /><span>{editing ? '儲存' : '加入白名單'}</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
