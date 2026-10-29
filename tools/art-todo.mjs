#!/usr/bin/env node
// List every document still on placeholder art, with the art key it needs (from the compendium data,
// never typed by hand — a hand-typed slug once orphaned an icon in Rigger 2). Keys are what
// tools/art-prompts.tsv and tools/gen-art.sh use: <assets dir>/<slug>.
//   node tools/art-todo.mjs          # missing only
//   node tools/art-todo.mjs --all    # every document
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { slugify } from "./lib.mjs";

const ALL = process.argv.includes("--all");
const dirOf = (d) => d.type === "npc" ? "creature_portraits" : d.type === "vehicle" ? "vehicle_portraits" : `item_icons/${d.type}`;
const rows = [];
for (const pack of readdirSync("packs-src")) {
  for (const f of readdirSync(join("packs-src", pack)).filter(x => x.endsWith(".json"))) {
    const d = JSON.parse(readFileSync(join("packs-src", pack, f), "utf8"));
    if (!d.system) continue;
    const key = `${dirOf(d)}/${slugify(d.name)}`;
    if (!ALL && existsSync(`assets/${key}.webp`)) continue;
    rows.push(`${key}\t${d.name}`);
  }
}
console.log(rows.sort().join("\n"));
console.error(`${rows.length} ${ALL ? "documents" : "still need art"}.`);
