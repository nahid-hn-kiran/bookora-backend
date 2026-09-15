import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/app.ts", "src/server.ts"],
  format: ["esm"],
  platform: "node",
  target: "es2023",
  outDir: "dist",
  clean: true,
  bundle: true,
  splitting: false,
  skipNodeModulesBundle: true,
});
