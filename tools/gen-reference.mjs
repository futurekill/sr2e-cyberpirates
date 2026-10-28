// The Cyberpirates Reference journal (book p.152–154): ancestor spirits, Divination, the African
// totems and the revised (local-name) totems. Descriptions are original summaries; numbers were read
// from 300 dpi renders. Each totem page says what scripts/register-cyberpirates.mjs automates and
// what the GM adjudicates.
import { idFor, sourceFlag, STATS, writePack } from "./lib.mjs";
import { CYBERPIRATES_TOTEMS as T } from "../scripts/register-cyberpirates.mjs";

const V = "300dpi+visual";
const page = (entry, name, content, sort) => ({ _id: idFor(`page:${entry}`, name), name, type: "text",
  title: { show: true, level: 1 }, text: { format: 1, content }, sort, ownership: { default: -1 }, flags: {}, _stats: STATS });
const entry = (name, src, pages) => {
  const _id = idFor("journal", name);
  return { _id, name, pages: pages.map((p, i) => page(name, p[0], p[1], (i + 1) * 100000)), folder: null, sort: 0,
    flags: sourceFlag({ ...src, verified: V }), ownership: { default: 0 }, _stats: STATS, _key: `!journal!${_id}` };
};

const ANCESTOR = entry("Ancestor Spirits", { page: 152, cell: "Ancestral Spirits; Ancestor Spirit stat block; Divination" }, [
  ["Ancestor shamans", `<p>Some West African shamans draw their power from their ancestors instead of the Spirits of Man. An <strong>ancestor shaman</strong> still follows an animal totem and otherwise uses the normal magic rules.</p>
<ul><li>They summon <strong>ancestor spirits</strong> instead of any other Spirits of Man, and conjure other nature spirits normally. Totem bonuses for conjuring Spirits of Man apply to ancestor spirits.</li>
<li>Ancestor-spirit <strong>shamanic adepts</strong> conjure only ancestor spirits and cast only spells their totem favors. Ancestral <strong>conjuring adepts</strong> summon whatever an ancestor shaman can, but have no Sorcery.</li>
<li>Any shaman may conjure ancestor spirits, whatever the totem: swap one of the totem's conjuring bonuses for a bonus to ancestor spirits (gamemaster and player agree which).</li>
<li><strong>Fetishes:</strong> summoning takes three fetishes tied to that ancestor — usually one object made for them before death (a stool, say) and two things they enjoyed in life. Each one missing costs the spirit 1 service.</li>
<li><strong>Time:</strong> hours equal to the spirit's Force, divided by the number of the spirit's relatives present (the shaman included; they needn't be willing). Services and Drain are normal.</li>
<li>No Great Form or Ally ancestor spirits are known.</li>
<li>They come from a "plane of death" shaped by the summoner's own beliefs. A shaman can quest there for their totem only with an ancestor spirit as guide (metaplane rules: Grimoire p.93).</li></ul>
<p><em>Play them like living relatives. Cyberpirates p.152.</em></p>`],
  ["Ancestor spirit", `<table><tr><th>B</th><th>Q</th><th>S</th><th>C</th><th>I</th><th>W</th><th>E</th><th>R</th><th>Attacks</th></tr>
<tr><td>F + 2</td><td>F × 3</td><td>F + 1</td><td>F</td><td>F</td><td>F</td><td>F(A)</td><td>F</td><td>(Strength)M Stun</td></tr></table>
<p><strong>Powers:</strong> Accident, Confusion, Divination, Guard, Manifestation, Search.</p>
<p>"× 3" is the running multiplier when manifested. Ancestor spirits have <strong>no domain</strong>: their powers reach 5 km per point of Force.</p>
<p><em>Not yet summonable in Foundry: its (Strength)M Stun attack needs a system change (the system's spirit attacks take their Power from Force). Until then, run it from this page. Cyberpirates p.152.</em></p>`],
  ["Divination (spirit power)", `<p>Asked to prophesy, the spirit reads the emotions and drives of everyone within its powers' area and guesses what they will do next. The gamemaster rolls <strong>dice equal to the spirit's Force</strong> against a TN set by the question:</p>
<table><tr><th>The question is</th><th>TN</th></tr>
<tr><td>Very vague ("What does next month hold for me?")</td><td>4</td></tr>
<tr><td>Vague ("Are my old enemies catching up?")</td><td>5</td></tr>
<tr><td>General ("Will I get hurt on this job?")</td><td>6</td></tr>
<tr><td>Specific ("Is this official taking bribes?")</td><td>8</td></tr>
<tr><td>Very specific ("What is the name of the man following me?")</td><td>10</td></tr></table>
<ul><li><strong>0 successes:</strong> a cryptic answer, often badly misleading.</li>
<li><strong>1–2:</strong> cryptic, but with a truth underneath.</li>
<li><strong>3–4:</strong> mildly helpful.</li>
<li><strong>5+:</strong> about the detail the questioner wanted.</li></ul>
<p>The answer is at most twice the spirit's Force in words, and as specific or vague as suits the story. <em>Cyberpirates p.152.</em></p>`]
]);

const fmt = (o, sign = "+") => Object.entries(o).map(([k, n]) => `${sign}${n} ${k}`).join(", ") || "—";
const auto = (k) => `<p class="sr2e-auto"><strong>In Foundry:</strong> pick <em>${T[k].label}</em> as the totem. Automated: spells ${fmt(T[k].spellBonus)}${Object.keys(T[k].spellPenalty).length ? `; ${fmt(T[k].spellPenalty, "−")}` : ""}; conjuring ${fmt(T[k].conjuringBonus)}.`;
const totem = (k, chars, env, adv, dis, byHand, p) => [T[k].label, `<p>${chars}</p>
<p><strong>Favored environment:</strong> ${env}</p><p><strong>Advantages:</strong> ${adv}</p><p><strong>Disadvantages:</strong> ${dis}</p>
${auto(k)}${byHand ? ` <strong>By hand:</strong> ${byHand}` : ""}</p><p><em>Cyberpirates p.${p}.</em></p>`];

const TOTEMS = entry("African Totems", { page: 153, cell: "New Totems; Revised Totems" }, [
  ["About these totems", `<p>The totems most common among Ghanaian and Ivory Coast shamans; Caribbean shamans of African descent may follow them too. Any of them may also conjure ancestor spirits (see <em>Ancestor Spirits</em>).</p>
<p>Spell and conjuring dice are automated when the totem is chosen on the Magic tab. "Spirits of the Sky" means mist and storm spirits (the system's <em>wind</em> spirits too). The system has no <strong>jungle</strong> domain, so jungle-spirit bonuses, Banishing dice, conditional bonuses and every disadvantage are applied by hand. <em>Cyberpirates p.152.</em></p>`],
  totem("agwengwere", "Aggressive, capricious and cunning, Hyena serves herself first, angers fast and stands her ground against bigger rivals — even lions, over a kill.",
    "Savannah", "+2 dice for combat spells, +2 dice to Banishing.", "−1 die for health spells. A Willpower (4) Test to do anything that brings her no benefit.",
    "+2 Banishing; the Willpower test.", 152),
  totem("anansi", "Spider in her African aspect: creator, destroyer and trickster. She waits and plots, and her web is delicate but strong; she strikes fast and without remorse.",
    "Quiet, dark places where few ever look", "+1 die for illusion and manipulation spells; +1 die for conjuring.", "+2 TN for Magic Tests in open areas; +1 TN when the shaman has no time to think a situation through (gamemaster's call).",
    "the +1 conjuring die (the book doesn't name a spirit type); both disadvantages.", 153),
  totem("asenna", "Bat is a traveller and restless seeker with far-reaching goals, at home anywhere and uneasy standing still.",
    "Anywhere", "+2 dice for detection and manipulation spells; +1 die for conjuring Spirits of the Sky.", "+2 to all magical TNs in direct sunlight. Distracted and irritable after a week in one place.",
    "both disadvantages.", 153),
  totem("awoba", "Leopard has stamina and great bursts of speed: aggressive, vicious when cornered, reclusive and nocturnal, trusting keen senses over intellect — so appearances can fool him.",
    "Forest and savannah", "+2 dice for combat and health spells; +2 dice for conjuring nature spirits during hours of darkness.", "−1 die on Spell Resistance Tests against illusions. Must defend family from harm, to the death if need be (no test to avoid it).",
    "the +2 conjuring at night; both disadvantages.", 153),
  totem("danwane", "Dove is a peaceful messenger and mediator who helps others to the point of martyrdom, and prides herself on staying aware of everything around her.",
    "Forests and savannah", "+2 dice for health spells, +1 die for detection spells, +1 die for conjuring Spirits of the Sky.", "Cannot cast combat spells. A successful Willpower (4) Test to deliberately kill a metahuman.",
    "the combat-spell ban (the system won't stop the cast); the Willpower test.", 153),
  totem("nau", "Like Anlo (Shark), Crocodile is a relentless, savage hunter with no fixed home who knows the secrets of the sea.",
    "On or by the sea and rivers", "+2 dice for combat spells; +1 die for illusion spells; +2 dice for conjuring sea and river spirits.", "Wounded in combat, or after a kill: a Willpower Test, TN 3 modified by injury. On 2 or fewer successes the shaman goes berserk for up to 3 turns (minus the successes), attacking the nearest living target with their most powerful weapon or spell.",
    "the berserk test.", 153),
  totem("onini", "Python is huge, slow and ponderous — no match for fast events — but immensely strong, quick to recover, merciless once on top, and able to dominate others by will. Peaceful, but unforgiving if provoked.",
    "Jungle", "+2 dice for health and manipulation spells; +2 dice for conjuring jungle spirits.", "To stop fighting or any ongoing activity: a successful Willpower (6) Test.",
    "+2 jungle spirits (no jungle domain in the system); the Willpower test.", 153),
  totem("osebo", "Like Jaguar, Cheetah is a skilled hunter and warrior who takes the most direct route, and a jack of many trades rarely at a loss.",
    "Savannah", "+2 dice for combat spells; +2 dice for conjuring savannah (prairie) spirits.", "−1 die for health spells. Natural Reaction of at least 4. Proud of her competence; hates admitting she can't do something.",
    "the Reaction minimum (check at creation); the roleplaying.", 153),
  totem("owoh", "Cobra is a skilled, stealthy hunter who hypnotizes prey to draw it close; slow to decide, uncompromising, and dislikes surprises.",
    "Jungle", "+2 dice for combat and illusion spells; +1 die for conjuring jungle spirits.", "Can't fight to stun: either abstains or goes for the kill. Slow when startled: surprised, +1 to all TNs for the whole combat.",
    "+1 jungle spirits (no jungle domain in the system); both disadvantages.", 153),
  totem("sase", "Like Rat, Jackal is a stealthy, selfish thief and a reluctant warrior who would rather run — but also mischievous, playful and unconventional.",
    "Savannah", "+2 dice for detection and illusion spells; +2 dice for conjuring savannah (prairie) spirits.", "−1 die for all combat spells.",
    "", 154),
  totem("wurega", "Parrot is a colorful, wisecracking show-off: brightest plumage, loudest voice, showiest magic, and always the center of attention.",
    "Jungle", "+2 dice for illusion spells; +2 dice for conjuring jungle spirits.", "+1 to magical TNs without an appreciative audience.",
    "+2 jungle spirits (no jungle domain in the system); the audience modifier.", 154),
  ["Revised totems", `<p>Local West African names for standard totems — use the standard totem (Awakenings p.151–155):</p>
<table><tr><th>Local name</th><th>Use</th></tr>
<tr><td>Agona (Crow)</td><td>Raven</td></tr><tr><td>Anlo (Shark)</td><td>Shark</td></tr><tr><td>Gbwegen (Lion)</td><td>Lion</td></tr>
<tr><td>Gwobeag (Dog)</td><td>Dog</td></tr><tr><td>Kpwire (Mouse)</td><td>Gecko</td></tr><tr><td>Oyoko (Falcon)</td><td>Eagle</td></tr>
<tr><td>Weme (Deer/Antelope)</td><td>Horse</td></tr></table>
<p>Raven, Shark, Lion, Dog and Eagle are in the core system's totem list. Gecko and Horse are not: until a module adds them, run them by hand. <em>Cyberpirates p.154.</em></p>`]
]);

writePack("cp-reference", [ANCESTOR, TOTEMS]);
