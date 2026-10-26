import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });

async function heights(url, selector) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  const rows = await page.evaluate((selector) => {
    return [...document.querySelectorAll(selector)].map((el, index) => {
      const heading = el.querySelector("h1, h2");
      return {
        index,
        h: Math.round(el.getBoundingClientRect().height),
        label: (heading?.textContent ?? el.tagName).replace(/\s+/g, " ").slice(0, 42),
      };
    });
  }, selector);
  await page.close();
  return rows;
}

const original = await heights("http://127.0.0.1:4173/", "section, footer");
const rebuild = await heights("http://127.0.0.1:4321/", "section, footer");
const n = Math.max(original.length, rebuild.length);
for (let i = 0; i < n; i++) {
  const a = original[i];
  const b = rebuild[i];
  const delta = (b?.h ?? 0) - (a?.h ?? 0);
  console.log(String(delta).padStart(6), String(a?.h ?? "-").padStart(5), String(b?.h ?? "-").padStart(5), "|", a?.label ?? "", "||", b?.label ?? "");
}
await browser.close();
