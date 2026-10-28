// Cyberware (book p.174–175) into packs-src/cp-cyberware. Every number was read from a 300 dpi render
// (OCR misread two Street Indexes and the Air Tank's Essence; the visual read is recorded). Peg legs
// and hook hands are NOT cyberlimbs (no limb fields): they carry no Strength or option rules.
import { itemDoc, writePack } from "./lib.mjs";

const V = "300dpi+visual";
const ICON = "systems/sr2e/assets/item_icons/cyberware/";
const NO_MODS = { body: 0, quickness: 0, strength: 0, charisma: 0, intelligence: 0, willpower: 0, reaction: 0, initiativeDice: 0 };
const ware = (s) => ({ location: "bodyware", grade: "standard", rating: 0, legality: "Legal", installed: true,
  attributeMods: NO_MODS, ratingStats: [], ...s });
const melee = (damageCode) => ({ isWeapon: true, weaponType: "melee", skill: "armed combat", damageType: "physical", reach: 0, damageCode });
const PEG = "Not a cyberleg: no nerve link, no Strength modifier, and no modifications or other cyberware can be added (it can be hollowed out to hide something no wider than a fist and no longer than a forearm). Quickness counts lower for movement; the wearer can't walk normally — a Perception (3) Test notices the peg. Removable from its attachment plate. Sharpened, it fights as a hand spur, (Str+2)M (gamemaster decides whether the wearer keeps balance). Standard grade only. Replacing it with a real cyberleg follows the replacement rules (Street Samurai Catalog p.97). Street Index: always available.";

const C = [
  { name: "OXSYS Cybergill", img: "filtration-system-air", page: 174, cell: "Cybergill table: Cybergill",
    s: { essenceCost: 1.5, cost: 12500, availability: "5/72 hours", streetIndex: 1.75,
      notes: "Gills implanted on both sides of the neck, with a tracheal cutoff valve and pulmonary bypasses: breathes dissolved oxygen straight from the water. Immune to oxygen toxicity; still vulnerable to nitrogen narcosis and decompression sickness from residual lung nitrogen (hence the usual internal helium Air Tank). Cyberpirates p.174." } },
  { name: "Air Tank (Cybergill)", img: "filtration-system-air", page: 174, cell: "Cybergill table: Air Tank",
    s: { essenceCost: 0.25, cost: 1200, availability: "4/5 days", streetIndex: 1.5,
      notes: "Internal tank of pure helium installed with a cybergill to flush residual nitrogen from the lungs. Cyberpirates p.174." } },
  { name: "Cyberfins", img: "hand-razors", page: 174, cell: "Cyberfins table",
    s: { essenceCost: 0.3, cost: 10500, availability: "5/48 hours", streetIndex: 1.25, ...melee("(Str)L"),
      notes: "Retractable spurs and webbing in the hands and feet: extended, the user swims as if wearing standard fins, and can attack with them as hand razors, (Str)L. Not compatible with standard fins or gloves. Cyberpirates p.174." } },
  { name: "Nitrogen Monitor", img: "filtration-system-blood", page: 174, cell: "Nitrogen Monitor table",
    s: { essenceCost: 0.5, cost: 8500, availability: "4/24 hours", streetIndex: 1.25,
      notes: "Lung bari-spectrometer and pulmonary-vein electrolytic analyzer. When the character is on the verge of nitrogen narcosis or the bends, roll 2D6: on 8 or less it warns them (a shriek and red letters on a display link). It can't warn of oxygen toxicity, helium chills or HPNS. Cyberpirates p.174." } },
  { name: "Peg Leg (Knee Length)", img: "simple-replacement-limb", page: 175, cell: "Peg Leg table: Knee Length",
    s: { essenceCost: 0.2, cost: 50, availability: "1/6 hours", streetIndex: 1,
      notes: `Attached at the knee. Walking −1, running multiplier −1 (apply by hand). ${PEG} Cyberpirates p.174–175.` } },
  { name: "Peg Leg (Hip Length)", img: "simple-replacement-limb", page: 175, cell: "Peg Leg table: Hip Length",
    s: { essenceCost: 0.4, cost: 120, availability: "1/6 hours", streetIndex: 1,
      notes: `Attached at the hip. Walking −2, running multiplier −2 (apply by hand). ${PEG} Cyberpirates p.174–175.` } },
  { name: "Hook Hand", img: "spur", page: 175, cell: "Peg Leg table: Hook Hand",
    s: { essenceCost: 0.1, cost: 30, availability: "1/6 hours", streetIndex: 1, ...melee("(Str+1)M"),
      notes: "Replacement hand on a wrist plate; attachments may weigh up to Strength ÷ 10 kg (Strength 5: 0.5 kg). A hook does (Str+1)M; a knife or spur attachment uses that weapon's damage code instead. Removable (voluntarily or otherwise). No cyber-enhancements. Standard grade only. Replacing it with a real cyberhand follows the replacement rules (Street Samurai Catalog p.97). Street Index: always available. Cyberpirates p.174–175." } }
];

writePack("cp-cyberware", C.map(c => itemDoc("cyberware", { name: c.name, type: "cyberware", img: `${ICON}${c.img}.webp`,
  system: ware(c.s), src: { page: c.page, cell: c.cell, verified: V } })));
