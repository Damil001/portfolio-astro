import { chromium } from 'playwright';
import fs from 'node:fs';

const widths = [1440, 1200, 991, 767, 479];
const selectors = [
  'body',
  'h1.heading-style-h1',
  'h2.heading-style-h2',
  '.project-card h3',
  '.service-card-bottom h3',
  '.progress-bottom h4',
  'p.text-size-regular.is-hero',
  'p.text-size-regular',
  'p.text-size-large',
  '.faq_text',
  'a.button',
  'a.button.is-secondary',
  '.container-large',
  '.padding-global',
  '.padding-vertical.padding-huge',
  '.padding-vertical.is-hero-section',
  '.hero-section',
  '.project-card',
  '.services-card-wrap',
  '.testimonial-card',
  '.testimonial-card-inner',
  '.faq1_question',
  '.faq1_accordion',
  '.footer',
  '.spacer-large',
  '.spacer-small',
  '.home-hero-content-wrap',
  '.projects-grid',
  '.service-grid',
  '.how-it-works-inner',
  '.button',
];

const props = [
  'color',
  'backgroundColor',
  'backgroundImage',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'textAlign',
  'padding',
  'margin',
  'width',
  'maxWidth',
  'borderRadius',
  'border',
  'boxShadow',
  'gap',
  'display',
  'minHeight',
];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const result = {};

for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  result[width] = await page.evaluate(({ selectors, props }) => {
    const root = getComputedStyle(document.documentElement);
    const vars = {};
    for (const name of ['--black', '--white', '--orange', '--dark-green', '--white-2']) {
      vars[name] = root.getPropertyValue(name).trim();
    }
    const out = { vars };
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (!el) {
        out[selector] = null;
        continue;
      }
      const cs = getComputedStyle(el);
      const box = el.getBoundingClientRect();
      const picked = { box: { width: Math.round(box.width), height: Math.round(box.height) } };
      for (const prop of props) picked[prop] = cs[prop];
      out[selector] = picked;
    }
    return out;
  }, { selectors, props });
  await page.close();
}

await browser.close();
fs.mkdirSync('scripts/captures', { recursive: true });
fs.writeFileSync('scripts/captures/computed.json', JSON.stringify(result, null, 2));
console.log('wrote scripts/captures/computed.json');
