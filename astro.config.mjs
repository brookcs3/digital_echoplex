import { defineConfig } from 'astro/config'
import { resolve } from 'path'

// https://astro.build/config
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
    rollupOptions: {
      output: {
        entryFileNames: 'scripts/[name].js',
        chunkFileNames: 'scripts/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
  vite: {
    server: {
      allowedHosts: ['healthcheck.railway.app', 'echoplex-js.com'],
    },
    resolve: {
      alias: {
        '@': resolve('./src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/_echoplex" as *;`,
        },
      },
    },
  },
})