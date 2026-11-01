import {version} from './package.json';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react(),{name:'product-version',transformIndexHtml:html=>html.replaceAll('__PRODUCT_VERSION__',version)}],
  build: { target: 'es2022', chunkSizeWarningLimit: 800, rollupOptions: { output: { codeSplitting: { groups: [
    // Keep the shared lazy-import helper out of the Pixi dependency group.
    {name:'preload',test:/vite\/preload-helper/,priority:100},
    {debugName:'existing-vendors',name(id) {
      if(!id.includes('node_modules'))return;
      if(/pixi/.test(id))return 'pixi';
      if(/react|zustand/.test(id))return 'ui';
      if(/howler|zzfx/.test(id))return 'audio';
      if(/gsap/.test(id))return 'animation';
    }},
  ]} } } },
  test: { include: ['tests/unit/core.test.ts','tests/unit/v3-*.test.ts','tests/unit/v4-*.test.ts','tests/unit/v5-*.test.ts'], environment: 'node' },
});
