// analyze.mjs <dir>: one row of numbers per Chrome trace (*.json.gz) in <dir>, all in ms.
//   fcp, lcp, tbt   load traces only, from navigation start
//   mainBusy        main-thread task time; style, layout, paint are parts of it
//   raster, gpu     tile raster and GPU-process task time: the cost of re-running filters
//   dropped         frames the compositor reported dropped
//   fps, frame*     from requestAnimationFrame intervals recorded by the driver; over33 = frames slower than 30 fps
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import path from "node:path";
const dir = process.argv[2];
const ms = (us) => +(us / 1000).toFixed(0);
const pct = (a, p) => a.length ? a[Math.min(a.length - 1, Math.floor(a.length * p))] : 0;
const rows = [];
for (const file of readdirSync(dir).filter((f) => f.endsWith(".json.gz")).sort()) {
  const raw = JSON.parse(gunzipSync(readFileSync(path.join(dir, file))));
  const ev = raw.traceEvents ?? raw;
  // The page's renderer: the process whose main thread ran the last navigationStart of the main frame.
  const navs = ev.filter((e) => e.name === "navigationStart" && e.args?.data?.isOutermostMainFrame && /^http/.test(e.args.data.documentLoaderURL ?? ""));
  const mainName = ev.filter((e) => e.name === "thread_name" && e.args.name === "CrRendererMain");
  const paintPid = (() => { const c = new Map(); for (const e of ev) if (e.name === "Paint" || e.name === "UpdateLayoutTree") c.set(e.pid, (c.get(e.pid) ?? 0) + 1); return [...c].sort((a, b) => b[1] - a[1])[0]?.[0]; })();
  const pid = navs.at(-1)?.pid ?? paintPid;
  const tid = mainName.find((e) => e.pid === pid)?.tid;
  const nav = navs.at(-1);
  const isLoad = file.startsWith("load");
  const span = ev.filter((e) => e.ts > 0 && (pid === undefined || e.pid === pid));
  const start = isLoad && nav ? nav.ts : Math.min(...span.map((e) => e.ts));
  const end = Math.max(...span.map((e) => e.ts + (e.dur ?? 0)));
  const sum = (name, f = () => true) => ms(ev.filter((e) => e.name === name && e.ph === "X" && e.ts >= start && f(e)).reduce((a, e) => a + e.dur, 0));
  const onMain = (e) => e.pid === pid && e.tid === tid;
  const tasks = ev.filter((e) => e.name === "RunTask" && e.ph === "X" && onMain(e) && e.ts >= start);
  const row = { trace: file.replace(".json.gz", ""), seconds: +((end - start) / 1e6).toFixed(1) };
  if (isLoad && nav) {
    const mark = (n) => { const m = ev.filter((e) => e.name === n && e.pid === pid && e.ts >= nav.ts).at(-1); return m ? ms(m.ts - nav.ts) : null; };
    row.fcp = mark("firstContentfulPaint");
    row.lcp = mark("largestContentfulPaint::Candidate");
    const fcpTs = nav.ts + (row.fcp ?? 0) * 1000;
    row.tbt = ms(tasks.filter((e) => e.ts >= fcpTs).reduce((a, e) => a + Math.max(0, e.dur - 50000), 0));
  }
  row.longTasks = tasks.filter((e) => e.dur > 50000).length;
  row.maxTask = ms(Math.max(0, ...tasks.map((e) => e.dur)));
  row.blocking = ms(tasks.reduce((a, e) => a + Math.max(0, e.dur - 50000), 0));
  row.mainBusy = ms(tasks.reduce((a, e) => a + e.dur, 0));
  row.style = sum("UpdateLayoutTree", onMain);
  row.layout = sum("Layout", onMain);
  row.paint = sum("Paint", onMain) + sum("PrePaint", onMain) + sum("Layerize", onMain);
  row.raster = sum("RasterTask");
  row.gpu = sum("GPUTask");
  row.rasterTasks = ev.filter((e) => e.name === "RasterTask" && e.ts >= start).length;
  row.mainFrames = ev.filter((e) => e.name === "BeginMainThreadFrame" && e.pid === pid && e.ts >= start).length;
  row.drawn = ev.filter((e) => e.name === "DrawFrame" && e.ts >= start).length;
  row.dropped = ev.filter((e) => e.name === "DroppedFrame" && e.ts >= start).length;
  const raf = path.join(dir, row.trace + ".raf.txt");
  if (existsSync(raf)) {
    const m = readFileSync(raf, "utf8").match(/\[[-\d.,\s]+\]/);
    if (m) {
      const d = JSON.parse(m[0]).slice(1).sort((a, b) => a - b);
      const total = d.reduce((a, b) => a + b, 0);
      row.fps = +(d.length / (total / 1000)).toFixed(1);
      row.frameP50 = pct(d, 0.5);
      row.frameP95 = pct(d, 0.95);
      row.frameMax = d.at(-1);
      row.over33 = d.filter((v) => v > 33.4).length;
    }
  }
  rows.push(row);
}
const keys = [...new Set(rows.flatMap((r) => Object.keys(r)))];
console.log(keys.join("\t"));
for (const r of rows) console.log(keys.map((k) => r[k] ?? "").join("\t"));
