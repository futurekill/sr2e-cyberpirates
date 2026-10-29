# Changelog

## Unreleased

## 0.4.0 — 2026-10-29
- **The ancestor spirit is summonable** (needs sr2e 0.123.0): Conjuring → a nature spirit →
  Ancestor. Printed statistics (B F+2, Q F×3, S F+1, R F), the six powers (Accident, Confusion,
  Divination, Guard, Manifestation, Search) and its attack: Force dice for (Strength)M Stun — the
  book names no attack skill, so Force follows the core water elemental's unarmed Stun attack.
  Every totem bonus for Spirits of Man carries over (Cat, Dog, Gator, Raccoon, Rat: +2). Three
  portraits. The Reference page lists what stays by hand (fetishes, conjuring time, Divination's roll).
- The totems and the ancestor spirit now register at Foundry's `init`, so saved spirits load with
  the right statistics.

## 0.3.0 — 2026-10-29
- **Seven more critters** (needs sr2e 0.122.0, which lets NPC Essence go above 6): Chupacabras;
  the vampires Sukuyan, Amalanhig and Abat/Boroka/Mangalok; the shapeshifters Malakat, Pugot and
  Warek, with portraits. The vampires are templates over the original character — each sheet is a
  typical vampire (an average human, Essence 7 for the 2D6) and its biography shows how to build a
  particular one. The shapeshifter sheets are the human form; the animal-form rules are in the
  biography.

## 0.2.0 — 2026-10-28
- Custom art for every document: 46 item icons, 16 critter portraits, and top-down vehicle tokens
  (transparent, bow pointing south so they face the way they move; rotation unlocked). Vehicle token
  length now follows the art's proportions; the bancas are 4 squares wide (outriggers), the Delphins 4.
- Generators derive art from `assets/` by file, so re-running one never wipes it
  (`tools/art-todo.mjs`, `tools/gen-art.sh`, `tools/fit-art.py`).

## 0.1.0 — 2026-10-28
- Module scaffold (build / extract / validate, lint, release workflow).
- Edges & Flaws (8) and skills (Diving, Ship).
- Weapons: Harpoon, Spear, Rattan Sticks (core Pole Arm / Staff / Club statistics), Harpoon Gun,
  Speargun, Sling Launcher, Colt M24A3 Water Carbine, FN-AAL Gyrojet Pistol, Ink Grenade; ammo:
  standard and explosive harpoons, ball / APDS / explosive gyrojets. Harpoons and spears resist with
  Impact armor.
- Diving gear: the six standard pieces, drysuit, dual tank manifold, full face mask, enclosed
  breathing helmet, OXSYS artificial gill, LBA, cybercomm link; armor: Diving Armor (4/2), JIM Diving
  Exoskeleton (6/6; Strength upgrades and penalties in its notes).
- Cyberware: OXSYS Cybergill and its helium Air Tank, Cyberfins (attack as hand razors), Nitrogen
  Monitor, Peg Leg (knee / hip), Hook Hand ((Str+1)M). Peg legs and hooks are not cyberlimbs.
- Critters (16): Busaw, Buwaya, King Cobra and its Awakened variant, Kiwigs, Reticulated Python and
  its Awakened variant, Alufye, Anwuma Bavole, Asonwu, Ekyelebenle, Green Mamba, Enwontzane, Gomatia,
  Mami Wata, Sasabonsam. The vampire templates, shapeshifters and Chupacabras wait on a system change
  (Essence above 6 — docs/NEEDS-SYSTEM.md).
- Vehicles (9): Banca (non-powered / outboard motor / sail), Mitsuhama Anago, Hughes WK-2S Sea
  Stallion, Vulkan Electronaut, Saeder-Krupp D. J. Locker, Vulkan Delphin RQ7 and its Coastal Patrol
  variant. Sonar, Sonar Signature, Depth, fuel and the subs' special rules are in the notes.
- African totems (11): Agwengwere, Anansi, Asenna, Awoba, Danwane, Nau, Onini, Osebo, Owoh, Sase,
  Wurega — selectable on the Magic tab with their spell and conjuring dice (registered at setup).
- Cyberpirates Reference journal: ancestor shamans, the ancestor spirit, Divination, a page per
  totem (what's automated, what's by hand), and the revised local-name totems.
- Cyberpirates Ships journal: how to read ship statistics; the Princess Victoria, Jorgensen, Stuart,
  Aohana and Akihito ships and the Triton, Vaneyev and New Hampshire submarines; antiship and
  air-defense missiles, ANDREWS, naval guns, MADCAP, ASROC, Kingfisher, torpedo probe, noisemaker
  and decoy. Reference only — the ship rules are run from the book.
