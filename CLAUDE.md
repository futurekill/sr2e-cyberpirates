# Cyberpirates! module — development notes

A FoundryVTT v13 content module for the sr2e system (own repo, own packs, no shared code).
Plan: docs/PLAN-content.md (Codex-reviewed). Content only — no underwater/ship rules.

## Source material — IMAGE-ONLY PDF
`../Shadowrun 2e - Cyberpirates {FASA7124}.pdf` has no text layer. OCR is for finding things;
EVERY number is read from a 300 dpi render (crop tables). Unreadable → docs/NEEDS-CAPTURE.md and
ask the user for a photo. PDF page = book page + 9 in the game chapter; cite BOOK pages.
Descriptions are original summaries. `_work/` (renders, OCR, drafts) is never committed.

## Packs
`packs-src/` (JSON, the source of truth) → `npm run build-packs` → `packs/` (gitignored; the release
workflow rebuilds it). Generators `tools/gen-*.mjs` from `tools/data/*`. Run `npm run validate` and
`npm run lint` before committing. Close Foundry before building (LevelDB locks).
Edges & Flaws use the system `quality` item exactly as the Shadowrun Companion module does.

## Schema snapshot
`tools/data/schema.json` is dumped from the LIVE data models (see tools/snapshot-schema.mjs), not from
pack documents — system pack docs carry stale keys (ammo `availability`/`weight`), which once let
invalid fields through. Cyberware/bioware `streetIndex` is a STRING field; everything else numeric.

## Transcription data
The transcription tables live in each `tools/gen-*.mjs` (one source of truth per pack) rather than
separate `tools/data/*` files, except the inherited core statistics (`tools/data/inherited.mjs`).
Every document — and every journal page — carries `flags["sr2e-cyberpirates"].source {page, cell,
verified: "300dpi+visual"}`; the validator rejects anything less. NPC derived fields (attribute values,
Reaction and Initiative base/value, movement) are never authored. Generators keep
`tools/data/inventory.json` (commit it with packs-src); foundry-check compares Foundry's packs with it.

## Art
`node tools/art-todo.mjs` lists what still needs art, keyed `<assets dir>/<slug>` from the compendium.
Prompts: `tools/art-prompts.tsv` (items, vehicles) and `tools/critter-prompts.tsv`. `tools/gen-art.sh
items|critters|vehicles` runs Codex image generation (style refs in `_work/ref/style`) into
`_work/out/<key>.png`; `python3 tools/fit-art.py` fits them into `assets/` (icons 256², portraits
1024², vehicles transparent and trimmed — nose SOUTH, Foundry's rotation 0). The generators derive
`img` from `assets/` by file (`artFor` in tools/lib.mjs), so re-running one never wipes art; vehicle
token length follows the art's proportions and real art unlocks rotation.
