import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const siteBase = process.env.SITE_BASE || '/'

export default defineConfig({
  base: siteBase,
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'www.medagentlab.cn',
      'medagentlab.cn'
    ]
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
