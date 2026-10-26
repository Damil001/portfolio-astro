import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
const info = await page.evaluate(() => {
  return [...document.querySelectorAll(".service")].map((card) => {
    const visual = card.querySelector(".service-visual");
    const img = card.querySelector("img");
    const svgs = [...card.querySelectorAll("svg")].map((svg) => {
      const box = svg.getBoundingClientRect();
      const style = getComputedStyle(svg);
      return {
        w: Math.round(box.width),
        h: Math.round(box.height),
        display: style.display,
        overflow: style.overflow,
      };
    });
    const box = visual.getBoundingClientRect();
    return {
      title: card.querySelector("h3")?.textContent,
      visual: { w: Math.round(box.width), h: Math.round(box.height) },
      img: img
        ? (() => {
            const b = img.getBoundingClientRect();
            return { w: Math.round(b.width), h: Math.round(b.height), src: img.getAttribute("src") };
          })()
        : null,
      svgs,
    };
  });
});
console.log(JSON.stringify(info, null, 2));
await page.screenshot({ path: "scripts/captures/services-now.png", fullPage: false });
await page.locator(".services").screenshot({ path: "scripts/captures/services-block.png" });
await browser.close();
