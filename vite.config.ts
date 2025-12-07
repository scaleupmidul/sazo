// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'app-utils': ['zustand', 'bcryptjs'],
          'ui-icons': ['lucide-react'] // Split heavy icons into separate chunk to unblock main thread
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
