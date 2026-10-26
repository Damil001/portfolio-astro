import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });
for (const width of [1440, 1200, 992, 900, 768, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
  await page.waitForSelector("h1.is-ready", { timeout: 5000 });
  const info = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const box = h1.getBoundingClientRect();
    return {
      lines: [...h1.querySelectorAll(".reveal-line")].map((line) => line.textContent),
      h1: Math.round(box.width),
      font: getComputedStyle(h1).fontSize,
    };
  });
  console.log(width, JSON.stringify(info));
  await page.close();
}
await browser.close();
