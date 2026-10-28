// Snapshot the system's document field names per type from its own pack sources, with the
// system version, into tools/data/schema.json — the validator's offline reference (the
// authoritative check is tools/foundry-check.js in Foundry). Run when the pinned system changes.
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const SYS = "../sr2e-foundryvtt";
if (!existsSync(SYS)) { console.error("needs ../sr2e-foundryvtt"); process.exit(1); }
const version = JSON.parse(readFileSync(join(SYS, "system.json"), "utf8")).version;
const keys = {};
const walk = (dir) => {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    if (f.isDirectory()) { walk(join(dir, f.name)); continue; }
    if (!f.name.endsWith(".json")) continue;
    const d = JSON.parse(readFileSync(join(dir, f.name), "utf8"));
    const add = (doc) => { if (doc?.type && doc.system) for (const k of Object.keys(doc.system)) (keys[doc.type] ??= new Set()).add(k); };
    add(d); for (const i of d.items ?? []) add(i);
  }
};
walk(join(SYS, "packs-src"));
// Quality items live in the Shadowrun Companion module (the model this module follows).
if (existsSync("../sr2e-shadowrun-companion/packs-src")) walk("../sr2e-shadowrun-companion/packs-src");
const out = { systemVersion: version, keys: Object.fromEntries(Object.entries(keys).map(([t, s]) => [t, [...s].sort()])) };
writeFileSync("tools/data/schema.json", JSON.stringify(out, null, 1) + "\n");
console.log(`schema snapshot from sr2e ${version}: ${Object.keys(out.keys).join(", ")}`);
