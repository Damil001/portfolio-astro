import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
const rows = await page.evaluate(() => {
  return [...document.querySelectorAll(".services-card-wrap")].map((card) => {
    const img = card.querySelector("img");
    const top = card.querySelector(".service-card-top");
    const bottom = card.querySelector(".service-card-bottom");
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    };
    return {
      label: card.querySelector("h3")?.textContent?.trim(),
      img: box(img),
      top: box(top),
      bottom: box(bottom),
      src: img?.getAttribute("src") ?? "logos",
    };
  });
});
console.log(JSON.stringify(rows, null, 2));
await browser.close();
