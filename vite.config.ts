import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// WhatsApp and Facebook read og tags from the static HTML without running
// JavaScript, so the English link preview is a copy of index.html at /en/.
// Each replacement must hit exactly once, so a changed tag fails the build.
const ENGLISH_HEAD: [RegExp, string][] = [
  [/<html lang="nl">/, '<html lang="en">'],
  [/<title>[^<]*<\/title>/, "<title>Marathon Supporter: see your runner more than once</title>"],
  [/<link rel="canonical" href="[^"]*" \/>/, '<link rel="canonical" href="https://marathon-supporter.com/en/" />'],
  [/"url": "https:\/\/marathon-supporter\.com\/"/, '"url": "https://marathon-supporter.com/en/"'],
  [/"description": "[^"]*"/, '"description": "Unofficial supporter planner: enter start wave and pace and see when your runner passes each metro, tram and train stop along the marathon course. Share the plan with one link."'],
  [/"inLanguage": "nl"/, '"inLanguage": "en"'],
  [/<meta name="description" content="[^"]*" \/>/, '<meta name="description" content="See where and when to cheer your runner: passing times for every metro, tram and train stop along the marathon course. Free and unofficial." />'],
  [/<meta property="og:locale" content="nl_NL" \/>/, '<meta property="og:locale" content="en_GB" />'],
  [/<meta property="og:locale:alternate" content="en_GB" \/>/, '<meta property="og:locale:alternate" content="nl_NL" />'],
  [/<meta property="og:url" content="[^"]*" \/>/, '<meta property="og:url" content="https://marathon-supporter.com/en/" />'],
  [/<meta property="og:title" content="[^"]*" \/>/, '<meta property="og:title" content="Marathon Supporter: see your runner more than once" />'],
  [/<meta property="og:description" content="[^"]*" \/>/, '<meta property="og:description" content="Enter start wave and pace, see when your runner passes each metro, tram and train stop. Share the plan with one link." />'],
  [/<meta property="og:image" content="[^"]*" \/>/, '<meta property="og:image" content="https://marathon-supporter.com/og-image-en.png" />'],
  [/<meta property="og:image:alt" content="[^"]*" \/>/, '<meta property="og:image:alt" content="Marathon Supporter: passing times per stop along the course" />'],
];

function englishPreviewPage(): Plugin {
  return {
    name: "english-preview-page",
    apply: "build",
    enforce: "post",
    generateBundle(_, bundle) {
      const index = bundle["index.html"];
      if (!index || index.type !== "asset") throw new Error("english-preview-page: index.html not in the bundle");
      let html = String(index.source);
      for (const [pattern, replacement] of ENGLISH_HEAD) {
        const hits = html.match(new RegExp(pattern.source, "g"))?.length ?? 0;
        if (hits !== 1) throw new Error(`english-preview-page: ${pattern} matched ${hits} times in index.html`);
        html = html.replace(pattern, replacement);
      }
      this.emitFile({ type: "asset", fileName: "en/index.html", source: html });
    },
  };
}

// Single Vite config for the static site.
// - root: client/ (index.html, public/ with 404.html and CNAME)
// - base: '/' because the site is served at the root of marathon-supporter.com
// - outDir: dist/ at the repo root, uploaded as-is by .github/workflows/deploy.yml
export default defineConfig({
  root: path.resolve(__dirname, "client"),
  base: "/",
  plugins: [react(), englishPreviewPage()],
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
