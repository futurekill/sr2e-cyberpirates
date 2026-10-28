// Every Cyberpirates totem's spell categories and conjuring domains must be real system keys (a typo
// silently drops the bonus), and no key may shadow a core totem. Run: node tools/check-totems.mjs
import assert from "node:assert";
import { CYBERPIRATES_TOTEMS } from "../scripts/register-cyberpirates.mjs";

const CATEGORIES = new Set(["combat", "detection", "health", "illusion", "manipulation"]);
const DOMAINS = new Set(["city", "field", "forest", "hearth", "lake", "mist", "mountain", "prairie", "river", "sea", "storm", "desert", "swamp", "wind"]);
const CORE = new Set(["bear", "cat", "coyote", "dog", "eagle", "gator", "lion", "mouse", "owl", "raccoon", "rat", "raven", "shark", "snake", "wolf"]);
for (const [key, t] of Object.entries(CYBERPIRATES_TOTEMS)) {
  assert(!CORE.has(key), `${key}: shadows a core totem`);
  for (const c of [...Object.keys(t.spellBonus), ...Object.keys(t.spellPenalty)]) assert(CATEGORIES.has(c), `${key}: bad spell category "${c}"`);
  for (const d of Object.keys(t.conjuringBonus)) assert(DOMAINS.has(d), `${key}: bad conjuring domain "${d}"`);
}
console.log(`ok: ${Object.keys(CYBERPIRATES_TOTEMS).length} totems, all categories & domains valid`);
