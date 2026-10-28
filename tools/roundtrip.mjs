// Build packs-src into a temp dir, extract it back, and require the JSON to come out identical
// (catches embedded documents — journal pages, actor items — lost by build or extract).
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { isDeepStrictEqual } from "node:util";

if (!existsSync("packs-src") || !readdirSync("packs-src").length) { console.error("Round trip: packs-src is missing."); process.exit(1); }
const tmp = mkdtempSync(join(tmpdir(), "cp-roundtrip-"));
const packs = join(tmp, "packs"), src = join(tmp, "src");
execFileSync("node", ["tools/build-packs.mjs"], { env: { ...process.env, PACKS_OUT: packs }, stdio: "ignore" });
if (existsSync(packs) && readdirSync(packs).length) {
  execFileSync("node", ["tools/extract-packs.mjs"], { env: { ...process.env, PACKS_IN: packs, SRC_OUT: src }, stdio: "ignore" });
}
let bad = 0;
for (const pack of existsSync("packs-src") ? readdirSync("packs-src") : []) {
  for (const f of readdirSync(join("packs-src", pack)).filter(x => x.endsWith(".json"))) {
    const a = JSON.parse(readFileSync(join("packs-src", pack, f), "utf8"));
    const p = join(src, pack, f);
    if (!existsSync(p)) { console.error(`  ✗ ${pack}/${f}: missing after round trip`); bad++; continue; }
    if (!isDeepStrictEqual(a, JSON.parse(readFileSync(p, "utf8")))) { console.error(`  ✗ ${pack}/${f}: changed by build → extract`); bad++; }
  }
}
if (bad) { console.error(`${bad} round-trip problem(s).`); process.exit(1); }
console.log("Round trip: packs-src survives build → extract unchanged.");
