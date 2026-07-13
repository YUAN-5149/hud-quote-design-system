import { useState } from 'react';
import { Panel, Metric, Chip, Button, Field, Input, Modal, Select, Icon } from '../components/Primitives.jsx';
import { fmt, fmtMD, toChineseUpper, todayISO } from '../lib/format.js';

function NewInvoiceModal({ open, onClose, onCreate, cases }) {
  const [caseId, setCaseId] = useState(cases[0]?.id || '');
  const [stage, setStage] = useState('第一期 · 訂金 50%');
  const [amount, setAmount] = useState('');
  const [due, setDue] = useState('');

  const submit = () => {
    const c = cases.find(x => x.id === caseId);
    if (!c || !+amount) return;
    onCreate({
      id: `B-${c.id.replace('#','')}-${Date.now() % 10}`,
      caseId: c.id, case: c.name, client: c.client.split(' · ')[0], gui: c.gui || '',
      stage, amount: +amount,
      issuedAt: todayISO(), dueAt: due || null, paidAt: null,
      status: 'warn', statusLabel: '待收款',
    });
    setAmount(''); setDue('');
    onClose();
  };

  return (
    <Modal
      open={open} onClose={onClose}
      title="開立請款單 · NEW INVOICE" meta="FORM" width={560}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>取消</Button>
          <Button variant="primary" icon="check" onClick={submit}>開立請款</Button>
        </>
      }
    >
      <div className="quote-meta-grid">
        <Field label="案件 · CASE">
          <Select value={caseId} onChange={setCaseId} options={cases.map(c => ({ value: c.id, label: `${c.id} ${c.name}` }))} />
        </Field>
        <Field label="期別 · STAGE">
          <Select value={stage} onChange={setStage} options={[
            { value: '第一期 · 訂金 50%', label: '第一期 · 訂金 50%' },
            { value: '第二期 · 完工款', label: '第二期 · 完工款' },
            { value: '全額 · 一次付清', label: '全額 · 一次付清' },
            { value: '追加工程款', label: '追加工程款' },
          ]} />
        </Field>
        <Field label="請款金額 · AMOUNT">
          <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="64200" autoFocus />
        </Field>
        <Field label="付款期限 · DUE">
          <Input type="date" value={due} onChange={e => setDue(e.target.value)} />
        </Field>
      </div>
      {+amount > 0 && (
        <div className="mono-label" style={{ marginTop: 12, color: 'var(--fg-2)' }}>{toChineseUpper(+amount)}</div>
      )}
    </Modal>
  );
}

export function BillingScreen({ cases, invoices, setInvoices }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);

  const sorted = [...invoices].sort((a, b) => (b.issuedAt || '').localeCompare(a.issuedAt || ''));
  const filtered = sorted.filter(v =>
    !q || v.case.includes(q) || v.client.includes(q) || v.id.includes(q)
  );
  const pending = invoices.filter(v => v.status === 'warn');
  const overdue = invoices.filter(v => v.status === 'alert');
  const monthKey = todayISO().slice(0, 7);
  const receivedThisMonth = invoices.filter(v => v.paidAt && v.paidAt.slice(0, 7) === monthKey);
  const sum = (list) => list.reduce((s, v) => s + v.amount, 0);
  const collected = invoices.filter(v => v.status === 'ok');
  const collectRate = invoices.length ? Math.round(collected.length / invoices.length * 100) : 0;

  const markPaid = (id) => {
    setInvoices(invoices.map(v => v.id === id ? { ...v, status: 'ok', statusLabel: '已收款', paidAt: todayISO() } : v));
  };

  return (
    <div className="screen" data-screen-label="Billing">
      <div className="screen-header">
        <h1 className="screen-title">請款 // BILLING</h1>
        <div className="screen-actions">
          <div className="searchbar">
            <Icon name="search" size={14} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="SEARCH · 請款 / 業主" />
          </div>
          <Button variant="primary" icon="file-plus" onClick={() => setOpen(true)}>開立請款</Button>
        </div>
      </div>

      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Panel title="待收款" meta="PENDING" accent>
          <Metric label="RECEIVABLE" value={fmt(sum(pending))} sub={`${pending.length} 張`} delta="追蹤中" deltaKind="warn" />
        </Panel>
        <Panel title="逾期未收" meta="OVERDUE">
          <Metric label="OVERDUE" value={fmt(sum(overdue))} sub={`${overdue.length} 張`} delta={overdue.length ? '需聯絡業主' : '無逾期'} deltaKind={overdue.length ? 'alert' : 'ok'} />
        </Panel>
        <Panel title="本月已收" meta="RECEIVED">
          <Metric label="COLLECTED" value={fmt(sum(receivedThisMonth))} sub={`${receivedThisMonth.length} 張`} delta={`▲ 歷史回收率 ${collectRate}%`} />
        </Panel>
        <Panel title="請款總額" meta="TOTAL">
          <Metric label="ISSUED" value={fmt(sum(invoices))} sub={`${invoices.length} 張`} />
        </Panel>
      </div>

      <Panel title={`請款單紀錄 · ${filtered.length} DOCS`} meta="LIVE">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr><th>INVOICE</th><th>案件 / 業主</th><th>期別</th><th>統編</th><th>開立</th><th>期限</th><th>收款日</th><th>狀態</th><th style={{ textAlign: 'right' }}>金額</th><th style={{ textAlign: 'right' }}>操作</th></tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id}>
                  <td className="mono">{v.id}</td>
                  <td><div>{v.case}</div><div className="row-sub">{v.client}</div></td>
                  <td className="row-sub">{v.stage}</td>
                  <td className="row-sub mono">{v.gui || '—'}</td>
                  <td className="row-sub mono">{fmtMD(v.issuedAt)}</td>
                  <td className="row-sub mono" style={{ color: v.status === 'alert' ? 'var(--alert)' : undefined }}>{fmtMD(v.dueAt)}</td>
                  <td className="row-sub mono" style={{ color: v.paidAt ? 'var(--ok)' : undefined }}>{fmtMD(v.paidAt)}</td>
                  <td><Chip kind={v.status}>{v.statusLabel}</Chip></td>
                  <td className="mono" style={{ textAlign: 'right' }}>{fmt(v.amount)}</td>
                  <td style={{ textAlign: 'right' }}>
                    {v.status !== 'ok' ? (
                      <button className="btn btn-solid btn-sm" onClick={() => markPaid(v.id)}>
                        <Icon name="check" size={12} /><span>登記收款</span>
                      </button>
                    ) : (
                      <span className="mono-label" style={{ color: 'var(--ok)' }}>SETTLED</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={10} style={{ textAlign: 'center', color: 'var(--fg-3)', padding: 32 }}>無符合請款單</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <NewInvoiceModal open={open} onClose={() => setOpen(false)} onCreate={(v) => setInvoices([v, ...invoices])} cases={cases} />
    </div>
  );
}
