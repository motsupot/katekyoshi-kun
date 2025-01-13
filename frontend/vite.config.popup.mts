import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"

export default defineConfig({
  define: { 'process.env.MODE_ENV' : "'development'"},
  plugins: [react()],
  base: "./",
  build: {
    minify: 'terser',
    terserOptions: {
      format: {
        ascii_only: true,
      }
    },
    outDir: "dist/popup",
  },
});
