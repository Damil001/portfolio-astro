import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
const logos = page.locator(".service-logos");
await logos.scrollIntoViewIfNeeded();
await logos.screenshot({ path: "scripts/captures/logos-row.png" });
await page.locator(".service-logos svg").first().screenshot({ path: "scripts/captures/logo-one.png" });
const boxes = await page.evaluate(() => {
  const row = document.querySelector(".service-logos");
  const rowBox = row.getBoundingClientRect();
  const style = getComputedStyle(row);
  return {
    row: { x: rowBox.x, y: rowBox.y, w: rowBox.width, h: rowBox.height, overflow: style.overflow, scrollWidth: row.scrollWidth },
    svgs: [...row.querySelectorAll("svg")].map((svg) => {
      const b = svg.getBoundingClientRect();
      return { x: Math.round(b.x - rowBox.x), y: Math.round(b.y - rowBox.y), w: Math.round(b.width), h: Math.round(b.height) };
    }),
  };
});
console.log(JSON.stringify(boxes, null, 2));
await browser.close();
