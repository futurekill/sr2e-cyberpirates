// Critters (book p.147–155) into packs-src/cp-critters, as npc actors shaped like the system's own
// critters (race "critter", a Natural Attack / Unarmed Strike weapon). Every number was read from a
// 300 dpi render (OCR garbles these stat lines; it was used only to locate them).
// Critter key (core p.232): Body "N/A" = rating / natural armor (B and I); Quickness "N x M" = rating /
// running multiplier; Intelligence "N/P" = rating / Perception; Essence in parentheses = dual-natured;
// Reaction "*" = 2D6 Initiative, "**" = 3D6. Charisma "—" is stored as 0; NPCData floors attributes at 1 (said in the biography).
// NPC Reaction is DERIVED as (Q+I)/2 + mod, so `mod` is set to land on the printed value. Movement is
// derived ×3, so the printed running multiplier is in the biography. Threat Rating = mean attribute
// (the Paranormal Animals module's rule; the book prints none). Derived fields (Reaction/Initiative
// base and value, movement) are not authored; the biography says where the sheet differs from the book.
// Not generated (docs/NEEDS-SYSTEM.md): Chupacabras (Essence 2D6), the vampire templates (2D6), and
// the shapeshifters (Essence 8) — NPC Essence is capped at 6.
import { idFor, sourceFlag, STATS } from "./lib.mjs";
import { writePack } from "./lib.mjs";

const V = "300dpi+visual";
const ICON = "systems/sr2e/assets/item_icons/weapons/";
const attr = (v) => ({ base: v, mod: 0, value: v, racial: 0 });

function attack(owner, { name = "Natural Attack", code, type = "physical", reach = 0, notes = "", humanoid = false, skill = "" }) {
  return { _id: idFor(`critter-attack:${owner}`, name), name, type: "weapon",
    img: `${ICON}${humanoid ? "unarmed-strike" : "natural-attack"}.webp`,
    system: { weaponType: "melee", skill, damageCode: code, damageType: type, concealability: 0, reach,
      firingModes: { ss: false, sa: false, bf: false, fa: false }, ammo: { current: 0, max: 0, type: "" }, recoilComp: 0,
      ranges: { short: 0, medium: 0, long: 0, extreme: 0 }, strengthMin: 0, weight: 0, cost: 0, availability: "",
      legality: "", equipped: true, accessories: [], notes },
    effects: [], folder: null, sort: 0, ownership: { default: 0 }, flags: {}, _stats: STATS };
}

function critter(x) {
  const _id = idFor("critter", x.name);
  const rBase = Math.floor((x.q + x.i) / 2);
  const stats = `B ${x.b}${x.armor ? `/${x.armor}` : ""} · Q ${x.q} × ${x.mult} · S ${x.s} · C ${x.c || "—"} · I ${x.i}${x.per ? `/${x.per}` : ""} · W ${x.w} · E ${x.dual ? `(${x.e})` : x.e} · R ${x.r}${"*".repeat((x.dice ?? 1) - 1)}`;
  const tr = Math.max(1, Math.round((x.b + x.q + x.s + x.c + x.i + x.w) / 6));
  // What the sheet shows differently from the book (the system's NPC model), said where players read it.
  const zero = [["Strength", x.s, "0"], ["Charisma", x.c, "—"]].filter(([, v]) => v === 0).map(([n, , shown]) => `${n} (printed ${shown})`);
  const sheet = [x.mult !== 3 && `the sheet's running rate uses ×3 — use ×${x.mult} by hand`,
    zero.length && `${zero.join(" and ")} ${zero.length > 1 ? "count" : "counts"} as 1 on the sheet (the system's floor)`,
    `Threat Rating ${tr} is this module's estimate (the average attribute), not the book's`].filter(Boolean);
  const bio = `<p>${x.desc}</p>`
    + (x.powers ? `<p><strong>Powers:</strong> ${x.powers}</p>` : "")
    + `<p><strong>Weaknesses:</strong> ${x.weak ?? "None"}</p>`
    + (x.note ? `<p><strong>Note:</strong> ${x.note}</p>` : "")
    + `<p><em>Printed stats: ${stats}; Attacks ${x.printedAttacks}. Running multiplier ×${x.mult}${x.per ? `; Perception ${x.per}` : ""}${x.dual ? "; dual-natured" : ""}. Cyberpirates p.${x.page}.</em></p>`
    + `<p><em>On the sheet: ${sheet.join("; ")}.</em></p>`;
  return {
    _id, name: x.name, type: "npc", img: "icons/svg/pawprint.svg",
    system: {
      biography: bio, race: "critter", professionalRating: 0,
      body: attr(x.b), quickness: attr(x.q), strength: attr(x.s), charisma: attr(x.c), intelligence: attr(x.i), willpower: attr(x.w),
      essence: { value: x.e, max: x.e },
      magic: { value: 0, max: 0, tradition: "none", type: "none", totem: "" },
      reaction: { mod: x.r - rBase },
      conditionMonitor: { physical: { value: 0, max: 10, overflow: 0 }, stun: { value: 0, max: 10, overflow: 0 }, overflow: 0 },
      armor: { ballistic: x.armor ?? 0, impact: x.armor ?? 0 },
      dicePools: { combat: { value: 0, max: 0, bonus: 0 }, magic: { value: 0, max: 0, bonus: 0 } },
      initiative: { dice: x.dice ?? 1, mod: 0 },
      threatRating: tr, nuyen: 0, dualNatured: !!x.dual
    },
    items: x.attacks.map(a => attack(x.name, a)), effects: [], folder: null, sort: 0,
    flags: sourceFlag({ page: x.page, cell: `${x.name.replace(/ \(.*/, "")} stat block`, verified: V }), _stats: STATS,
    prototypeToken: { name: x.name, displayName: 0, actorLink: false, width: 1, height: 1, lockRotation: true,
      texture: { src: "icons/svg/pawprint.svg", fit: "contain" }, disposition: -1,
      bar1: { attribute: "conditionMonitor.physical" }, bar2: { attribute: "conditionMonitor.stun" } },
    ownership: { default: 0 }, _key: `!actors!${_id}`
  };
}

const HUMANOID = [{ name: "Unarmed Strike", code: "(Str)M", type: "stun", humanoid: true, skill: "unarmed_combat", notes: "Humanoid: uses weapons and the normal combat rules." }];
const COBRA_P = "Enhanced Senses (Smell), Thermographic Vision";
const COBRA_N = "A cobra that inflicts a Light wound or worse has injected a nonmagical venom that does 6S damage at 10-minute intervals.";
const PY_N = "A successful predatory bite lets the python start constricting, damage or not: (Str)L Stun every Combat Turn. Heavy armor resists it normally; lighter Impact armor has no effect. It waits until the prey's heart stops before eating. Escaping the coils takes a Complex Action and a successful opposed Strength Test.";
const MAMBA_N = "A snake that inflicts a Light wound or worse has injected venom: 5S at 5-, 10- and 20-minute intervals (mundane or Awakened). It can spit the poison up to 5 m: if it wins an opposed Reaction Test, the target is blinded for 2D6 hours ÷ the successes of a Body Test against the poison's Damage Code; no successes, and the blinding is permanent.";

const C = [
  // Philippines (* in the book: native to the Philippines)
  { name: "Busaw", page: 149, b: 7, q: 5, mult: 4, s: 6, c: 1, i: 4, w: 5, e: 5, dual: true, r: 4, printedAttacks: "Humanoid", attacks: HUMANOID,
    powers: "Enhanced Senses (Hearing, Smell)", weak: "Allergy (Sunlight, Moderate; Citric Acid, Severe), Reduced Senses (blind or nearly so)",
    desc: "The Philippine ghoul (aswang)." },
  { name: "Buwaya", page: 149, b: 10, armor: 4, q: 4, mult: 4, s: 8, c: 0, i: 1, w: 4, e: 6, r: 3, printedAttacks: "10S", attacks: [{ code: "10S" }],
    powers: "Compulsion, Enhanced Physical Attributes (Strength, three times per day for [Essence]D6 turns), Enhanced Senses (Low-Light Vision, Smell), Search",
    desc: "A small, fat, mostly green Philippine crocodile with a brown patch on its back. It Searches for food and magically Compels the prey to come within biting distance. Lazy: it always takes offered meat rather than attacking." },
  { name: "King Cobra", page: 149, b: 5, q: 6, mult: 1, s: 5, c: 0, i: 1, per: 4, w: 2, e: 6, r: 6, dice: 2, printedAttacks: "6M", attacks: [{ code: "6M", notes: "Venom on a Light wound or worse (see biography)." }],
    powers: COBRA_P, note: COBRA_N,
    desc: "Mundane king cobra of the Philippine forests, 4–6 m long; preys on small to medium mammals and reptiles, including snakes." },
  { name: "King Cobra (Awakened)", page: 149, b: 8, q: 6, mult: 1, s: 8, c: 0, i: 1, per: 4, w: 4, e: 6, r: 6, dice: 3, printedAttacks: "6M", attacks: [{ code: "6M", notes: "Venom on a Light wound or worse (see biography)." }],
    powers: `${COBRA_P}, Immunity to Poisons, Hypnotic Stare (treat as Hypnotic Song with eye contact as range), Silence`, note: COBRA_N,
    desc: "Awakened king cobra, up to 8 m long." },
  { name: "Kiwigs", page: 150, b: 11, armor: 2, q: 4, mult: 5, s: 13, c: 0, i: 2, per: 4, w: 4, e: 6, r: 4, printedAttacks: "9D2, +1 Reach",
    attacks: [{ code: "9D", reach: 1, notes: "Printed 9D2, +1 Reach." }],
    powers: "Enhanced Physical Attributes (Strength or Quickness, once per day each, for [Essence × 2]D6 turns), Enhanced Reactions, Enhanced Senses (Thermographic Vision, Wide-band Hearing)",
    weak: "Allergy (Sunlight, Nuisance)",
    desc: "Awakened carnivorous boars resembling North American piasmae, but with cloven hooves and pig-like snouts." },
  { name: "Reticulated Python", page: 150, b: 8, q: 4, mult: 1, s: 10, c: 0, i: 1, per: 5, w: 2, e: 6, r: 5, printedAttacks: "8M",
    attacks: [{ code: "8M", notes: "Bite; then constriction (Str)L Stun each Combat Turn (see biography)." }],
    powers: "Enhanced Senses (Smell), Thermographic Vision", note: PY_N,
    desc: "Constrictor of Malaysian and Philippine jungles, 6–10 m long; eats most mammals." },
  { name: "Reticulated Python (Awakened)", page: 150, b: 10, q: 4, mult: 1, s: 16, c: 0, i: 1, per: 5, w: 4, e: 6, r: 5, printedAttacks: "8M",
    attacks: [{ code: "8M", notes: "Bite; then constriction (Str)L Stun each Combat Turn (see biography)." }],
    powers: "Adaptive Coloration, Enhanced Senses (Smell), Immunity to Pathogens and Poisons, Search, Thermographic Vision",
    note: `${PY_N} Awakened pythons can attack and hold astral forms; escaping works the same physically or astrally.`,
    desc: "Awakened reticulated python, up to 14 m and 350 kg, with a head the size of a big shoe box." },
  // West Africa
  { name: "Alufye", page: 154, b: 2, q: 3, mult: 2, s: 1, c: 0, i: 1, per: 4, w: 1, e: 6, r: 3, printedAttacks: "none", attacks: [],
    powers: "Empathy, Enhanced Senses (Smell, Taste)",
    desc: "Awakened cockroaches 30–40 cm long from West African rainforests. They trill when threatened, lulling a would-be predator into pleasant lethargy. Harmless, popular pets." },
  { name: "Anwuma Bavole", page: 154, b: 1, q: 4, mult: 4, s: 0, c: 0, i: 1, per: 4, w: 1, e: 6, r: 4, printedAttacks: "1L1",
    attacks: [{ code: "1L", notes: "Printed 1L1." }],
    powers: "Enhanced Senses (Low-light Vision), Sonic Projection (High Frequency)", weak: "Allergy (Sunlight, Mild)",
    desc: "Awakened fish-eating bats of coastal West Africa, like North American birdmen. They sometimes follow groups of people for days; the Nzima feed them as an omen of good luck." },
  { name: "Asonwu", page: 154, b: 2, q: 4, mult: 3, s: 3, c: 0, i: 3, per: 4, w: 2, e: 6, r: 6, printedAttacks: "6L", attacks: [{ code: "6L" }],
    powers: "Enhanced Senses (Improved Hearing and Smell, Low-light Vision), Pestilence",
    note: "Multiplier for asonwu movement is 4 (the stat line prints × 3).",
    desc: "Carnivorous pack hunters like the agropelter: a few hamstring large prey with swift bites, then up to fifty mob it. Their Pestilence disease brings itching, shaking, madness and eventually brain death." },
  { name: "Ekyelebenle", page: 154, b: 5, q: 6, mult: 2, s: 6, c: 0, i: 1, per: 5, w: 4, e: 6, dual: true, r: 6, dice: 3, printedAttacks: "6M biting",
    attacks: [{ code: "6M", notes: "Bite (multiple). Venom on a Light wound or worse; can spit it (see biography)." }],
    powers: "Enhanced Senses (Smell, Thermographic Vision), Immunity to Poisons, Immunity to Pathogens, Magical Resistance, Venom", note: MAMBA_N,
    desc: "Awakened green mambas up to 6 m long from the savannahs of sub-Saharan Africa. Extremely aggressive: they chase anything dwarf-sized or smaller, spit poison for defense and hunting, and bite many times." },
  { name: "Green Mamba", page: 154, b: 4, q: 6, mult: 2, s: 5, c: 0, i: 1, per: 5, w: 3, e: 6, r: 6, dice: 3, printedAttacks: "6L biting",
    attacks: [{ code: "6L", notes: "Bite. Venom on a Light wound or worse; can spit it (see biography)." }],
    powers: "Enhanced Senses (Smell, Thermographic Vision), Immunity to Poisons, Immunity to Pathogens, Magical Resistance, Venom", note: MAMBA_N,
    desc: "The non-Awakened green mamba: the parenthesized statistics of the Ekyelebenle entry. The book prints one powers line for both variants (reproduced here); the gamemaster decides which apply to a mundane snake." },
  { name: "Enwontzane", page: 155, b: 8, q: 3, mult: 4, s: 7, c: 0, i: 2, per: 4, w: 4, e: 6, dual: true, r: 4, printedAttacks: "8S2, +1 Reach",
    attacks: [{ code: "8S", reach: 1, notes: "Printed 8S2, +1 Reach." }],
    powers: "Adaptive Coloration",
    desc: "Nocturnal, arboreal predators like the sasquatch and bandersnatch: almost 3 m tall, over 400 kg, free of HMHVV. They feed on anything ork-sized or smaller and live in family groups of up to ten." },
  { name: "Gomatia", page: 155, b: 6, q: 3, mult: 1, s: 6, c: 0, i: 2, per: 6, w: 3, e: 6, dual: true, r: 3, dice: 3, printedAttacks: "Tongue 6L Stun, Bite 6M",
    attacks: [{ name: "Tongue", code: "6L", type: "stun", notes: "Opposed Strength Test to get something out of its grasp; 1 Free Action to drag something to its mouth." }, { name: "Bite", code: "6M" }],
    powers: "Adaptive Coloration, Enhanced Senses (Smell, 360° vision), Immunity to Poisons",
    desc: "Doberman-sized Awakened chameleons with rotating eyes, prehensile tails and a sticky tongue three times their body length. Diurnal ambushers of birds and Awakened insects; stupid enough to attack insect spirits that smell like prey. Sold as pets and increasingly as security paranimals." },
  { name: "Mami Wata", page: 155, b: 4, q: 6, mult: 4, s: 6, c: 0, i: 3, per: 5, w: 3, e: 6, r: 5, printedAttacks: "6S", attacks: [{ code: "6S" }],
    powers: "Enhanced Physical Attributes (Quickness, once per day, for [Essence × 2]D6 turns), Enhanced Senses (Improved Hearing)",
    weak: "Dietary Requirement (Alcohol)",
    desc: "West African mermaids domesticated by Ewe pirates, bred slightly faster and smarter; up to 1.5 m long." },
  { name: "Sasabonsam", page: 155, b: 7, q: 5, mult: 5, s: 6, c: 1, i: 4, w: 5, e: 5, dual: true, r: 4, printedAttacks: "Humanoid", attacks: HUMANOID,
    powers: "Enhanced Senses (Hearing, Smell)", weak: "Allergy (Sunlight, Moderate), Reduced Senses (blind or nearly so)",
    desc: "West African ghouls of the Krieger-Laluah HMHVV strain, with extremely long legs and arms; they run on all fours as easily as on two legs." }
];

writePack("cp-critters", C.map(critter));
