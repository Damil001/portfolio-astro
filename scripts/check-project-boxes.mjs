import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 768, height: 900 } });
await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
const boxes = await page.evaluate(() =>
  [...document.querySelectorAll(".project-card")].map((card) => {
    const img = card.querySelector("img");
    const cardBox = card.getBoundingClientRect();
    const imgBox = img.getBoundingClientRect();
    return {
      name: card.querySelector("h3").textContent,
      card: [Math.round(cardBox.x), Math.round(cardBox.y), Math.round(cardBox.width), Math.round(cardBox.height)],
      img: [Math.round(imgBox.x), Math.round(imgBox.y), Math.round(imgBox.width), Math.round(imgBox.height)],
      overflow: Math.round(imgBox.right - cardBox.right),
    };
  }),
);
console.log(JSON.stringify(boxes, null, 2));
await browser.close();
