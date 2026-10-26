import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
const info = await page.evaluate(() => {
  const embed = document.querySelector(".service-card-marquee-embed svg");
  const filter = embed?.querySelector("filter");
  const walk = (el, depth = 0) => {
    if (!el || depth > 4) return [];
    return [...el.children].map((child) => ({
      tag: child.tagName,
      kids: walk(child, depth + 1).length,
    }));
  };
  return {
    found: Boolean(embed),
    filterChildren: filter ? walk(filter) : null,
    direct: filter ? [...filter.children].map((el) => el.tagName) : null,
  };
});
console.log(JSON.stringify(info, null, 2));
const card = page.locator(".service-card-top.is-product").first();
await card.screenshot({ path: "scripts/captures/original-dev.png" });
await browser.close();
