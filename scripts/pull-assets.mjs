import fs from "node:fs";
import path from "node:path";

const out = "public/images";
fs.mkdirSync(out, { recursive: true });

const local = [
  "Group-3-1.svg",
  "Design-graphic.svg",
  "Frame-23.svg",
  "Frame-23-1.svg",
  "Frame-23-2.svg",
  "Group-1_1.svg",
  "Group-1-1.svg",
  "Group-1-2.svg",
  "Frame-13.svg",
  "favicon.svg",
];

for (const name of local) {
  fs.copyFileSync(path.join("damil.webflow/images", name), path.join(out, name));
}

const html = fs.readFileSync("damil.webflow/index.html", "utf8");
const marker = 'class="service-card-marquee-track"';
const start = html.indexOf(marker);
const end = html.indexOf(marker, start + marker.length);
const chunk = html.slice(start, end);
const svgs = [...chunk.matchAll(/<svg[\s\S]*?<\/svg>/g)].map((match) => match[0]);
const logoDir = path.join(out, "logos");
fs.mkdirSync(logoDir, { recursive: true });
svgs.forEach((svg, index) => {
  const fixed = svg.replaceAll("viewbox=", "viewBox=");
  const file = `logo-${String(index + 1).padStart(2, "0")}.svg`;
  fs.writeFileSync(path.join(logoDir, file), fixed);
});
console.log("logos", svgs.length);

const portrait = html.match(/xlink:href="(data:image\/jpeg;base64,[^"]+)"/);
if (portrait) {
  const bytes = Buffer.from(portrait[1].split(",")[1], "base64");
  fs.writeFileSync(path.join(out, "kerry-searle.jpg"), bytes);
  console.log("kerry", bytes.length);
}

const live = await (await fetch("https://damil.webflow.io/")).text();
const srcs = [...live.matchAll(/src="(https:\/\/cdn\.prod\.website-files\.com\/66119547721f1526666a77cf\/[^"]+)"/g)].map(
  (match) => match[1],
);
const unique = [...new Set(srcs)].filter((url) => /\.(png|jpe?g|webp|svg)(\?|$)/i.test(url));
for (const url of unique) {
  const file = decodeURIComponent(url.split("/").pop() ?? "asset");
  const response = await fetch(url);
  if (!response.ok) {
    console.log("fail", response.status, file);
    continue;
  }
  fs.writeFileSync(path.join(out, file), Buffer.from(await response.arrayBuffer()));
  console.log("saved", file);
}
