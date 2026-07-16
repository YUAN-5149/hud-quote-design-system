import { useState, useEffect, useRef } from 'react';
import { Panel, Button, Field, Input, Chip, Icon } from '../components/Primitives.jsx';
import { validateGUI } from '../lib/format.js';

// ─────────────────────────────────────────────────────────────
// 設定 — 報價單抬頭（工程行自家資料）
// 管理員可編輯；其他成員唯讀
// ─────────────────────────────────────────────────────────────
export function SettingsScreen({ session, company, onSave }) {
  const canEdit = !!session?.isAdmin;
  const [form, setForm] = useState(company);
  const [err, setErr] = useState({});
  const [savedTick, setSavedTick] = useState(false);
  // 使用者開始編輯後就不再被雲端同步覆蓋（company 每次快照都是新物件參照）
  const editingRef = useRef(false);

  useEffect(() => {
    if (!editingRef.current) setForm(company);
  }, [company]);

  const edit = (patch) => { editingRef.current = true; setForm(prev => ({ ...prev, ...patch })); };
  const setF = (k) => (e) => edit({ [k]: e.target.value });
  const dirty = ['name', 'gui', 'phone', 'address', 'bank'].some(k => (form[k] || '') !== (company[k] || ''));
  const incomplete = !form.name?.trim() || !form.gui?.trim();

  const submit = () => {
    const e = {};
    if (!form.name?.trim()) e.name = '請輸入工程行名稱';
    if (form.gui && !validateGUI(form.gui)) e.gui = '統編檢核未通過';
    setErr(e);
    if (Object.keys(e).length) return;
    onSave({ ...company, ...form, name: form.name.trim() });
    editingRef.current = false; // 存檔後恢復接收雲端同步
    setSavedTick(true);
    setTimeout(() => setSavedTick(false), 1800);
  };

  return (
    <div className="screen" data-screen-label="Settings">
      <div className="screen-header">
        <div>
          <div className="mono-label" style={{ color: 'var(--fg-3)' }}>SETTINGS · 系統設定</div>
          <h1 className="screen-title">設定 // SETTINGS</h1>
        </div>
        <div className="screen-actions">
          {canEdit && (
            <Button variant="primary" icon={savedTick ? 'check' : 'save'} onClick={submit} disabled={!dirty && !savedTick}>
              {savedTick ? '已儲存' : '儲存設定'}
            </Button>
          )}
        </div>
      </div>

      {incomplete && (
        <div className="version-bar" style={{ borderLeftColor: 'var(--warn)' }}>
          <span className="mono-label" style={{ color: 'var(--warn)' }}>SETUP REQUIRED</span>
          <span className="version-note" style={{ marginLeft: 0, textAlign: 'left' }}>
            尚未填寫工程行資料 — 報價單列印的抬頭與匯款帳戶會是空白，請先完成設定
          </span>
        </div>
      )}

      <Panel title="報價單抬頭" meta={canEdit ? 'COMPANY · 可編輯' : 'COMPANY · READ-ONLY'} accent>
        <div className="quote-meta-grid">
          <Field label="工程行名稱 · NAME" error={err.name} helper="顯示於報價單抬頭">
            <Input value={form.name || ''} onChange={setF('name')} placeholder="宏達水電工程行" disabled={!canEdit} />
          </Field>
          <Field label="統一編號 · GUI" error={err.gui}>
            <Input
              value={form.gui || ''}
              onChange={e => edit({ gui: e.target.value.replace(/\D/g, '').slice(0, 8) })}
              placeholder="8 位數字"
              inputMode="numeric"
              disabled={!canEdit}
            />
          </Field>
          <Field label="聯絡電話 · PHONE">
            <Input value={form.phone || ''} onChange={setF('phone')} placeholder="02-2723-1234" disabled={!canEdit} />
          </Field>
          <Field label="地址 · ADDRESS">
            <Input value={form.address || ''} onChange={setF('address')} placeholder="台北市信義區松德路 12 號 1F" disabled={!canEdit} />
          </Field>
          <Field label="匯款帳戶 · BANK" helper="印在報價單付款方式，請務必確認正確">
            <Input value={form.bank || ''} onChange={setF('bank')} placeholder="第一銀行 信義分行 · 123-45-678901" disabled={!canEdit} />
          </Field>
        </div>
        {!canEdit && (
          <div className="mono-label" style={{ color: 'var(--fg-3)', marginTop: 14 }}>
            僅管理員可修改公司設定
          </div>
        )}
      </Panel>

      {/* 列印預覽 — 與報價單實際印出的抬頭一致 */}
      <Panel title="報價單抬頭預覽" meta="PREVIEW">
        <div className="settings-preview">
          <div className="settings-preview-name">{form.name?.trim() || '（未填寫工程行名稱）'}</div>
          <div className="settings-preview-meta">
            統一編號 {form.gui || '—'} · 電話 {form.phone || '—'}<br />
            {form.address || '—'}
          </div>
          <div className="settings-preview-bank">
            匯款帳戶：{form.bank || '—'}
          </div>
        </div>
      </Panel>

      <Panel title="系統資訊" meta="ABOUT">
        <div className="tele-list">
          <div className="about-row">
            <span className="about-lbl">登入身分</span>
            <span>{session?.name} <Chip kind={session?.isAdmin ? 'active' : 'info'}>{session?.isAdmin ? 'ADMIN · 管理員' : session?.role}</Chip></span>
          </div>
          <div className="about-row">
            <span className="about-lbl">資料儲存</span>
            <span className="mono" style={{ color: 'var(--fg-2)' }}>Firebase Firestore · asia-east1（台灣）</span>
          </div>
          <div className="about-row">
            <span className="about-lbl">離線支援</span>
            <span className="mono" style={{ color: 'var(--ok)' }}>
              <Icon name="check" size={12} /> 已啟用 · 恢復連線自動同步
            </span>
          </div>
        </div>
      </Panel>
    </div>
  );
}
