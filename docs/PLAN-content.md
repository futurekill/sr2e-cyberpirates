# Plan: Cyberpirates! content module (`sr2e-cyberpirates`)
_Round 2 — revised after Codex R1–R2 (see PLAN-content-REVIEW-LOG.md)._ User ruling: content only (no underwater or ship rules); Edges &
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
| `cp-skills` | Item `skill` | the new Active Skill **Diving** and the Vehicle Skill **Ship**, both `category: "active"` (SkillData has no `vehicle` category and no default fields, R1 #7); their defaults (Diving → Intelligence +12; Ship → Motorboat +2) and concentrations written in the notes as MANUAL defaults; new concentrations of existing skills (Armed/Unarmed Combat (Underwater), Etiquette (Maritime)) as notes on those two items only — the system's own skill items are never edited p.144–145 |
| `cp-weapons` | Item `weapon` | melee, projectile (harpoon gun, speargun, sling launcher), firearms (FN-AAL gyrojet …), explosives p.179–181 |
| `cp-gear` | Item `gear`/`armor` | diving gear (standard diving gear table, OXSYS artificial gill, dual tank manifold, full mask, breathing helmet, LBA) and diving armor p.181–183 |
| `cp-cyberware` | Item `cyberware` | OXSYS cybergill, cyberfins, nitrogen monitor, peg legs and hook hands p.183 (essence, cost, availability, street index; rating rows where printed) |
| `cp-critters` | Actor `npc` (as PAE) | Caribbean, Philippine and West African critters p.156–163: attributes, attacks, powers, weaknesses, Awakened variants as separate entries where the book gives separate stats |
| `cp-vehicles` | Actor `vehicle` | craft printed with the STANDARD vehicle stats (Handling, Speed, Accel, Body, Armor, Signature, Autonav, Sensor…): bancas (non-powered / outboard / sail), Mitsuhama Anago (and its Fugu variant), Hughes WK-2S Sea Stallion, and any submarine printed that way — book p.175–179 |
| `cp-reference` | JournalEntry | the totem pages (above), the ancestor spirit and Divination, the revised-totem names |
| `cp-ships` | JournalEntry (reference) | ships and submarines printed in SHIP-RULE terms (Hull, Bulwark, Sonar, Accommodation, Depth): Cunard Princess Victoria, Maersk Jorgensen, CSS Stuart, Shiawase Aohana, MF Akihito, the larger submarines; ship weapons (missiles, naval guns, ANDREWS) and accessories (torpedo probe, noisemaker, decoy) p.176–182 — one page each with the printed stats, because without ship rules a vehicle actor for them would be half-working (user ruling: content only) |

| (script) totems | `CONFIG.SR2E.totems` via `scripts/register-cyberpirates.mjs` (the Grimoire module's pattern: an esmodule extending the config in place at setup) | the African totems with full entries (Agwengwere/Hyena, Anansi/Spider, Asenna/Bat, Awoba/Leopard, Danwane/Dove, Nau/Crocodile, Onini/Python, Osebo/Cheetah, Owoh/Cobra, Sase/Jackal, Wurega/Parrot) book p.152–154 — Python and Cobra are the same entries the Philippines text points to (p.149 → p.153); spell and conjuring bonuses/penalties in the core totem shape. **Player-readable (R1 #6):** every totem also gets a page in a `cp-reference` journal pack with its characteristics, environment, advantages, disadvantages and anything conditional the config can't express (e.g. "+2 conjuring nature spirits during hours of darkness"), marked "adjudicate by hand". The "revised totems" (Agona = Raven, Anlo = Shark, …) are local NAMES for existing totems: a page there, not new totems |
| (script) ancestor spirits | `CONFIG.SR2E.spiritDomains` + `spiritProfiles` + `spiritDomainProfile` + `spiritPowers`/`spiritDomainPowers` via the same script | the Ancestor Spirit (book p.152): printed B F+2, Q F x 3, S F+1, C/I/W F, E F(A), R F, attack (Strength)M Stun. "F x 3" is the standard critter notation — Quickness F with movement multiplier 3 — so the profile is `{ b: +2, q: 0, mult: 3, s: +1, r: 0 }` (R1 #4; the page's own note confirms "Quickness 'x3' is the Running multiplier"). Its attack, (Strength)M Stun, can't be expressed today: `rollSpiritAttack()` takes its Power from Force (R2 #1). So the ancestor spirit is registered ONLY after a separately reviewed SYSTEM change adds a Strength-based attack power to the spirit-profile attack shape (listed in `docs/NEEDS-SYSTEM.md`, tested Force 4 → 5M Stun); until then it is a reference page only — never a summonable spirit with a wrong or missing attack. Powers Accident, Confusion, Divination, Guard, Manifestation, Search — Divination registered as a LABEL only (`spiritPowers` holds labels, R1 #5); its rules (the Divination TN table) live on the reference page. Ancestor-shaman conjuring limits, fetishes and conjuring time are on the reference page for the GM, not enforced |

**Template critters** (vampire and shapeshifter variants printed as "C", "C×5", "C+E", "A+2"): an
example actor with typical values and the book's formulas spelled out in the biography, like the
Paranormal Animals precedent — but every value checked against the CURRENT `NPCData` schema
(R1 #3; Nosferatu's stored Essence 7 is outside NPCData's 0–6 bounds and is NOT a precedent).
**Critter values the schema can't hold** (Essence 8 for the shapeshifters, 2D6 random Essence): a
separate, separately-reviewed SYSTEM change (raise NPC Essence's maximum for critters) is a
prerequisite; until it ships, those critters are listed in `docs/NEEDS-SYSTEM.md` and not generated —
never clamped silently. **Named NPCs** in the setting (Masaru, the dragon)
stay out, as fiction NPCs.

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
"Use the statistics of X" items (Harpoon = pole-arm, Spear = staff, Rattan sticks = club, core p.254):
X's numbers are SNAPSHOTTED into `tools/data/inherited.mjs` with the system's source id and the
system version they were copied from (R1 #10) — generation never reads a sibling checkout, so CI and
re-runs are reproducible; the validator re-checks the snapshot against the system pack only when
the sibling checkout is present (a warning, not a CI failure).
**Verification record (R1 #11):** every data row carries `{ page: <book folio>, cell: "<row/column>",
verified: "300dpi" }`; the validator REJECTS any row without `verified`, so nothing unread ships.

## Build tooling (R1 #1, #2)
- `build-packs` and `extract-packs` handle JournalEntry pages (split into `!journal.pages!` records
  and back); a round-trip check (build → extract → compare) runs in `npm run validate`.
- The validator takes each pack's document type from `module.json` (not a hard-coded list), checks
  per type: required keys, `_key` form, unique ids (embedded too), the `quality`/`skill`/`weapon`/
  `gear`/`armor`/`cyberware` and `npc`/`vehicle` field names and choice values the system defines (a
  checked-in list taken from the pinned system version), numeric bounds (e.g. Essence 0–6), and the
  forbidden derived fields (`actualBodyCost`, `value` on attributes where the system derives them).
- In Foundry, `tools/foundry-check.js` (run from a macro, QA §1) is the authoritative schema check
  (R2 #2): for every pack it reports documents missing from the index, `invalidDocumentIds`
  (validation failures), and — comparing each loaded document's `toObject()` RECURSIVELY against the
  untouched `packs-src` JSON it came from, authored fields only — any authored field that was dropped
  or whose value changed (clamped, coerced). Fields the schema inserted as defaults, and Foundry's
  metadata (`_stats`, `ownership`, `sort`, `folder`), are allowed and not reported.

## Checks
- `npm run validate` + `npm run lint` in CI.
- **Quench (R1 #9):** the registration script adds a Quench batch `cyberpirates.*` (when Quench is
  active): the totems exist with their bonuses and coexist with the Grimoire module enabled (no key
  clash). Once the ancestor spirit lands (after its system change): its domain, profile and
  Divination label are registered; a fresh ancestor summoned at Force 4 gets B6 S5 Q4 (mult 3), its
  powers and a 5M Stun attack; a saved ancestor actor survives a reload.
- In Foundry: every pack opens; a weapon, cyberware, critter and vehicle drop onto a character/
  scene and roll (QA-PLAN).

## Ship weapons (resolved, R1 #8)
WeaponData has no missile Handling/Speed/Body/Signature/Range Rating fields (Rigger 2's AIM-11R is a
plain weapon with the rest in prose), so ship weapons and accessories stay journal references in
`cp-ships`; there is no `cp-vehicle-weapons`/`cp-vehicle-mods` pack. Small submarines (Vulkan Electronaut, Saeder-Krupp
D.J. Locker, Vulkan Delphin RQ7 + patrol variant) ARE printed with standard vehicle stats → `cp-vehicles`.

## Out of scope
Underwater rules, ship rules (user ruling), fiction NPC stat blocks inside the setting chapters,
GitHub repo creation until the user okays it.
