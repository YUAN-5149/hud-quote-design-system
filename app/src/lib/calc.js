// 報價金額計算 — 純函式，與畫面無關，方便測試。
// 這是全系統唯一的金額真實來源；報價單、請款單、列印版都必須走這裡，
// 否則同一張單在不同畫面會算出不同的錢。

export const TAX_RATE = 0.05; // 台灣營業稅

// 單一項目小計。數量與單價一律轉數字，避免表單傳進來的字串變成字串相接。
export const lineTotal = (item) => (Number(item?.qty) || 0) * (Number(item?.price) || 0);

// 回傳 { subtotal, tax, total }
// taxInc 為 false 時不計稅（報價以未稅呈現）。
// 稅額四捨五入到元 — 台灣發票不記小數位。
export function quoteTotals(items = [], taxInc = true) {
  const subtotal = items.reduce((sum, it) => sum + lineTotal(it), 0);
  const tax = taxInc ? Math.round(subtotal * TAX_RATE) : 0;
  return { subtotal, tax, total: subtotal + tax };
}
