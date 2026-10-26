import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
const before = await page.evaluate(() => {
  const svg = document.querySelector(".service-logos svg");
  const filter = svg.querySelector("filter");
  const g = svg.querySelector("g");
  return {
    base: document.querySelector("base")?.href ?? null,
    filterId: filter?.id,
    filterChildren: [...(filter?.children ?? [])].map((el) => el.tagName),
    gFilter: g?.getAttribute("filter"),
    rectFill: svg.querySelector("rect")?.getAttribute("fill"),
  };
});
console.log("before", JSON.stringify(before, null, 2));
await page.evaluate(() => {
  document.querySelectorAll(".service-logos svg g").forEach((g) => g.removeAttribute("filter"));
});
await page.locator(".service-logos").screenshot({ path: "scripts/captures/logos-nofilter.png" });
await browser.close();
