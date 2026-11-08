import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Panel, Chip, Button, Field, Input, Toggle, Modal, Icon } from '../components/Primitives.jsx';
import { GuiStatus, useGuiVerify } from '../components/GuiStatus.jsx';
import { gcisSearchCompany } from '../lib/gcis.js';
import { AddLineItemModal } from './Screens.jsx';
import { fmt, fmtMD, toChineseUpper, validateGUI, todayYMD, todayISO, addDays, roadName } from '../lib/format.js';
import { quoteTotals } from '../lib/calc.js';

// ─────────────────────────────────────────────────────────────
// 列印版報價單 — 白底正式文件（@media print 才顯示，見 print.css）
// ─────────────────────────────────────────────────────────────
// 報價有效天數：存在 info.validDays；舊報價沒有這個欄位時沿用預設 30 日
const DEFAULT_VALID_DAYS = 30;
const VALID_DAY_PRESETS = [7, 15, 30, 60];
export const validDaysOf = (info) => {
  const n = Math.round(+info?.validDays);
  return n > 0 ? n : DEFAULT_VALID_DAYS;
};

function PrintQuote({ info, items, subtotal, tax, total, taxInc, company }) {
  return createPortal(
    <div className="print-quote">
      <header className="pq-head">
        <div>
          <h1>{company.name || '（未設定工程行名稱）'}</h1>
          <div className="pq-co-meta">
            統一編號 {company.gui || '—'} · 電話 {company.phone || '—'}<br />
            {company.address || '—'}
          </div>
        </div>
        <div className="pq-doc">
          <div className="pq-doc-title">工 程 報 價 單</div>
          <div className="pq-doc-meta">
            <span>報價日期：{todayYMD()}</span>
            <span>報價單號：{info.quoteNo}</span>
            <span>有效期限：報價日起 {validDaysOf(info)} 日</span>
          </div>
        </div>
      </header>

      <table className="pq-info">
        <tbody>
          <tr>
            <th>業主</th><td>{info.client}</td>
            <th>統一編號</th><td>{info.gui || '—'}</td>
          </tr>
          <tr>
            <th>工程名稱</th><td>{info.name}</td>
            <th>聯絡電話</th><td>{info.phone}</td>
          </tr>
          <tr>
            <th>工程地點</th><td>{info.location}</td>
            <th>預計工期</th><td>{info.duration}</td>
          </tr>
        </tbody>
      </table>

      <table className="pq-items">
        <thead>
          <tr><th style={{ width: 36 }}>項次</th><th>工程項目</th><th style={{ width: 56 }}>類別</th><th style={{ width: 56 }}>數量</th><th style={{ width: 48 }}>單位</th><th style={{ width: 88 }}>單價</th><th style={{ width: 100 }}>複價</th></tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={it.id}>
              <td className="ctr">{i + 1}</td>
              <td>{it.name}</td>
              <td className="ctr">{it.cat}</td>
              <td className="rgt">{it.qty.toLocaleString()}</td>
              <td className="ctr">{it.unit}</td>
              <td className="rgt">{it.price.toLocaleString()}</td>
              <td className="rgt">{(it.qty * it.price).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr><td colSpan={6} className="rgt">小計</td><td className="rgt">{subtotal.toLocaleString()}</td></tr>
          <tr><td colSpan={6} className="rgt">營業稅 5%{taxInc ? '' : '（未稅）'}</td><td className="rgt">{tax.toLocaleString()}</td></tr>
          <tr className="pq-total"><td colSpan={6} className="rgt">總計</td><td className="rgt">NT$ {total.toLocaleString()}</td></tr>
        </tfoot>
      </table>

      <div className="pq-upper">合計金額（大寫）：{toChineseUpper(total)}</div>

      <ol className="pq-notes">
        <li>本報價單有效期限為報價日起 {validDaysOf(info)} 日，逾期請重新確認。</li>
        <li>付款方式：簽約訂金 50%，完工驗收後付清尾款。匯款帳戶：{company.bank || '—'}。</li>
        <li>施工範圍以本報價單工項為準，追加工程另行報價。</li>
        <li>本報價含營業稅，如需開立統一發票請提供統編。</li>
      </ol>

      <footer className="pq-sign">
        <div><span>報價人</span><div className="pq-sign-line" /></div>
        <div><span>業主簽回</span><div className="pq-sign-line" /></div>
        <div><span>日期</span><div className="pq-sign-line" /></div>
      </footer>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────
// 業主名稱查統編（商工登記；官方 API 僅支援公司，行號請直接輸入統編）
// ─────────────────────────────────────────────────────────────
function GuiSearchModal({ proxy, initial, onClose, onPick }) {
  const [kw, setKw] = useState(initial || '');
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState('');

  const search = async (e) => {
    if (e) e.preventDefault();
    setErr(''); setBusy(true); setRows(null);
    const r = await gcisSearchCompany(proxy, kw);
    setBusy(false);
    if (r.error) return setErr(r.error);
    if (r.off) return setErr('尚未設定商工登記查詢代理（設定頁）');
    setRows(r.results);
  };

  return (
    <Modal
      open onClose={onClose}
      title="名稱查統編 · GCIS" meta="公司登記" width={620}
    >
      <form onSubmit={search} className="searchbar" style={{ marginBottom: 12 }}>
        <Icon name="search" size={14} />
        <input value={kw} onChange={e => setKw(e.target.value)} placeholder="公司名稱關鍵字（至少 2 字）" autoFocus />
        <Button variant="primary" onClick={search} disabled={busy}>{busy ? '查詢中…' : '查詢'}</Button>
      </form>
      {err && <div className="mono-label" style={{ color: 'var(--warn)', marginBottom: 8 }}>{err}</div>}
      {rows && (
        <div className="pick-list">
          {rows.map(r => (
            <button key={r.gui} className="pick-row" onClick={() => { onPick(r); onClose(); }}>
              <span className="mono" style={{ color: 'var(--accent)', width: 96 }}>{r.gui}</span>
              <span style={{ flex: 1, color: 'var(--fg-1)' }}>{r.name}</span>
              <Chip kind={(r.status || '').includes('核准') ? 'ok' : 'warn'}>{r.status || '—'}</Chip>
            </button>
          ))}
          {rows.length === 0 && (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--fg-3)' }}>
              查無符合的公司 — 行號（商號）不支援名稱查詢，請直接輸入統編驗證
            </div>
          )}
        </div>
      )}
      <div className="mono-label" style={{ marginTop: 12, color: 'var(--fg-3)' }}>
        資料來源：經濟部商工行政資料開放平臺
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// QUOTE BUILDER
// ─────────────────────────────────────────────────────────────
// 報價流程：依這張報價單的實際狀態顯示（草稿 → 送出業主 → 業主簽回 → 請款）
function QuoteSteps({ quote }) {
  const st = quote?.status;
  const overdue = st === 'warn' && quote?.validAt && quote.validAt < todayISO();
  const invoiced = (quote?.invoicedCount || 0) > 0;
  const steps = [
    {
      label: '草稿建立',
      state: quote ? 'done' : 'active',
      sub: quote ? `${quote.version?.toUpperCase() || 'V1'} · 已儲存` : '尚未儲存 · 按「儲存草稿」',
    },
    {
      label: '送出業主',
      state: st === 'warn' || st === 'ok' ? 'done' : quote ? 'active' : 'todo',
      sub: st === 'warn' || st === 'ok' ? `${fmtMD(quote.issuedAt)} 送出 · 有效至 ${fmtMD(quote.validAt)}` : '按「送出報價」',
    },
    {
      label: '業主簽回',
      state: st === 'ok' ? 'done' : overdue ? 'alert' : st === 'warn' ? 'active' : 'todo',
      sub: st === 'ok' ? `${fmtMD(quote.signedAt)} 簽回` : overdue ? '已逾期 · 請聯絡業主或建立新版本' : st === 'warn' ? '等待業主簽回' : '—',
    },
    {
      label: '請款',
      state: invoiced ? 'done' : st === 'ok' ? 'active' : 'todo',
      sub: invoiced ? `已開 ${quote.invoicedCount} 期 · ${fmt(quote.invoicedAmount)}` : st === 'ok' ? '可到報價單列表「轉請款」' : '—',
    },
  ];
  const mark = { done: '✓', active: '●', alert: '!', todo: '○' };
  return (
    <ol className="steps">
      {steps.map(s => (
        <li key={s.label} className={s.state === 'todo' ? '' : `step-${s.state}`}>
          <span className="step-mark">{mark[s.state]}</span>
          <div><div>{s.label}</div><div className="row-sub mono">{s.sub}</div></div>
        </li>
      ))}
    </ol>
  );
}

export function QuoteBuilder({ caseData, quote, versions = [], materials, company = {}, newQuoteNo, onClose, onSave, onOpenVersion, onNewVersion }) {
  // 只有草稿可編輯；已送出／已簽回的版本唯讀，要修改請建立新版本
  const readOnly = !!quote && quote.status !== 'info';
  // 案件名稱只在第一版（新報價／v1）可命名；後續版本沿用同一案件名稱
  const canNameCase = !readOnly && (!quote || quote.version === 'v1');
  // 使用者手動改過名稱後，就不再被工程地點自動覆蓋
  const [nameTouched, setNameTouched] = useState(!!quote);
  const [items, setItems] = useState(quote?.items?.length ? quote.items : []); // 新報價從空白開始，不帶示範工項
  const [taxInc, setTaxInc] = useState(quote?.taxInc ?? true);
  const [addOpen, setAddOpen] = useState(false);
  const [guiSearchOpen, setGuiSearchOpen] = useState(false);
  const [savedTick, setSavedTick] = useState(false);
  const [info, setInfo] = useState(() => {
    if (quote?.info) return quote.info;
    const location = caseData?.location || '';
    return {
      quoteNo: quote?.id || newQuoteNo,
      // 新報價：以工程地點的路名為預設案件名稱，可自行改寫
      name: quote?.case || caseData?.name || roadName(location) || '',
      client: quote?.client || caseData?.client || '',
      gui: quote?.gui || caseData?.gui || '',
      phone: '',
      location,
      duration: '14 天',
      validDays: DEFAULT_VALID_DAYS,
    };
  });
  const { subtotal, tax, total } = quoteTotals(items, taxInc);
  const guiInvalid = info.gui && !validateGUI(info.gui);
  // 統編通過檢核碼後即時查商工登記（唯讀版本不查）
  const guiVerify = useGuiVerify(readOnly ? '' : (company.gcisProxy || ''), info.gui);
  const updateQty = (id, qty) => setItems(items.map(it => it.id === id ? { ...it, qty: Math.max(0, qty) } : it));
  const removeItem = (id) => setItems(items.filter(it => it.id !== id));
  const addItem = (it) => setItems(prev => [...prev, it]);
  // 調整工項順序（列印版依此順序）：↑↓ 按鈕一次一格，或按住左側把手拖曳
  const moveItem = (from, to) => setItems(prev => {
    if (from === to || from < 0 || to < 0 || from >= prev.length || to >= prev.length) return prev;
    const next = [...prev];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
  });
  const [dragArmed, setDragArmed] = useState(null); // 按住把手才允許拖曳，避免干擾數量輸入框
  const [dragFrom, setDragFrom] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const endDrag = () => { setDragArmed(null); setDragFrom(null); setDragOver(null); };
  const setF = (k) => (e) => setInfo({ ...info, [k]: e.target.value });

  // 組出報價單紀錄（保留簽回／請款進度），交給 App upsert
  const buildRecord = (status, statusLabel) => ({
    id: info.quoteNo,
    caseId: quote?.caseId || caseData?.id || null, // null → App 依案件名稱建立新案件
    case: info.name.trim() || roadName(info.location) || '未命名案件',
    client: (info.client || '').split(' · ')[0], gui: info.gui,
    version: quote?.version || 'v1',
    status, statusLabel,
    amount: total, taxInc, items, info,
    issuedAt: status === 'warn' ? todayISO() : (quote?.issuedAt || todayISO()),
    // 到期日＝報價日＋有效天數；草稿改天數後再存檔也會跟著更新
    validAt: addDays(status === 'warn' ? todayISO() : (quote?.issuedAt || todayISO()), validDaysOf(info)),
    signedAt: quote?.signedAt || null,
    invoicedCount: quote?.invoicedCount || 0,
    invoicedAmount: quote?.invoicedAmount || 0,
  });
  const saveDraft = () => {
    onSave(buildRecord('info', '草稿'), false);
    setSavedTick(true);
    setTimeout(() => setSavedTick(false), 1600);
  };
  const sendQuote = () => onSave(buildRecord('warn', '待業主簽回'), true);
  // 草稿另存新版本：目前畫面上的內容存成下一版草稿；原版本維持上次儲存的內容不變
  const saveAsNewVersion = () => onNewVersion({ ...quote, ...buildRecord('info', '草稿') });

  return (
    <div className="screen screen-quote" data-screen-label="Quote Builder">
      <div className="screen-header">
        <div>
          <div className="mono-label" style={{ color: 'var(--fg-3)' }}>
            {info.quoteNo} · {caseData?.id || '新案件'} {quote?.version ? `· ${quote.version.toUpperCase()}` : ''}
          </div>
          <h1 className="screen-title">{info.name || '新報價單'}</h1>
        </div>
        <div className="screen-actions">
          <Button variant="ghost" onClick={onClose} icon="x">關閉</Button>
          <Button variant="solid" icon="printer" onClick={() => window.print()}>列印 / PDF</Button>
          {readOnly ? (
            <Button variant="primary" icon="file-plus" onClick={() => onNewVersion(quote)}>建立新版本</Button>
          ) : (
            <>
              <Button variant="solid" icon={savedTick ? 'check' : 'save'} onClick={saveDraft}>{savedTick ? '已儲存' : '儲存草稿'}</Button>
              {quote && <Button variant="solid" icon="file-plus" onClick={saveAsNewVersion}>另存新版本</Button>}
              <Button variant="primary" icon="send" onClick={sendQuote}>送出報價</Button>
            </>
          )}
        </div>
      </div>

      {/* 版本選擇 — 點擊切換回顧任一版本 */}
      {versions.length > 1 && (
        <div className="version-bar">
          <span className="mono-label">VERSIONS · 版本</span>
          <div className="version-chips">
            {versions.map(v => (
              <button
                key={v.id}
                className={`version-chip ${v.id === quote?.id ? 'active' : ''}`}
                onClick={() => v.id !== quote?.id && onOpenVersion(v)}
                title={`${v.statusLabel} · 開立 ${fmtMD(v.issuedAt)} · ${fmt(v.amount)}`}
              >
                <span className={`chip-dot chip-dot-${v.status}`} />
                {v.version}
              </button>
            ))}
          </div>
          <span className="version-note">
            {readOnly
              ? `${quote.statusLabel}版本唯讀 — 要修改請建立新版本`
              : '草稿可編輯 · 「另存新版本」會把目前內容存成新的一版，原版本不變'}
          </span>
        </div>
      )}

      <div className="quote-layout">
        <div className="quote-main">
          <Panel title="案件資訊" meta="CLIENT · SCOPE">
            <div className="quote-meta-grid">
              <Field
                label="案件名稱 · CASE NAME"
                helper={canNameCase ? '預設帶入工程地點的路名，可自行改寫' : '沿用第一版案件名稱'}
              >
                <Input
                  value={info.name}
                  onChange={(e) => { setNameTouched(true); setInfo({ ...info, name: e.target.value }); }}
                  placeholder="松高路 3F 配電工程"
                  disabled={!canNameCase}
                />
              </Field>
              <Field label="業主">
                <div className="field-with-btn">
                  <Input value={info.client} onChange={setF('client')} disabled={readOnly} />
                  {!readOnly && !!(company.gcisProxy || '').trim() && (
                    <button type="button" className="btn btn-solid btn-sm" title="以名稱查統編（商工登記）" onClick={() => setGuiSearchOpen(true)}>
                      <Icon name="search" size={12} /><span>查統編</span>
                    </button>
                  )}
                </div>
              </Field>
              <Field label="統一編號 · GUI（選填）" error={guiInvalid ? '統編檢核未通過 — 請確認是否正確' : ''} helper={guiVerify.state === 'idle' || guiVerify.state === 'off' ? '開立發票用；個人業主可留空' : ''}>
                <Input value={info.gui} onChange={e => setInfo({ ...info, gui: e.target.value.replace(/\D/g, '').slice(0, 8) })} placeholder="8 位數字" inputMode="numeric" disabled={readOnly} />
                <GuiStatus verify={guiVerify} onAdopt={(name) => setInfo(prev => ({ ...prev, client: name }))} />
              </Field>
              <Field label="聯絡電話"><Input value={info.phone} onChange={setF('phone')} disabled={readOnly} /></Field>
              <Field label="工程地點" helper={canNameCase && !nameTouched ? '輸入地址會自動帶出路名為案件名稱' : ''}>
                <Input
                  value={info.location}
                  onChange={(e) => {
                    const location = e.target.value;
                    // 尚未手動命名時，案件名稱跟著地址的路名走
                    setInfo(prev => ({
                      ...prev,
                      location,
                      ...(canNameCase && !nameTouched ? { name: roadName(location) } : {}),
                    }));
                  }}
                  placeholder="台北市信義區松高路 19 號 3F"
                  disabled={readOnly}
                />
              </Field>
              <Field label="預計工期"><Input value={info.duration} onChange={setF('duration')} disabled={readOnly} /></Field>
            </div>
          </Panel>

          <Panel title="工項明細" meta={`${items.length} LINE ITEMS`} accent>
            <div className="table-scroll">
              <table className="data-table line-items">
                <thead>
                  <tr><th>#</th><th>項目</th><th>類別</th><th style={{ textAlign: 'right' }}>數量</th><th>單位</th><th style={{ textAlign: 'right' }}>單價</th><th style={{ textAlign: 'right' }}>小計</th><th /></tr>
                </thead>
                <tbody>
                  {items.map((it, i) => (
                    <tr
                      key={it.id}
                      className={[
                        dragFrom === i ? 'li-dragging' : '',
                        dragOver === i && dragFrom !== null && dragFrom !== i ? (dragFrom < i ? 'li-drop-below' : 'li-drop-above') : '',
                      ].join(' ')}
                      draggable={!readOnly && dragArmed === it.id}
                      onDragStart={(e) => { setDragFrom(i); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(i)); }}
                      onDragOver={(e) => { if (dragFrom === null) return; e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (dragOver !== i) setDragOver(i); }}
                      onDrop={(e) => { e.preventDefault(); if (dragFrom !== null) moveItem(dragFrom, i); endDrag(); }}
                      onDragEnd={endDrag}
                    >
                      <td className="mono row-sub">
                        <div className="li-order">
                          {!readOnly && (
                            <span
                              className="li-grip" title="按住拖曳調整順序"
                              onMouseDown={() => setDragArmed(it.id)} onMouseUp={() => setDragArmed(null)}
                            ><Icon name="grip-vertical" size={14} /></span>
                          )}
                          <span>{String(i + 1).padStart(2, '0')}</span>
                          {!readOnly && (
                            <span className="li-arrows">
                              <button type="button" className="li-arrow" title="上移" disabled={i === 0} onClick={() => moveItem(i, i - 1)}><Icon name="chevron-up" size={12} /></button>
                              <button type="button" className="li-arrow" title="下移" disabled={i === items.length - 1} onClick={() => moveItem(i, i + 1)}><Icon name="chevron-down" size={12} /></button>
                            </span>
                          )}
                        </div>
                      </td>
                      <td>{it.name}</td>
                      <td><Chip kind={it.type === 'labor' ? 'info' : 'dim'}>{it.cat}</Chip></td>
                      <td style={{ textAlign: 'right' }}>
                        {readOnly
                          ? <span className="mono">{it.qty}</span>
                          : <input className="input input-inline" type="number" value={it.qty} onChange={e => updateQty(it.id, +e.target.value)} />}
                      </td>
                      <td className="row-sub mono">{it.unit}</td>
                      <td className="mono" style={{ textAlign: 'right' }}>{it.price.toLocaleString()}</td>
                      <td className="mono" style={{ textAlign: 'right', color: 'var(--accent)' }}>{(it.qty * it.price).toLocaleString()}</td>
                      <td>
                        {!readOnly && (
                          <button className="icon-btn" onClick={() => removeItem(it.id)}><Icon name="x" size={14} /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--fg-3)', padding: 24 }}>
                      {readOnly ? '此版本無工項' : '尚無工項 · 點擊下方新增'}
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {!readOnly && (
              <button className="add-line" onClick={() => setAddOpen(true)}>
                <Icon name="plus" size={14} /> 新增工項
              </button>
            )}
          </Panel>
        </div>

        <aside className="quote-side">
          <Panel title="金額計算" meta="AMOUNT">
            <div className="calc-row"><span>小計</span><span className="mono">{fmt(subtotal)}</span></div>
            <div className="calc-row"><span>營業稅 (5%)</span><span className="mono">{fmt(tax)}</span></div>
            <div className="calc-total">
              <div className="mono-label" style={{ color: 'var(--accent)' }}>TOTAL · 總計</div>
              <div className="calc-total-v">{fmt(total)}</div>
            </div>
            <div className="calc-upper mono-label">{toChineseUpper(total)}</div>
            <Toggle on={taxInc} onChange={readOnly ? () => {} : setTaxInc} label="含營業稅" />
            <div className="valid-days">
              <span className="mono-label">報價有效期限 · VALID</span>
              <div className="valid-days-row">
                {VALID_DAY_PRESETS.map(d => (
                  <button
                    type="button" key={d} disabled={readOnly}
                    className={`valid-day-btn ${validDaysOf(info) === d ? 'active' : ''}`}
                    onClick={() => setInfo({ ...info, validDays: d })}
                  >{d} 天</button>
                ))}
                <label className="valid-day-custom">
                  <input
                    type="number" min="1" max="365" inputMode="numeric" disabled={readOnly}
                    className="input input-inline" aria-label="自訂有效天數"
                    value={info.validDays ?? DEFAULT_VALID_DAYS}
                    onChange={e => setInfo({ ...info, validDays: e.target.value === '' ? '' : Math.min(365, Math.max(0, Math.round(+e.target.value))) })}
                  />
                  <span>天</span>
                </label>
              </div>
              <div className="row-sub mono">送出後到期日：{fmtMD(addDays(todayISO(), validDaysOf(info)))}</div>
            </div>
          </Panel>
          <Panel title="報價流程" meta="WORKFLOW">
            <QuoteSteps quote={quote} />
          </Panel>
        </aside>
      </div>

      <AddLineItemModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={addItem} materials={materials} />
      {guiSearchOpen && (
        <GuiSearchModal
          proxy={company.gcisProxy || ''}
          initial={(info.client || '').split(' · ')[0]}
          onClose={() => setGuiSearchOpen(false)}
          onPick={(r) => setInfo(prev => ({ ...prev, client: r.name, gui: r.gui }))}
        />
      )}
      <PrintQuote info={info} items={items} subtotal={subtotal} tax={tax} total={total} taxInc={taxInc} company={company} />
    </div>
  );
}
