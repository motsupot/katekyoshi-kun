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
  description: "AI家庭教師くんです。",
  version: "1.0.0",
  permissions: ["storage", "activeTab"],
  icons: {
    "128": "kateikyoushi_woman_boy.png",
  },
  content_scripts: [
    {
      js: ["src/content.ts"],
      matches: ["<all_urls>"],
    },
  ],
  action: {
    default_popup: "src/popup.html",
    default_icon: "kateikyoushi_woman_boy.png",
  },
});

export default defineConfig({
  plugins: [/*viteManifestHackIssue846*/, crx({ manifest })],
  build: {
    // 出力設定
    outDir: "dist", // 出力先
    emptyOutDir: true,
    rollupOptions: {
      input: {
        content: "src/content.ts", // 入力ファイル
      },
      output: {
        entryFileNames: "assets/[name].js", // 出力ファイル名
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
