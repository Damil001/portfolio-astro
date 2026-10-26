import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
await page.waitForSelector("h1.is-shown", { timeout: 5000 });
await page.waitForTimeout(1100);

const hero = await page.evaluate(() => {
  const inner = document.querySelector("h1 .reveal-line-inner");
  const intro = document.querySelector(".stack h2");
  return {
    lines: document.querySelectorAll("h1 .reveal-line").length,
    text: document.querySelector("h1")?.innerText,
    transform: inner ? getComputedStyle(inner).transform : null,
    introShown: intro?.classList.contains("is-shown") ?? false,
    introReady: intro?.classList.contains("is-ready") ?? false,
  };
});

await page.locator(".stack").first().scrollIntoViewIfNeeded();
await page.waitForSelector(".stack h2.is-shown", { timeout: 4000 });
await page.waitForTimeout(400);
await page.screenshot({ path: "scripts/captures/reveal-intro.png" });

await page.locator("#projects .project-card").first().scrollIntoViewIfNeeded();
await page.waitForSelector(".project-card.is-shown", { timeout: 4000 });
await page.waitForTimeout(200);
const cards = await page.evaluate(() =>
  [...document.querySelectorAll(".project-card")].map((card) => card.classList.contains("is-shown")),
);
await page.screenshot({ path: "scripts/captures/reveal-card.png" });

console.log(JSON.stringify({ hero, cards }, null, 2));
await browser.close();
