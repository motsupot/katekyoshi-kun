import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"

export default defineConfig({
  define: { 'process.env.NODE_ENV' : "'development'"},
  plugins: [react()],
  base: "./",
  build: {
    minify: 'terser',
    terserOptions: {
      format: {
        ascii_only: true,
      }
    },
    rollupOptions: {
      input: {
        popup: 'sidepanel.html',
      },
    },
    outDir: "dist/sidepanel",
  },
});
