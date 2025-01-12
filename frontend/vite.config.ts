import { PluginOption, defineConfig } from "vite";
import { crx, defineManifest } from "@crxjs/vite-plugin";

// Pluginは非推奨のため、PluginOptionを使う
const viteManifestHackIssue846: PluginOption & {
  renderCrxManifest: (manifest: any, bundle: any) => void;
} = {
  // Workaround from https://github.com/crxjs/chrome-extension-tools/issues/846#issuecomment-1861880919.
  name: "manifestHackIssue846",
  renderCrxManifest(_manifest, bundle) {
    bundle["manifest.json"] = bundle[".vite/manifest.json"];
    bundle["manifest.json"].fileName = "manifest.json";
    delete bundle[".vite/manifest.json"];
  },
};

const manifest = defineManifest({
  manifest_version: 3,
  name: "AI家庭教師くん",
  version: "1.0.0",
  description: "AI家庭教師くんです。",
  permissions: ["storage", "activeTab"],
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content.ts"], // ビルド後のファイルを指定
    },
  ],
  web_accessible_resources: [
    {
      matches: ["<all_urls>"],
      resources: ["src/content.ts"],
    },
  ],
  content_security_policy: {
    extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';",
  },
  action: {
    default_popup: "src/popup.html",
    default_icon: "kateikyoushi_woman_boy.png",
  },
});

export default defineConfig({
  plugins: [viteManifestHackIssue846, crx({ manifest })],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
