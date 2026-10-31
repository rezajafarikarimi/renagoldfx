import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const previewMode = process.env.BASE44_PREVIEW_MODE === '1';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://localhost:4000',
        changeOrigin: false,
      },
    },
    // The preview is served over HTTPS through a proxy, so HMR must use wss on 443.
    ...(previewMode ? { hmr: { protocol: 'wss', clientPort: 443 } } : {}),
  },
});
