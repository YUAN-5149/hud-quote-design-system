import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Panel, Chip, Button, Field, Input, Toggle, Icon } from '../components/Primitives.jsx';
import { AddLineItemModal } from './Screens.jsx';
import { LINE_ITEMS_INIT, COMPANY } from '../lib/data.js';
import { fmt, toChineseUpper, validateGUI, todayYMD } from '../lib/format.js';

// ─────────────────────────────────────────────────────────────
// 列印版報價單 — 白底正式文件（@media print 才顯示，見 print.css）
// ─────────────────────────────────────────────────────────────
function PrintQuote({ info, items, subtotal, tax, total, taxInc }) {
  return createPortal(
    <div className="print-quote">
      <header className="pq-head">
        <div>
          <h1>{COMPANY.name}</h1>
          <div className="pq-co-meta">
            統一編號 {COMPANY.gui} · 電話 {COMPANY.phone}<br />
            {COMPANY.address}
          </div>
        </div>
        <div className="pq-doc">
          <div className="pq-doc-title">工 程 報 價 單</div>
          <div className="pq-doc-meta">
            <span>報價日期：{todayYMD()}</span>
            <span>報價單號：{info.quoteNo}</span>
            <span>有效期限：報價日起 30 日</span>
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
        <li>本報價單有效期限為報價日起 30 日，逾期請重新確認。</li>
        <li>付款方式：簽約訂金 50%，完工驗收後付清尾款。匯款帳戶：{COMPANY.bank}。</li>
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
// QUOTE BUILDER
// ─────────────────────────────────────────────────────────────
export function QuoteBuilder({ caseData, onClose }) {
  const [items, setItems] = useState(LINE_ITEMS_INIT);
  const [taxInc, setTaxInc] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [info, setInfo] = useState({
    quoteNo: `Q-${(caseData?.id || '#NEW').replace('#', '')}-A`,
    name: caseData?.name || '新報價單',
    client: caseData?.client || '大明建設 · 王協理',
    gui: caseData?.gui || '',
    phone: '02-2723-xxxx',
    location: '台北市信義區松高路 19 號 3F',
    duration: '14 天',
  });
  const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
  const tax = taxInc ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + tax;
  const guiInvalid = info.gui && !validateGUI(info.gui);
  const updateQty = (id, qty) => setItems(items.map(it => it.id === id ? { ...it, qty: Math.max(0, qty) } : it));
  const removeItem = (id) => setItems(items.filter(it => it.id !== id));
  const addItem = (it) => setItems(prev => [...prev, it]);
  const setF = (k) => (e) => setInfo({ ...info, [k]: e.target.value });

  return (
    <div className="screen screen-quote" data-screen-label="Quote Builder">
      <div className="screen-header">
        <div>
          <div className="mono-label" style={{ color: 'var(--fg-3)' }}>QUOTE BUILDER · {caseData?.id || '#NEW'}</div>
          <h1 className="screen-title">{info.name}</h1>
        </div>
        <div className="screen-actions">
          <Button variant="ghost" onClick={onClose} icon="x">關閉</Button>
          <Button variant="solid" icon="printer" onClick={() => window.print()}>列印 / PDF</Button>
          <Button variant="solid" icon="save">儲存草稿</Button>
          <Button variant="primary" icon="send">送出報價</Button>
        </div>
      </div>

      <div className="quote-layout">
        <div className="quote-main">
          <Panel title="案件資訊" meta="CLIENT · SCOPE">
            <div className="quote-meta-grid">
              <Field label="業主"><Input value={info.client} onChange={setF('client')} /></Field>
              <Field label="統一編號 · GUI" error={guiInvalid ? '統編檢核未通過' : ''} helper="開立發票用，選填">
                <Input value={info.gui} onChange={e => setInfo({ ...info, gui: e.target.value.replace(/\D/g, '').slice(0, 8) })} placeholder="8 位數字" inputMode="numeric" />
              </Field>
              <Field label="聯絡電話"><Input value={info.phone} onChange={setF('phone')} /></Field>
              <Field label="工程地點"><Input value={info.location} onChange={setF('location')} /></Field>
              <Field label="預計工期"><Input value={info.duration} onChange={setF('duration')} /></Field>
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
            </div>
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
            <div className="calc-upper mono-label">{toChineseUpper(total)}</div>
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
      <PrintQuote info={info} items={items} subtotal={subtotal} tax={tax} total={total} taxInc={taxInc} />
    </div>
  );
}
