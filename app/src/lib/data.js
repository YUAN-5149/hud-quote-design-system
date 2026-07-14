// 種子資料 — 案件、材料庫、報價單、請款單
// 日期以「今天」為基準往回鋪 12 個月，Demo 的報表統計永遠有資料

const isoOf = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
// n 個月前的某一天（day 超過當月天數時 JS Date 會自動進位，種子資料用小日期避免）
const monthsAgo = (n, day = 15) => {
  const now = new Date();
  return isoOf(new Date(now.getFullYear(), now.getMonth() - n, day));
};
const caseIdOf = (dateISO) => `#${dateISO.slice(0, 4)}-${dateISO.slice(5, 7)}${dateISO.slice(8, 10)}`;
const mmdd = (dateISO) => `${dateISO.slice(5, 7)}/${dateISO.slice(8, 10)}`;

const mkCase = (offsetM, day, name, client, gui, status, statusLabel, amount, location, progress) => {
  const createdAt = monthsAgo(offsetM, day);
  return { id: caseIdOf(createdAt), createdAt, name, client, gui, status, statusLabel, amount, updated: mmdd(createdAt), location, progress };
};

export const CASES_SEED = [
  mkCase(0, 8,  '大明商辦 3F 配電工程',   '大明建設 · 王協理', '84149961', 'active', '進行中', 128400, '台北 · 信義', 62),
  mkCase(0, 6,  '信義區吳公館整修',       '吳先生',           '',         'warn',   '待確認', 48200,  '台北 · 信義', 24),
  mkCase(1, 11, '文心飯店地下機房配管',   '文心國際酒店',     '20828393', 'alert',  '逾期',   312800, '台中 · 西屯', 88),
  mkCase(1, 9,  '松山火鍋店冷凍配電',     '頂鍋食品',         '53212539', 'ok',     '已付款', 92500,  '台北 · 松山', 100),
  mkCase(2, 6,  '林口集合住宅熱水管線',   '日盛營造',         '86517312', 'active', '進行中', 186700, '新北 · 林口', 41),
  mkCase(2, 2,  '板橋誠品門市照明更新',   '誠品生活',         '23222367', 'ok',     '已付款', 64200,  '新北 · 板橋', 100),
  mkCase(4, 14, '中山診所配電更新',       '安禾醫療',         '42566717', 'ok',     '已付款', 138600, '台北 · 中山', 100),
  mkCase(5, 7,  '內湖廠房高架配管',       '華立精機',         '12786413', 'ok',     '已付款', 264500, '台北 · 內湖', 100),
  mkCase(7, 16, '天母住宅浴室翻新',       '張公館',           '',         'ok',     '已付款', 88700,  '台北 · 士林', 100),
  mkCase(8, 5,  '南港倉儲照明工程',       '聯運物流',         '45000103', 'ok',     '已付款', 118200, '台北 · 南港', 100),
  mkCase(10, 12,'竹北接待中心水電',       '遠成建設',         '80333857', 'ok',     '已付款', 342000, '新竹 · 竹北', 100),
  mkCase(11, 9, '老屋全室管線重拉',       '陳公館',           '',         'ok',     '已付款', 154800, '台北 · 大同', 100),
];

// 類別：配電（開關／配電盤）、電線、管材（電管／銅管）、工資
export const MATERIALS = [
  { code: 'NFB-3P-100', name: '無熔絲開關 NFB 3P 100A', cat: '配電', unit: '個', price: 2850, stock: 12 },
  { code: 'NFB-2P-30',  name: '無熔絲開關 NFB 2P 30A',  cat: '配電', unit: '個', price: 680, stock: 34 },
  { code: 'PVC-1-4M',   name: 'PVC 電管 1" × 4m',        cat: '管材', unit: '支', price: 180, stock: 128 },
  { code: 'PVC-3-4-4M', name: 'PVC 電管 3/4" × 4m',      cat: '管材', unit: '支', price: 140, stock: 82 },
  { code: 'PNL-60-80',  name: '配電盤 600×800 烤漆',    cat: '配電', unit: '座', price: 18500, stock: 3 },
  { code: 'WIRE-5-5',   name: '電線 5.5 平方 × 100m',   cat: '電線', unit: '捲', price: 3200, stock: 18 },
  { code: 'WIRE-2-0',   name: '電線 2.0 平方 × 100m',   cat: '電線', unit: '捲', price: 1400, stock: 24 },
  { code: 'PIPE-CU-15', name: '銅管 15A × 3m',           cat: '管材', unit: '支', price: 520, stock: 0 },
  { code: 'LBR-ELEC-S', name: '配管施工 · 資深師傅',    cat: '工資', unit: '工時', price: 1200, stock: '—' },
  { code: 'LBR-ELEC-J', name: '配管施工 · 助手',        cat: '工資', unit: '工時', price: 700, stock: '—' },
  { code: 'LBR-GND',    name: '接地測試 · 現場驗收',    cat: '工資', unit: '式', price: 4500, stock: '—' },
  { code: 'LBR-PLB',    name: '給排水配管施工',          cat: '工資', unit: '工時', price: 1100, stock: '—' },
];

// 材料分類（不含工資）— 儀表板與篩選共用；顏色為同色系深淺，符合 HUD 用色節制原則
export const MATERIAL_CATS = [
  { name: '配電', color: 'rgba(0, 229, 255, 0.95)' },
  { name: '電線', color: 'rgba(0, 229, 255, 0.55)' },
  { name: '管材', color: 'rgba(0, 229, 255, 0.25)' },
];

export const LINE_ITEMS_INIT = [
  { id: 1, type: 'material', name: '無熔絲開關 NFB 3P 100A', qty: 2, unit: '個', price: 2850, cat: '材料' },
  { id: 2, type: 'material', name: 'PVC 電管 1" × 4m', qty: 24, unit: '支', price: 180, cat: '材料' },
  { id: 3, type: 'material', name: '配電盤 600×800 烤漆', qty: 1, unit: '座', price: 18500, cat: '材料' },
  { id: 4, type: 'labor', name: '配管施工 · 資深師傅', qty: 16, unit: '工時', price: 1200, cat: '工資' },
  { id: 5, type: 'labor', name: '接地測試 · 現場驗收', qty: 1, unit: '式', price: 4500, cat: '工資' },
];

// 報價單種子 — 狀態流：草稿 (info) → 待業主簽回 (warn) → 已簽回 (ok)
// 逾期未簽由 UI 依 validAt < 今天 自動判斷
const addDaysISO = (dateISO, days) => {
  const d = new Date(dateISO);
  d.setDate(d.getDate() + days);
  return isoOf(d);
};
const QUOTE_LABELS = { info: '草稿', warn: '待業主簽回', ok: '已簽回' };
const mkQuote = (caseRef, version, status, issued, opts = {}) => {
  const c = CASES_SEED.find(x => x.name === caseRef);
  const issuedAt = monthsAgo(issued[0], issued[1]);
  return {
    id: `Q-${c.id.replace('#', '')}-${String.fromCharCode(64 + +version.slice(1))}`,
    caseId: c.id, case: c.name, client: c.client.split(' · ')[0], gui: c.gui,
    version, status, statusLabel: QUOTE_LABELS[status],
    amount: opts.amount ?? c.amount,
    issuedAt, validAt: addDaysISO(issuedAt, 30),
    signedAt: opts.signed ? monthsAgo(opts.signed[0], opts.signed[1]) : null,
    invoicedCount: opts.invoicedCount || 0,
    invoicedAmount: opts.invoicedAmount || 0,
    items: null, info: null, taxInc: true,
  };
};

export const QUOTES_SEED = [
  mkQuote('大明商辦 3F 配電工程',   'v3', 'warn', [0, 8]),
  mkQuote('大明商辦 3F 配電工程',   'v2', 'warn', [1, 2],  { amount: 121800 }), // 超過 30 天 → UI 顯示逾期未簽
  mkQuote('信義區吳公館整修',       'v1', 'info', [0, 6]),
  mkQuote('文心飯店地下機房配管',   'v2', 'ok',   [3, 10], { signed: [3, 20], invoicedCount: 2, invoicedAmount: 312800 }),
  mkQuote('松山火鍋店冷凍配電',     'v1', 'ok',   [1, 8],  { signed: [1, 9],  invoicedCount: 1, invoicedAmount: 92500 }),
  mkQuote('林口集合住宅熱水管線',   'v2', 'ok',   [2, 6],  { signed: [2, 7],  invoicedCount: 1, invoicedAmount: 93400 }),
  mkQuote('板橋誠品門市照明更新',   'v1', 'ok',   [2, 2],  { signed: [2, 3],  invoicedCount: 1, invoicedAmount: 64200 }),
];

// 請款單種子（BILLING）— 以案件為本，鋪滿近 12 個月
// issued/due/paid: [幾個月前, 日]；paid 為 null 表示未收款，逾期以 dueAt < 今天 自動判斷
const mkInv = (n, caseRef, stage, amount, issued, due, paid) => {
  const c = CASES_SEED.find(x => x.name === caseRef);
  const issuedAt = monthsAgo(issued[0], issued[1]);
  const dueAt = monthsAgo(due[0], due[1]);
  const paidAt = paid ? monthsAgo(paid[0], paid[1]) : null;
  const overdue = !paidAt && dueAt < isoOf(new Date());
  return {
    id: `B-${c.id.replace('#', '')}-${n}`,
    caseId: c.id, case: c.name, client: c.client.split(' · ')[0], gui: c.gui,
    stage, amount, issuedAt, dueAt, paidAt,
    status: paidAt ? 'ok' : overdue ? 'alert' : 'warn',
    statusLabel: paidAt ? '已收款' : overdue ? '逾期未收' : '待收款',
  };
};

export const INVOICES_SEED = [
  mkInv(1, '大明商辦 3F 配電工程', '第一期 · 訂金 50%', 64200,  [0, 10], [-1, 10], null),
  mkInv(2, '大明商辦 3F 配電工程', '追加工程款',        21500,  [0, 8],  [-1, 8],  null),
  mkInv(1, '文心飯店地下機房配管', '第二期 · 完工款',   156400, [1, 20], [1, 28],  null),
  mkInv(2, '文心飯店地下機房配管', '第一期 · 訂金 50%', 156400, [3, 12], [2, 12],  [3, 26]),
  mkInv(1, '松山火鍋店冷凍配電',   '全額 · 一次付清',   92500,  [1, 10], [1, 25],  [1, 24]),
  mkInv(1, '林口集合住宅熱水管線', '第一期 · 訂金 50%', 93400,  [2, 8],  [1, 8],   [2, 20]),
  mkInv(1, '板橋誠品門市照明更新', '全額 · 一次付清',   64200,  [2, 4],  [1, 4],   [2, 18]),
  mkInv(1, '中山診所配電更新',     '全額 · 一次付清',   138600, [4, 16], [3, 16],  [4, 27]),
  mkInv(1, '內湖廠房高架配管',     '第一期 · 訂金 50%', 132300, [5, 9],  [4, 9],   [5, 21]),
  mkInv(2, '內湖廠房高架配管',     '第二期 · 完工款',   132200, [5, 22], [4, 22],  [4, 8]),
  mkInv(1, '天母住宅浴室翻新',     '全額 · 一次付清',   88700,  [7, 18], [6, 18],  [6, 2]),
  mkInv(1, '南港倉儲照明工程',     '第一期 · 訂金 50%', 59100,  [8, 7],  [7, 7],   [8, 19]),
  mkInv(2, '南港倉儲照明工程',     '第二期 · 完工款',   59100,  [8, 24], [7, 24],  [7, 6]),
  mkInv(1, '竹北接待中心水電',     '第一期 · 訂金 50%', 171000, [10, 14],[9, 14],  [10, 27]),
  mkInv(2, '竹北接待中心水電',     '第二期 · 完工款',   171000, [9, 5],  [8, 5],   [9, 19]),
  mkInv(1, '老屋全室管線重拉',     '全額 · 一次付清',   154800, [11, 11],[10, 11], [11, 25]),
];

// 報價單抬頭（工程行自家資料 — 之後移到設定頁）
export const COMPANY = {
  name: '宏達水電工程行',
  gui: '12345675',
  phone: '02-2723-1234',
  address: '台北市信義區松德路 12 號 1F',
  bank: '第一銀行 信義分行 · 123-45-678901',
};
