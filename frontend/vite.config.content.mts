import { defineConfig } from "vite";

export default defineConfig({
  define: {
    "process.env.NODE_ENV": "'development'",
    'process.env.VITE_API_HOST' : JSON.stringify(process.env.VITE_API_HOST)
  },
  build: {
    lib: {
      entry: "src/content/index.ts",
      fileName: () => `index.js`,
      name: "katekyoshi-kun-content",
    },
    minify: "terser",
    terserOptions: {
      format: {
        ascii_only: true,
      },
    },
    outDir: "dist/content",
  },
});
