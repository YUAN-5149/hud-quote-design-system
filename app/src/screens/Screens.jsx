import { useState, useMemo } from 'react';
import { Panel, Metric, Chip, Button, Field, Input, Modal, Select, Icon } from '../components/Primitives.jsx';
import { MATERIALS, QUOTES, MONTHLY, CLIENT_DIST } from '../lib/data.js';
import { fmt } from '../lib/format.js';

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
export function AddLineItemModal({ open, onClose, onAdd }) {
  const [mode, setMode] = useState('catalog'); // 'catalog' | 'custom'
  const [q, setQ] = useState('');
  const [custom, setCustom] = useState({ name: '', cat: '材料', unit: '個', qty: 1, price: 0 });
  const filtered = MATERIALS.filter(m => m.name.includes(q) || m.code.includes(q));

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
    setCustom({ name: '', cat: '材料', unit: '個', qty: 1, price: 0 });
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
            <span className="mono-label" style={{ color: 'var(--fg-3)' }}>{filtered.length}/{MATERIALS.length}</span>
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
                { value: '材料', label: '材料' },
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
export function Dashboard({ cases, onOpenCase, onNewCase, onBuildQuote }) {
  const activeCases = cases.filter(c => c.status === 'active');
  const totalMonth = cases.reduce((s, c) => s + c.amount, 0);
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
        <Panel title="本月收款" meta="2026 · APR" accent>
          <Metric label="TOTAL RECEIVED" value={fmt(totalMonth)} delta="▲ +12.4% · 月增 NT$ 92,800" />
        </Panel>
        <Panel title="進行中案件" meta="LIVE">
          <Metric label="ACTIVE CASES" value={activeCases.length} accent delta={`▲ ${cases.filter(c=>c.status==='warn').length} 待確認 · ${cases.filter(c=>c.status==='alert').length} 逾期`} deltaKind="warn" />
        </Panel>
        <Panel title="待開發票" meta="PENDING">
          <Metric label="TO BE ISSUED" value={fmt(218300)} sub="4 張" delta="7 日內到期" deltaKind="warn" />
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
export function QuotesList({ onOpenQuote }) {
  return (
    <div className="screen" data-screen-label="Quotes">
      <div className="screen-header">
        <h1 className="screen-title">報價單 // QUOTES</h1>
        <div className="screen-actions">
          <Button variant="primary" icon="file-plus" onClick={onOpenQuote}>建立報價</Button>
        </div>
      </div>
      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Panel title="本月開立" meta="APR"><Metric label="ISSUED" value={QUOTES.length} accent sub="張" /></Panel>
        <Panel title="待業主簽回" meta="PENDING"><Metric label="AWAITING" value="1" delta="03:42 已等待" deltaKind="warn" /></Panel>
        <Panel title="已簽回金額" meta="APPROVED"><Metric label="SIGNED" value={fmt(405300)} /></Panel>
        <Panel title="逾期未簽" meta="OVERDUE"><Metric label="OVERDUE" value="1" delta="需聯絡業主" deltaKind="alert" /></Panel>
      </div>
      <Panel title="報價單紀錄" meta={`${QUOTES.length} DOCS`}>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr><th>QUOTE</th><th>案件</th><th>版本</th><th>狀態</th><th>開立</th><th>有效</th><th style={{ textAlign: 'right' }}>金額</th></tr>
            </thead>
            <tbody>
              {QUOTES.map(q => (
                <tr key={q.id} onClick={onOpenQuote}>
                  <td className="mono">{q.id}</td>
                  <td><div>{q.case}</div><div className="row-sub mono">{q.caseId}</div></td>
                  <td><Chip kind="dim" code>{q.version}</Chip></td>
                  <td><Chip kind={q.status}>{q.statusLabel}</Chip></td>
                  <td className="row-sub mono">{q.issued}</td>
                  <td className="row-sub mono">{q.valid}</td>
                  <td className="mono" style={{ textAlign: 'right' }}>{fmt(q.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MATERIALS
// ─────────────────────────────────────────────────────────────
export function MaterialsScreen() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const filtered = MATERIALS.filter(m =>
    (cat === 'all' || m.cat === cat) && (m.name.includes(q) || m.code.includes(q))
  );
  const totalValue = MATERIALS
    .filter(m => typeof m.stock === 'number')
    .reduce((s, m) => s + m.stock * m.price, 0);

  return (
    <div className="screen" data-screen-label="Materials">
      <div className="screen-header">
        <h1 className="screen-title">材料庫 // MATERIALS</h1>
        <div className="screen-actions">
          <Button variant="ghost" icon="download">匯出清單</Button>
          <Button variant="primary" icon="plus">新增品項</Button>
        </div>
      </div>
      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Panel title="品項總數" meta="CATALOG" accent><Metric label="SKUS" value={MATERIALS.length} accent /></Panel>
        <Panel title="庫存價值" meta="VALUE"><Metric label="ON-HAND" value={fmt(totalValue)} /></Panel>
        <Panel title="低庫存" meta="< 10"><Metric label="LOW STOCK" value={MATERIALS.filter(m => typeof m.stock === 'number' && m.stock < 10).length} delta="建議補貨" deltaKind="warn" /></Panel>
        <Panel title="缺貨" meta="ZERO"><Metric label="OUT" value={MATERIALS.filter(m => m.stock === 0).length} delta="立即補貨" deltaKind="alert" /></Panel>
      </div>
      <Panel title={`CATALOG · ${filtered.length} SKUS`} meta="LIVE">
        <div className="materials-toolbar" style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center' }}>
          <div className="searchbar" style={{ flex: 1 }}>
            <Icon name="search" size={14} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="SEARCH · 品項 / 代碼" style={{ width: '100%' }}/>
          </div>
          <div className="cat-tabs">
            {['all','材料','工資'].map(c => (
              <button key={c} className={`cat-tab ${cat===c?'active':''}`} onClick={() => setCat(c)}>{c==='all'?'全部':c}</button>
            ))}
          </div>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr><th>CODE</th><th>品名</th><th style={{ fontSize: 12 }}>類別</th><th style={{ fontSize: 12 }}>單位</th><th style={{ textAlign: 'right', fontSize: 12 }}>單價</th><th style={{ textAlign: 'right', fontSize: 12 }}>庫存</th><th style={{ textAlign: 'right', fontSize: 12 }}>庫存值</th></tr>
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// REPORTS
// ─────────────────────────────────────────────────────────────
export function ReportsScreen() {
  const [range, setRange] = useState('7m');
  const maxVal = Math.max(...MONTHLY.map(m => m.rev));
  const totalRev = MONTHLY.reduce((s,m) => s + m.rev, 0);
  const totalCost = MONTHLY.reduce((s,m) => s + m.cost, 0);
  const margin = ((totalRev - totalCost) / totalRev * 100).toFixed(1);

  return (
    <div className="screen" data-screen-label="Reports">
      <div className="screen-header">
        <h1 className="screen-title">營運報表 // REPORTS</h1>
        <div className="screen-actions">
          <div className="cat-tabs">
            {[['3m','近 3 月'],['7m','近 7 月'],['1y','近一年']].map(([v,l]) => (
              <button key={v} className={`cat-tab ${range===v?'active':''}`} onClick={() => setRange(v)}>{l}</button>
            ))}
          </div>
          <Button variant="ghost" icon="download">匯出 PDF</Button>
        </div>
      </div>

      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Panel title="期間營收" meta="REVENUE" accent><Metric label="TOTAL" value={fmt(totalRev * 1000)} delta="▲ +18.2% 年增" /></Panel>
        <Panel title="期間成本" meta="COST"><Metric label="TOTAL" value={fmt(totalCost * 1000)} delta="▲ +12.4% 年增" deltaKind="warn" /></Panel>
        <Panel title="毛利率" meta="MARGIN"><Metric label="MARGIN" value={margin + '%'} accent delta="▲ +2.1 pt" /></Panel>
        <Panel title="案件完成率" meta="RATE"><Metric label="COMPLETION" value="88%" delta="▲ 高於去年 6 pt" /></Panel>
      </div>

      <div className="two-col">
        <Panel title="月營收對比" meta="REVENUE · COST · 千元">
          <div className="chart-wrap">
            <div className="chart-bars">
              {MONTHLY.map(m => {
                const hR = (m.rev / maxVal) * 100;
                const hC = (m.cost / maxVal) * 100;
                return (
                  <div key={m.m} className="bar-group" title={`${m.m} · 營收 ${m.rev} / 成本 ${m.cost}`}>
                    <div className="bar-pair">
                      <span className="bar bar-rev" style={{ height: hR + '%' }}>
                        <span className="bar-v mono">{m.rev}</span>
                      </span>
                      <span className="bar bar-cost" style={{ height: hC + '%' }} />
                    </div>
                    <span className="bar-label mono">{m.m}</span>
                  </div>
                );
              })}
            </div>
            <div className="chart-legend">
              <span className="legend-item"><span className="dot-sq" style={{ background: 'var(--accent)' }} />營收</span>
              <span className="legend-item"><span className="dot-sq" style={{ background: 'var(--fg-4)' }} />成本</span>
            </div>
          </div>
        </Panel>

        <Panel title="業主分佈" meta="TOP CLIENTS">
          <ul className="dist-list">
            {CLIENT_DIST.map((c, i) => (
              <li key={c.name}>
                <div className="dist-hd">
                  <span className="mono-label" style={{ color: 'var(--fg-4)' }}>{String(i+1).padStart(2,'0')}</span>
                  <span style={{ flex: 1, fontFamily: 'var(--font-tc)', color: 'var(--fg-1)' }}>{c.name}</span>
                  <span className="mono" style={{ color: 'var(--accent)' }}>{fmt(c.value * 1000)}</span>
                </div>
                <div className="dist-bar"><span className="dist-fill" style={{ width: c.pct + '%' }} /></div>
                <span className="mono row-sub">{c.pct}%</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="工項類別分析" meta="BY CATEGORY">
        <div className="cat-grid">
          {[
            { name: '配電 · 強電', pct: 42, amt: 1860 },
            { name: '配管 · 給排水', pct: 28, amt: 1240 },
            { name: '照明安裝', pct: 14, amt: 620 },
            { name: '空調配線', pct: 10, amt: 440 },
            { name: '其他雜項', pct: 6, amt: 264 },
          ].map(c => (
            <div key={c.name} className="cat-card">
              <div className="mono-label" style={{ color: 'var(--accent)' }}>{c.name}</div>
              <div className="num-hd">{c.pct}%</div>
              <div className="mono row-sub">{fmt(c.amt * 1000)}</div>
              <div className="dist-bar" style={{ marginTop: 8 }}><span className="dist-fill" style={{ width: c.pct * 2 + '%' }} /></div>
            </div>
          ))}
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
