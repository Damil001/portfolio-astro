import fs from "node:fs";

const html = fs.readFileSync("damil.webflow/index.html", "utf8");
const start = html.indexOf('class="social_links-wrap"');
const slice = html.slice(start, start + 20000);
const svgs = [...slice.matchAll(/<svg[\s\S]*?<\/svg>/g)].map((match) => match[0].replaceAll("viewbox=", "viewBox="));
const names = ["social-1.svg", "social-2.svg", "social-3.svg"];
svgs.slice(0, 3).forEach((svg, index) => {
  fs.writeFileSync(`public/images/${names[index]}`, svg);
  console.log(names[index], svg.length);
});
