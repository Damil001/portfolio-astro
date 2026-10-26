import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });

const desktop = await browser.newPage({ viewport: { width: 1200, height: 800 } });
await desktop.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
const desk = await desktop.evaluate(() => {
  const nav = document.querySelector(".nav");
  const links = [...document.querySelectorAll(".nav-links a")].map((a) => ({
    text: a.textContent.trim(),
    href: a.getAttribute("href"),
    exists: a.getAttribute("href").startsWith("#") ? Boolean(document.querySelector(a.getAttribute("href"))) : true,
  }));
  return {
    sticky: getComputedStyle(nav).position,
    toggle: getComputedStyle(document.querySelector(".nav-toggle")).display,
    links,
  };
});
await desktop.locator(".nav").screenshot({ path: "scripts/captures/nav-desktop.png" });
await desktop.locator("a[href='#projects']").click();
await desktop.waitForTimeout(700);
const projectsTop = await desktop.evaluate(() => document.querySelector("#projects").getBoundingClientRect().top);
await desktop.close();

const phone = await browser.newPage({ viewport: { width: 390, height: 800 } });
await phone.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
const before = await phone.evaluate(() => getComputedStyle(document.querySelector(".nav-links")).display);
await phone.locator(".nav-toggle").click();
const after = await phone.evaluate(() => ({
  open: document.querySelector(".nav-toggle").getAttribute("aria-expanded"),
  display: getComputedStyle(document.querySelector(".nav-links")).display,
}));
await phone.locator(".nav").screenshot({ path: "scripts/captures/nav-phone.png" });
await phone.close();

console.log(JSON.stringify({ desk, projectsTop, before, after }, null, 2));
await browser.close();
