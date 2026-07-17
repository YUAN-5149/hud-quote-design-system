/**
 * 商工登記查詢代理 — Cloudflare Worker
 *
 * 用途：經濟部商工行政資料開放平臺 API 沒有 CORS 標頭，瀏覽器無法直接呼叫；
 * 此 Worker 負責轉發請求並補上 CORS，讓報價系統前端能查詢統編／公司名稱。
 *
 * 部署步驟（免費，約 5 分鐘）：
 *   1. 註冊 https://dash.cloudflare.com（免費方案即可，不需信用卡）
 *   2. 左側選單 Workers & Pages → Create → Create Worker → 命名（例如 gcis-proxy）→ Deploy
 *   3. 點 Edit code，把本檔案全部內容貼上取代預設程式 → Deploy
 *   4. 複製 Worker 網址（形如 https://gcis-proxy.你的帳號.workers.dev）
 *   5. 回到報價系統 → 設定 → 商工登記查詢 → 貼上網址儲存
 *
 * 安全性：僅允許轉發到 data.gcis.nat.gov.tw 的開放資料 API 路徑，
 * 其他任何路徑一律拒絕；結果於邊緣節點快取 1 小時，減少對政府平臺的請求。
 */

const UPSTREAM = 'https://data.gcis.nat.gov.tw/od/data/api';
// 僅允許 /<UUID> 形式的資料集路徑
const DATASET_PATH = /^\/[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, OPTIONS',
  'access-control-allow-headers': 'content-type',
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }
    if (request.method !== 'GET') {
      return new Response('method not allowed', { status: 405, headers: CORS });
    }

    const url = new URL(request.url);
    if (url.pathname === '/') {
      // 健康檢查（設定頁「測試連線」用）
      return new Response(JSON.stringify({ ok: true, service: 'gcis-proxy' }), {
        headers: { 'content-type': 'application/json', ...CORS },
      });
    }
    if (!DATASET_PATH.test(url.pathname)) {
      return new Response('not found', { status: 404, headers: CORS });
    }

    const upstreamUrl = UPSTREAM + url.pathname + url.search;

    // 邊緣快取 1 小時：同一查詢不重複打政府平臺
    const cache = caches.default;
    const cacheKey = new Request(upstreamUrl);
    let cached = await cache.match(cacheKey);
    if (cached) {
      const res = new Response(cached.body, cached);
      Object.entries(CORS).forEach(([k, v]) => res.headers.set(k, v));
      res.headers.set('x-cache', 'HIT');
      return res;
    }

    const upstream = await fetch(upstreamUrl, {
      headers: { 'User-Agent': 'hud-quote-gcis-proxy/1.0' },
    });
    const body = await upstream.text();

    const res = new Response(body, {
      status: upstream.status,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'cache-control': 'public, max-age=3600',
        ...CORS,
      },
    });
    if (upstream.ok) {
      await cache.put(cacheKey, res.clone());
    }
    return res;
  },
};
