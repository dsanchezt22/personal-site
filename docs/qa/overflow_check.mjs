import { chromium } from "/home/diego/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core/index.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const SHOTS = path.join(ROOT, "docs/qa/shots");
const BASE = process.env.SITE_URL || "http://127.0.0.1:8790/";
const CHROME = process.env.CHROME || "/home/diego/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome";

const viewports = [
  { name: "320", width: 320, height: 568 },
  { name: "375", width: 375, height: 667 },
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1440", width: 1440, height: 900 },
];

const bans = ["ts.net", "tailscale", "diegospc", "127.0.0.1", "localhost", "janus", "janice", "/home/diego", "tail9d2968"];

function parseRgb(value) {
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(",").map((p) => Number.parseFloat(p.trim()));
  return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
}

function lin(c) {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
}

function lum(rgb) {
  return 0.2126 * lin(rgb.r) + 0.7152 * lin(rgb.g) + 0.0722 * lin(rgb.b);
}

function ratio(fg, bg) {
  const L1 = lum(fg);
  const L2 = lum(bg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

async function inspect(page) {
  return page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const failures = [];
    if (document.documentElement.scrollWidth > vw + 1) {
      failures.push({
        kind: "page",
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: vw,
      });
    }
    const nodes = document.querySelectorAll("h1, h2, h3, p, a, li, dt, dd, button, span");
    for (const el of nodes) {
      const text = (el.innerText || "").replace(/\s+/g, " ").trim();
      if (!text) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) continue;
      if (rect.right > vw + 1 || rect.left < -1) {
        failures.push({
          kind: "box",
          text: text.slice(0, 90),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          vw,
        });
      }
    }
    const body = getComputedStyle(document.body);
    const kicker = getComputedStyle(document.querySelector(".kicker"));
    const title = getComputedStyle(document.querySelector("h3"));
    return {
      failures,
      colors: {
        bg: body.backgroundColor,
        ink: body.color,
        muted: kicker.color,
        title: title.fontSize,
        body: body.fontSize,
        hero: getComputedStyle(document.querySelector("h1")).fontSize,
        meta: kicker.fontSize,
      },
      text: document.body.innerText,
      sections: ["about", "work", "experience", "education", "skills", "contact"].map((id) => Boolean(document.getElementById(id))),
    };
  });
}

const report = { pass: true, views: [], contrast: [], fps: null, reducedMotion: null, toggle: null, bans: [], resume: null };

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--disable-dev-shm-usage"],
});

await mkdir(SHOTS, { recursive: true });

try {
  for (const theme of ["light", "dark"]) {
    for (const vp of viewports) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        colorScheme: theme,
        deviceScaleFactor: 1,
        reducedMotion: "no-preference",
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (err) => errors.push(String(err)));
      await page.goto(BASE, { waitUntil: "networkidle" });
      await page.waitForTimeout(250);
      const result = await inspect(page);
      const overflow = result.failures;
      if (overflow.length || errors.length) report.pass = false;
      report.views.push({
        name: vp.name,
        theme,
        width: vp.width,
        height: vp.height,
        overflow,
        errors,
        colors: result.colors,
        sections: result.sections,
      });
      if (theme === "light" && vp.name === "1440") {
        const fg = parseRgb(result.colors.ink);
        const bg = parseRgb(result.colors.bg);
        const muted = parseRgb(result.colors.muted);
        const inkRatio = ratio(fg, bg);
        const mutedRatio = ratio(muted, bg);
        report.contrast.push({ theme, inkRatio, mutedRatio, colors: result.colors });
        if (inkRatio < 4.5 || mutedRatio < 4.5) report.pass = false;
        const lowered = result.text.toLowerCase();
        report.bans = bans.filter((word) => lowered.includes(word));
        if (report.bans.length) report.pass = false;
        if (result.sections.some((ok) => !ok)) report.pass = false;
      }
      if (theme === "dark" && vp.name === "1440") {
        const fg = parseRgb(result.colors.ink);
        const bg = parseRgb(result.colors.bg);
        const muted = parseRgb(result.colors.muted);
        const inkRatio = ratio(fg, bg);
        const mutedRatio = ratio(muted, bg);
        report.contrast.push({ theme, inkRatio, mutedRatio, colors: result.colors });
        if (inkRatio < 4.5 || mutedRatio < 4.5) report.pass = false;
      }
      await page.addStyleTag({
        content: "html.js .reveal{opacity:1!important;transform:none!important;transition:none!important}",
      });
      const file = path.join(SHOTS, `site-${vp.name}-${theme}.png`);
      await page.screenshot({ path: file, fullPage: true });
      if (vp.name === "1440") {
        await page.screenshot({
          path: path.join(SHOTS, `site-desktop-${theme}.png`),
          fullPage: true,
        });
        await page.screenshot({
          path: path.join(SHOTS, `site-desktop-${theme}-fold.png`),
          fullPage: false,
        });
      }
      if (vp.name === "390" && theme === "light") {
        await page.screenshot({ path: path.join(SHOTS, "site-mobile-light.png"), fullPage: true });
        await page.screenshot({ path: path.join(SHOTS, "site-mobile-light-fold.png"), fullPage: false });
      }
      if (vp.name === "390" && theme === "dark") {
        await page.screenshot({ path: path.join(SHOTS, "site-mobile-dark-fold.png"), fullPage: false });
      }
      if ((vp.name === "320" || vp.name === "390" || vp.name === "1440") && theme === "light") {
        for (const id of ["work", "experience", "education", "contact"]) {
          await page.evaluate((target) => {
            const el = document.getElementById(target);
            const y = el.getBoundingClientRect().top + window.scrollY - 76;
            window.scrollTo(0, Math.max(0, y));
          }, id);
          await page.waitForTimeout(40);
          await page.screenshot({
            path: path.join(SHOTS, `site-${vp.name}-light-${id}.png`),
            fullPage: false,
          });
        }
      }
      await context.close();
    }
  }

  const toggleContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    colorScheme: "dark",
    reducedMotion: "no-preference",
  });
  const togglePage = await toggleContext.newPage();
  await togglePage.goto(BASE, { waitUntil: "networkidle" });
  const before = await togglePage.evaluate(() => ({
    theme: document.documentElement.dataset.theme || "system",
    bg: getComputedStyle(document.body).backgroundColor,
    label: document.getElementById("theme").textContent,
  }));
  await togglePage.click("#theme");
  const mid = await togglePage.evaluate(() => ({
    theme: document.documentElement.dataset.theme || "system",
    bg: getComputedStyle(document.body).backgroundColor,
    label: document.getElementById("theme").textContent,
  }));
  await togglePage.click("#theme");
  const after = await togglePage.evaluate(() => ({
    theme: document.documentElement.dataset.theme || "system",
    bg: getComputedStyle(document.body).backgroundColor,
    label: document.getElementById("theme").textContent,
  }));
  report.toggle = { before, mid, after };
  if (before.theme !== "system" || mid.theme !== "light" || after.theme !== "dark") report.pass = false;
  if (mid.bg === before.bg) report.pass = false;
  await togglePage.screenshot({ path: path.join(SHOTS, "site-toggle-light.png"), fullPage: false });
  await toggleContext.close();

  const motionContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const motionPage = await motionContext.newPage();
  await motionPage.goto(BASE, { waitUntil: "networkidle" });
  await motionPage.waitForTimeout(400);
  const motionState = await motionPage.evaluate(() => ({
    field: document.documentElement.dataset.field,
    frames: document.documentElement.__fieldFrames(),
  }));
  await motionPage.waitForTimeout(600);
  const motionLater = await motionPage.evaluate(() => document.documentElement.__fieldFrames());
  report.reducedMotion = { ...motionState, framesLater: motionLater, delta: motionLater - motionState.frames };
  if (motionState.field !== "static" || motionLater - motionState.frames > 2) report.pass = false;
  await motionContext.close();

  const fpsContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: "light",
    deviceScaleFactor: 2,
    reducedMotion: "no-preference",
  });
  const fpsPage = await fpsContext.newPage();
  const client = await fpsContext.newCDPSession(fpsPage);
  await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await fpsPage.goto(BASE, { waitUntil: "networkidle" });
  await fpsPage.waitForTimeout(200);
  const fpsStart = await fpsPage.evaluate(() => document.documentElement.__fieldFrames());
  await fpsPage.waitForTimeout(1000);
  const fpsEnd = await fpsPage.evaluate(() => document.documentElement.__fieldFrames());
  report.fps = { throttle: 4, viewport: "390x844", dpr: 2, frames: fpsEnd - fpsStart };
  if (fpsEnd - fpsStart < 50) report.pass = false;
  await fpsContext.close();

  const resume = await fetch(BASE + "Diego-Sanchez-Tirado-Resume.pdf");
  report.resume = { status: resume.status, type: resume.headers.get("content-type"), bytes: Number(resume.headers.get("content-length")) };
  if (resume.status !== 200 || !(resume.headers.get("content-type") || "").includes("pdf")) report.pass = false;

  const ogPage = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await ogPage.goto(BASE + "docs/qa/og-card.html", { waitUntil: "networkidle" });
  await ogPage.screenshot({ path: path.join(ROOT, "og.png") });
  await ogPage.close();
} finally {
  await browser.close();
}

const out = path.join(ROOT, "docs/qa/overflow-results.json");
await writeFile(out, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pass: report.pass, fps: report.fps, reducedMotion: report.reducedMotion, toggle: report.toggle, contrast: report.contrast, bans: report.bans, resume: report.resume, overflow: report.views.filter((v) => v.overflow.length || v.errors.length) }, null, 2));
if (!report.pass) process.exit(1);
