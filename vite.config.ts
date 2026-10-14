import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Single Vite config for the static site.
// - root: client/ (index.html, public/ with 404.html and CNAME)
// - base: '/' because the site is served at the root of marathon-supporter.com
// - outDir: dist/ at the repo root, uploaded as-is by .github/workflows/deploy.yml
export default defineConfig({
  root: path.resolve(__dirname, "client"),
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});
