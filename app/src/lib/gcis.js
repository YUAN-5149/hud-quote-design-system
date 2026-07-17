// 經濟部商工行政資料開放平臺 — 統編驗證與名稱查詢
// 透過自架的 Cloudflare Worker 代理呼叫（平臺 API 無 CORS，瀏覽器不能直連）
// 代理網址存於設定（settings/company.gcisProxy）；未設定時所有函式回 { off: true }，
// 介面退回本機檢核碼驗證，不影響既有流程。

// 官方資料集 UUID（取自 data.gcis.nat.gov.tw Swagger，均已實測）
const DS = {
  TYPE_CHECK: '673F0FC0-B3A7-429F-9041-E9866836B66D',   // 統編查是否為公司/分公司/商業
  COMPANY_BASIC: '5F64D864-61CB-4D0D-8AD9-492047CC1EA6', // 公司登記基本資料-應用一
  BUSINESS_BASIC: '7E6AFA72-AD6A-46D3-8681-ED77951D912D', // 商業登記基本資料-應用一
  COMPANY_KEYWORD: '6BBA2268-1367-4B42-9CCA-BC17499EBE8C', // 公司登記關鍵字查詢
};

const normalizeProxy = (proxy) => (proxy || '').trim().replace(/\/+$/, '');

async function call(proxy, dataset, filter, top = 5) {
  const base = normalizeProxy(proxy);
  if (!base) return { off: true };
  const url = `${base}/${dataset}?` + new URLSearchParams({
    $format: 'json', $filter: filter, $skip: '0', $top: String(top),
  });
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 9000);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    if (!r.ok) return { error: `查詢失敗 (HTTP ${r.status})` };
    const text = await r.text();
    try {
      const data = JSON.parse(text);
      return { data: Array.isArray(data) ? data : [] };
    } catch {
      // 平臺以 200 + 文字訊息回覆「查無資料」等情況
      return { data: [] };
    }
  } catch (e) {
    return { error: e.name === 'AbortError' ? '查詢逾時' : '無法連線查詢服務' };
  } finally {
    clearTimeout(timer);
  }
}

// 測試代理連線（設定頁用）
export async function gcisPing(proxy) {
  const base = normalizeProxy(proxy);
  if (!base) return { error: '請先填寫代理網址' };
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const r = await fetch(base + '/', { signal: ctrl.signal });
    clearTimeout(timer);
    const j = await r.json().catch(() => null);
    return j?.ok ? { ok: true } : { error: '回應格式不符（請確認貼的是 Worker 網址）' };
  } catch {
    return { error: '無法連線（網址錯誤或 Worker 未部署）' };
  }
}

// 驗證統編：回 { ok, type, name, status } / { notFound } / { off } / { error }
export async function gcisVerify(proxy, gui) {
  if (!/^\d{8}$/.test(gui)) return { error: '統編須為 8 位數字' };

  const check = await call(proxy, DS.TYPE_CHECK, `Business_Accounting_NO eq ${gui}`, 5);
  if (check.off || check.error) return check;
  const kinds = (check.data || []).filter(x => x.exist === 'Y').map(x => x.TYPE);
  if (!kinds.length) return { notFound: true };

  // 依類別帶出名稱與登記狀態
  if (kinds.includes('公司') || kinds.includes('分公司')) {
    const co = await call(proxy, DS.COMPANY_BASIC, `Business_Accounting_NO eq ${gui}`, 1);
    const row = co.data?.[0];
    return {
      ok: true,
      type: kinds.includes('公司') ? '公司' : '分公司',
      name: row?.Company_Name || '',
      status: row?.Company_Status_Desc || '',
    };
  }
  const biz = await call(proxy, DS.BUSINESS_BASIC, `President_No eq ${gui}`, 1);
  const row = biz.data?.[0];
  return {
    ok: true,
    type: '商業',
    name: row?.Business_Name || '',
    status: row?.Business_Current_Status_Desc || '',
  };
}

// 公司名稱關鍵字查統編（行號無官方關鍵字 API，僅支援公司）
export async function gcisSearchCompany(proxy, keyword) {
  const kw = (keyword || '').trim();
  if (kw.length < 2) return { error: '請輸入至少 2 個字' };
  const r = await call(
    proxy, DS.COMPANY_KEYWORD,
    `Company_Name like ${kw} and Company_Status eq 01`, 10
  );
  if (r.off || r.error) return r;
  return {
    results: (r.data || []).map(x => ({
      gui: x.Business_Accounting_NO,
      name: x.Company_Name,
      status: x.Company_Status_Desc,
    })),
  };
}
