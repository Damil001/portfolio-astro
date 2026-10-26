import { readFileSync, writeFileSync } from "node:fs";

const path = "src/data/marks.ts";
const source = readFileSync(path, "utf8");
const pattern = / filter=\\"url\(#[^)]+\)\\"/g;
const count = source.match(pattern)?.length ?? 0;
writeFileSync(path, source.replace(pattern, ""));
console.log("removed", count);
