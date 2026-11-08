import { describe, it, expect } from 'vitest';
import { docId } from './store.js';

describe('docId', () => {
  it('一般代碼維持不變（既有資料照常對應）', () => {
    expect(docId('NFB-2P-20')).toBe('NFB-2P-20');
    expect(docId('PVC 電管 1" × 4m')).toBe('PVC 電管 1" × 4m');
    expect(docId('#2026-1108')).toBe('#2026-1108');
  });
  it('含斜線的代碼轉成合法 ID', () => {
    expect(docId('PVC三通1又1/2" OT')).toBe('PVC三通1又1%2F2" OT');
    expect(docId('a/b/c')).not.toContain('/');
  });
  it('Firestore 保留名稱也轉成合法 ID', () => {
    expect(docId('.')).not.toBe('.');
    expect(docId('..')).not.toBe('..');
    expect(docId('__x__')).not.toMatch(/^__.*__$/);
  });
});
