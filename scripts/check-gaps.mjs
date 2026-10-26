import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
await page.locator(".service-card-marquee").scrollIntoViewIfNeeded();
await page.addStyleTag({
  content: ".service-card-marquee-track { animation: none !important; transform: none !important; }",
});

const rows = await page.evaluate(() => {
  const track = document.querySelector(".service-card-marquee-track");
  const set = track.querySelector(".service-card-marquee-set");
  return [...set.querySelectorAll(".service-card-marquee-card")].map((card, index) => {
    const embed = card.querySelector(".service-card-marquee-embed");
    const svg = card.querySelector("svg");
    const cardBox = card.getBoundingClientRect();
    const embedBox = embed.getBoundingClientRect();
    const svgBox = svg.getBoundingClientRect();
    return {
      index,
      svgWidthAttr: svg.getAttribute("width"),
      viewBox: svg.getAttribute("viewBox") || svg.getAttribute("viewbox"),
      card: Math.round(cardBox.width * 10) / 10,
      embed: Math.round(embedBox.width * 10) / 10,
      svg: Math.round(svgBox.width * 10) / 10,
      cardX: Math.round(cardBox.x * 10) / 10,
      svgX: Math.round(svgBox.x * 10) / 10,
    };
  });
});

const gaps = rows.slice(1).map((row, index) => Math.round((row.cardX - (rows[index].cardX + rows[index].card)) * 10) / 10);
const svgGaps = rows.slice(1).map((row, index) => Math.round((row.svgX - (rows[index].svgX + rows[index].svg)) * 10) / 10);
console.log(JSON.stringify({ rows, gaps, svgGaps }, null, 2));
await browser.close();
