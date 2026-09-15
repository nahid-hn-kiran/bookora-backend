import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: { server: "src/server.ts" },
    outDir: "dist",
    format: ["esm"],
    platform: "node",
    target: "es2023",
    bundle: true,
    splitting: false,
    skipNodeModulesBundle: true,
  },
  {
    entry: { index: "api/index.ts" },
    outDir: "api",
    format: ["esm"],
    platform: "node",
    target: "es2023",
    bundle: true,
    splitting: false,
    skipNodeModulesBundle: true,
  },
]);
