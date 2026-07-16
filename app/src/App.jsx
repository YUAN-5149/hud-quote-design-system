import { useState, useEffect } from 'react';
import { Rail, TopBar, StatusBar } from './components/Chrome.jsx';
import { Dashboard, CaseList, QuotesList, MaterialsScreen, ReportsScreen, NewCaseModal } from './screens/Screens.jsx';
import { QuoteBuilder } from './screens/QuoteBuilder.jsx';
import { BillingScreen } from './screens/Billing.jsx';
import { LoginScreen, WhitelistScreen } from './auth/Auth.jsx';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase.js';
import { loadSession, saveSession, logoutAuth, WL_SEED } from './lib/session.js';
import { useSyncedCollection } from './lib/store.js';
import { CASES_SEED, INVOICES_SEED, QUOTES_SEED, MATERIALS, MOVES_SEED } from './lib/data.js';
import { todayISO, addDays, nextQuoteNo } from './lib/format.js';

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
  // Firebase Auth 狀態 — 資料同步僅在登入後啟動（安全規則要求）
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    if (!auth) { setAuthed(true); return undefined; } // 無 Firebase：本機模式
    return onAuthStateChanged(auth, (user) => {
      setAuthed(!!user);
      // Firebase 憑證失效但本機還留著 session → 強制回登入頁
      if (!user && loadSession()) {
        saveSession(null);
        setSession(null);
      }
    });
  }, []);

  // Firestore 即時同步集合（多裝置共用；離線時用本機快取）
  const [cases, setCases] = useSyncedCollection('cases', CASES_SEED, 'id', authed);
  const [invoices, setInvoices] = useSyncedCollection('invoices', INVOICES_SEED, 'id', authed);
  const [quotes, setQuotes] = useSyncedCollection('quotes', QUOTES_SEED, 'id', authed);
  const [materials, setMaterials] = useSyncedCollection('materials', MATERIALS, 'code', authed);
  const [moves, setMoves] = useSyncedCollection('moves', MOVES_SEED, 'id', authed);
  const [whitelist, setWhitelist] = useSyncedCollection('whitelist', WL_SEED, 'phone', authed);
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
  const logout = () => { logoutAuth(); saveSession(null); setSession(null); };

  if (!session) return <LoginScreen onAuth={handleAuth} />;

  const openCase = (c) => { setSelectedCase(c); setSelectedQuote(null); setScreen('quote'); };
  const openNewQuote = () => { setSelectedCase(null); setSelectedQuote(null); setScreen('quote'); };
  // 同日建立多筆案件時，流水後綴避免撞號
  const createCase = (c) => setCases(prev => {
    let id = c.id;
    let n = 2;
    while (prev.some(x => x.id === id)) id = `${c.id}-${n++}`;
    return [{ ...c, id }, ...prev];
  });

  // 從報價單列表開啟：帶入該報價單與其案件
  const openQuoteDoc = (q) => {
    setSelectedCase(cases.find(c => c.id === q.caseId) || null);
    setSelectedQuote(q);
    setScreen('quote');
  };

  // 案件編號：#YYYY-MMDD，同日多筆加流水後綴
  const newCaseId = () => {
    const d = todayISO();
    const base = `#${d.slice(0, 4)}-${d.slice(5, 7)}${d.slice(8, 10)}`;
    let id = base;
    let n = 2;
    while (cases.some(c => c.id === id)) id = `${base}-${n++}`;
    return id;
  };

  // 報價編輯器儲存（草稿或送出）— 依 id upsert
  // 尚未歸屬案件的新報價：以報價上輸入的案件名稱順帶建立案件
  const saveQuote = (record, goToList) => {
    let rec = record;
    if (!rec.caseId) {
      const now = new Date();
      const c = {
        id: newCaseId(),
        createdAt: todayISO(),
        name: rec.case,
        client: rec.info?.client || '—',
        gui: rec.gui || '',
        location: rec.info?.location || '—',
        status: 'warn', statusLabel: '待確認',
        amount: rec.amount,
        updated: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
        progress: 0,
      };
      setCases(prev => [c, ...prev]);
      rec = { ...rec, caseId: c.id };
      setSelectedCase(c);
    }
    setQuotes(prev => prev.some(q => q.id === rec.id)
      ? prev.map(q => q.id === rec.id ? { ...q, ...rec } : q)
      : [rec, ...prev]);
    setSelectedQuote(rec); // 綁定已存檔紀錄，後續存檔才會更新同一張單
    if (goToList) setScreen('quotes');
  };

  // 建立新版本：複製內容為草稿，版本號 +1；舊版本原封保留供回顧
  const newQuoteVersion = (quote) => {
    const sameCase = quotes.filter(q => q.caseId === quote.caseId);
    const verNum = (q) => +String(q.version || 'v1').replace('v', '') || 0;
    const nextV = sameCase.reduce((m, q) => Math.max(m, verNum(q)), 0) + 1;
    const id = nextQuoteNo(quotes); // 新版本＝當日新開立的一張單

    const rec = {
      ...quote,
      id,
      version: `v${nextV}`,
      status: 'info', statusLabel: '草稿',
      issuedAt: todayISO(),
      validAt: addDays(todayISO(), 30),
      signedAt: null,
      invoicedCount: 0,
      invoicedAmount: 0,
      info: quote.info ? { ...quote.info, quoteNo: id } : null,
      _ord: Date.now(),
    };
    setQuotes(prev => [rec, ...prev]);
    setSelectedCase(cases.find(c => c.id === quote.caseId) || null);
    setSelectedQuote(rec);
    setScreen('quote');
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
      case 'quote': return <QuoteBuilder
        key={selectedQuote?.id || selectedCase?.id || 'new'}
        caseData={selectedCase}
        quote={selectedQuote}
        versions={selectedQuote
          ? quotes.filter(q => q.caseId === selectedQuote.caseId)
              .sort((a, b) => (+String(a.version || 'v1').replace('v', '')) - (+String(b.version || 'v1').replace('v', '')))
          : []}
        materials={materials}
        newQuoteNo={nextQuoteNo(quotes)}
        onClose={() => setScreen('quotes')}
        onSave={saveQuote}
        onOpenVersion={openQuoteDoc}
        onNewVersion={newQuoteVersion}
      />;
      case 'quotes': return <QuotesList quotes={quotes} onNewQuote={openNewQuote} onOpenQuote={openQuoteDoc} onSign={signQuote} onConvert={convertQuote} onNewVersion={newQuoteVersion} />;
      case 'materials': return <MaterialsScreen materials={materials} cases={cases} moves={moves} onAdd={(m) => setMaterials(prev => [m, ...prev])} onUpdate={updateMaterial} onDelete={deleteMaterial} onMove={addMovement} />;
      case 'billing': return <BillingScreen cases={cases} invoices={invoices} setInvoices={setInvoices} />;
      case 'reports': return <ReportsScreen cases={cases} invoices={invoices} />;
      case 'whitelist': return <WhitelistScreen session={session} onLogout={logout} list={whitelist} setList={setWhitelist} />;
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
