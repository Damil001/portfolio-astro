import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
await page.waitForSelector("h1.is-ready");
const info = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  const source = h1.dataset.revealSource;
  h1.replaceChildren();
  const words = [];
  source.split("\n").forEach((piece) => {
    piece.trim().split(/\s+/).filter(Boolean).forEach((bit) => {
      if (words.length) h1.append(" ");
      const span = document.createElement("span");
      span.textContent = bit;
      h1.append(span);
      words.push(span);
    });
  });
  return {
    source,
    client: h1.clientWidth,
    words: words.map((word) => ({
      text: word.textContent,
      top: word.offsetTop,
      width: Math.round(word.getBoundingClientRect().width),
    })),
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
