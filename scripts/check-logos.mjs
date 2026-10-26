import { chromium } from "playwright";
import { PNG } from "pngjs";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
const response = await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
if (!response?.ok()) throw new Error(`page ${response?.status()}`);
const info = await page.evaluate(() => {
  const svg = document.querySelector(".service-card-marquee-embed svg");
  const filter = svg?.querySelector("filter");
  const box = svg?.getBoundingClientRect();
  return {
    tracks: document.querySelectorAll(".service-card-marquee-track").length,
    cards: document.querySelectorAll(".service-card-marquee-card").length,
    filterChildren: filter ? [...filter.children].map((el) => el.tagName) : [],
    box: box ? { w: Math.round(box.width), h: Math.round(box.height) } : null,
  };
});
const buffer = await page.locator(".service-card-marquee-embed svg").first().screenshot();
const png = PNG.sync.read(buffer);
let dark = 0;
for (let i = 0; i < png.data.length; i += 4) {
  if (png.data[i] < 40 && png.data[i + 1] < 40 && png.data[i + 2] < 40 && png.data[i + 3] > 200) dark += 1;
}
console.log(JSON.stringify({ ...info, darkPixels: dark }));
await browser.close();
if (info.filterChildren.length < 10) process.exit(1);
if (dark < 20) process.exit(2);
