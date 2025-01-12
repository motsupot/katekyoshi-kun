import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        background: 'src/background/index.ts',
        content: 'src/content/index.ts',
        popup: 'src/popup/index.html',
      },
    },
    outDir: 'dist',
  },
});

