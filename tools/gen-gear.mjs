// Diving equipment (book p.172–174) into packs-src/cp-gear: survival gear and two armors. Every number
// was read from a 300 dpi render and agreed with 300 dpi OCR (where OCR misread a Street Index, the
// visual read wins and is what's recorded). A "—" concealability is 0, as on the system's Full Heavy Armor.
import { itemDoc, writePack } from "./lib.mjs";

const V = "300dpi+visual";
const ICON = "systems/sr2e/assets/item_icons/";
const gear = (s) => ({ category: "survival", rating: 0, quantity: 1, legality: "Legal", equipped: false, concealability: 0, ...s });
const armor = (s) => ({ legality: "Legal", equipped: false, isLayered: false, ...s });
const STD = "Part of the standard diving gear set (face mask, snorkel, fins, wet suit, breathing regulator, buoyancy compensator and weight belt, scuba tank). Weight is on dry land; worn for diving it imposes no weight penalty. Cyberpirates p.172–173.";

const G = [
  { name: "Breathing Regulator", cell: "Standard Diving Gear Table", page: 173, s: { weight: 2.5, cost: 720, availability: "4/12 hours", streetIndex: 1,
    notes: `Draws air from the scuba tank: primary and secondary (octopus) mouthpieces, depth and pressure gauge, compensator inflator. Speech is impossible with the mouthpiece in. ${STD}` } },
  { name: "Buoyancy Compensator + Weight Belt", cell: "Standard Diving Gear Table", page: 173, s: { weight: 12, cost: 475, availability: "4/12 hours", streetIndex: 1,
    notes: `Inflatable vest worn with a weight belt for neutral buoyancy; it can also send a helpless diver to the surface (Ascent, Descent and Buoyancy, p.157). ${STD}` } },
  { name: "Face Mask + Snorkel", cell: "Standard Diving Gear Table", page: 173, s: { weight: 0, cost: 120, availability: "4/12 hours", streetIndex: 1, notes: STD } },
  { name: "Fins", cell: "Standard Diving Gear Table", page: 173, s: { weight: 0.7, cost: 90, availability: "4/12 hours", streetIndex: 1, notes: STD } },
  { name: "Scuba Tank", cell: "Standard Diving Gear Table", page: 173, s: { weight: 18, cost: 3000, availability: "4/12 hours", streetIndex: 1,
    notes: `Aluminum/titanium tank holding air or mixed gas at up to 300 bars; metahumans breathe about 4 bars a minute on average (varies with depth, lungs and activity). ${STD}` } },
  { name: "Wet Suit", cell: "Standard Diving Gear Table", page: 173, s: { weight: 1.2, cost: 290, availability: "4/12 hours", streetIndex: 1,
    notes: `Traps a warmed film of water against the skin against hypothermia. ${STD}` } },
  { name: "Drysuit", cell: "Drysuit table", page: 173, s: { weight: 3.5, cost: 1500, availability: "4/36 hours", streetIndex: 1.25,
    notes: "Encloses the diver in a sheath of air; used in Arctic waters and for long dives below 200 m. −2 to Body Tests against helium chills (p.159) and to any other underwater Resistance Test against cold or hypothermia — apply by hand. Cyberpirates p.172–173." } },
  { name: "Dual Tank Manifold Assembly", cell: "Dual Tank Manifold table", page: 173, s: { weight: 0.1, cost: 200, availability: "4/18 hours", streetIndex: 1,
    notes: "Lets a breathing system carry two scuba tanks at once. Cyberpirates p.173." } },
  { name: "Full Face Mask", cell: "Full Face Mask table", page: 173, s: { weight: 0, cost: 360, availability: "4/24 hours", streetIndex: 1.25,
    notes: "Covers eyes, nose and mouth; a quick-release takes a standard breathing regulator, and side plugs take communication systems, voice microphones and other add-ons. Cyberpirates p.173." } },
  { name: "Enclosed Breathing Helmet", cell: "Enclosed Breathing Helmet table", page: 173, s: { weight: 1, cost: 960, availability: "5/96 hours", streetIndex: 1.5,
    notes: "Commercial divers' helmet filled with air or mixed gas from the tank so the diver can speak; outside speakers carry speech into the water. Includes a halogen head lamp and a speaker jack for an external underwater radio or cablephone. Cyberpirates p.173." } },
  { name: "OXSYS Artificial Gill", cell: "OXSYS Artificial Gill table", page: 173, s: { weight: 0.5, cost: 3250, availability: "4/12 hours", streetIndex: 1,
    notes: "Wraparound face-piece whose jaw filters extract oxygen from water by forced osmosis; no training needed. Pure oxygen: shallow water only (under 7 m) — deeper, the diver risks oxygen toxicity. Cyberpirates p.173." } },
  { name: "Liquid Breathing Apparatus (LBA)", cell: "LBA table", page: 174, s: { weight: 25, cost: 50000, availability: "8/21 days", streetIndex: 2.5,
    notes: "Scuba-like rig with an enclosed helmet; the diver inhales a super-oxygenated fluid, down to 3,000 m. Immune to decompression sickness, oxygen toxicity and nitrogen narcosis, but not HPNS. Speech is impossible: talk by radio, keypad or a cybercomm link. Cyberpirates p.173–174." } },
  { name: "Cybercomm Link", cell: "LBA table", page: 174, s: { category: "electronics", weight: 0, cost: 62000, availability: "8/2 weeks", streetIndex: 3,
    notes: "Transducer and radio transmitter that turn thoughts into words and send and receive them unspoken, with no outward sign. Quadruples the words available as a Free Action (core p.81). Listed with the LBA. Cyberpirates p.174." } }
];

const A = [
  { name: "Diving Armor", img: "armor-jacket", cell: "Diving Armor table", page: 173, s: { ballistic: 4, impact: 2, concealability: 0, weight: 2, cost: 1750,
    availability: "5/48 hours", streetIndex: 1.25,
    notes: "Like regular armor but made of materials that don't absorb water, and streamlined so it doesn't impair swimming. Cyberpirates p.173." } },
  { name: "JIM Diving Exoskeleton", img: "full-heavy-armor", cell: "JIM Diving Exoskeleton table", page: 173, s: { ballistic: 6, impact: 6, concealability: 0, weight: 300,
    cost: 25000, availability: "6/14 days", streetIndex: 2,
    notes: "Plasteel exoskeleton pressurized to 1 atmosphere: dives to 600 m with no decompression risk, 20 hours of self-contained air. Armor Rating 6. The suit has Strength 7; each extra point (to a maximum of 10) costs +5,000¥. The wearer takes −2 Quickness and Reaction and rolls only one Initiative die — apply by hand. Modified for a rigger interface, those penalties vanish, it works as a vehicle control rig, and a jacked rigger uses the Control Pool in place of the Combat Pool. Cyberpirates p.173." } }
];

writePack("cp-gear", [
  ...G.map(g => itemDoc("gear", { name: g.name, type: "gear", img: `${ICON}gear/general.webp`, system: gear(g.s),
    src: { page: g.page, cell: g.cell, verified: V } })),
  ...A.map(a => itemDoc("armor", { name: a.name, type: "armor", img: `${ICON}armor/${a.img}.webp`, system: armor(a.s),
    src: { page: a.page, cell: a.cell, verified: V } }))
]);
