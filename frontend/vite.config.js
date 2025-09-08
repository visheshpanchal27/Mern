import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      }
    }),
  ],
  publicDir: 'public',
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          ui: ['framer-motion', '@mui/material', '@mui/icons-material'],
          charts: ['apexcharts', 'react-apexcharts'],
          utils: ['axios', 'moment', 'date-fns']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      }
    },
    sourcemap: false,
    cssCodeSplit: true
  },
  server: {
    port: 5173,
    host: true,
    hmr: {
      overlay: false
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit'],
    exclude: ['@vite/client', '@vite/env']
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});
