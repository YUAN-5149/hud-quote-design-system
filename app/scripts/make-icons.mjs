// 從 icon-src.svg 產生 PWA 各尺寸圖示到 public/
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, 'icon-src.svg');
const out = join(root, 'public');
mkdirSync(out, { recursive: true });

// 一般圖示（含圓角的完整畫面）
await sharp(src).resize(192, 192).png().toFile(join(out, 'pwa-192.png'));
await sharp(src).resize(512, 512).png().toFile(join(out, 'pwa-512.png'));
await sharp(src).resize(180, 180).png().toFile(join(out, 'apple-touch-icon.png'));

// maskable：內容縮到 80% 安全區，底色補滿
const inner = await sharp(src).resize(410, 410).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#060C16' } })
  .composite([{ input: inner, gravity: 'center' }])
  .png()
  .toFile(join(out, 'pwa-maskable-512.png'));

console.log('icons generated');
