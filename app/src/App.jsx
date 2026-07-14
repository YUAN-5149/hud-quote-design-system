import { useState, useEffect } from 'react';
import { Rail, TopBar, StatusBar } from './components/Chrome.jsx';
import { Dashboard, CaseList, QuotesList, MaterialsScreen, ReportsScreen, NewCaseModal } from './screens/Screens.jsx';
import { QuoteBuilder } from './screens/QuoteBuilder.jsx';
import { BillingScreen } from './screens/Billing.jsx';
import { LoginScreen, WhitelistScreen } from './auth/Auth.jsx';
import { loadSession, saveSession } from './lib/session.js';
import { usePersistedState } from './lib/store.js';
import { CASES_SEED, INVOICES_SEED, QUOTES_SEED, MATERIALS, MOVES_SEED } from './lib/data.js';
import { todayISO } from './lib/format.js';

const LABELS = {
  dashboard: 'COMMAND · 主控台',
  cases: 'CASES · 案件',
  quote: 'QUOTE · 報價編輯',
  quotes: 'QUOTES · 報價單',
  materials: 'MATERIALS · 材料',
  billing: 'BILLING · 請款',
  reports: 'REPORTS · 報表',
  whitelist: 'WHITELIST · 白名單',
};

export default function App() {
  const [session, setSession] = useState(() => loadSession());
  const [screen, setScreen] = useState(() => localStorage.getItem('scr') || 'dashboard');
  const [selectedCase, setSelectedCase] = useState(null);
  const [cases, setCases] = usePersistedState('hud_cases_v2', CASES_SEED);
  const [invoices, setInvoices] = usePersistedState('hud_invoices_v2', INVOICES_SEED);
  const [quotes, setQuotes] = usePersistedState('hud_quotes_v1', QUOTES_SEED);
  const [materials, setMaterials] = usePersistedState('hud_materials_v1', MATERIALS);
  const [moves, setMoves] = usePersistedState('hud_stock_moves_v1', MOVES_SEED);
  const [selectedQuote, setSelectedQuote] = useState(null);

  // 材料庫：編輯（以原代碼定位）、刪除、進出貨（異動紀錄 + 庫存增減）
  const updateMaterial = (code, item) =>
    setMaterials(prev => prev.map(m => (m.code === code ? item : m)));
  const deleteMaterial = (code) =>
    setMaterials(prev => prev.filter(m => m.code !== code));
  const addMovement = (mv) => {
    setMoves(prev => [mv, ...prev]);
    setMaterials(prev => prev.map(m =>
      m.code === mv.code && typeof m.stock === 'number'
        ? { ...m, stock: Math.max(0, m.stock + (mv.type === 'in' ? mv.qty : -mv.qty)) }
        : m));
  };
  const [newCaseOpen, setNewCaseOpen] = useState(false);

  useEffect(() => { localStorage.setItem('scr', screen); }, [screen]);

  const handleAuth = (s) => { saveSession(s); setSession(s); setScreen('dashboard'); };
  const logout = () => { saveSession(null); setSession(null); };

  if (!session) return <LoginScreen onAuth={handleAuth} />;

  const openCase = (c) => { setSelectedCase(c); setSelectedQuote(null); setScreen('quote'); };
  const openNewQuote = () => { setSelectedCase(null); setSelectedQuote(null); setScreen('quote'); };
  const createCase = (c) => setCases(prev => [c, ...prev]);

  // 從報價單列表開啟：帶入該報價單與其案件
  const openQuoteDoc = (q) => {
    setSelectedCase(cases.find(c => c.id === q.caseId) || null);
    setSelectedQuote(q);
    setScreen('quote');
  };

  // 報價編輯器儲存（草稿或送出）— 依 id upsert
  const saveQuote = (record, goToList) => {
    setQuotes(prev => prev.some(q => q.id === record.id)
      ? prev.map(q => q.id === record.id ? { ...q, ...record } : q)
      : [record, ...prev]);
    if (goToList) setScreen('quotes');
  };

  // 業主簽回
  const signQuote = (id) => {
    setQuotes(prev => prev.map(q => q.id === id
      ? { ...q, status: 'ok', statusLabel: '已簽回', signedAt: todayISO() }
      : q));
  };

  // 同案件請款單流水號 — 從既有清單推算，避免與種子或手開請款撞號
  const nextInvoiceId = (caseId) => {
    const base = `B-${caseId.replace('#', '')}`;
    let n = invoices.filter(v => v.caseId === caseId).length + 1;
    while (invoices.some(v => v.id === `${base}-${n}`)) n++;
    return `${base}-${n}`;
  };

  // 已簽回報價 → 開立請款單，並跳到請款頁
  const convertQuote = (quote, { stage, amount, dueAt }) => {
    const inv = {
      id: nextInvoiceId(quote.caseId),
      caseId: quote.caseId, case: quote.case, client: quote.client, gui: quote.gui || '',
      stage, amount, issuedAt: todayISO(), dueAt: dueAt || null, paidAt: null,
      status: 'warn', statusLabel: '待收款', quoteId: quote.id,
    };
    setInvoices(prev => [inv, ...prev]);
    setQuotes(prev => prev.map(q => q.id === quote.id
      ? { ...q, invoicedCount: (q.invoicedCount || 0) + 1, invoicedAmount: (q.invoicedAmount || 0) + amount }
      : q));
    setScreen('billing');
  };

  const content = () => {
    switch (screen) {
      case 'dashboard': return <Dashboard cases={cases} invoices={invoices} onOpenCase={openCase} onNewCase={() => setNewCaseOpen(true)} onBuildQuote={openNewQuote} />;
      case 'cases': return <CaseList cases={cases} onOpenCase={openCase} onNewCase={() => setNewCaseOpen(true)} />;
      case 'quote': return <QuoteBuilder key={selectedQuote?.id || selectedCase?.id || 'new'} caseData={selectedCase} quote={selectedQuote} materials={materials} onClose={() => setScreen('quotes')} onSave={saveQuote} />;
      case 'quotes': return <QuotesList quotes={quotes} onNewQuote={openNewQuote} onOpenQuote={openQuoteDoc} onSign={signQuote} onConvert={convertQuote} />;
      case 'materials': return <MaterialsScreen materials={materials} cases={cases} moves={moves} onAdd={(m) => setMaterials(prev => [m, ...prev])} onUpdate={updateMaterial} onDelete={deleteMaterial} onMove={addMovement} />;
      case 'billing': return <BillingScreen cases={cases} invoices={invoices} setInvoices={setInvoices} />;
      case 'reports': return <ReportsScreen cases={cases} invoices={invoices} />;
      case 'whitelist': return <WhitelistScreen session={session} onLogout={logout} />;
      default: return null;
    }
  };

  return (
    <div className="app">
      <Rail active={screen === 'quote' ? 'quotes' : screen} onNav={setScreen} session={session} onLogout={logout} />
      <TopBar screenLabel={LABELS[screen]} session={session} onLogout={logout} />
      <main className="main">{content()}</main>
      <StatusBar session={session} />
      <NewCaseModal open={newCaseOpen} onClose={() => setNewCaseOpen(false)} onCreate={createCase} />
    </div>
  );
}
