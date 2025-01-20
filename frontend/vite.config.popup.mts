import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  define: {
    "process.env.NODE_ENV": "'development'",
    'process.env.VITE_API_HOST' : JSON.stringify(process.env.VITE_API_HOST)
  },
  plugins: [react()],
  base: "./",
  build: {
    minify: "terser",
    terserOptions: {
      format: {
        ascii_only: true,
      },
    },
    rollupOptions: {
      input: {
        popup: "popup.html",
      },
    },
    outDir: "dist/popup",
  },
});
