// Edges & Flaws (book p.142–144) into packs-src/cp-qualities — the system `quality` item exactly as
// the Shadowrun Companion module uses it. Values verified: a 300 dpi visual read of each name/Value line
// agreed with 300 dpi OCR (2026-10-28). Variable values store the base and explain the rest in notes.
import { itemDoc, writePack } from "./lib.mjs";

const E = "edge", F = "flaw", V = "300dpi+visual";
const Q = [
  { name: "Braggart", kind: F, category: "social", value: -1, page: 142,
    notes: "Can't resist topping everyone else's story, and will lie to do it. Backing down from a boast takes an Intelligence (4) Test with at least 2 successes. Starts fights in bars." },
  { name: "Connected", kind: E, category: "social", value: 3, page: 142,
    notes: "Choose one contact and one kind of merchandise at creation. 3 points: that contact always deals in it one way (always buys, or always sells) at the best price. 5 points: both ways. The GM sets buying at Street Value and selling without the Street Index markup." },
  { name: "Liar", kind: F, category: "social", value: -2, page: 143,
    notes: "Sounds insincere even when truthful. Each time the character addresses someone, the GM rolls 1D6: on a 1 they assume a lie. With that person afterwards the chance grows by 1 each meeting; once caught on a 1–6, they stop dealing with the character (a contact is lost for good, perhaps as an Enemy)." },
  { name: "Natural Immunity (Cyberpirates)", kind: E, category: "physical", value: 3, page: 143,
    notes: "Immune to one drug or poison the character would plausibly meet (agreed with the GM): one dose every (Body ÷ 2) days has no effect. More than one dose in that time does normal damage, recovering after (Body ÷ 2) days. Not the Shadowrun Companion's 1-point Natural Immunity." },
  { name: "Pirate Family", kind: E, category: "social", value: 3, page: 143,
    notes: "Born into the pirate life: an extended family across ports worldwide who turn up to help or hinder. They aren't contacts but Friends of Friends. The GM may make this a Flaw or cut its cost to 1 to reflect troublesome relatives (debts, feuds, an arranged marriage)." },
  { name: "Sea Legs", kind: F, category: "mental", value: -2, page: 143,
    notes: "After 24 hours on land: Willpower (4) Test needing 2 successes, or the character seeks a way back to sea; failed tests add +1 to all TNs. Repeat every Intelligence hours (+1 TN after a success, +2 after a failure, cumulative failures tracked). Ends after hours at sea equal to the failures; past 24 failures, days at sea." },
  { name: "Sea Madness", kind: F, category: "mental", value: -4, page: 143,
    notes: "After 24 hours at sea out of sight of land: Willpower (4) Test needing 2 successes, or the character slowly goes mad — fearing being thrown overboard, sabotaging, even attacking companions to reach land. Repeat every Intelligence hours (+1 TN after a success, +2 after a failure). Passes in hours equal to the failures once land is seen; past 24 failures, days." },
  { name: "Water Sprite", kind: E, category: "physical", value: 1, page: 144,
    notes: "1 point per improvement: hold breath underwater +20 seconds; swimming distance +0.1 to the multiplier; swimming fatigue +1 (normally Body ÷ 2); treading water +1 minute between tests and −1 to its Damage Resistance TN; floating −1 to Buoyancy and Treading Water tests (not damage resistance) and +1 Body for how long the character can float." }
];

writePack("cp-qualities", Q.map(q => itemDoc("quality", { name: q.name, type: "quality",
  img: q.kind === E ? "icons/svg/upgrade.svg" : "icons/svg/downgrade.svg",
  system: { kind: q.kind, category: q.category, pointValue: q.value, source: "Cyberpirates", notes: q.notes },
  src: { page: q.page, cell: "Value line", verified: V } })));
