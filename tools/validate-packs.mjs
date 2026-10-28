// Offline validator for the Cyberpirates packs (docs/PLAN-content.md "Build tooling"). Runs without
// Foundry; the authoritative schema check is tools/foundry-check.js inside Foundry.
//  - every pack's document type comes from module.json;
//  - required keys, `_key` form, unique ids (embedded ids unique per parent);
//  - `system` field names and scalar types must match the system's live schema snapshot (tools/data/schema.json);
//  - numeric bounds the system enforces (NPC Essence 0–6) and no derived fields;
//  - every generated document carries its transcription record with `verified` set.
// Run: `npm run validate` (also runs the build → extract round trip).
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = "packs-src";
const MODULE = JSON.parse(readFileSync("module.json", "utf8"));
const SCHEMA = JSON.parse(readFileSync("tools/data/schema.json", "utf8"));
const TYPE_OF = Object.fromEntries((MODULE.packs ?? []).map(p => [p.name, p.type]));
const COLLECTION = { Item: "items", Actor: "actors", JournalEntry: "journal" };
// Derived by the system every preparation: authoring them stores stale numbers.
const DERIVED = { bioware: ["actualBodyCost"], npc: [], vehicle: [] };
// Scalar field classes → the JS type a source value must have (Foundry would coerce it silently).
const KIND = { NumberField: "number", StringField: "string", HTMLField: "string", BooleanField: "boolean" };
let problems = 0;
const note = (m) => { console.error("  ✗ " + m); problems++; };

if (!existsSync(ROOT)) { console.log("no packs-src yet"); process.exit(0); }
const packs = readdirSync(ROOT).filter((p) => statSync(join(ROOT, p)).isDirectory());

const checkSystem = (where, doc) => {
  const allowed = SCHEMA.keys[doc.type];
  if (!allowed) return note(`${where}: type "${doc.type}" not in the schema snapshot (sr2e ${SCHEMA.systemVersion})`);
  for (const [k, v] of Object.entries(doc.system ?? {})) {
    const kind = allowed[k];
    if (!kind) { note(`${where}: system.${k} is not a ${doc.type} field`); continue; }
    const want = KIND[kind];
    if (want && v !== null && typeof v !== want) note(`${where}: system.${k} is a ${kind} — got ${typeof v} ${JSON.stringify(v)}`);
  }
  for (const k of DERIVED[doc.type] ?? []) if (k in (doc.system ?? {})) note(`${where}: system.${k} is derived — don't author it`);
  const ess = doc.system?.essence;
  if (doc.type === "npc" && ess && [ess.value, ess.max].some(v => v != null && (v < 0 || v > 6))) note(`${where}: NPC Essence outside 0–6 (needs the system change, docs/NEEDS-SYSTEM.md)`);
};

for (const pack of packs.sort()) {
  const type = TYPE_OF[pack];
  if (!type) { note(`${pack}: not declared in module.json`); continue; }
  const collection = COLLECTION[type];
  const dir = join(ROOT, pack);
  const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
  const ids = new Map();
  console.log(`\n${pack}  (${files.length} ${type} docs)`);
  for (const f of files) {
    let doc;
    try { doc = JSON.parse(readFileSync(join(dir, f), "utf8")); }
    catch (e) { note(`${f}: invalid JSON — ${e.message}`); continue; }
    if (f.startsWith("_folder") || doc._key?.startsWith("!folders!")) continue;
    const req = type === "JournalEntry" ? ["_id", "_key", "name", "pages"] : ["_id", "_key", "name", "type", "system"];
    for (const k of req) if (doc[k] === undefined) note(`${f}: missing "${k}"`);
    if (doc._id && doc._key !== `!${collection}!${doc._id}`) note(`${f}: _key should be "!${collection}!${doc._id}"`);
    if (ids.has(doc._id)) note(`${f}: duplicate _id with ${ids.get(doc._id)}`); else ids.set(doc._id, f);
    if (type !== "JournalEntry") checkSystem(f, doc);
    const sub = new Set();
    for (const child of [...(doc.items ?? []), ...(doc.pages ?? []), ...(doc.effects ?? [])]) {
      if (!child?._id) { note(`${f}: an embedded document has no _id`); continue; }
      if (sub.has(child._id)) note(`${f}: duplicate embedded _id ${child._id}`); sub.add(child._id);
      if (child.type && child.system && type === "Actor") checkSystem(`${f} → ${child.name}`, child);
    }
    const src = doc.flags?.["sr2e-cyberpirates"]?.source;
    if (!src?.page || !src?.verified) note(`${f}: no verified transcription record (flags["sr2e-cyberpirates"].source {page, cell, verified})`);
  }
}

if (problems) { console.error(`\n${problems} problem(s) found.`); process.exit(1); }
console.log("\nAll packs valid.");
