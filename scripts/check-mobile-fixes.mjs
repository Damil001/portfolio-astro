import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });

const intro = page.locator(".stack").first();
await intro.screenshot({ path: "scripts/captures/intro-390.png" });
await page.locator("#projects .project-card").nth(3).screenshot({ path: "scripts/captures/findem-390.png" });
await page.locator(".steps").screenshot({ path: "scripts/captures/steps-390b.png" });

const size = await page.evaluate(() => {
  const h2 = document.querySelector(".stack h2");
  const style = getComputedStyle(h2);
  return { fontSize: style.fontSize, lineHeight: style.lineHeight };
});
console.log(size);
await browser.close();
