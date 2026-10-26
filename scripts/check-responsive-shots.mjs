import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });

for (const width of [390, 768]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
  for (const id of ["projects", "services", "steps", "quotes"]) {
    const selector = id === "projects" ? "#projects" : id === "services" ? ".services" : id === "steps" ? ".steps" : ".quotes";
    const locator = page.locator(selector).first();
    await locator.scrollIntoViewIfNeeded();
    await locator.screenshot({ path: `scripts/captures/${id}-${width}.png` });
  }
  await page.close();
}

await browser.close();
