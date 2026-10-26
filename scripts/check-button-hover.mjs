import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
await page.waitForSelector(".hero .button.is-shown, .hero .actions.is-shown", { timeout: 5000 }).catch(() => {});

const primary = page.locator(".hero .button").first();
const secondary = page.locator(".hero .button.is-secondary");
await primary.hover();
await page.waitForTimeout(450);
const primaryStyle = await primary.evaluate((el) => {
  const style = getComputedStyle(el);
  return { transform: style.transform, filter: style.filter };
});
await page.locator(".hero .actions").screenshot({ path: "scripts/captures/button-hover-primary.png" });

await secondary.hover();
await page.waitForTimeout(450);
const secondaryStyle = await secondary.evaluate((el) => {
  const style = getComputedStyle(el);
  return { transform: style.transform, color: style.color, backgroundImage: style.backgroundImage.slice(0, 80) };
});
await page.locator(".hero .actions").screenshot({ path: "scripts/captures/button-hover-secondary.png" });

console.log(JSON.stringify({ primaryStyle, secondaryStyle }, null, 2));
await browser.close();
