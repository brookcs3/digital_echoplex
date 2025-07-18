import { defineConfig } from 'astro/config';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  outDir: 'dist',
  publicDir: 'public',
  scopedStyleStrategy: 'class',
  devToolbar: {
    enabled: false,
  },
  server: {
    host: true,
  },
  build: {
    format: 'file',
    assets: 'assets',
    inlineStylesheets: 'never',
    minify: false,
    sourcemap: true,
  },
  vite: {
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use 'sass:math'; @use 'sass:map'; `,
        },
      },
    },
    build: {
      minify: false,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    server: {
      fs: {
        // Allow serving files from one level up to the project root
        allow: ['..'],
      },
    },
  },
});