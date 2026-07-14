import { useState, useMemo } from 'react';
import { Panel, Metric, Chip, Button, Field, Input, Modal, Select, Icon } from '../components/Primitives.jsx';
import { MATERIALS, MATERIAL_CATS } from '../lib/data.js';
import { fmt, fmtMD, todayISO, addDays } from '../lib/format.js';

// ─────────────────────────────────────────────────────────────
// NEW CASE MODAL
// ─────────────────────────────────────────────────────────────
export function NewCaseModal({ open, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [gui, setGui] = useState('');
  const [location, setLocation] = useState('');
  const [amount, setAmount] = useState('');
  const reset = () => { setName(''); setClient(''); setGui(''); setLocation(''); setAmount(''); };
  const submit = () => {
    if (!name.trim()) return;
    const now = new Date();
    const id = `#${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
    onCreate({
      id,
      createdAt: todayISO(),
      name: name.trim(),
      client: client.trim() || '—',
      gui: gui.trim(),
      location: location.trim() || '—',
      status: 'warn',
      statusLabel: '待確認',
      amount: +amount || 0,
      updated: `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,
      progress: 0,
    });
    reset();
    onClose();
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="新增案件 · NEW CASE"
      meta="FORM"
      width={560}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>取消</Button>
          <Button variant="primary" icon="check" onClick={submit}>建立案件</Button>
        </>
      }
    >
      <div className="quote-meta-grid">
        <Field label="案件名稱 · NAME">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="大明商辦 3F 配電工程" autoFocus />
        </Field>
        <Field label="業主 · CLIENT">
          <Input value={client} onChange={e => setClient(e.target.value)} placeholder="王協理" />
        </Field>
        <Field label="統一編號 · GUI (選填)">
          <Input value={gui} onChange={e => setGui(e.target.value.replace(/\D/g, '').slice(0, 8))} placeholder="8 位數字" inputMode="numeric" />
        </Field>
        <Field label="地點 · LOCATION">
          <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="台北 · 信義" />
        </Field>
        <Field label="預估金額 · AMOUNT">
          <Input value={amount} onChange={e => setAmount(e.target.value)} placeholder="128400" type="number" />
        </Field>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// ADD LINE-ITEM MODAL
// ─────────────────────────────────────────────────────────────
export function AddLineItemModal({ open, onClose, onAdd, materials = MATERIALS }) {
  const [mode, setMode] = useState('catalog'); // 'catalog' | 'custom'
  const [q, setQ] = useState('');
  const [custom, setCustom] = useState({ name: '', cat: '配電', unit: '個', qty: 1, price: 0 });
  const filtered = materials.filter(m => m.name.includes(q) || m.code.includes(q));

  const addFromCatalog = (m) => {
    onAdd({
      id: Date.now(),
      type: m.cat === '工資' ? 'labor' : 'material',
      name: m.name,
      qty: 1, unit: m.unit, price: m.price, cat: m.cat,
    });
    onClose();
  };
  const addCustom = () => {
    if (!custom.name.trim()) return;
    onAdd({
      id: Date.now(),
      type: custom.cat === '工資' ? 'labor' : 'material',
      name: custom.name.trim(),
      qty: +custom.qty || 1,
      unit: custom.unit.trim() || '個',
      price: +custom.price || 0,
      cat: custom.cat,
    });
    setCustom({ name: '', cat: '配電', unit: '個', qty: 1, price: 0 });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="新增工項 · ADD LINE" meta={mode === 'catalog' ? 'FROM CATALOG' : 'CUSTOM'} width={640}>
      <div className="mode-tabs">
        <button className={`mode-tab ${mode === 'catalog' ? 'active' : ''}`} onClick={() => setMode('catalog')}>
          從材料庫選取
        </button>
        <button className={`mode-tab ${mode === 'custom' ? 'active' : ''}`} onClick={() => setMode('custom')}>
          自訂工項
        </button>
      </div>

      {mode === 'catalog' && (
        <>
          <div className="searchbar" style={{ marginBottom: 12 }}>
            <Icon name="search" size={14} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="SEARCH · 品項 / 代碼" autoFocus />
            <span className="mono-label" style={{ color: 'var(--fg-3)' }}>{filtered.length}/{materials.length}</span>
          </div>
          <div className="pick-list">
            {filtered.map(m => (
              <button key={m.code} className="pick-row" onClick={() => addFromCatalog(m)}>
                <span className="mono" style={{ color: 'var(--accent)', width: 110 }}>{m.code}</span>
                <span style={{ flex: 1, color: 'var(--fg-1)' }}>{m.name}</span>
                <Chip kind={m.cat === '工資' ? 'info' : 'dim'}>{m.cat}</Chip>
                <span className="mono" style={{ width: 90, textAlign: 'right', color: 'var(--fg-1)' }}>{fmt(m.price)}</span>
                <span className="mono row-sub" style={{ width: 40, textAlign: 'right' }}>/{m.unit}</span>
              </button>
            ))}
            {filtered.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: 'var(--fg-3)' }}>無符合項目</div>}
          </div>
        </>
      )}

      {mode === 'custom' && (
        <>
          <div className="quote-meta-grid">
            <Field label="項目名稱 · NAME">
              <Input value={custom.name} onChange={e => setCustom({ ...custom, name: e.target.value })} placeholder="開關面板 2P" autoFocus />
            </Field>
            <Field label="類別 · CATEGORY">
              <Select value={custom.cat} onChange={v => setCustom({ ...custom, cat: v })} options={[
                { value: '配電', label: '配電' },
                { value: '電線', label: '電線' },
                { value: '管材', label: '管材' },
                { value: '工資', label: '工資' },
                { value: '雜項', label: '雜項' },
              ]}/>
            </Field>
            <Field label="單位 · UNIT">
              <Input value={custom.unit} onChange={e => setCustom({ ...custom, unit: e.target.value })} />
            </Field>
            <Field label="數量 · QTY">
              <Input type="number" value={custom.qty} onChange={e => setCustom({ ...custom, qty: e.target.value })} />
            </Field>
            <Field label="單價 · UNIT PRICE">
              <Input type="number" value={custom.price} onChange={e => setCustom({ ...custom, price: e.target.value })} />
            </Field>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button variant="ghost" onClick={onClose}>取消</Button>
            <Button variant="primary" icon="plus" onClick={addCustom}>加入工項</Button>
          </div>
        </>
      )}
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────
export function Dashboard({ cases, invoices = [], onOpenCase, onNewCase, onBuildQuote }) {
  const activeCases = cases.filter(c => c.status === 'active');
  const monthKey = todayISO().slice(0, 7);
  const paidThisMonth = invoices.filter(v => v.paidAt && v.paidAt.slice(0, 7) === monthKey);
  const unpaid = invoices.filter(v => v.status !== 'ok');
  const overdueCount = invoices.filter(v => v.status === 'alert').length;
  const sum = (list) => list.reduce((s, v) => s + v.amount, 0);
  return (
    <div className="screen" data-screen-label="Dashboard">
      <div className="screen-header">
        <h1 className="screen-title">主控台 // COMMAND</h1>
        <div className="screen-actions">
          <Button variant="ghost" icon="plus" onClick={onNewCase}>新增案件</Button>
          <Button variant="primary" icon="file-plus" onClick={onBuildQuote}>建立報價</Button>
        </div>
      </div>
      <div className="metric-grid">
        <Panel title="本月收款" meta="LIVE" accent>
          <Metric label="RECEIVED" value={fmt(sum(paidThisMonth))} sub={`${paidThisMonth.length} 張`} />
        </Panel>
        <Panel title="進行中案件" meta="LIVE">
          <Metric label="ACTIVE CASES" value={activeCases.length} accent delta={`▲ ${cases.filter(c=>c.status==='warn').length} 待確認 · ${cases.filter(c=>c.status==='alert').length} 逾期`} deltaKind="warn" />
        </Panel>
        <Panel title="待收款項" meta="RECEIVABLE">
          <Metric label="UNPAID" value={fmt(sum(unpaid))} sub={`${unpaid.length} 張`} delta={overdueCount ? `${overdueCount} 張逾期` : '無逾期'} deltaKind={overdueCount ? 'alert' : 'ok'} />
        </Panel>
        <Panel title="本月工時" meta="LOG">
          <Metric label="LABOR HOURS" value="214.5" sub="HR · 3 師傅" delta="▲ 效率 94%" />
        </Panel>
      </div>
      <div className="two-col">
        <Panel title="最近案件" meta={`${cases.length} RECORDS · LIVE`}>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr><th>CASE</th><th>業主 / 名稱</th><th>狀態</th><th style={{ textAlign: 'right' }}>金額</th><th style={{ textAlign: 'right' }}>更新</th></tr>
              </thead>
              <tbody>
                {cases.slice(0, 6).map((c, i) => (
                  <tr key={c.id} className={i === 0 ? 'row-active' : ''} onClick={() => onOpenCase(c)}>
                    <td className="mono">{c.id}</td>
                    <td><div>{c.name}</div><div className="row-sub">{c.client}</div></td>
                    <td><Chip kind={c.status}>{c.statusLabel}</Chip></td>
                    <td className="mono" style={{ textAlign: 'right' }}>{fmt(c.amount)}</td>
                    <td className="mono row-sub" style={{ textAlign: 'right' }}>{c.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <div className="stack">
          <Panel title="系統狀態" meta="TELEMETRY">
            <div className="tele-list">
              <div className="tele-row"><span className="tele-lbl">節點連線</span><span className="tele-bar"><span className="tele-fill" style={{ width: '94%', background: 'var(--ok)' }} /></span><span className="tele-v">94%</span></div>
              <div className="tele-row"><span className="tele-lbl">本月達成率</span><span className="tele-bar"><span className="tele-fill" style={{ width: '72%' }} /></span><span className="tele-v">72%</span></div>
              <div className="tele-row"><span className="tele-lbl">材料庫存</span><span className="tele-bar"><span className="tele-fill" style={{ width: '38%', background: 'var(--warn)' }} /></span><span className="tele-v">38%</span></div>
              <div className="tele-row"><span className="tele-lbl">請款回收</span><span className="tele-bar"><span className="tele-fill" style={{ width: '81%' }} /></span><span className="tele-v">81%</span></div>
            </div>
          </Panel>
          <Panel title="今日排程" meta="3 TASKS">
            <ul className="task-list">
              <li><span className="task-time mono">09:00</span><span className="task-lbl">新莊 · 冷氣配線現勘</span><Chip kind="info">現勘</Chip></li>
              <li><span className="task-time mono">13:30</span><span className="task-lbl">文心飯店機房驗收</span><Chip kind="alert">逾期</Chip></li>
              <li><span className="task-time mono">16:00</span><span className="task-lbl">大明商辦報價複核</span><Chip kind="warn">待確認</Chip></li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CASE LIST
// ─────────────────────────────────────────────────────────────
export function CaseList({ cases, onOpenCase, onNewCase }) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() =>
    cases.filter(c => c.name.includes(q) || c.id.includes(q) || c.client.includes(q)),
  [q, cases]);
  return (
    <div className="screen" data-screen-label="Cases">
      <div className="screen-header">
        <h1 className="screen-title">案件列表 // CASES</h1>
        <div className="screen-actions">
          <div className="searchbar">
            <Icon name="search" size={14} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="SEARCH · 案件 / 業主" />
            <span className="mono-label" style={{ color: 'var(--fg-3)' }}>{filtered.length}/{cases.length}</span>
          </div>
          <Button variant="primary" icon="plus" onClick={onNewCase}>新增案件</Button>
        </div>
      </div>
      <Panel title={`CASES · ${filtered.length} RECORDS`} meta="FULL INDEX">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr><th>CASE</th><th>名稱 / 業主</th><th>地區</th><th>進度</th><th>狀態</th><th style={{ textAlign: 'right' }}>金額</th></tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} onClick={() => onOpenCase(c)}>
                  <td className="mono">{c.id}</td>
                  <td><div>{c.name}</div><div className="row-sub">{c.client}</div></td>
                  <td className="row-sub mono">{c.location}</td>
                  <td>
                    <div className="progress-mini"><span className="progress-fill" style={{ width: c.progress + '%', background: c.status === 'alert' ? 'var(--alert)' : c.status === 'warn' ? 'var(--warn)' : c.progress === 100 ? 'var(--ok)' : 'var(--accent)' }} /></div>
                    <span className="mono row-sub">{c.progress}%</span>
                  </td>
                  <td><Chip kind={c.status}>{c.statusLabel}</Chip></td>
                  <td className="mono" style={{ textAlign: 'right' }}>{fmt(c.amount)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--fg-3)', padding: 32 }}>無符合案件</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// QUOTES LIST
// ─────────────────────────────────────────────────────────────
// 逾期未簽：送出後超過有效期仍未簽回
const effQuoteStatus = (q) =>
  q.status === 'warn' && q.validAt && q.validAt < todayISO() ? 'alert' : q.status;
const effQuoteLabel = (q) => (effQuoteStatus(q) === 'alert' ? '逾期未簽' : q.statusLabel);

// 已簽回報價 → 轉請款單
function ConvertModal({ quote, onClose, onConvert }) {
  const remaining = Math.max(0, quote.amount - (quote.invoicedAmount || 0));
  const stageOptions = [
    { value: '第一期 · 訂金 50%', amt: Math.min(Math.round(quote.amount * 0.5), remaining) },
    { value: '第二期 · 完工款', amt: remaining },
    { value: '全額 · 一次付清', amt: remaining },
    { value: '追加工程款', amt: 0 },
  ];
  const [stage, setStage] = useState(quote.invoicedCount > 0 ? '第二期 · 完工款' : '第一期 · 訂金 50%');
  const [amount, setAmount] = useState(() => {
    const opt = stageOptions.find(o => o.value === (quote.invoicedCount > 0 ? '第二期 · 完工款' : '第一期 · 訂金 50%'));
    return opt ? opt.amt : remaining;
  });
  const [due, setDue] = useState(addDays(todayISO(), 30));
  const pickStage = (v) => {
    setStage(v);
    const opt = stageOptions.find(o => o.value === v);
    if (opt && opt.amt > 0) setAmount(opt.amt);
  };
  const submit = () => {
    if (!+amount) return;
    onConvert(quote, { stage, amount: +amount, dueAt: due });
    onClose();
  };
  return (
    <Modal
      open onClose={onClose}
      title="轉開請款單 · QUOTE → INVOICE" meta={quote.id} width={560}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>取消</Button>
          <Button variant="primary" icon="check" onClick={submit}>開立請款</Button>
        </>
      }
    >
      <div className="quote-meta-grid">
        <Field label="案件 · CASE">
          <Input value={`${quote.caseId} ${quote.case}`} disabled />
        </Field>
        <Field label="期別 · STAGE">
          <Select value={stage} onChange={pickStage} options={stageOptions.map(o => ({ value: o.value, label: o.value }))} />
        </Field>
        <Field label="請款金額 · AMOUNT" helper={`報價 ${fmt(quote.amount)} · 已請款 ${fmt(quote.invoicedAmount || 0)} · 未請款 ${fmt(remaining)}`}>
          <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        </Field>
        <Field label="付款期限 · DUE">
          <Input type="date" value={due} onChange={e => setDue(e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
}

export function QuotesList({ quotes = [], onNewQuote, onOpenQuote, onSign, onConvert }) {
  const [converting, setConverting] = useState(null);
  const monthKey = todayISO().slice(0, 7);
  const sorted = [...quotes].sort((a, b) => (b.issuedAt || '').localeCompare(a.issuedAt || ''));
  const issuedThisMonth = quotes.filter(q => q.issuedAt && q.issuedAt.slice(0, 7) === monthKey);
  const pending = quotes.filter(q => effQuoteStatus(q) === 'warn');
  const overdue = quotes.filter(q => effQuoteStatus(q) === 'alert');
  const signed = quotes.filter(q => q.status === 'ok');
  const sum = (list) => list.reduce((s, q) => s + q.amount, 0);

  return (
    <div className="screen" data-screen-label="Quotes">
      <div className="screen-header">
        <h1 className="screen-title">報價單 // QUOTES</h1>
        <div className="screen-actions">
          <Button variant="primary" icon="file-plus" onClick={onNewQuote}>建立報價</Button>
        </div>
      </div>
      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Panel title="本月開立" meta="ISSUED"><Metric label="ISSUED" value={issuedThisMonth.length} accent sub="張" /></Panel>
        <Panel title="待業主簽回" meta="PENDING"><Metric label="AWAITING" value={pending.length} sub={fmt(sum(pending))} delta={pending.length ? '等待簽回' : '無待簽'} deltaKind="warn" /></Panel>
        <Panel title="已簽回金額" meta="APPROVED"><Metric label="SIGNED" value={fmt(sum(signed))} sub={`${signed.length} 張`} /></Panel>
        <Panel title="逾期未簽" meta="OVERDUE"><Metric label="OVERDUE" value={overdue.length} delta={overdue.length ? '需聯絡業主' : '無逾期'} deltaKind={overdue.length ? 'alert' : 'ok'} /></Panel>
      </div>
      <Panel title="報價單紀錄" meta={`${quotes.length} DOCS`}>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr><th>QUOTE</th><th>案件</th><th>版本</th><th>狀態</th><th>開立</th><th>有效</th><th>簽回</th><th style={{ textAlign: 'right' }}>金額</th><th style={{ textAlign: 'right' }}>操作</th></tr>
            </thead>
            <tbody>
              {sorted.map(q => {
                const st = effQuoteStatus(q);
                const remaining = q.amount - (q.invoicedAmount || 0);
                return (
                  <tr key={q.id} onClick={() => onOpenQuote(q)}>
                    <td className="mono">{q.id}</td>
                    <td><div>{q.case}</div><div className="row-sub mono">{q.caseId}</div></td>
                    <td><Chip kind="dim" code>{q.version}</Chip></td>
                    <td><Chip kind={st}>{effQuoteLabel(q)}</Chip></td>
                    <td className="row-sub mono">{fmtMD(q.issuedAt)}</td>
                    <td className="row-sub mono" style={{ color: st === 'alert' ? 'var(--alert)' : undefined }}>{fmtMD(q.validAt)}</td>
                    <td className="row-sub mono" style={{ color: q.signedAt ? 'var(--ok)' : undefined }}>{fmtMD(q.signedAt)}</td>
                    <td className="mono" style={{ textAlign: 'right' }}>{fmt(q.amount)}</td>
                    <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                      {q.status === 'info' && (
                        <button className="btn btn-solid btn-sm" onClick={() => onOpenQuote(q)}>
                          <Icon name="pencil" size={12} /><span>繼續編輯</span>
                        </button>
                      )}
                      {(st === 'warn' || st === 'alert') && (
                        <button className="btn btn-solid btn-sm" onClick={() => onSign(q.id)}>
                          <Icon name="check" size={12} /><span>業主簽回</span>
                        </button>
                      )}
                      {q.status === 'ok' && remaining > 0 && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          {q.invoicedCount > 0 && <span className="mono-label" style={{ color: 'var(--fg-3)' }}>已開 {q.invoicedCount} 期</span>}
                          <button className="btn btn-primary btn-sm" onClick={() => setConverting(q)}>
                            <Icon name="receipt" size={12} /><span>轉請款</span>
                          </button>
                        </div>
                      )}
                      {q.status === 'ok' && remaining <= 0 && (
                        <span className="mono-label" style={{ color: 'var(--ok)' }}>已全額請款</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {quotes.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--fg-3)', padding: 32 }}>尚無報價單</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
      {converting && <ConvertModal quote={converting} onClose={() => setConverting(null)} onConvert={onConvert} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MATERIALS
// ─────────────────────────────────────────────────────────────
// 品項表單（新增／編輯共用）— 代碼可留空自動編號；編輯時代碼鎖定
const CODE_PREFIX = { '配電': 'PWR', '電線': 'WIRE', '管材': 'PIPE', '工資': 'LBR', '雜項': 'MISC' };

function MaterialModal({ onClose, onSubmit, materials, editing = null }) {
  const blank = editing
    ? { code: editing.code, name: editing.name, cat: editing.cat, unit: editing.unit, price: String(editing.price), stock: typeof editing.stock === 'number' ? String(editing.stock) : '' }
    : { code: '', name: '', cat: '配電', unit: '個', price: '', stock: '' };
  const [form, setForm] = useState(blank);
  const [err, setErr] = useState({});
  const isLabor = form.cat === '工資';

  const pickCat = (v) => setForm({ ...form, cat: v, unit: v === '工資' ? '工時' : form.unit === '工時' ? '個' : form.unit });

  const autoCode = () => {
    const prefix = CODE_PREFIX[form.cat] || 'ITM';
    let n = materials.filter(m => m.code.startsWith(prefix + '-')).length + 1;
    while (materials.some(m => m.code === `${prefix}-${String(n).padStart(3, '0')}`)) n++;
    return `${prefix}-${String(n).padStart(3, '0')}`;
  };

  const submit = () => {
    const e = {};
    if (!form.name.trim()) e.name = '請輸入品名';
    if (!(+form.price > 0)) e.price = '請輸入單價';
    const code = editing ? editing.code : (form.code.trim().toUpperCase() || autoCode());
    if (!editing && materials.some(m => m.code === code)) e.code = '代碼已存在';
    if (!isLabor && form.stock !== '' && +form.stock < 0) e.stock = '庫存不可為負';
    setErr(e);
    if (Object.keys(e).length) return;
    onSubmit({
      code,
      name: form.name.trim(),
      cat: form.cat,
      unit: form.unit.trim() || (isLabor ? '工時' : '個'),
      price: +form.price,
      stock: isLabor ? '—' : (+form.stock || 0),
    });
    onClose();
  };

  return (
    <Modal
      open onClose={onClose}
      title={editing ? '編輯品項 · EDIT SKU' : '新增品項 · NEW SKU'} meta={editing ? editing.code : 'CATALOG'} width={560}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>取消</Button>
          <Button variant="primary" icon="check" onClick={submit}>{editing ? '儲存變更' : '加入材料庫'}</Button>
        </>
      }
    >
      <div className="quote-meta-grid">
        <Field label="品名 · NAME" error={err.name}>
          <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="無熔絲開關 NFB 2P 20A" autoFocus />
        </Field>
        <Field label="類別 · CATEGORY">
          <Select value={form.cat} onChange={pickCat} options={['配電','電線','管材','工資','雜項'].map(c => ({ value: c, label: c }))} />
        </Field>
        <Field label="代碼 · CODE" error={err.code} helper={editing ? '代碼不可變更' : form.code.trim() ? '' : `留空自動編號：${autoCode()}`}>
          <Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="NFB-2P-20" className="input mono" disabled={!!editing} />
        </Field>
        <Field label="單位 · UNIT">
          <Input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder={isLabor ? '工時' : '個'} />
        </Field>
        <Field label="單價 · UNIT PRICE" error={err.price}>
          <Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="450" inputMode="numeric" />
        </Field>
        {!isLabor && (
          <Field label={editing ? '庫存 · STOCK' : '期初庫存 · STOCK'} error={err.stock} helper={editing ? '手動修正；日常增減請用進出貨' : '選填，預設 0'}>
            <Input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0" inputMode="numeric" />
          </Field>
        )}
      </div>
    </Modal>
  );
}

// 進出貨 — 進貨入庫 / 領料出庫，套用後自動增減庫存
function MovementModal({ onClose, onMove, materials, cases }) {
  const stockItems = materials.filter(m => typeof m.stock === 'number');
  const [type, setType] = useState('in');
  const [code, setCode] = useState(stockItems[0]?.code || '');
  const [qty, setQty] = useState('');
  const [caseId, setCaseId] = useState('');
  const [note, setNote] = useState('');
  const [err, setErr] = useState({});
  const item = stockItems.find(m => m.code === code);

  const submit = () => {
    const e = {};
    if (!item) e.code = '請選擇品項';
    if (!(+qty > 0)) e.qty = '請輸入數量';
    if (item && type === 'out' && +qty > item.stock) e.qty = `庫存僅剩 ${item.stock} ${item.unit}`;
    setErr(e);
    if (Object.keys(e).length) return;
    const caseName = cases.find(c => c.id === caseId)?.name || '';
    onMove({
      id: `M-${Date.now()}`,
      date: todayISO(),
      code: item.code, name: item.name, unit: item.unit,
      type, qty: +qty,
      note: [caseName, note.trim()].filter(Boolean).join(' · ') || (type === 'in' ? '進貨' : '領料'),
    });
    onClose();
  };

  return (
    <Modal
      open onClose={onClose}
      title="進出貨 · STOCK MOVEMENT" meta={type === 'in' ? 'INBOUND' : 'OUTBOUND'} width={560}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>取消</Button>
          <Button variant="primary" icon="check" onClick={submit}>{type === 'in' ? '登記進貨' : '登記領料'}</Button>
        </>
      }
    >
      <div className="mode-tabs">
        <button className={`mode-tab ${type === 'in' ? 'active' : ''}`} onClick={() => setType('in')}>進貨入庫</button>
        <button className={`mode-tab ${type === 'out' ? 'active' : ''}`} onClick={() => setType('out')}>領料出庫</button>
      </div>
      <div className="quote-meta-grid">
        <Field label="品項 · SKU" error={err.code}>
          <Select value={code} onChange={setCode} options={stockItems.map(m => ({ value: m.code, label: `${m.code} ${m.name}` }))} />
        </Field>
        <Field label="數量 · QTY" error={err.qty} helper={item ? `目前庫存 ${item.stock} ${item.unit}` : ''}>
          <Input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="0" inputMode="numeric" autoFocus />
        </Field>
        {type === 'out' && (
          <Field label="用於案件 · CASE" helper="選填">
            <Select value={caseId} onChange={setCaseId} options={[{ value: '', label: '— 不指定 —' }, ...cases.map(c => ({ value: c.id, label: `${c.id} ${c.name}` }))]} />
          </Field>
        )}
        <Field label={type === 'in' ? '廠商／備註 · NOTE' : '備註 · NOTE'} helper="選填">
          <Input value={note} onChange={e => setNote(e.target.value)} placeholder={type === 'in' ? '全成建材' : '3F 配電箱'} />
        </Field>
      </div>
    </Modal>
  );
}

export function MaterialsScreen({ materials = MATERIALS, cases = [], moves = [], onAdd, onUpdate, onDelete, onMove }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [moveOpen, setMoveOpen] = useState(false);

  const removeItem = (m) => {
    if (!confirm(`從材料庫刪除「${m.name}」(${m.code})？`)) return;
    onDelete(m.code);
  };
  const filtered = materials.filter(m =>
    (cat === 'all' || m.cat === cat) && (m.name.includes(q) || m.code.includes(q))
  );
  const stockItems = materials.filter(m => typeof m.stock === 'number');
  const totalValue = stockItems.reduce((s, m) => s + m.stock * m.price, 0);

  // 分類儀表板統計（不含工資 — 工資無庫存價值）
  const catStats = MATERIAL_CATS.map(c => {
    const list = stockItems.filter(m => m.cat === c.name);
    const value = list.reduce((s, m) => s + m.stock * m.price, 0);
    return { ...c, skus: list.length, value, pct: totalValue ? Math.round(value / totalValue * 100) : 0 };
  });
  // conic-gradient 環圖分段
  let acc = 0;
  const donutStops = catStats.map(c => {
    const from = acc;
    acc += totalValue ? (c.value / totalValue) * 100 : 0;
    return `${c.color} ${from}% ${acc}%`;
  }).join(', ');
  const maxStock = Math.max(...stockItems.map(m => m.stock), 1);

  return (
    <div className="screen" data-screen-label="Materials">
      <div className="screen-header">
        <h1 className="screen-title">材料庫 // MATERIALS</h1>
        <div className="screen-actions">
          <Button variant="ghost" icon="arrow-left-right" onClick={() => setMoveOpen(true)}>進出貨</Button>
          <Button variant="primary" icon="plus" onClick={() => setAddOpen(true)}>新增品項</Button>
        </div>
      </div>
      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Panel title="品項總數" meta="CATALOG" accent><Metric label="SKUS" value={materials.length} accent /></Panel>
        <Panel title="庫存價值" meta="VALUE"><Metric label="ON-HAND" value={fmt(totalValue)} /></Panel>
        <Panel title="低庫存" meta="< 10"><Metric label="LOW STOCK" value={stockItems.filter(m => m.stock > 0 && m.stock < 10).length} delta="建議補貨" deltaKind="warn" /></Panel>
        <Panel title="缺貨" meta="ZERO"><Metric label="OUT" value={stockItems.filter(m => m.stock === 0).length} delta="立即補貨" deltaKind="alert" /></Panel>
      </div>

      <div className="two-col">
        <Panel title="庫存水位" meta="STOCK LEVEL · 缺貨紅 · 低庫存黃">
          <div className="stock-list">
            {stockItems.map(m => {
              const out = m.stock === 0;
              const low = !out && m.stock < 10;
              const w = Math.max((m.stock / maxStock) * 100, out ? 0 : 2);
              return (
                <div key={m.code} className="stock-row">
                  <span className="mono stock-code">{m.code}</span>
                  <span className="stock-name">{m.name}</span>
                  <span className="tele-bar">
                    <span className="tele-fill" style={{ width: w + '%', background: out ? 'var(--alert)' : low ? 'var(--warn)' : 'var(--accent)' }} />
                  </span>
                  <span className="mono stock-v" style={{ color: out ? 'var(--alert)' : low ? 'var(--warn)' : 'var(--fg-1)' }}>
                    {m.stock} {m.unit}{out ? ' · 缺' : low ? ' · 低' : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="分類價值佔比" meta="BY CATEGORY">
          <div className="donut-wrap">
            <div className="donut" style={{ background: `conic-gradient(${donutStops})` }}>
              <div className="donut-center">
                <span className="mono-label" style={{ color: 'var(--fg-3)' }}>TOTAL</span>
                <span className="donut-total mono">{Math.round(totalValue / 1000)}K</span>
              </div>
            </div>
            <ul className="donut-legend">
              {catStats.map(c => (
                <li key={c.name}>
                  <span className="dot-sq" style={{ background: c.color }} />
                  <span className="donut-cat">{c.name}</span>
                  <span className="mono row-sub">{c.skus} 項</span>
                  <span className="mono donut-val">{fmt(c.value)}</span>
                  <span className="mono" style={{ color: 'var(--accent)' }}>{c.pct}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      <Panel title={`CATALOG · ${filtered.length} SKUS`} meta="LIVE">
        <div className="materials-toolbar" style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center' }}>
          <div className="searchbar" style={{ flex: 1 }}>
            <Icon name="search" size={14} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="SEARCH · 品項 / 代碼" style={{ width: '100%' }}/>
          </div>
          <div className="cat-tabs">
            {['all','配電','電線','管材','工資'].map(c => (
              <button key={c} className={`cat-tab ${cat===c?'active':''}`} onClick={() => setCat(c)}>{c==='all'?'全部':c}</button>
            ))}
          </div>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr><th>CODE</th><th>品名</th><th style={{ fontSize: 12 }}>類別</th><th style={{ fontSize: 12 }}>單位</th><th style={{ textAlign: 'right', fontSize: 12 }}>單價</th><th style={{ textAlign: 'right', fontSize: 12 }}>庫存</th><th style={{ textAlign: 'right', fontSize: 12 }}>庫存值</th><th style={{ textAlign: 'right', fontSize: 12 }}>操作</th></tr>
            </thead>
            <tbody>
              {filtered.map(m => {
                const low = typeof m.stock === 'number' && m.stock < 10;
                const out = m.stock === 0;
                return (
                  <tr key={m.code}>
                    <td className="mono">{m.code}</td>
                    <td>{m.name}</td>
                    <td><Chip kind={m.cat === '工資' ? 'info' : 'dim'}>{m.cat}</Chip></td>
                    <td className="row-sub mono">{m.unit}</td>
                    <td className="mono" style={{ textAlign: 'right' }}>{fmt(m.price)}</td>
                    <td className="mono" style={{ textAlign: 'right', color: out ? 'var(--alert)' : low ? 'var(--warn)' : 'var(--fg-1)' }}>
                      {m.stock}{out && ' · 缺貨'}{low && !out && ' · 低'}
                    </td>
                    <td className="mono" style={{ textAlign: 'right', color: 'var(--accent)' }}>
                      {typeof m.stock === 'number' ? fmt(m.stock * m.price) : '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button className="icon-btn" title="編輯" onClick={() => setEditing(m)}><Icon name="pencil" size={13} /></button>
                        <button className="icon-btn" title="刪除" onClick={() => removeItem(m)}><Icon name="trash-2" size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="進出貨紀錄" meta={`STOCK MOVEMENTS · ${moves.length} 筆`}>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr><th>日期</th><th>品項</th><th style={{ fontSize: 12 }}>類型</th><th style={{ textAlign: 'right', fontSize: 12 }}>數量</th><th style={{ fontSize: 12 }}>案件／備註</th></tr>
            </thead>
            <tbody>
              {[...moves].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 10).map(mv => (
                <tr key={mv.id}>
                  <td className="row-sub mono">{mv.date?.slice(5).replace('-', '/')}</td>
                  <td><div>{mv.name}</div><div className="row-sub mono">{mv.code}</div></td>
                  <td><Chip kind={mv.type === 'in' ? 'ok' : 'info'}>{mv.type === 'in' ? '進貨' : '領料'}</Chip></td>
                  <td className="mono" style={{ textAlign: 'right', color: mv.type === 'in' ? 'var(--ok)' : 'var(--fg-1)' }}>
                    {mv.type === 'in' ? '+' : '−'}{mv.qty} {mv.unit}
                  </td>
                  <td className="row-sub">{mv.note || '—'}</td>
                </tr>
              ))}
              {moves.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--fg-3)', padding: 24 }}>尚無進出貨紀錄</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {addOpen && <MaterialModal onClose={() => setAddOpen(false)} onSubmit={onAdd} materials={materials} />}
      {editing && <MaterialModal onClose={() => setEditing(null)} onSubmit={(item) => onUpdate(editing.code, item)} materials={materials} editing={editing} />}
      {moveOpen && <MovementModal onClose={() => setMoveOpen(false)} onMove={onMove} materials={materials} cases={cases} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// REPORTS
// ─────────────────────────────────────────────────────────────
const RANGE_MONTHS = { '3m': 3, '6m': 6, '1y': 12 };

// 近 n 個月的月份桶（endOffset 往前平移，用於「前期」比較），key = 'YYYY-MM'
function lastMonths(n, endOffset = 0) {
  const now = new Date();
  const arr = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i - endOffset, 1);
    arr.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: `${String(d.getMonth() + 1).padStart(2, '0')}月`,
    });
  }
  return arr;
}

const inMonth = (iso, key) => !!iso && iso.slice(0, 7) === key;
const sumAmt = (list) => list.reduce((s, v) => s + v.amount, 0);

export function ReportsScreen({ cases = [], invoices = [] }) {
  const [range, setRange] = useState('6m');
  const n = RANGE_MONTHS[range];

  // 每月統計：已收款（依收款日）、開立請款（依開立日）
  const months = lastMonths(n).map(m => ({
    ...m,
    paid: sumAmt(invoices.filter(v => inMonth(v.paidAt, m.key))),
    issued: sumAmt(invoices.filter(v => inMonth(v.issuedAt, m.key))),
  }));
  const paidTotal = months.reduce((s, m) => s + m.paid, 0);
  const issuedInRange = invoices.filter(v => months.some(m => inMonth(v.issuedAt, m.key)));
  const issuedTotal = sumAmt(issuedInRange);
  const unpaidCount = issuedInRange.filter(v => v.status !== 'ok').length;
  const collectRate = issuedTotal ? Math.round(paidTotal / issuedTotal * 100) : 0;

  // 與前一段等長期間比較（沒有更早資料時不顯示）
  const prevPaid = lastMonths(n, n).reduce((s, m) =>
    s + sumAmt(invoices.filter(v => inMonth(v.paidAt, m.key))), 0);
  const paidDelta = prevPaid > 0 ? (paidTotal - prevPaid) / prevPaid * 100 : null;

  const doneCases = cases.filter(c => c.progress === 100 || c.status === 'ok').length;
  const completion = cases.length ? Math.round(doneCases / cases.length * 100) : 0;

  // 業主分佈：期間內開立請款金額，前 4 名 + 其他
  const byClient = {};
  issuedInRange.forEach(v => { byClient[v.client] = (byClient[v.client] || 0) + v.amount; });
  const clientsSorted = Object.entries(byClient).sort((a, b) => b[1] - a[1]);
  const restSum = clientsSorted.slice(4).reduce((s, [, v]) => s + v, 0);
  const clientDist = [
    ...clientsSorted.slice(0, 4).map(([name, value]) => ({ name, value })),
    ...(restSum > 0 ? [{ name: `其他 ${clientsSorted.length - 4} 家`, value: restSum }] : []),
  ];

  // 案件狀態分析（全部案件，依合約金額）
  const statusGroups = [
    { name: '進行中', key: 'active' },
    { name: '待確認', key: 'warn' },
    { name: '逾期', key: 'alert' },
    { name: '已完工', key: 'ok' },
  ].map(g => {
    const list = cases.filter(c => c.status === g.key);
    return { ...g, count: list.length, amt: list.reduce((s, c) => s + c.amount, 0) };
  });
  const caseAmtTotal = statusGroups.reduce((s, g) => s + g.amt, 0) || 1;

  const maxVal = Math.max(...months.map(m => Math.max(m.paid, m.issued)), 1);

  return (
    <div className="screen" data-screen-label="Reports">
      <div className="screen-header">
        <h1 className="screen-title">營運報表 // REPORTS</h1>
        <div className="screen-actions">
          <div className="cat-tabs">
            {[['3m','近 3 月'],['6m','近 6 月'],['1y','近一年']].map(([v,l]) => (
              <button key={v} className={`cat-tab ${range===v?'active':''}`} onClick={() => setRange(v)}>{l}</button>
            ))}
          </div>
          <Button variant="ghost" icon="download">匯出 PDF</Button>
        </div>
      </div>

      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Panel title="期間已收款" meta="RECEIVED" accent>
          <Metric label="TOTAL" value={fmt(paidTotal)}
            delta={paidDelta !== null ? `${paidDelta >= 0 ? '▲ +' : '▼ '}${paidDelta.toFixed(1)}% · 較前期` : undefined}
            deltaKind={paidDelta !== null && paidDelta < 0 ? 'warn' : 'ok'} />
        </Panel>
        <Panel title="期間開立請款" meta="ISSUED">
          <Metric label="TOTAL" value={fmt(issuedTotal)} sub={`${issuedInRange.length} 張`} />
        </Panel>
        <Panel title="回收率" meta="COLLECTED">
          <Metric label="RATE" value={collectRate + '%'} accent
            delta={unpaidCount ? `${unpaidCount} 張未收` : '全數收訖'}
            deltaKind={unpaidCount ? 'warn' : 'ok'} />
        </Panel>
        <Panel title="案件完成率" meta="RATE">
          <Metric label="COMPLETION" value={completion + '%'} sub={`${doneCases}/${cases.length} 案`} />
        </Panel>
      </div>

      <div className="two-col">
        <Panel title="月收款對比" meta={`已收款 · 開立請款 · 千元 · ${months.length} 個月`}>
          <div className="chart-wrap">
            <div className="chart-bars" style={{ gridTemplateColumns: `repeat(${months.length}, 1fr)` }}>
              {months.map(m => {
                const hP = (m.paid / maxVal) * 100;
                const hI = (m.issued / maxVal) * 100;
                return (
                  <div key={m.key} className="bar-group" title={`${m.label} · 已收 ${Math.round(m.paid/1000)}K / 開立 ${Math.round(m.issued/1000)}K`}>
                    <div className="bar-pair">
                      <span className="bar bar-rev" style={{ height: hP + '%' }}>
                        {m.paid > 0 && <span className="bar-v mono">{Math.round(m.paid / 1000)}</span>}
                      </span>
                      <span className="bar bar-cost" style={{ height: hI + '%' }} />
                    </div>
                    <span className="bar-label mono">{m.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="chart-legend">
              <span className="legend-item"><span className="dot-sq" style={{ background: 'var(--accent)' }} />已收款</span>
              <span className="legend-item"><span className="dot-sq" style={{ background: 'var(--fg-4)' }} />開立請款</span>
            </div>
          </div>
        </Panel>

        <Panel title="業主分佈" meta="期間請款 · TOP CLIENTS">
          <ul className="dist-list">
            {clientDist.map((c, i) => {
              const pct = issuedTotal ? Math.round(c.value / issuedTotal * 100) : 0;
              return (
                <li key={c.name}>
                  <div className="dist-hd">
                    <span className="mono-label" style={{ color: 'var(--fg-4)' }}>{String(i+1).padStart(2,'0')}</span>
                    <span style={{ flex: 1, fontFamily: 'var(--font-tc)', color: 'var(--fg-1)' }}>{c.name}</span>
                    <span className="mono" style={{ color: 'var(--accent)' }}>{fmt(c.value)}</span>
                  </div>
                  <div className="dist-bar"><span className="dist-fill" style={{ width: pct + '%' }} /></div>
                  <span className="mono row-sub">{pct}%</span>
                </li>
              );
            })}
            {clientDist.length === 0 && (
              <li style={{ color: 'var(--fg-3)', padding: 16, textAlign: 'center' }}>期間內無請款紀錄</li>
            )}
          </ul>
        </Panel>
      </div>

      <Panel title="案件狀態分析" meta="BY STATUS · 合約金額">
        <div className="cat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {statusGroups.map(g => {
            const pct = Math.round(g.amt / caseAmtTotal * 100);
            return (
              <div key={g.key} className="cat-card">
                <div className="mono-label" style={{ color: 'var(--accent)' }}>{g.name} · {g.count} 案</div>
                <div className="num-hd">{pct}%</div>
                <div className="mono row-sub">{fmt(g.amt)}</div>
                <div className="dist-bar" style={{ marginTop: 8 }}><span className="dist-fill" style={{ width: pct + '%' }} /></div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

export function ComingSoon({ label }) {
  return (
    <div className="screen" data-screen-label={label}>
      <div className="screen-header"><h1 className="screen-title">{label}</h1></div>
      <Panel title="MODULE · STANDBY" meta="NOT WIRED">
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--fg-3)' }}>
          <div className="mono-label" style={{ color: 'var(--accent)', marginBottom: 12 }}>⌐ STANDBY ⌐</div>
          <div style={{ fontFamily: 'var(--font-tc)', fontSize: 14 }}>此模組於 UI 套件中尚未實作</div>
        </div>
      </Panel>
    </div>
  );
}
