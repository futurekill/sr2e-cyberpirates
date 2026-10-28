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
