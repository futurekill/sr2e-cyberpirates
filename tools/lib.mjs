// Shared helpers for the generators: deterministic ids, document shells, the transcription record.
import { createHash } from "node:crypto";
import { mkdirSync, rmSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export const idFor = (ns, s) => createHash("sha1").update(`cp:${ns}:${s}`).digest("hex").slice(0, 16);
export const STATS = { coreVersion: "13.351", systemId: "sr2e", systemVersion: "0.121.0", createdTime: 1793000000000,
  modifiedTime: 1793000000000, lastModifiedBy: null, compendiumSource: null, duplicateSource: null, exportSource: null };

/** The transcription record every generated document carries (the validator requires `verified`). */
export const sourceFlag = (src) => ({ "sr2e-cyberpirates": { source: { page: src.page, cell: src.cell ?? "", verified: src.verified } } });

export const INVENTORY = "tools/data/inventory.json";
export const safeName = (name) => name.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");

/** Replace a pack's source folder with these documents. */
export function writePack(pack, docs) {
  const dir = join("packs-src", pack);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  for (const d of docs) writeFileSync(join(dir, `${safeName(d.name)}_${d._id}.json`), JSON.stringify(d, null, 2) + "\n");
  // The independent list of what each pack must contain: foundry-check compares Foundry's indexes
  // with it, and the validator keeps it equal to packs-src.
  const inv = existsSync(INVENTORY) ? JSON.parse(readFileSync(INVENTORY, "utf8")) : {};
  inv[pack] = docs.map(d => ({ _id: d._id, name: d.name })).sort((a, b) => a._id.localeCompare(b._id));
  writeFileSync(INVENTORY, JSON.stringify(Object.fromEntries(Object.entries(inv).sort()), null, 1) + "\n");
  console.log(`${pack}: ${docs.length} documents${missingArt.length ? ` — ${missingArt.length} still on placeholder art` : ""}`);
  missingArt.length = 0;
}

/** Kebab slug for art file names ("Peg Leg (Knee Length)" → "peg-leg-knee-length"). */
export const slugify = (name) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/['\u2019]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/**
 * The art for a document, derived from disk on every run: `assets/<dir>/<slug>.webp` when it exists,
 * else the fallback. Generators rewrite packs-src wholesale, so art that lived only in packs-src would
 * be wiped by a re-run (it happened to Rigger Black Book); deriving it here means it never is.
 */
export const missingArt = [];
export function artFor(dir, name, fallback) {
  const rel = `assets/${dir}/${slugify(name)}.webp`;
  if (existsSync(rel)) return `modules/sr2e-cyberpirates/${rel}`;
  missingArt.push(rel);
  return fallback;
}

export function itemDoc(ns, { name, type, img, system, src }) {
  const _id = idFor(ns, name);
  img = artFor(`item_icons/${type}`, name, img);
  return { _id, name, type, img, system, effects: [], flags: sourceFlag(src), folder: null, sort: 0,
    _stats: STATS, ownership: { default: 0 }, _key: `!items!${_id}` };
}

/** A text journal page and a journal entry (pages sorted in order), for the reference generators. */
export const journalPage = (entry, name, content, sort, src) => ({ _id: idFor(`page:${entry}`, name), name, type: "text",
  title: { show: true, level: 1 }, text: { format: 1, content }, sort, ownership: { default: -1 }, flags: sourceFlag(src), _stats: STATS });
/** pages: [name, html, pageSrc?]; a page without its own record takes the entry's page, cell = its name. */
export function journalEntry(name, src, pages) {
  const _id = idFor("journal", name);
  return { _id, name, pages: pages.map((p, i) => journalPage(name, p[0], p[1], (i + 1) * 100000,
    { page: src.page, cell: p[0], verified: src.verified, ...(p[2] ?? {}) })), folder: null, sort: 0,
    flags: sourceFlag(src), ownership: { default: 0 }, _stats: STATS, _key: `!journal!${_id}` };
}
