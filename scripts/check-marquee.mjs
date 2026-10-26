import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
await page.locator(".service-card-marquee").scrollIntoViewIfNeeded();

const read = () =>
  page.evaluate(() =>
    [...document.querySelectorAll(".service-card-marquee-track")].map((track) => {
      const style = getComputedStyle(track);
      return {
        reverse: track.classList.contains("is-reverse"),
        name: style.animationName,
        direction: style.animationDirection,
        x: track.getBoundingClientRect().x,
      };
    }),
  );

const first = await read();
await page.waitForTimeout(700);
const second = await read();
console.log(JSON.stringify({ first, second }, null, 2));
await browser.close();

const moved = first.map((row, index) => second[index].x - row.x);
if (first[0].name !== "service-marquee") process.exit(1);
if (first[1].direction !== "reverse") process.exit(2);
if (!(moved[0] < -1 && moved[2] < -1 && moved[1] > 1)) {
  console.error("unexpected movement", moved);
  process.exit(3);
}
