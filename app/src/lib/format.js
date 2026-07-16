// 金額格式化工具
export const fmt = (n) => 'NT$ ' + (n || 0).toLocaleString();

// 新台幣大寫金額（報價單／請款單正式文件用）
const DIGITS = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'];
const UNITS = ['', '拾', '佰', '仟'];
const GROUPS = ['', '萬', '億', '兆'];

export function toChineseUpper(n) {
  n = Math.round(Math.abs(+n || 0));
  if (n === 0) return '新台幣零元整';
  let out = '';
  let gi = 0;
  while (n > 0) {
    const seg = n % 10000;
    if (seg > 0) {
      let segStr = '';
      let zero = false;
      let s = seg;
      for (let i = 0; s > 0; i++) {
        const d = s % 10;
        if (d === 0) {
          if (segStr && !zero) { segStr = DIGITS[0] + segStr; zero = true; }
        } else {
          segStr = DIGITS[d] + UNITS[i] + segStr;
          zero = false;
        }
        s = Math.floor(s / 10);
      }
      out = segStr + GROUPS[gi] + out;
    } else if (out && !out.startsWith(DIGITS[0])) {
      out = DIGITS[0] + out;
    }
    n = Math.floor(n / 10000);
    gi++;
  }
  return '新台幣' + out + '元整';
}

// 統一編號檢核（台灣財政部演算法，含 2021 新制）
export function validateGUI(gui) {
  if (!/^\d{8}$/.test(gui)) return false;
  const weights = [1, 2, 1, 2, 1, 2, 4, 1];
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    const p = +gui[i] * weights[i];
    sum += Math.floor(p / 10) + (p % 10);
  }
  if (sum % 5 === 0) return true;
  // 第 7 碼為 7 時，該位乘積可視為 1，即總和 +1 可被 5 整除
  if (gui[6] === '7' && (sum + 1) % 5 === 0) return true;
  return false;
}

// 從台灣地址擷取路名（含段別）
// 台北市信義區松高路 19 號 3F → 松高路
// 台北市大安區忠孝東路四段 216 巷 → 忠孝東路四段
export const roadName = (addr = '') => {
  // 先去掉縣市前綴（含縣轄市，如「新竹縣竹北市」），比對才不會把「市」算進路名
  const s = addr.replace(/^\s*[一-龥]{2,3}[縣市](?:[^區\s]{2,3}市)?/, '');
  // 路名不跨越行政區字（區鄉鎮村里）；後面須接空白／號碼／結尾，避免誤抓「沒有路名」這類敘述
  const m = s.match(/[^縣區鄉鎮村里\s\d]{1,6}?(?:大道|路|街)(?:[一二三四五六七八九十]+段)?(?=[\s\d]|$)/);
  return m ? m[0] : '';
};

// 報價編號：Q-YYYYMMDD-NN（開立日 + 當日流水號）
export const nextQuoteNo = (quotes = [], dateISO) => {
  const ymd = (dateISO || todayISO()).replace(/-/g, '');
  const prefix = `Q-${ymd}-`;
  const used = quotes
    .filter(q => typeof q.id === 'string' && q.id.startsWith(prefix))
    .map(q => parseInt(q.id.slice(prefix.length), 10) || 0);
  const n = (used.length ? Math.max(...used) : 0) + 1;
  return `${prefix}${String(n).padStart(2, '0')}`;
};

// ISO 日期加 n 天
export const addDays = (dateISO, days) => {
  const d = new Date(dateISO);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// ISO 日期 (YYYY-MM-DD) → MM/DD 顯示
export const fmtMD = (s) => (s && s.length >= 10 ? `${s.slice(5, 7)}/${s.slice(8, 10)}` : '—');

export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const todayYMD = () => {
  const d = new Date();
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
};
