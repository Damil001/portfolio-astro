import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const widths = [390, 768, 992, 1200];

for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 800 } });
  await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
  const report = await page.evaluate(() => {
    const cols = (selector) => getComputedStyle(document.querySelector(selector)).gridTemplateColumns;
    const doc = document.documentElement;
    const offenders = [...document.querySelectorAll("body *")]
      .filter((el) => {
        const box = el.getBoundingClientRect();
        return box.width > doc.clientWidth + 1 && getComputedStyle(el).position !== "absolute";
      })
      .slice(0, 8)
      .map((el) => `${el.className || el.tagName} ${Math.round(el.getBoundingClientRect().width)}`);
    return {
      scroll: doc.scrollWidth,
      client: doc.clientWidth,
      projects: cols(".projects"),
      services: cols(".services"),
      steps: cols(".steps"),
      quotes: cols(".quotes"),
      offset: getComputedStyle(document.querySelector(".project-column.is-offset")).paddingTop,
      offenders,
    };
  });
  console.log(width, JSON.stringify(report));
  await page.screenshot({ path: `scripts/captures/responsive-${width}.png`, fullPage: true });
  await page.close();
}

await browser.close();
