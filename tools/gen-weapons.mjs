// Weapons and their ammunition (book p.170–172) into packs-src/cp-weapons. Every number was read
// from a 300 dpi render and agreed with 300 dpi OCR. Melee weapons copy their core base
// (tools/data/inherited.mjs). Harpoons and spears resist with Impact armor: the weapon's own
// loaded-ammo snapshot carries armorCalc "impact", as do the harpoon ammo items.
import { itemDoc, writePack } from "./lib.mjs";
import { BASES, INHERITED_FROM } from "./data/inherited.mjs";
// Core Range Table rows (sr2e module/rules/weapon-ranges.mjs), copied: generation never reads a sibling checkout.
const R = { sportingRifle: [30, 60, 150, 300], smg: [10, 40, 80, 150], heavyPistol: [5, 20, 40, 60], heavyCrossbow: [25, 75, 200, 300] };
const rangesFor = (c) => { const [short, medium, long, extreme] = R[c]; return { short, medium, long, extreme }; };

const V = "300dpi+visual";
const ICON = "systems/sr2e/assets/item_icons/";
const NO_MODES = { ss: false, sa: false, bf: false, fa: false };
const NO_RANGE = { short: 0, medium: 0, long: 0, extreme: 0 };
const NO_AMMO = { current: 0, max: 0, type: "" };

const weapon = (s) => ({ weaponType: "firearm", skill: "firearms", damageType: "physical", concealability: 99, reach: 0,
  firingModes: NO_MODES, ammo: NO_AMMO, recoilComp: 0, ranges: NO_RANGE, strengthMin: 0, legality: "Legal",
  equipped: false, accessories: [], ...s });

const inherited = (key, extra) => {
  const b = BASES[key];
  return weapon({ weaponType: "melee", skill: "armed_combat", damageCode: b.damageCode, damageType: b.damageType,
    concealability: b.concealability, reach: b.reach, weight: b.weight, cost: b.cost, availability: b.availability,
    streetIndex: b.streetIndex, ...extra });
};
const base = (key) => `Statistics of the ${BASES[key].name} (core p.254; ${INHERITED_FROM.pack} ${BASES[key].id}, sr2e ${INHERITED_FROM.version})`;

const W = [
  { name: "Harpoon", img: BASES.poleArm.img, src: { page: 170, cell: "Melee Weapons: Harpoons" },
    system: inherited("poleArm", { notes: `${base("poleArm")}. Thrusting point damage is (Str+2)M — choose it by hand when the harpoon is used to thrust. Cyberpirates p.170.` }) },
  { name: "Spear", img: BASES.staff.img, src: { page: 170, cell: "Melee Weapons: Spears" },
    system: inherited("staff", { damageType: "physical", notes: `${base("staff")}, except the damage is Physical. Thrust point damage is (Str+4)L — choose it by hand. Cyberpirates p.170.` }) },
  { name: "Rattan Sticks", img: BASES.club.img, src: { page: 170, cell: "Melee Weapons: Rattan sticks" },
    system: inherited("club", { weight: 0.2, notes: `Lightweight clubs of arnis de mano, the Philippine martial art. ${base("club")}, but they weigh 0.2 kg and hit like flechette weapons: (Str+1)S Stun against an unarmored opponent; against an armored one, double the target's Impact Armor (apply by hand). Cyberpirates p.170.` }) },

  { name: "Harpoon Gun", img: `${ICON}weapons/heavy-crossbow.webp`, src: { page: 171, cell: "Harpoon Gun stat block" },
    system: weapon({ weaponType: "projectile", skill: "projectile_weapons", damageCode: "12D", concealability: 99,
      firingModes: { ...NO_MODES, ss: true }, ammo: { current: 1, max: 1, type: "harpoon", armorCalc: "impact" },
      ranges: rangesFor("sportingRifle"), weight: 20, cost: 6500, availability: "3/24 hrs", streetIndex: 1,
      notes: "Boat- or ship-mounted whaling harpoon; it cannot be hand-held (the cost includes a basic pintle mount; other mounts are bought separately). Sporting-rifle range. Projectile Weapons; resist with Impact armor. Weapon Value 1 (turret mounting: Rigger 2 p.135). Standard harpoon 12D, explosive head 16D (legal only in known megalodon territory). A harpoon on a rope flies no farther than the rope: a target beyond it is missed automatically. Tying or untying the rope is a Complex Action, cutting it a Simple Action. Cyberpirates p.171." }) },
  { name: "Speargun", img: `${ICON}weapons/heavy-crossbow.webp`, src: { page: 171, cell: "Speargun stat block (cont. right column)" },
    system: weapon({ weaponType: "projectile", skill: "projectile_weapons", damageCode: "6M", concealability: 99,
      firingModes: { ...NO_MODES, ss: true }, ammo: { current: 1, max: 1, type: "spear", armorCalc: "impact" },
      ranges: rangesFor("heavyCrossbow"), weight: 2, cost: 800, availability: "3/24 hrs", streetIndex: 1,
      notes: "CO₂-powered spear launcher. Heavy Crossbow ranges (fixed — the gas charge, not the diver's Strength). Projectile Weapons (Speargun may be a Specialization); resist with Impact armor. Standard fishing spear 6M; armor-piercing javelin 8S — set the damage by hand when one is loaded (no cost is printed for either). Cyberpirates p.171." }) },
  { name: "Sling Launcher", img: `${ICON}weapons/projectile.webp`, src: { page: 171, cell: "Sling Launcher stat block" },
    system: weapon({ weaponType: "projectile", skill: "projectile_weapons", damageCode: "", concealability: 99,
      firingModes: { ...NO_MODES, ss: true }, ammo: { current: 1, max: 1, type: "" },
      weight: 7, cost: 40, availability: "1/14 hrs", streetIndex: 1,
      notes: "An overgrown slingshot strung between two anchor points on a vessel, with at least a two-meter draw; the pouch holds anything under a kilogram (rocks, grenades, water balloons). Damage is the hurled item's. Range is an aerodynamic grenade's (Grenade Range Table, core p.96) and it scatters the same way (core p.97) — resolve by hand. Projectile Weapons. Cyberpirates p.171." }) },

  { name: "Colt M24A3 Water Carbine", img: `${ICON}weapons/submachine-guns.webp`, src: { page: 171, cell: "Colt M24A3 stat block (cont. p.172)" },
    system: weapon({ damageCode: "6M", concealability: 5, firingModes: { ...NO_MODES, sa: true, bf: true },
      ammo: { current: 30, max: 30, type: "smg" }, ranges: rangesFor("smg"), weight: 3.5, cost: 1000,
      availability: "5/48 hrs", streetIndex: 2.5,
      notes: "SMG designed for the UCAS Navy SEALs: a sealed firing chamber fed by the diver's scuba tank lets it fire regular ammunition underwater, and a purge valve clears water when changing clips. Caseless ammunition: 1.5 × the brass-cased price, Availability +1. Cyberpirates p.171–172." }) },
  { name: "FN-AAL Gyrojet Pistol", img: `${ICON}weapons/heavy-pistols.webp`, src: { page: 172, cell: "FN-AAL stat block" },
    system: weapon({ damageCode: "10M", concealability: 5, firingModes: { ...NO_MODES, sa: true },
      ammo: { current: 10, max: 10, type: "gyrojet" }, ranges: rangesFor("heavyPistol"), weight: 2, cost: 600,
      availability: "4/48 hrs", streetIndex: 1.5,
      notes: "Heavy pistol of the British Special Boat Squadron, firing 6 mm rockets whose alkaline fuel burns on contact with water. Load the gyrojet ammunition (ball, APDS, explosive). Hydrostatic shock: explosive gyrojets add +2 Power instead of +1 (built into the Explosive Gyrojets item). Cyberpirates p.172." }) },

  { name: "Ink Grenade", img: `${ICON}weapons/smoke-grenade.webp`, src: { page: 172, cell: "Ink Grenade stat block" },
    system: weapon({ weaponType: "grenade", skill: "throwing_weapons", damageCode: "0M", concealability: 6,
      weight: 0.25, cost: 40, availability: "4/4 days", streetIndex: 2, blastType: "smoke", quantity: 1,
      notes: "Underwater: spews a black ink cloud of about 5 m radius. Everyone inside takes +4 to all visual tests, cumulative with the underwater vision modifiers. No damage. Cyberpirates p.172." }) }
];

const ammo = (s) => ({ ammoType: "regular", quantity: 10, damageModifier: 0, armorModifier: 0, damageType: "",
  armorCalc: "standard", concealability: 8, weight: 0, ...s });
const A = [
  { name: "Harpoon (Standard)", img: `${ICON}ammo/regular-ammo.webp`, src: { page: 171, cell: "Harpoon Gun: Ammo rows" },
    system: ammo({ ammoType: "harpoon", quantity: 1, armorCalc: "impact", concealability: 99, cost: 25,
      availability: "1/6 hrs", streetIndex: 1, notes: "Harpoon Gun bolt, 12D. Resist with Impact armor. Price per harpoon. Cyberpirates p.171." }) },
  { name: "Harpoon (Explosive Head)", img: `${ICON}ammo/explosive-rounds.webp`, src: { page: 171, cell: "Harpoon Gun: Ammo rows" },
    system: ammo({ ammoType: "harpoon", quantity: 1, damageModifier: 4, armorCalc: "impact", concealability: 99,
      cost: 200, availability: "3/12 hrs", streetIndex: 2,
      notes: "Harpoon Gun bolt with an explosive head: 16D (+4 Power over the standard 12D). Legal only in known megalodon territory. Resist with Impact armor. Price per harpoon. Cyberpirates p.171." }) },
  { name: "Ball Gyrojets", img: `${ICON}ammo/regular-ammo.webp`, src: { page: 172, cell: "FN-AAL Gyrojet Ammunition: Ball" },
    system: ammo({ ammoType: "gyrojet", weight: 1.75, cost: 50, availability: "3/36 hrs", streetIndex: 2,
      notes: "FN-AAL gyrojet clip of 10, 10M. Cyberpirates p.172." }) },
  { name: "APDS Gyrojets", img: `${ICON}ammo/apds.webp`, src: { page: 172, cell: "FN-AAL Gyrojet Ammunition: APDS" },
    system: ammo({ ammoType: "gyrojet", armorCalc: "half_ballistic", weight: 1.75, cost: 100, availability: "14/14 days",
      streetIndex: 5, notes: "FN-AAL gyrojet clip of 10. APDS rules: Street Samurai Catalog p.63 (halves Ballistic armor). Cyberpirates p.172." }) },
  { name: "Explosive Gyrojets", img: `${ICON}ammo/explosive-rounds.webp`, src: { page: 172, cell: "FN-AAL Gyrojet Ammunition: Explosive" },
    system: ammo({ ammoType: "gyrojet", damageModifier: 2, weight: 1.75, cost: 80, availability: "4/48 hrs", streetIndex: 2.5,
      notes: "FN-AAL gyrojet clip of 10, 12M: hydrostatic shock makes it +2 Power instead of explosive ammo's usual +1. Cyberpirates p.172." }) }
];

writePack("cp-weapons", [
  ...W.map(w => itemDoc("weapon", { ...w, type: "weapon", src: { ...w.src, verified: V } })),
  ...A.map(a => itemDoc("ammo", { ...a, type: "ammo", src: { ...a.src, verified: V } }))
]);
