import { describe, it, expect } from 'vitest';
import { quoteTotals, lineTotal, TAX_RATE } from './calc.js';

describe('lineTotal', () => {
  it('數量乘單價', () => {
    expect(lineTotal({ qty: 3, price: 250 })).toBe(750);
  });

  it('表單傳進字串時仍照數字相乘，不做字串相接', () => {
    expect(lineTotal({ qty: '3', price: '250' })).toBe(750);
  });

  it('缺欄位或非數字視為 0', () => {
    expect(lineTotal({})).toBe(0);
    expect(lineTotal({ qty: 5 })).toBe(0);
    expect(lineTotal({ qty: 'abc', price: 100 })).toBe(0);
    expect(lineTotal(null)).toBe(0);
  });
});

describe('quoteTotals', () => {
  it('空單為零', () => {
    expect(quoteTotals([])).toEqual({ subtotal: 0, tax: 0, total: 0 });
  });

  it('多項目加總後課 5% 稅', () => {
    const items = [
      { qty: 2, price: 1000 },
      { qty: 1, price: 3000 },
    ];
    expect(quoteTotals(items, true)).toEqual({ subtotal: 5000, tax: 250, total: 5250 });
  });

  it('taxInc 為 false 時不課稅，總計等於小計', () => {
    const items = [{ qty: 1, price: 5000 }];
    expect(quoteTotals(items, false)).toEqual({ subtotal: 5000, tax: 0, total: 5000 });
  });

  it('稅額四捨五入到元 — 發票不記小數位', () => {
    // 1234 * 0.05 = 61.7 → 62
    expect(quoteTotals([{ qty: 1, price: 1234 }], true).tax).toBe(62);
    // 1230 * 0.05 = 61.5 → 62（.5 進位）
    expect(quoteTotals([{ qty: 1, price: 1230 }], true).tax).toBe(62);
    // 1210 * 0.05 = 60.5 → 61
    expect(quoteTotals([{ qty: 1, price: 1210 }], true).tax).toBe(61);
  });

  it('總計恆等於小計加稅額，不會因分開四捨五入而對不起來', () => {
    const items = [{ qty: 7, price: 333 }, { qty: 3, price: 149 }];
    const { subtotal, tax, total } = quoteTotals(items, true);
    expect(total).toBe(subtotal + tax);
  });

  it('預設含稅', () => {
    expect(quoteTotals([{ qty: 1, price: 100 }])).toEqual(quoteTotals([{ qty: 1, price: 100 }], true));
  });

  it('稅率為 5%', () => {
    expect(TAX_RATE).toBe(0.05);
  });
});
