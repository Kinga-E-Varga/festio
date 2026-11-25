/*
 * Runs `diff.ts` through Vite, which understands the library's
 * `import.meta.glob` and the `@/` paths:
 *   node .claude/skills/template/run.mjs drafts/templates/<id>.json
 */
import { createServer } from "vite";

const file = process.argv[2];
if (!file) {
  console.error("Usage: run.mjs drafts/templates/<id>.json");
  process.exit(1);
}

const server = await createServer({
  configFile: false,
  logLevel: "error",
  appType: "custom",
  resolve: { tsconfigPaths: true },
  server: { middlewareMode: true, hmr: false, ws: false },
  optimizeDeps: { noDiscovery: true, include: [] },
});
try {
  const { diff } = await server.ssrLoadModule(
    "/.claude/skills/template/diff.ts",
  );
  diff(file);
} finally {
  await server.close();
}
