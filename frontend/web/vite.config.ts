import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/core': path.resolve(__dirname, './src/core'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/store': path.resolve(__dirname, './src/store'),
    },
  },
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 3000,
    open: true,
    // Disable caching in development
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  },
  build: {
    // Generate unique hashes for files to prevent browser caching issues
    rollupOptions: {
      output: {
        // Add hash to filenames
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
    // Ensure source maps are generated for debugging
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: ['firebase', 'firebase/app', 'firebase/auth'],
  },
});

