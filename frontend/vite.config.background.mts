import { defineConfig } from "vite";

export default defineConfig({
  define: { 'process.env.MODE_ENV' : "'development'"},
  build: {
    lib: {
      entry: "src/background/index.ts",
      fileName: () => `index.js`,
      name: 'katekyoshi-kun-sw',
    },
    minify: 'terser',
    terserOptions: {
      format: {
        ascii_only: true,
      }
    },
    outDir: "dist/background",
  },
});
