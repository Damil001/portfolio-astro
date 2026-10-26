import { readFileSync, writeFileSync } from "node:fs";

const html = readFileSync("damil.webflow/index.html", "utf8");

function svgsBetween(startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0) throw new Error(`markers not found: ${startMarker}`);
  const slice = html.slice(start, end);
  return [...slice.matchAll(/<svg[\s\S]*?<\/svg>/g)].map((match) => match[0].trim());
}

function flattenFilters(svg) {
  return svg.replace(/<filter\b([^>]*)>[\s\S]*?<\/filter>/gi, (block, attrs) => {
    const primitives = [...block.matchAll(/<(fe[a-z]+)(\s[^>]*?)?\s*\/?>/gi)].map((match) => {
      const tag = match[1];
      const attributes = match[2] ?? "";
      return `<${tag}${attributes}></${tag}>`;
    });
    return `<filter${attrs}>${primitives.join("")}</filter>`;
  });
}

const logos = svgsBetween(
  '<div class="service-card-marquee-track">',
  '<div class="service-card-marquee-track">',
).map(flattenFilters);
const socials = svgsBetween('<div class="social_links-wrap">', "</footer>").map(flattenFilters);

if (logos.length !== 10) throw new Error(`expected 10 logos, got ${logos.length}`);
if (socials.length !== 3) throw new Error(`expected 3 socials, got ${socials.length}`);
if (!logos[0].includes('filter="url(#filter0_iii_2092_385)"')) {
  throw new Error("logo filter attribute missing");
}
const filter = logos[0].match(/<filter[\s\S]*?<\/filter>/)?.[0] ?? "";
const primitiveCount = filter.match(/<fe/gi)?.length ?? 0;
if (primitiveCount < 10) {
  throw new Error(`filter only has ${primitiveCount} primitives:\n${filter.slice(0, 500)}`);
}

writeFileSync(
  "src/data/marks.ts",
  `export const developmentLogos = ${JSON.stringify(logos, null, 2)};\n\nexport const socialMarks = ${JSON.stringify(socials, null, 2)};\n`,
);
console.log(`wrote ${logos.length} logos and ${socials.length} social marks`);
