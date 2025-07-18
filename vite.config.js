import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: ['healthcheck.railway.app', 'echoplex-js.com', '*'],
    host: true,
  },
});