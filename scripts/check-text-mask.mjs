import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
await page.waitForTimeout(400);

const lines = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  return { html: h1.innerHTML.slice(0, 80), text: h1.innerText };
});

await page.screenshot({ path: "scripts/captures/mask-hero.png" });

const intro = page.locator(".stack").first();
const box = await intro.boundingBox();
await page.evaluate((top) => window.scrollTo(0, top - 180), box.y);
await page.waitForTimeout(300);
await page.screenshot({ path: "scripts/captures/mask-intro.png" });
console.log(JSON.stringify(lines));
await browser.close();
