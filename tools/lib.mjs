// Shared helpers for the generators: deterministic ids, document shells, the transcription record.
import { createHash } from "node:crypto";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const idFor = (ns, s) => createHash("sha1").update(`cp:${ns}:${s}`).digest("hex").slice(0, 16);
export const STATS = { coreVersion: "13.351", systemId: "sr2e", systemVersion: "0.121.0", createdTime: 1793000000000,
  modifiedTime: 1793000000000, lastModifiedBy: null, compendiumSource: null, duplicateSource: null, exportSource: null };

/** The transcription record every generated document carries (the validator requires `verified`). */
export const sourceFlag = (src) => ({ "sr2e-cyberpirates": { source: { page: src.page, cell: src.cell ?? "", verified: src.verified } } });

export const safeName = (name) => name.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");

/** Replace a pack's source folder with these documents. */
export function writePack(pack, docs) {
  const dir = join("packs-src", pack);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  for (const d of docs) writeFileSync(join(dir, `${safeName(d.name)}_${d._id}.json`), JSON.stringify(d, null, 2) + "\n");
  console.log(`${pack}: ${docs.length} documents`);
}

export function itemDoc(ns, { name, type, img, system, src }) {
  const _id = idFor(ns, name);
  return { _id, name, type, img, system, effects: [], flags: sourceFlag(src), folder: null, sort: 0,
    _stats: STATS, ownership: { default: 0 }, _key: `!items!${_id}` };
}

/** A text journal page and a journal entry (pages sorted in order), for the reference generators. */
export const journalPage = (entry, name, content, sort) => ({ _id: idFor(`page:${entry}`, name), name, type: "text",
  title: { show: true, level: 1 }, text: { format: 1, content }, sort, ownership: { default: -1 }, flags: {}, _stats: STATS });
export function journalEntry(name, src, pages) {
  const _id = idFor("journal", name);
  return { _id, name, pages: pages.map((p, i) => journalPage(name, p[0], p[1], (i + 1) * 100000)), folder: null, sort: 0,
    flags: sourceFlag(src), ownership: { default: 0 }, _stats: STATS, _key: `!journal!${_id}` };
}
