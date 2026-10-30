import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: { target: 'es2022', chunkSizeWarningLimit: 800, rollupOptions: { output: { manualChunks(id) {
    if(!id.includes('node_modules'))return;
    if(/pixi/.test(id))return 'pixi';
    if(/react|zustand/.test(id))return 'ui';
    if(/howler|zzfx/.test(id))return 'audio';
    if(/gsap/.test(id))return 'animation';
  } } } },
  test: { include: ['tests/unit/core.test.ts','tests/unit/v3-*.test.ts'], environment: 'node' },
});
