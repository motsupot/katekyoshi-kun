import { PluginOption, defineConfig } from 'vite';
import { crx, defineManifest } from '@crxjs/vite-plugin';

// Pluginは非推奨のため、PluginOptionを使う
const viteManifestHackIssue846: PluginOption & {
  renderCrxManifest: (manifest: any, bundle: any) => void;
} = {
  // Workaround from https://github.com/crxjs/chrome-extension-tools/issues/846#issuecomment-1861880919.
  name: 'manifestHackIssue846',
  renderCrxManifest(_manifest, bundle) {
    bundle['manifest.json'] = bundle['.vite/manifest.json'];
    bundle['manifest.json'].fileName = 'manifest.json';
    delete bundle['.vite/manifest.json'];
  },
};

const manifest = defineManifest({
  manifest_version: 3,
  name: '家庭教師くん',
  version: '1.0.0',
  description: '家庭教師エージェントです。',
  content_scripts: [
    {
      matches: ['https://zenn.dev/topics/*'],
      js: ['src/content.ts'],
    },
  ],
  background: {
    service_worker: "src/background.ts"
  },
  action: {
    default_popup: 'index.html',
    default_icon: "kateikyoushi_woman_boy.png"
  },
});

export default defineConfig({
  plugins: [viteManifestHackIssue846, crx({ manifest })],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
