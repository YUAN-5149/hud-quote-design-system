import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { readFileSync } from 'node:fs';

// 版本與建置日期取自實際來源，狀態列不再顯示編造的版號
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const buildDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');

// base is overridden by the GitHub Pages deploy script via --base
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        name: '水電報價 HUD',
        short_name: '水電報價',
        description: '水電工程報價、請款與庫存管理主控台',
        lang: 'zh-Hant',
        display: 'standalone',
        orientation: 'any',
        theme_color: '#060C16',
        background_color: '#060C16',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // 靜態資源預快取；bundle 含 Firebase SDK 較大，放寬上限
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        // Firestore/Auth 連線交給 Firebase SDK 自己的離線機制，SW 一律不攔
        navigateFallbackDenylist: [/^\/hud-quote-design-system\/(?!app)/],
        runtimeCaching: [
          {
            // Google Fonts 樣式與字型檔快取一年，離線時字體仍可用
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 24, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
  build: {
    rollupOptions: {
      output: {
        // 分開 vendor：改 App 程式碼時 firebase/react 的快取不會失效
        manualChunks: {
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
});
