
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: './',
  plugins: [react()],
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
  root: path.resolve(__dirname, 'client'),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: true
  },
});
