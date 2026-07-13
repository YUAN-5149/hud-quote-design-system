// 種子資料 — 案件、材料庫、報價單、請款單、報表
export const CASES_SEED = [
  { id: '#2025-0418', name: '大明商辦 3F 配電工程', client: '大明建設 · 王協理', gui: '84149961', status: 'active', statusLabel: '進行中', amount: 128400, updated: '14:32', location: '台北 · 信義', progress: 62 },
  { id: '#2025-0416', name: '信義區吳公館整修', client: '吳先生', gui: '', status: 'warn', statusLabel: '待確認', amount: 48200, updated: '11:08', location: '台北 · 信義', progress: 24 },
  { id: '#2025-0411', name: '文心飯店地下機房配管', client: '文心國際酒店', gui: '20828393', status: 'alert', statusLabel: '逾期', amount: 312800, updated: '04/12', location: '台中 · 西屯', progress: 88 },
  { id: '#2025-0409', name: '松山火鍋店冷凍配電', client: '頂鍋食品', gui: '53212539', status: 'ok', statusLabel: '已付款', amount: 92500, updated: '04/10', location: '台北 · 松山', progress: 100 },
  { id: '#2025-0406', name: '林口集合住宅熱水管線', client: '日盛營造', gui: '86517312', status: 'active', statusLabel: '進行中', amount: 186700, updated: '04/15', location: '新北 · 林口', progress: 41 },
  { id: '#2025-0402', name: '板橋誠品門市照明更新', client: '誠品生活', gui: '23222367', status: 'ok', statusLabel: '已付款', amount: 64200, updated: '04/03', location: '新北 · 板橋', progress: 100 },
];

export const MATERIALS = [
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

export const LINE_ITEMS_INIT = [
  { id: 1, type: 'material', name: '無熔絲開關 NFB 3P 100A', qty: 2, unit: '個', price: 2850, cat: '材料' },
  { id: 2, type: 'material', name: 'PVC 電管 1" × 4m', qty: 24, unit: '支', price: 180, cat: '材料' },
  { id: 3, type: 'material', name: '配電盤 600×800 烤漆', qty: 1, unit: '座', price: 18500, cat: '材料' },
  { id: 4, type: 'labor', name: '配管施工 · 資深師傅', qty: 16, unit: '工時', price: 1200, cat: '工資' },
  { id: 5, type: 'labor', name: '接地測試 · 現場驗收', qty: 1, unit: '式', price: 4500, cat: '工資' },
];

export const QUOTES = [
  { id: 'Q-2025-0418-A', caseId: '#2025-0418', case: '大明商辦 3F 配電工程', version: 'v3', status: 'warn', statusLabel: '待業主簽回', amount: 128400, issued: '04/18', valid: '05/18' },
  { id: 'Q-2025-0416-A', caseId: '#2025-0416', case: '信義區吳公館整修', version: 'v1', status: 'info', statusLabel: '草稿', amount: 48200, issued: '04/16', valid: '05/16' },
  { id: 'Q-2025-0411-B', caseId: '#2025-0411', case: '文心飯店地下機房配管', version: 'v2', status: 'ok', statusLabel: '已簽回', amount: 312800, issued: '04/11', valid: '05/11' },
  { id: 'Q-2025-0409-A', caseId: '#2025-0409', case: '松山火鍋店冷凍配電', version: 'v1', status: 'ok', statusLabel: '已簽回', amount: 92500, issued: '04/09', valid: '05/09' },
  { id: 'Q-2025-0406-A', caseId: '#2025-0406', case: '林口集合住宅熱水管線', version: 'v2', status: 'alert', statusLabel: '逾期未簽', amount: 186700, issued: '04/06', valid: '04/16' },
];

// 請款單種子（BILLING）
export const INVOICES_SEED = [
  { id: 'B-2025-0411-2', caseId: '#2025-0411', case: '文心飯店地下機房配管', client: '文心國際酒店', gui: '20828393', stage: '第二期 · 完工款', amount: 156400, issued: '04/20', due: '05/05', status: 'alert', statusLabel: '逾期未收' },
  { id: 'B-2025-0418-1', caseId: '#2025-0418', case: '大明商辦 3F 配電工程', client: '大明建設', gui: '84149961', stage: '第一期 · 訂金 50%', amount: 64200, issued: '04/19', due: '05/19', status: 'warn', statusLabel: '待收款' },
  { id: 'B-2025-0409-1', caseId: '#2025-0409', case: '松山火鍋店冷凍配電', client: '頂鍋食品', gui: '53212539', stage: '全額 · 一次付清', amount: 92500, issued: '04/10', due: '04/25', status: 'ok', statusLabel: '已收款' },
  { id: 'B-2025-0402-1', caseId: '#2025-0402', case: '板橋誠品門市照明更新', client: '誠品生活', gui: '23222367', stage: '全額 · 一次付清', amount: 64200, issued: '04/04', due: '04/18', status: 'ok', statusLabel: '已收款' },
];

// 近 12 個月（05月 = 去年 5 月，依序到今年 4 月）
export const MONTHLY = [
  { m: '05月', rev: 640, cost: 402 },
  { m: '06月', rev: 578, cost: 366 },
  { m: '07月', rev: 655, cost: 391 },
  { m: '08月', rev: 690, cost: 424 },
  { m: '09月', rev: 587, cost: 355 },
  { m: '10月', rev: 612, cost: 384 },
  { m: '11月', rev: 548, cost: 362 },
  { m: '12月', rev: 724, cost: 441 },
  { m: '01月', rev: 680, cost: 412 },
  { m: '02月', rev: 512, cost: 318 },
  { m: '03月', rev: 798, cost: 476 },
  { m: '04月', rev: 842, cost: 498 },
];

export const CLIENT_DIST = [
  { name: '大明建設', value: 328, pct: 28 },
  { name: '文心酒店', value: 312, pct: 27 },
  { name: '日盛營造', value: 186, pct: 16 },
  { name: '誠品生活', value: 128, pct: 11 },
  { name: '其他 12 家', value: 204, pct: 18 },
];

// 報價單抬頭（工程行自家資料 — 之後移到設定頁）
export const COMPANY = {
  name: '宏達水電工程行',
  gui: '12345675',
  phone: '02-2723-1234',
  address: '台北市信義區松德路 12 號 1F',
  bank: '第一銀行 信義分行 · 123-45-678901',
};
