import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  server: {
    host: "localhost",
    port: 2029,
    strictPort: true,
    open: true,
  },
  preview: {
    host: "localhost",
    port: 2029,
    open: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
