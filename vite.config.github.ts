import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  // Base path for GitHub Pages deployment
  base: '/marathon_runner/',
  
  plugins: [
    react(),
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@components': path.resolve(__dirname, './client/src/components'),
      '@lib': path.resolve(__dirname, './client/src/lib'),
      '@hooks': path.resolve(__dirname, './client/src/hooks'),
      '@pages': path.resolve(__dirname, './client/src/pages'),
      '@assets': path.resolve(__dirname, './attached_assets'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },

  // For GitHub Pages, we only build the client
  // The backend won't be available, so we'll use static data
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html'),
    },
  },
});