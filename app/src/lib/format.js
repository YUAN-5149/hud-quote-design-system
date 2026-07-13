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
