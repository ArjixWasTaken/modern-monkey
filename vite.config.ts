import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

// Vite plugins
import vue from "@vitejs/plugin-vue";
import webExt from "vite-plugin-web-extension";

// Utilities
import { readJsonFile as json } from "vite-plugin-web-extension";
import { parse as parseYaml } from "yaml";

const yaml = (path: string) => parseYaml(readFileSync(path, "utf-8"));

const generateManifest = () => {
  const manifest = yaml("src/manifest.yml");
  const pkg = json("package.json");

  return {
    version: pkg.version,
    ...manifest,
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    webExt({
      manifest: generateManifest,
      watchFilePaths: ["package.json", "src/manifest.yml"],
      browser: "firefox"
    }),
  ],
});
