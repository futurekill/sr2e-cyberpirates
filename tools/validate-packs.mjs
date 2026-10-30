// Offline validator for the Cyberpirates packs (docs/PLAN-content.md "Build tooling"). Runs without
// Foundry; the authoritative schema check is tools/foundry-check.js inside Foundry.
//  - every pack's document type comes from module.json;
//  - required keys, `_key` form, unique ids (embedded ids unique per parent);
//  - `system` field names and scalar types must match the system's live schema snapshot (tools/data/schema.json);
//  - numeric bounds the system enforces (NPC Essence ≥ 0; no upper bound since sr2e 0.122.0) and no derived fields;
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
const DERIVED = { bioware: ["actualBodyCost"], npc: ["movement"], vehicle: [] };
// Nested paths NPCData recomputes every preparation (authoring them only stores a stale number).
const DERIVED_PATHS = { npc: ["reaction.base", "reaction.value", "initiative.base", "initiative.value",
  ...["body", "quickness", "strength", "charisma", "intelligence", "willpower"].map(a => `${a}.value`)] };
// Scalar field classes → the JS type a source value must have (Foundry would coerce it silently).
const KIND = { NumberField: "number", StringField: "string", HTMLField: "string", BooleanField: "boolean" };
let problems = 0;
const note = (m) => { console.error("  ✗ " + m); problems++; };

// Every pack the manifest declares must have sources (a deleted pack must not pass silently).
for (const name of Object.keys(TYPE_OF)) {
  const dir = join(ROOT, name);
  if (!existsSync(dir) || !readdirSync(dir).some(f => f.endsWith(".json"))) note(`${name}: declared in module.json but packs-src/${name} is missing or empty`);
}
const packs = existsSync(ROOT) ? readdirSync(ROOT).filter((p) => statSync(join(ROOT, p)).isDirectory()) : [];

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
  for (const k of DERIVED_PATHS[doc.type] ?? []) if (k.split(".").reduce((o, p) => o?.[p], doc.system) !== undefined) note(`${where}: system.${k} is derived — don't author it`);
  const ess = doc.system?.essence;
  if (doc.type === "npc" && ess && [ess.value, ess.max].some(v => v != null && v < 0)) note(`${where}: NPC Essence below 0`);
};

// NPC alternate forms: NPCData's flat contract (sr2e module/data/actor-data.mjs), and weapon tags must name a form.
const INT0 = ["body", "quickness", "strength", "charisma", "intelligence", "willpower", "ballistic", "impact"];
const checkForms = (where, doc) => {
  const keys = new Set();
  for (const f of doc.system?.forms ?? []) {
    for (const k of ["key", "name", "img"]) if (typeof f[k] !== "string") note(`${where}: form ${k} not a string`);
    if (!f.key || keys.has(f.key)) note(`${where}: form key "${f.key}" blank or duplicate`);
    keys.add(f.key);
    for (const k of INT0) if (!Number.isInteger(f[k]) || f[k] < 0) note(`${where}: form ${f.key}.${k} = ${f[k]}`);
    if (!Number.isInteger(f.initiativeDice) || f.initiativeDice < 1) note(`${where}: form ${f.key}.initiativeDice = ${f.initiativeDice}`);
    if (!Number.isInteger(f.reactionMod)) note(`${where}: form ${f.key}.reactionMod = ${f.reactionMod}`);
  }
  if (doc.system?.activeForm && !keys.has(doc.system.activeForm)) note(`${where}: activeForm "${doc.system.activeForm}" unknown`);
  for (const i of doc.items ?? []) if (i.system?.form && !keys.has(i.system.form)) note(`${where} → ${i.name}: tagged "${i.system.form}", no such form`);
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
    if (doc.type === "npc") checkForms(f, doc);
    const sub = new Set();
    for (const child of [...(doc.items ?? []), ...(doc.pages ?? []), ...(doc.effects ?? [])]) {
      if (!child?._id) { note(`${f}: an embedded document has no _id`); continue; }
      if (sub.has(child._id)) note(`${f}: duplicate embedded _id ${child._id}`); sub.add(child._id);
      if (child.type && child.system && type === "Actor") checkSystem(`${f} → ${child.name}`, child);
    }
    const rec = (d, w) => {
      const src = d.flags?.["sr2e-cyberpirates"]?.source;
      if (!src?.page || !src?.cell || src?.verified !== "300dpi+visual") note(`${w}: no complete transcription record (flags["sr2e-cyberpirates"].source {page, cell, verified: "300dpi+visual"})`);
    };
    rec(doc, f);
    for (const pg of doc.pages ?? []) rec(pg, `${f} → page ${pg.name}`);
  }
}

// The inventory (tools/data/inventory.json, written by the generators) must list exactly packs-src.
{
  const inv = existsSync("tools/data/inventory.json") ? JSON.parse(readFileSync("tools/data/inventory.json", "utf8")) : {};
  for (const name of new Set([...Object.keys(inv), ...Object.keys(TYPE_OF)])) {
    const dir = join(ROOT, name);
    const ids = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith(".json") && !f.startsWith("_folder")).map(f => JSON.parse(readFileSync(join(dir, f), "utf8"))._id).sort() : [];
    const want = (inv[name] ?? []).map(d => d._id).sort();
    if (JSON.stringify(ids) !== JSON.stringify(want)) note(`${name}: tools/data/inventory.json doesn't match packs-src (re-run the generator)`);
  }
}

// Inherited statistics (tools/data/inherited.mjs) against the sibling system's pack: a WARNING only,
// so CI without the sibling checkout still passes (PLAN-content.md R1 #10).
const SIB = "../sr2e-foundryvtt/packs-src/weapons";
if (existsSync(SIB)) {
  const { BASES } = await import("./data/inherited.mjs");
  const files = readdirSync(SIB);
  for (const [key, b] of Object.entries(BASES)) {
    const f = files.find(x => x.endsWith(`_${b.id}.json`));
    if (!f) { console.warn(`  ⚠ inherited ${key}: ${b.id} not in the system's weapons pack`); continue; }
    const sys = JSON.parse(readFileSync(join(SIB, f), "utf8")).system;
    for (const k of ["damageCode", "damageType", "concealability", "reach", "weight", "availability", "cost"]) {
      if (sys[k] !== b[k]) console.warn(`  ⚠ inherited ${key}.${k}: snapshot ${JSON.stringify(b[k])}, system now ${JSON.stringify(sys[k])}`);
    }
  }
}

if (problems) { console.error(`\n${problems} problem(s) found.`); process.exit(1); }
console.log("\nAll packs valid.");
