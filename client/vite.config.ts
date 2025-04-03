import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import themePlugin from '@replit/vite-plugin-shadcn-theme-json'
import path from 'path'
import fs from 'fs'

// Copy theme.json to client directory if it doesn't exist
try {
  if (!fs.existsSync(path.resolve(__dirname, './theme.json'))) {
    fs.copyFileSync(
      path.resolve(__dirname, '../theme.json'),
      path.resolve(__dirname, './theme.json')
    )
  }
} catch (error) {
  console.error('Error handling theme.json:', error)
}

export default defineConfig({
  plugins: [
    react(),
    themePlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, '../attached_assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@shared': path.resolve(__dirname, '../shared')
    }
  },
  build: {
    outDir: '../static-build',
    emptyOutDir: true,
  }
})