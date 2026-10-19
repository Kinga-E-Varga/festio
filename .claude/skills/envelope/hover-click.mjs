// Hover the envelope, click, screenshot shortly after. usage: node hoverclick.mjs <chrome> <url> <out.png> <msAfterClick>
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
const [chrome, url, out, after] = process.argv.slice(2);
const port = 9334;
const proc = spawn(chrome, [
  "--no-sandbox",
  `--remote-debugging-port=${port}`,
  "about:blank",
]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 50; i++) {
  try {
    targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    if (targets.some((t) => t.type === "page")) break;
  } catch {}
  await sleep(200);
}
const ws = new WebSocket(
  targets.find((t) => t.type === "page").webSocketDebuggerUrl,
);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
  }
});
const send = (method, params = {}) =>
  new Promise((res) => {
    const i = ++id;
    pending.set(i, res);
    ws.send(JSON.stringify({ id: i, method, params }));
  });
const ev = async (e) =>
  (
    await send("Runtime.evaluate", {
      expression: e,
      returnByValue: true,
      awaitPromise: true,
    })
  ).result.result.value;
await send("Emulation.setDeviceMetricsOverride", {
  width: 1100,
  height: 1000,
  deviceScaleFactor: 1,
  mobile: false,
});
await send("Page.navigate", { url });
await sleep(2500);
const r = await ev(
  `(() => { const b = (document.querySelector('.env-hit') ?? document.getElementById('hit')).getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`,
);
await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: r.x, y: r.y });
await sleep(800);
await send("Input.dispatchMouseEvent", {
  type: "mousePressed",
  x: r.x,
  y: r.y,
  button: "left",
  clickCount: 1,
});
await send("Input.dispatchMouseEvent", {
  type: "mouseReleased",
  x: r.x,
  y: r.y,
  button: "left",
  clickCount: 1,
});
await sleep(Number(after));
const shot = await send("Page.captureScreenshot", { format: "png" });
writeFileSync(out, Buffer.from(shot.result.data, "base64"));
ws.close();
proc.kill();
