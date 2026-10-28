# Content waiting on a system change

Nothing here is generated until the sr2e change ships and is pinned (`module.json` compatibility,
`tools/data/schema.json`). Values are never clamped to fit.

## NPC Essence above 6 (critters)
`NPCData.essence` is bounded 0–6. These critters print Essence the schema can't hold:

| Critter | Book page | Printed Essence | Why it doesn't fit |
|---|---|---|---|
| Chupacabras | 147 | 2D6 | random, up to 12 |
| Sukuyan (vampire template) | 147 | 2D6 | random, up to 12 |
| Amalanhig (vampire template) | 149 | 2D6 | random, up to 12 |
| Abat, Boroka, Mangalok (vampire template) | 149 | 2D6 | random, up to 12 |
| Malakat, Pugot (shapeshifters) | 149 | (8) | 8, dual-natured |
| Warek (leopard shapeshifter) | 155 | (8) | 8, dual-natured |

Their stat blocks are read and transcribed in `_work/transcription-draft.md` (verify again at
generation). The vampire and shapeshifter entries are templates ("C", "A + 2"): when generated they
become example actors with typical values and the formulas in the biography.

## Strength-based spirit attack (ancestor spirit)
The Ancestor Spirit (book p.152) attacks for (Strength)M Stun; `rollSpiritAttack()` takes its Power
from Force. Until the spirit-profile attack shape can take Strength, the ancestor spirit is a
reference page only (never a summonable spirit with a wrong attack). Test: Force 4 → 5M Stun.

## NPC attribute floor and running multiplier (generated, with the difference disclosed)
These critters ARE generated; each biography's "On the sheet" line says where the sheet differs:
- `NPCData.prepareDerivedData` floors every attribute at 1, so a printed 0 (Anwuma Bavole's
  Strength) or "—" (Charisma of the animal critters) counts as 1.
- NPC running is always Quickness × 3; the printed multipliers (×1, ×2, ×4, ×5) are applied by hand.
A system change would let an NPC carry a 0 attribute and its own running multiplier.
