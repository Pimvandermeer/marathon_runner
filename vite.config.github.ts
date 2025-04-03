
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import themePlugin from '@replit/vite-plugin-shadcn-theme-json';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Copy theme.json to client directory if it doesn't exist
try {
  if (!fs.existsSync(path.resolve(__dirname, './client/theme.json'))) {
    fs.copyFileSync(
      path.resolve(__dirname, './theme.json'),
      path.resolve(__dirname, './client/theme.json')
    )
  }
} catch (error) {
  console.error('Error handling theme.json:', error)
}

export default defineConfig({
  base: './',
  plugins: [
    react(),
    themePlugin(),
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
  root: path.resolve(__dirname, 'client'),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: true
  },
});
