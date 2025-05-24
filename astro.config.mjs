import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  outDir: 'dist',
  publicDir: 'public',
  build: {
    format: 'file',
    assets: 'assets'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'scripts/[name].js',
          chunkFileNames: 'scripts/[name].js',
          assetFileNames: 'assets/[name][extname]'
        }
      }
    }
  }
});
