import { useState, useEffect } from 'react';
import { Rail, TopBar, StatusBar } from './components/Chrome.jsx';
import { Dashboard, CaseList, QuotesList, MaterialsScreen, ReportsScreen, NewCaseModal } from './screens/Screens.jsx';
import { QuoteBuilder } from './screens/QuoteBuilder.jsx';
import { BillingScreen } from './screens/Billing.jsx';
import { LoginScreen, WhitelistScreen } from './auth/Auth.jsx';
import { loadSession, saveSession } from './lib/session.js';
import { usePersistedState } from './lib/store.js';
import { CASES_SEED, INVOICES_SEED } from './lib/data.js';

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
  const [newCaseOpen, setNewCaseOpen] = useState(false);

  useEffect(() => { localStorage.setItem('scr', screen); }, [screen]);

  const handleAuth = (s) => { saveSession(s); setSession(s); setScreen('dashboard'); };
  const logout = () => { saveSession(null); setSession(null); };

  if (!session) return <LoginScreen onAuth={handleAuth} />;

  const openCase = (c) => { setSelectedCase(c); setScreen('quote'); };
  const openNewQuote = () => { setSelectedCase(null); setScreen('quote'); };
  const createCase = (c) => setCases(prev => [c, ...prev]);

  const content = () => {
    switch (screen) {
      case 'dashboard': return <Dashboard cases={cases} invoices={invoices} onOpenCase={openCase} onNewCase={() => setNewCaseOpen(true)} onBuildQuote={openNewQuote} />;
      case 'cases': return <CaseList cases={cases} onOpenCase={openCase} onNewCase={() => setNewCaseOpen(true)} />;
      case 'quote': return <QuoteBuilder key={selectedCase?.id || 'new'} caseData={selectedCase} onClose={() => setScreen('cases')} />;
      case 'quotes': return <QuotesList onOpenQuote={openNewQuote} />;
      case 'materials': return <MaterialsScreen />;
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
