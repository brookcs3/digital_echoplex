import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://echoplex-js.com',
  
  // Development
  devToolbar: {
    enabled: false,
  },
  server: {
    host: true,
  },
  
  // Build configuration
  build: {
    format: 'file',
    inlineStylesheets: 'never',
  },
  
  // Vite configuration for development
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use 'sass:math'; @use 'sass:map'; `,
        },
      },
    },
  },
})
