// New skills (book p.144–145) into packs-src/cp-skills. SkillData has no defaults or `vehicle`
// category, so both are `active` and their Skill Web defaults are noted for manual use. The linked
// attribute follows the book's default (Diving → Intelligence) and the system's vehicle skills
// (Ship → Quickness, like Car and Pilot). Verified: 300 dpi OCR agreed with the visual read.
import { itemDoc, writePack } from "./lib.mjs";

const S = [
  { name: "Diving", attr: "intelligence", img: "icons/svg/waterfall.svg",
    notes: "Active Skill covering all underwater diving: safe diving times, oxygen-nitrogen-helium mixtures, surface intervals between dives, and using diving gear (it may come into play when equipment fails). Defaults to Intelligence, six dots (+12 default) — apply by hand. Concentrations: Deep-water Diving (JIM, LBA), Mixed-gas Diving." },
  { name: "Ship", attr: "quickness", img: "icons/svg/anchor.svg",
    notes: "Vehicle Skill for piloting, navigating and handling a large surface ship (Cyberpirates ship rules — not automated). Defaults to Motorboat, one dot (+2 default) — apply by hand. Concentrations: Diesel (SV), Nuclear (SV), Turbine (SV); specializing means a specific class of vessel. Related new concentrations of existing skills: Armed/Unarmed Combat (Underwater) — −1 Combat Skill for surface melee; Etiquette (Maritime)." }
];

writePack("cp-skills", S.map(s => itemDoc("skill", { name: s.name, type: "skill", img: s.img,
  system: { category: "active", linkedAttribute: s.attr, rating: 0, concentration: { name: "", rating: 0 },
    specialization: { name: "", rating: 0 }, isMagical: false, notes: s.notes },
  src: { page: s.name === "Diving" ? 144 : 144, cell: "Skills text", verified: "300dpi+visual" } })));
