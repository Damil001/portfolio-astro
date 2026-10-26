import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });

async function cards(url, selector) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  const rows = await page.evaluate((selector) => {
    return [...document.querySelectorAll(selector)].map((el) => ({
      h: Math.round(el.getBoundingClientRect().height),
      w: Math.round(el.getBoundingClientRect().width),
      label: (el.querySelector("h3")?.textContent ?? el.textContent ?? "").replace(/\s+/g, " ").slice(0, 36),
    }));
  }, selector);
  await page.close();
  return rows;
}

const original = await cards("http://127.0.0.1:4173/", ".services-card-wrap");
const rebuild = await cards("http://127.0.0.1:4321/", ".service");
original.forEach((row, index) => {
  const next = rebuild[index];
  console.log(row.label, row.w, row.h, "||", next?.w, next?.h, "delta", (next?.h ?? 0) - row.h);
});
await browser.close();
