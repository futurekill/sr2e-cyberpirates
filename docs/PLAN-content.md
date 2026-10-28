# Plan: Cyberpirates! content module (`sr2e-cyberpirates`)
_Round 0 — Claude, 2026-10-28 (revised after reading the equipment chapter). User ruling: content only (no underwater or ship rules); Edges &
Flaws follow the Shadowrun Companion module's model._

## Goal
A content module, like the other sourcebook modules, adding Cyberpirates! (FASA7124, SR2, 1997)
game content as compendia for the sr2e system. No system code changes unless a field is missing,
and then only as a separate, reviewed system change.

## Source handling
PDF page = book page + 9 in the game chapter (PDF 151 = book 142); cite BOOK pages.
The PDF is image-only. OCR (tesseract) is for FINDING things; every number and code that goes
into a document is read from a page RENDERED at 300 dpi (crops for tables), and logged in
`docs/NEEDS-CAPTURE.md` until verified — the source-captures rule. Descriptions are original
summaries, never pasted text. `_work/` (renders, OCR) stays out of git.

## Packs (all `packs-src/` JSON → `npm run build-packs` → `packs/`, gitignored)
| Pack | Type | Content (PDF pages) |
|---|---|---|
| `cp-qualities` | Item `quality` | Edges & Flaws (book p.142–144): Braggart −1, Connected 3 or 5, Liar −2, Natural Immunity 3, Pirate Family 3, Sea Legs −2, Sea Madness −4, Water Sprite 1 per improvement — exactly the Companion's `QualityData` use: kind, category, pointValue, source "Cyberpirates", notes. Cyberpirates' **Natural Immunity** (3 points, drugs/poisons) differs from the Companion's (1 point): its own item, named "Natural Immunity (Cyberpirates)". Variable values (Connected 3/5, Water Sprite per point) carry the base value with the options in notes, as the Companion does for variable edges |
| `cp-skills` | Item `skill` | the new Active Skill **Diving** (defaults to Intelligence, +12) and Vehicle Skill **Ship** (defaults to Motorboat, +2), with their concentrations as notes; new concentrations of existing skills (Armed/Unarmed Combat (Underwater), Etiquette (Maritime)) as notes on those two items only — the system's own skill items are never edited p.144–145 |
| `cp-weapons` | Item `weapon` | melee, projectile (harpoon gun, speargun, sling launcher), firearms (FN-AAL gyrojet …), explosives p.179–181 |
| `cp-gear` | Item `gear`/`armor` | diving gear (standard diving gear table, OXSYS artificial gill, dual tank manifold, full mask, breathing helmet, LBA) and diving armor p.181–183 |
| `cp-cyberware` | Item `cyberware` | OXSYS cybergill, cyberfins, nitrogen monitor, peg legs and hook hands p.183 (essence, cost, availability, street index; rating rows where printed) |
| `cp-critters` | Actor `npc` (as PAE) | Caribbean, Philippine and West African critters p.156–163: attributes, attacks, powers, weaknesses, Awakened variants as separate entries where the book gives separate stats |
| `cp-vehicles` | Actor `vehicle` | craft printed with the STANDARD vehicle stats (Handling, Speed, Accel, Body, Armor, Signature, Autonav, Sensor…): bancas (non-powered / outboard / sail), Mitsuhama Anago (and its Fugu variant), Hughes WK-2S Sea Stallion, and any submarine printed that way — book p.175–179 |
| `cp-ships` | JournalEntry (reference) | ships and submarines printed in SHIP-RULE terms (Hull, Bulwark, Sonar, Accommodation, Depth): Cunard Princess Victoria, Maersk Jorgensen, CSS Stuart, Shiawase Aohana, MF Akihito, the larger submarines; ship weapons (missiles, naval guns, ANDREWS) and accessories (torpedo probe, noisemaker, decoy) p.176–182 — one page each with the printed stats, because without ship rules a vehicle actor for them would be half-working (user ruling: content only) |

Each pack: one generator `tools/gen-<pack>.mjs` from a transcription table in `tools/data/`
(the Street Samurai Catalog pattern), deterministic ids, `npm run validate` (schema fields only,
no derived fields, sorted rating rows, every number traced to a page in the data file), lint.

## Repo scaffold
Copied from `sr2e-fields-of-fire` (build/extract/validate tools, eslint, release + lint workflows
with the packaging excludes, CLAUDE.md, README, CHANGELOG, docs/QA-PLAN.md). `module.json` depends on
sr2e ≥ the current version. Pack folder "Cyberpirates". Art: default icons first; the custom-art
pass (Codex imagegen) is a later step, as with the other modules.

## Transcription workflow
Draft tables come from reading pages (`_work/transcription-draft.md`, started); the generator data
files (`tools/data/*.mjs`) are filled from 300 dpi crops, each row carrying its book page, and
`docs/NEEDS-CAPTURE.md` lists anything unreadable (ask the user for a photo, the source-captures rule).
"Use the statistics of X" items (Harpoon = pole-arm, Spear = staff, Rattan sticks = club, core p.254)
take X's numbers from the system's own compendium entry at generation time, with the book's
exceptions applied, so they can't drift from the core data.

## Checks
- `npm run validate` + `npm run lint` in CI; Quench not needed (no code).
- In Foundry: every pack opens; a weapon, cyberware, critter and vehicle drop onto a character/
  scene and roll (QA-PLAN).

## Out of scope
Underwater rules, ship rules (user ruling), fiction NPC stat blocks inside the setting chapters,
GitHub repo creation until the user okays it.
