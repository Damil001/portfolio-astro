import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
await page.waitForSelector("h1.is-ready");
const info = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  const probe = document.createElement("span");
  const style = getComputedStyle(h1);
  probe.style.font = style.font;
  probe.style.letterSpacing = style.letterSpacing;
  probe.style.whiteSpace = "nowrap";
  probe.textContent = "engineering partner";
  document.body.append(probe);
  const lines = [...h1.querySelectorAll(".reveal-line")].map((line) => ({
    text: line.textContent,
    width: Math.round(line.getBoundingClientRect().width),
  }));
  return {
    h1: Math.round(h1.getBoundingClientRect().width),
    phrase: Math.round(probe.getBoundingClientRect().width),
    lead: (() => {
      probe.textContent = "Your marketing &";
      return Math.round(probe.getBoundingClientRect().width);
    })(),
    tracking: style.letterSpacing,
    font: style.font,
    lines,
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
