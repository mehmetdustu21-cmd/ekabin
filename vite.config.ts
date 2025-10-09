import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/predict': {
        target: 'https://kwai-kolors-kolors-virtual-try-on.hf.space',
        changeOrigin: true,
        rewrite: (path) => '/api/predict',
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔥 Proxying:', req.url);
          });
        }
      }
    }
  }
})