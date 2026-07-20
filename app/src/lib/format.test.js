import { describe, it, expect } from 'vitest';
import { toChineseUpper, validateGUI, roadName, nextQuoteNo, addDays, fmtMD } from './format.js';

describe('toChineseUpper', () => {
  it('零', () => {
    expect(toChineseUpper(0)).toBe('新台幣零元整');
  });

  it('個位到千位', () => {
    expect(toChineseUpper(7)).toBe('新台幣柒元整');
    expect(toChineseUpper(58)).toBe('新台幣伍拾捌元整');
    expect(toChineseUpper(1234)).toBe('新台幣壹仟貳佰參拾肆元整');
  });

  it('萬位以上分節', () => {
    expect(toChineseUpper(10000)).toBe('新台幣壹萬元整');
    expect(toChineseUpper(52500)).toBe('新台幣伍萬貳仟伍佰元整');
  });

  it('中間的零只寫一次', () => {
    expect(toChineseUpper(1005)).toBe('新台幣壹仟零伍元整');
    expect(toChineseUpper(10005)).toBe('新台幣壹萬零伍元整');
  });

  it('跨節補零 — 低位不滿四位數時萬／億之後要接零', () => {
    expect(toChineseUpper(10005)).toBe('新台幣壹萬零伍元整');
    expect(toChineseUpper(100205)).toBe('新台幣壹拾萬零貳佰零伍元整');
    expect(toChineseUpper(100000005)).toBe('新台幣壹億零伍元整');
  });

  it('低位滿四位數時不補零', () => {
    expect(toChineseUpper(15005)).toBe('新台幣壹萬伍仟零伍元整');
    expect(toChineseUpper(52500)).toBe('新台幣伍萬貳仟伍佰元整');
  });

  it('小數四捨五入、負數取絕對值', () => {
    expect(toChineseUpper(99.4)).toBe('新台幣玖拾玖元整');
    expect(toChineseUpper(99.5)).toBe('新台幣壹佰元整');
    expect(toChineseUpper(-58)).toBe('新台幣伍拾捌元整');
  });

  it('非數字視為零', () => {
    expect(toChineseUpper(null)).toBe('新台幣零元整');
    expect(toChineseUpper('abc')).toBe('新台幣零元整');
  });
});

describe('validateGUI', () => {
  it('接受有效統編', () => {
    expect(validateGUI('04595257')).toBe(true); // 台積電
    expect(validateGUI('22099131')).toBe(true); // 鴻海精密
  });

  it('第 7 碼為 7 時套用 2021 新制', () => {
    // 加權和 39，本身不被 5 整除；第 7 碼為 7 時該位可視為 1，等同總和 +1
    expect(validateGUI('12345675')).toBe(true);
  });

  it('拒絕格式不符', () => {
    expect(validateGUI('1234567')).toBe(false);   // 7 碼
    expect(validateGUI('123456789')).toBe(false); // 9 碼
    expect(validateGUI('1234567a')).toBe(false);  // 含字母
    expect(validateGUI('')).toBe(false);
  });

  it('拒絕檢核碼錯誤的號碼', () => {
    expect(validateGUI('04595258')).toBe(false);
  });
});

describe('roadName', () => {
  it('去掉縣市與行政區後取路名', () => {
    expect(roadName('台北市信義區松高路 19 號 3F')).toBe('松高路');
  });

  it('保留段別', () => {
    expect(roadName('台北市大安區忠孝東路四段 216 巷')).toBe('忠孝東路四段');
  });

  it('處理縣轄市前綴', () => {
    expect(roadName('新竹縣竹北市光明六路 100 號')).toBe('光明六路');
  });

  it('找不到路名時回傳空字串', () => {
    expect(roadName('沒有路名的地址')).toBe('');
    expect(roadName('')).toBe('');
  });
});

describe('nextQuoteNo', () => {
  it('當日第一張從 01 起算', () => {
    expect(nextQuoteNo([], '2026-07-20')).toBe('Q-20260720-01');
  });

  it('接續當日最大流水號', () => {
    const quotes = [{ id: 'Q-20260720-01' }, { id: 'Q-20260720-02' }];
    expect(nextQuoteNo(quotes, '2026-07-20')).toBe('Q-20260720-03');
  });

  it('不受其他日期的單影響', () => {
    const quotes = [{ id: 'Q-20260719-07' }];
    expect(nextQuoteNo(quotes, '2026-07-20')).toBe('Q-20260720-01');
  });

  it('流水號有缺口時取最大值加一，不重複既有編號', () => {
    const quotes = [{ id: 'Q-20260720-01' }, { id: 'Q-20260720-05' }];
    expect(nextQuoteNo(quotes, '2026-07-20')).toBe('Q-20260720-06');
  });
});

describe('addDays', () => {
  it('同月內加天數', () => {
    expect(addDays('2026-07-20', 14)).toBe('2026-08-03');
  });

  it('跨年', () => {
    expect(addDays('2026-12-25', 10)).toBe('2027-01-04');
  });

  it('閏年二月', () => {
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
  });
});

describe('fmtMD', () => {
  it('ISO 轉 MM/DD', () => {
    expect(fmtMD('2026-07-20')).toBe('07/20');
  });

  it('無值時顯示破折號', () => {
    expect(fmtMD('')).toBe('—');
    expect(fmtMD(null)).toBe('—');
  });
});
