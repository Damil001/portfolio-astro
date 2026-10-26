import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
const colors = await page.evaluate(() => {
  const clip = (selector) => getComputedStyle(document.querySelector(selector)).webkitBackgroundClip || getComputedStyle(document.querySelector(selector)).backgroundClip;
  return {
    hero: clip("h1"),
    intro: clip(".stack h2"),
    section: clip("h2.center"),
    footer: clip(".footer-stack h2"),
  };
});
console.log(JSON.stringify(colors));
await browser.close();
