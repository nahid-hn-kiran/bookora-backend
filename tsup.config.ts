import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  platform: "node",
  target: "es2023",
  outDir: "dist",
  clean: true,
  bundle: true,
  splitting: false,
  skipNodeModulesBundle: true,
});
