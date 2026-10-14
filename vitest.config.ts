import { defineConfig } from "vitest/config";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Standalone Vitest config (not merged with vite.config.ts, whose root is
// client/; merging would make the include glob resolve under client/client/).
// Aliases mirror vite.config.ts exactly.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  test: {
    environment: "jsdom",
    include: ["client/src/**/*.test.{ts,tsx}"],
  },
});
