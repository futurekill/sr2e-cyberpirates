# Plan Review Log: Cyberpirates! content module
Started 2026-10-28. MAX_ROUNDS=5.

## Round 1 — Codex
The plan needs revision. Concrete findings, with one-line fixes:

- **Journal pages are unsupported by the copied builder.** [build-packs.mjs](/Users/jcandalino/Code/foundryvtt/shadowrun/sr2e-fields-of-fire/tools/build-packs.mjs) splits embedded actor items/effects but has no `journal: ["pages"]` handling, risking lost ship-reference pages. **Fix:** Add journal-page splitting and extraction, then verify a build/extract round trip preserves every page.

- **The copied validator does not validate schemas.** It checks basic keys and IDs, hard-codes `ff-vehicles`, treats everything else as Items, and requires `type`/`system` even for journals. **Fix:** Derive document types from the manifest and validate nested schemas, choices, bounds, embedded IDs, journal pages, and forbidden derived fields.

- **Nosferatu is an unsafe schema precedent.** Its source stores Essence 7, while [NPCData](/Users/jcandalino/Code/foundryvtt/shadowrun/sr2e-foundryvtt/module/data/actor-data.mjs:1680) caps both Essence fields at 6; it also includes derived values. **Fix:** Audit every critter against current NPCData and gate unsupported printed values on a separately reviewed system change rather than copying or silently clamping them.

- **Ancestor Quickness is misrepresented.** The system explicitly distinguishes Quickness from the printed movement multiplier; its profiles support additive `q`, not Quickness multiplied by Force. **Fix:** Verify the rendered entry and encode Quickness F with `q: 0, mult: 3`, rather than Quickness 3F.

- **Divination has no config slot for a rules summary.** `spiritPowers` maps keys to label strings, and `useSpiritPower()` only displays that label and spends a service. **Fix:** Register a string label and put the summary in accessible journal content or spirit notes.

- **Totem disadvantages can disappear into developer comments.** The Grimoire precedent does this, but comments are invisible to players and the totem config has no displayed notes field. **Fix:** Publish player-readable totem entries containing disadvantages, conditional modifiers, and manual adjudication instructions.

- **Skill defaults are not supported by SkillData.** It has no default-target or default-penalty fields, and `vehicle` is not a valid skill category. **Fix:** Use `category: "active"` for both skills and explicitly document Diving’s Intelligence +12 and Ship’s Motorboat +2 as manual defaults.

- **The missile question has a concrete negative answer.** Rigger 2’s AIM-11R is an ordinary `weapon`; Intelligence is prose, and WeaponData lacks missile Handling, Speed, Body, Signature, and Range Rating fields. **Fix:** Keep these ship weapons as journal references under the content-only ruling.

- **“Quench not needed (no code)” contradicts the registration scripts.** Setup follows the Grimoire precedent, but that alone does not verify saved ancestor actors, derived profiles, or module coexistence. **Fix:** Require registration tests plus Foundry checks covering fresh summons, saved-world reloads, attack values, power labels, totem modifiers, and Grimoire enabled simultaneously.

- **Live sibling-compendium reads undermine deterministic generation.** The same transcription can generate different weapons when the neighboring system checkout changes, and clean CI may lack that checkout altogether. **Fix:** Pin the upstream revision and source IDs, with reproducible fetching or checked-in verified source snapshots.

- **A page citation does not prove transcription verification.** The plan lacks a durable verified record once entries leave `NEEDS-CAPTURE.md`, particularly for inherited weapon stats and formula glyphs. **Fix:** Record printed folio, source row/cell, verified value or formula, and verification status in tracked data; reject unresolved entries during validation.

VERDICT: REVISE
### Claude's response
Accepted all 11 (see the Round 1 plan). Note on #1: the scaffold commit already added journal pages to build-packs; extraction and a round-trip check are now planned too.
