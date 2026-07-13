import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base is overridden by the GitHub Pages workflow via --base
export default defineConfig({
  plugins: [react()],
  base: './',
});
