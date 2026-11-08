// Screens.jsx — dashboard, case list, quote builder, quotes, materials
const { useState: useStateS, useMemo: useMemoS } = React;

// ─────────────────────────────────────────────────────────────
// CASES (seed)
// ─────────────────────────────────────────────────────────────
const CASES_SEED = [
  { id: '#2025-0418', name: '大明商辦 3F 配電工程', client: '大明建設 · 王協理', status: 'active', statusLabel: '進行中', amount: 128400, updated: '14:32', location: '台北 · 信義', progress: 62 },
  { id: '#2025-0416', name: '信義區吳公館整修', client: '吳先生', status: 'warn', statusLabel: '待確認', amount: 48200, updated: '11:08', location: '台北 · 信義', progress: 24 },
  { id: '#2025-0411', name: '文心飯店地下機房配管', client: '文心國際酒店', status: 'alert', statusLabel: '逾期', amount: 312800, updated: '04/12', location: '台中 · 西屯', progress: 88 },
  { id: '#2025-0409', name: '松山火鍋店冷凍配電', client: '頂鍋食品', status: 'ok', statusLabel: '已付款', amount: 92500, updated: '04/10', location: '台北 · 松山', progress: 100 },
  { id: '#2025-0406', name: '林口集合住宅熱水管線', client: '日盛營造', status: 'active', statusLabel: '進行中', amount: 186700, updated: '04/15', location: '新北 · 林口', progress: 41 },
  { id: '#2025-0402', name: '板橋誠品門市照明更新', client: '誠品生活', status: 'ok', statusLabel: '已付款', amount: 64200, updated: '04/03', location: '新北 · 板橋', progress: 100 },
];

// ─────────────────────────────────────────────────────────────
// MATERIALS CATALOG (used by quote builder + materials screen)
// ─────────────────────────────────────────────────────────────
const MATERIALS = [
  { code: 'NFB-3P-100', name: '無熔絲開關 NFB 3P 100A', cat: '材料', unit: '個', price: 2850, stock: 12 },
  { code: 'NFB-2P-30',  name: '無熔絲開關 NFB 2P 30A',  cat: '材料', unit: '個', price: 680, stock: 34 },
  { code: 'PVC-1-4M',   name: 'PVC 電管 1" × 4m',        cat: '材料', unit: '支', price: 180, stock: 128 },
  { code: 'PVC-3-4-4M', name: 'PVC 電管 3/4" × 4m',      cat: '材料', unit: '支', price: 140, stock: 82 },
  { code: 'PNL-60-80',  name: '配電盤 600×800 烤漆',    cat: '材料', unit: '座', price: 18500, stock: 3 },
  { code: 'WIRE-5-5',   name: '電線 5.5 平方 × 100m',   cat: '材料', unit: '捲', price: 3200, stock: 18 },
  { code: 'WIRE-2-0',   name: '電線 2.0 平方 × 100m',   cat: '材料', unit: '捲', price: 1400, stock: 24 },
  { code: 'PIPE-CU-15', name: '銅管 15A × 3m',           cat: '材料', unit: '支', price: 520, stock: 0 },
  { code: 'LBR-ELEC-S', name: '配管施工 · 資深師傅',    cat: '工資', unit: '工時', price: 1200, stock: '—' },
  { code: 'LBR-ELEC-J', name: '配管施工 · 助手',        cat: '工資', unit: '工時', price: 700, stock: '—' },
  { code: 'LBR-GND',    name: '接地測試 · 現場驗收',    cat: '工資', unit: '式', price: 4500, stock: '—' },
  { code: 'LBR-PLB',    name: '給排水配管施工',          cat: '工資', unit: '工時', price: 1100, stock: '—' },
];

const fmt = (n) => 'NT$ ' + (n || 0).toLocaleString();

// ─────────────────────────────────────────────────────────────
// NEW CASE MODAL
// ─────────────────────────────────────────────────────────────
function NewCaseModal({ open, onClose, onCreate }) {
  const [name, setName] = useStateS('');
  const [client, setClient] = useStateS('');
  const [location, setLocation] = useStateS('');
  const [amount, setAmount] = useStateS('');
  const reset = () => { setName(''); setClient(''); setLocation(''); setAmount(''); };
  const submit = () => {
    if (!name.trim()) return;
    const now = new Date();
    const id = `#${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
    onCreate({
      id,
      name: name.trim(),
      client: client.trim() || '—',
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
function AddLineItemModal({ open, onClose, onAdd }) {
  const [mode, setMode] = useStateS('catalog'); // 'catalog' | 'custom'
  const [q, setQ] = useStateS('');
  const [custom, setCustom] = useStateS({ name: '', cat: '材料', unit: '個', qty: 1, price: 0 });
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
function Dashboard({ cases, onOpenCase, onNewCase, onBuildQuote }) {
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
function CaseList({ cases, onOpenCase, onNewCase }) {
  const [q, setQ] = useStateS('');
  const filtered = useMemoS(() =>
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
      </Panel>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// QUOTE BUILDER
// ─────────────────────────────────────────────────────────────
const LINE_ITEMS_INIT = [
  { id: 1, type: 'material', name: '無熔絲開關 NFB 3P 100A', qty: 2, unit: '個', price: 2850, cat: '材料' },
  { id: 2, type: 'material', name: 'PVC 電管 1" × 4m', qty: 24, unit: '支', price: 180, cat: '材料' },
  { id: 3, type: 'material', name: '配電盤 600×800 烤漆', qty: 1, unit: '座', price: 18500, cat: '材料' },
  { id: 4, type: 'labor', name: '配管施工 · 資深師傅', qty: 16, unit: '工時', price: 1200, cat: '工資' },
  { id: 5, type: 'labor', name: '接地測試 · 現場驗收', qty: 1, unit: '式', price: 4500, cat: '工資' },
];

function QuoteBuilder({ caseData, onClose }) {
  const [items, setItems] = useStateS(LINE_ITEMS_INIT);
  const [taxInc, setTaxInc] = useStateS(true);
  const [addOpen, setAddOpen] = useStateS(false);
  const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
  const tax = taxInc ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + tax;
  const updateQty = (id, qty) => setItems(items.map(it => it.id === id ? { ...it, qty: Math.max(0, qty) } : it));
  const removeItem = (id) => setItems(items.filter(it => it.id !== id));
  const addItem = (it) => setItems(prev => [...prev, it]);

  return (
    <div className="screen screen-quote" data-screen-label="Quote Builder">
      <div className="screen-header">
        <div>
          <div className="mono-label" style={{ color: 'var(--fg-3)' }}>QUOTE BUILDER · {caseData?.id || '#NEW'}</div>
          <h1 className="screen-title">{caseData?.name || '新報價單'}</h1>
        </div>
        <div className="screen-actions">
          <Button variant="ghost" onClick={onClose} icon="x">關閉</Button>
          <Button variant="solid" icon="save">儲存草稿</Button>
          <Button variant="primary" icon="send">送出報價</Button>
        </div>
      </div>

      <div className="quote-layout">
        <div className="quote-main">
          <Panel title="案件資訊" meta="CLIENT · SCOPE">
            <div className="quote-meta-grid">
              <Field label="業主"><Input defaultValue={caseData?.client || '大明建設 · 王協理'} /></Field>
              <Field label="聯絡電話"><Input defaultValue="02-2723-xxxx" /></Field>
              <Field label="工程地點"><Input defaultValue="台北市信義區松高路 19 號 3F" /></Field>
              <Field label="預計工期"><Input defaultValue="14 天" /></Field>
            </div>
          </Panel>

          <Panel title="工項明細" meta={`${items.length} LINE ITEMS`} accent>
            <table className="data-table line-items">
              <thead>
                <tr><th>#</th><th>項目</th><th>類別</th><th style={{ textAlign: 'right' }}>數量</th><th>單位</th><th style={{ textAlign: 'right' }}>單價</th><th style={{ textAlign: 'right' }}>小計</th><th /></tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={it.id}>
                    <td className="mono row-sub">{String(i + 1).padStart(2, '0')}</td>
                    <td>{it.name}</td>
                    <td><Chip kind={it.type === 'labor' ? 'info' : 'dim'}>{it.cat}</Chip></td>
                    <td style={{ textAlign: 'right' }}>
                      <input className="input input-inline" type="number" value={it.qty} onChange={e => updateQty(it.id, +e.target.value)} />
                    </td>
                    <td className="row-sub mono">{it.unit}</td>
                    <td className="mono" style={{ textAlign: 'right' }}>{it.price.toLocaleString()}</td>
                    <td className="mono" style={{ textAlign: 'right', color: 'var(--accent)' }}>{(it.qty * it.price).toLocaleString()}</td>
                    <td><button className="icon-btn" onClick={() => removeItem(it.id)}><Icon name="x" size={14} /></button></td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--fg-3)', padding: 24 }}>尚無工項 · 點擊下方新增</td></tr>
                )}
              </tbody>
            </table>
            <button className="add-line" onClick={() => setAddOpen(true)}>
              <Icon name="plus" size={14} /> 新增工項
            </button>
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
            <Toggle on={taxInc} onChange={setTaxInc} label="含營業稅" />
          </Panel>
          <Panel title="核准流程" meta="WORKFLOW">
            <ol className="steps">
              <li className="step-done"><span className="step-mark">✓</span><div><div>草稿建立</div><div className="row-sub mono">04/17 10:24 · 陳師傅</div></div></li>
              <li className="step-done"><span className="step-mark">✓</span><div><div>工料複核</div><div className="row-sub mono">04/18 09:15 · 林工</div></div></li>
              <li className="step-active"><span className="step-mark">●</span><div><div>送出業主</div><div className="row-sub mono">等待 · 03:42</div></div></li>
              <li><span className="step-mark">○</span><div><div>業主簽回</div><div className="row-sub mono">—</div></div></li>
            </ol>
          </Panel>
        </aside>
      </div>

      <AddLineItemModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={addItem} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// QUOTES LIST
// ─────────────────────────────────────────────────────────────
const QUOTES = [
  { id: 'Q-2025-0418-A', caseId: '#2025-0418', case: '大明商辦 3F 配電工程', version: 'v3', status: 'warn', statusLabel: '待業主簽回', amount: 128400, issued: '04/18', valid: '05/18' },
  { id: 'Q-2025-0416-A', caseId: '#2025-0416', case: '信義區吳公館整修', version: 'v1', status: 'info', statusLabel: '草稿', amount: 48200, issued: '04/16', valid: '05/16' },
  { id: 'Q-2025-0411-B', caseId: '#2025-0411', case: '文心飯店地下機房配管', version: 'v2', status: 'ok', statusLabel: '已簽回', amount: 312800, issued: '04/11', valid: '05/11' },
  { id: 'Q-2025-0409-A', caseId: '#2025-0409', case: '松山火鍋店冷凍配電', version: 'v1', status: 'ok', statusLabel: '已簽回', amount: 92500, issued: '04/09', valid: '05/09' },
  { id: 'Q-2025-0406-A', caseId: '#2025-0406', case: '林口集合住宅熱水管線', version: 'v2', status: 'alert', statusLabel: '逾期未簽', amount: 186700, issued: '04/06', valid: '04/16' },
];

function QuotesList({ onOpenQuote }) {
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
      </Panel>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MATERIALS
// ─────────────────────────────────────────────────────────────
function MaterialsScreen() {
  const [q, setQ] = useStateS('');
  const [cat, setCat] = useStateS('all');
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
        <Panel title="品項總數" meta="< 10"><Metric label="LOW STOCK" value={MATERIALS.filter(m => typeof m.stock === 'number' && m.stock < 10).length} delta="建議補貨" deltaKind="warn" /></Panel>
        <Panel title="缺貨" meta="ZERO"><Metric label="OUT" value={MATERIALS.filter(m => m.stock === 0).length} delta="立即補貨" deltaKind="alert" /></Panel>
      </div>
      <Panel title={`CATALOG · ${filtered.length} SKUS`} meta="LIVE">
        <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center' }}>
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
      </Panel>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// REPORTS
// ─────────────────────────────────────────────────────────────
const MONTHLY = [
  { m: '10月', rev: 612, cost: 384 },
  { m: '11月', rev: 548, cost: 362 },
  { m: '12月', rev: 724, cost: 441 },
  { m: '01月', rev: 680, cost: 412 },
  { m: '02月', rev: 512, cost: 318 },
  { m: '03月', rev: 798, cost: 476 },
  { m: '04月', rev: 842, cost: 498 },
];
const CLIENT_DIST = [
  { name: '大明建設', value: 328, pct: 28 },
  { name: '文心酒店', value: 312, pct: 27 },
  { name: '日盛營造', value: 186, pct: 16 },
  { name: '誠品生活', value: 128, pct: 11 },
  { name: '其他 12 家', value: 204, pct: 18 },
];

function ReportsScreen() {
  const [range, setRange] = useStateS('7m');
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

function ComingSoon({ label }) {
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

Object.assign(window, { Dashboard, CaseList, QuoteBuilder, QuotesList, MaterialsScreen, ReportsScreen, ComingSoon, CASES_SEED, NewCaseModal });
