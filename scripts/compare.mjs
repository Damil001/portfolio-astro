import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'node:fs';
import path from 'node:path';

const width = Number(process.argv[2] ?? 1200);
const originalUrl = process.argv[3] ?? 'http://127.0.0.1:4173/';
const rebuildUrl = process.argv[4] ?? 'http://127.0.0.1:4321/';
const outDir = path.resolve('scripts/captures');
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width, height: 800 }, deviceScaleFactor: 1 });

async function shoot(url, file) {
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  if (!response || !response.ok()) {
    throw new Error(`${url} returned ${response ? response.status() : 'no response'}`);
  }
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: file, fullPage: true });
  const box = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  }));
  return box;
}

const originalFile = path.join(outDir, `original-${width}.png`);
const rebuildFile = path.join(outDir, `rebuild-${width}.png`);
const originalBox = await shoot(originalUrl, originalFile);
const rebuildBox = await shoot(rebuildUrl, rebuildFile);
await browser.close();

function load(file) {
  return PNG.sync.read(fs.readFileSync(file));
}

function pad(src, width, height) {
  const out = new PNG({ width, height });
  out.data.fill(0);
  for (let i = 0; i < out.data.length; i += 4) {
    out.data[i] = 255;
    out.data[i + 1] = 255;
    out.data[i + 2] = 255;
    out.data[i + 3] = 255;
  }
  PNG.bitblt(src, out, 0, 0, src.width, src.height, 0, 0);
  return out;
}

const original = load(originalFile);
const rebuild = load(rebuildFile);
const canvasWidth = Math.max(original.width, rebuild.width);
const canvasHeight = Math.max(original.height, rebuild.height);
const a = pad(original, canvasWidth, canvasHeight);
const b = pad(rebuild, canvasWidth, canvasHeight);
const diff = new PNG({ width: canvasWidth, height: canvasHeight });
const mismatched = pixelmatch(a.data, b.data, diff.data, canvasWidth, canvasHeight, { threshold: 0.1 });
const total = canvasWidth * canvasHeight;
const score = Number((((total - mismatched) / total) * 100).toFixed(2));
const report = {
  width,
  originalHeight: originalBox.height,
  rebuildHeight: rebuildBox.height,
  image: { original: [original.width, original.height], rebuild: [rebuild.width, rebuild.height] },
  score,
  mismatched,
  total,
};
const reportFile = path.join(outDir, `report-${width}.json`);
fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
