// Register the African totems (Cyberpirates p.152–154) into CONFIG.SR2E.totems at setup, in the
// core totems' shape { label, environment, spellBonus, spellPenalty, conjuringBonus } — the Grimoire
// module's pattern. Only what that shape can express is automated: spell-category dice and
// conjuring dice by spirit domain. "Spirits of the Sky" = mist and storm (core p.235) plus the system's `wind` umbrella.
// The system has no jungle domain, and conditional bonuses (darkness), Banishing dice, the
// Anansi "conjuring" die and every disadvantage are on the totem's page in the Cyberpirates
// Reference journal, adjudicated by hand. `environment` is display text only.

const SKY = (n) => ({ wind: n, mist: n, storm: n });

export const CYBERPIRATES_TOTEMS = {
  agwengwere: { label: "Agwengwere (Hyena)", environment: "savannah",
    spellBonus: { combat: 2 }, spellPenalty: { health: 1 }, conjuringBonus: {} },
  anansi: { label: "Anansi (Spider)", environment: "quiet, dark places",
    spellBonus: { illusion: 1, manipulation: 1 }, spellPenalty: {}, conjuringBonus: {} },
  asenna: { label: "Asenna (Bat)", environment: "any",
    spellBonus: { detection: 2, manipulation: 2 }, spellPenalty: {}, conjuringBonus: SKY(1) },
  awoba: { label: "Awoba (Leopard)", environment: "forest and savannah",
    spellBonus: { combat: 2, health: 2 }, spellPenalty: {}, conjuringBonus: {} },
  danwane: { label: "Danwane (Dove)", environment: "forest and savannah",
    spellBonus: { health: 2, detection: 1 }, spellPenalty: {}, conjuringBonus: SKY(1) },
  nau: { label: "Nau (Crocodile)", environment: "sea and rivers",
    spellBonus: { combat: 2, illusion: 1 }, spellPenalty: {}, conjuringBonus: { sea: 2, river: 2 } },
  onini: { label: "Onini (Python)", environment: "jungle",
    spellBonus: { health: 2, manipulation: 2 }, spellPenalty: {}, conjuringBonus: {} },
  osebo: { label: "Osebo (Cheetah)", environment: "savannah",
    spellBonus: { combat: 2 }, spellPenalty: { health: 1 }, conjuringBonus: { prairie: 2 } },
  owoh: { label: "Owoh (Cobra)", environment: "jungle",
    spellBonus: { combat: 2, illusion: 2 }, spellPenalty: {}, conjuringBonus: {} },
  sase: { label: "Sase (Jackal)", environment: "savannah",
    spellBonus: { detection: 2, illusion: 2 }, spellPenalty: { combat: 1 }, conjuringBonus: { prairie: 2 } },
  wurega: { label: "Wurega (Parrot)", environment: "jungle",
    spellBonus: { illusion: 2 }, spellPenalty: {}, conjuringBonus: {} }
};

// The ancestor spirit (CP p.152): B F+2 · Q F×3 · S F+1 · C/I/W F · E F(A) · R F, attack (Strength)M Stun
// on Force dice (the book names no attack skill; Force by the user's ruling — the core water
// elemental's unarmed Stun attack uses Force). A Spirit of Man that inherits every Spirits-of-Man
// totem bonus. Needs sr2e 0.123.0 (attack `power`, spiritDomainGroup/Inherits, spiritPortraitBase).
export const ANCESTOR = {
  profile: { b: 2, q: 0, mult: 3, s: 1, r: 0,
    attack: { mode: "melee", level: "M", damageType: "stun", dice: "force", power: "strength" } },
  powers: ["accident", "confusion", "divination", "guard", "manifestation", "search"]
};
export let registeredIn = null;   // which hook registered the spirit config (the Quench batch checks "init")

// typeof guard: importable in plain Node for tools/check-totems.mjs (Hooks exists only in Foundry).
// INIT, not setup: Foundry prepares world documents before setup, so a saved ancestor spirit would
// otherwise derive from the fallback (fire) profile. The system's init (which assigns CONFIG.SR2E)
// runs before a module's.
if (typeof Hooks !== "undefined") {
  Hooks.once("init", () => {
    const S = globalThis.CONFIG?.SR2E;
    if (!S?.totems) return console.warn("sr2e-cyberpirates | CONFIG.SR2E not found — is the sr2e system active?");
    Object.assign(S.totems, CYBERPIRATES_TOTEMS);
    if (!S.spiritDomainGroup || !S.spiritPortraitBase) return console.warn("sr2e-cyberpirates | the ancestor spirit needs sr2e 0.123.0 or later");
    S.spiritDomains.ancestor = "Ancestor";
    S.spiritDomainProfile.ancestor = "ancestor";
    S.spiritProfiles.ancestor = ANCESTOR.profile;
    S.spiritDomainGroup.ancestor = "spirits_of_man";
    S.spiritDomainInherits.ancestor = true;
    S.spiritPowers.divination = "Divination";
    S.spiritDomainPowers.ancestor = ANCESTOR.powers;
    S.spiritPortraitBase.ancestor = "modules/sr2e-cyberpirates/assets/spirit_portraits";
    S.spiritPortraitVariants.ancestor = 3;
    registeredIn = "init";
  });
}

// Quench (only when the Quench module is active): the totems and the ancestor spirit are registered and the system's own
// totem-dice lookup reads them. An unsaved in-memory actor — nothing is written to the world.
if (typeof Hooks !== "undefined") {
  Hooks.on("quenchReady", (quench) => {
    quench.registerBatch("sr2e-cyberpirates.totems", (context) => {
      const { describe, it, assert } = context;
      const shaman = (totem) => new Actor.implementation({ name: "Totem probe", type: "character",
        system: { magic: { tradition: "shamanic", totem } } });
      describe("Cyberpirates totems", () => {
        it("every totem is in CONFIG.SR2E.totems", () => {
          for (const k of Object.keys(CYBERPIRATES_TOTEMS)) assert.ok(CONFIG.SR2E.totems[k], k);
        });
        // An independent transcription of the book's Advantages/Disadvantages (p.152–154), typed
        // separately from CYBERPIRATES_TOTEMS: spell dice per category, conjuring dice per domain.
        const SKY1 = { wind: 1, mist: 1, storm: 1 };
        const BOOK = {
          agwengwere: [{ combat: 2, health: -1 }, {}], anansi: [{ illusion: 1, manipulation: 1 }, {}],
          asenna: [{ detection: 2, manipulation: 2 }, SKY1], awoba: [{ combat: 2, health: 2 }, {}],
          danwane: [{ health: 2, detection: 1 }, SKY1], nau: [{ combat: 2, illusion: 1 }, { sea: 2, river: 2 }],
          onini: [{ health: 2, manipulation: 2 }, {}], osebo: [{ combat: 2, health: -1 }, { prairie: 2 }],
          owoh: [{ combat: 2, illusion: 2 }, {}], sase: [{ detection: 2, illusion: 2, combat: -1 }, { prairie: 2 }],
          wurega: [{ illusion: 2 }, {}]
        };
        it("every totem's spell dice match the book through the system's lookup", () => {
          for (const [k, [spells]] of Object.entries(BOOK)) {
            const a = shaman(k);
            for (const c of ["combat", "detection", "health", "illusion", "manipulation"]) assert.equal(a._totemSpellDice(c), spells[c] ?? 0, `${k} ${c}`);
          }
        });
        it("every totem's conjuring dice match the book", () => {
          for (const [k, [, conj]] of Object.entries(BOOK)) assert.deepEqual({ ...CONFIG.SR2E.totems[k].conjuringBonus }, conj, k);
        });
        it("core totems are untouched, and Grimoire's survive alongside (when it is active)", () => {
          assert.equal(CONFIG.SR2E.totems.lion.spellBonus.combat, 2);
          if (game.modules.get("sr2e-grimoire")?.active) for (const k of ["moon", "oak", "sea", "sun", "wildcat", "wyrm"]) assert.ok(CONFIG.SR2E.totems[k], `grimoire ${k}`);
        });
      });
    }, { displayName: "SR2E Cyberpirates: totems" });

    quench.registerBatch("sr2e-cyberpirates.ancestor", (context) => {
      const { it, assert, after } = context;
      const made = []; let prevPlacement;
      // The printed powers, typed independently of ANCESTOR.powers (CP p.152).
      const PRINTED = ["accident", "confusion", "divination", "guard", "manifestation", "search"];
      context.before(async () => {
        prevPlacement = game.settings.get("sr2e", "spiritPlacement");
        await game.settings.set("sr2e", "spiritPlacement", "off");   // no interactive token placement
      });
      after(async function () {
        this.timeout(20000);
        await game.settings.set("sr2e", "spiritPlacement", prevPlacement);
        // Only this batch's documents: messages spoken by an actor it made.
        await ChatMessage.deleteDocuments(game.messages.filter(m => made.some(a => a.id === m.speaker?.actor)).map(m => m.id));
        for (const a of made) { try { await a.delete(); } catch (e) {} }
      });
      const withFaces = async (faces, fn) => {
        const orig = CONFIG.Dice.randomUniform, q = [...faces];
        CONFIG.Dice.randomUniform = () => q.length ? (6.5 - q.shift()) / 6 : orig();
        try { return await fn(); } finally { CONFIG.Dice.randomUniform = orig; }
      };
      it("the spirit config was registered at init", () => {
        assert.equal(registeredIn, "init");
        assert.equal(CONFIG.SR2E.spiritDomainProfile.ancestor, "ancestor");
      });
      it("a Cat shaman conjures an ancestor spirit end to end (Cat's city +2 is inherited)", async function () {
        this.timeout(15000);
        const shaman = await Actor.create({ name: "Quench Ancestor Shaman", type: "character",
          system: { charisma: { base: 5 }, magic: { type: "full_magician", rating: 6, tradition: "shamanic", totem: "cat" } } });
        made.push(shaman);
        await shaman.createEmbeddedDocuments("Item", [{ name: "Conjuring", type: "skill", system: { rating: 4, category: "active" } }]);
        const calls = []; const orig = shaman.rollSuccessTest.bind(shaman);
        shaman.rollSuccessTest = (d, tn, o) => { calls.push(d); return orig(d, tn, o); };
        await withFaces(Array(20).fill(5), () => shaman.rollConjuring({ force: 4, kind: "nature", domain: "ancestor" }));
        const sp = game.actors.find(a => a.type === "spirit" && a.system.conjurerUuid === shaman.uuid);
        if (sp) made.push(sp);
        assert.ok(sp, "a spirit was created");
        assert.equal(calls[0], 6, "Conjuring 4 + Cat 2"); assert.equal(calls[1], 7, "Drain: Charisma 5 + Cat 2");
        assert.equal(sp.system.domain, "ancestor");
        assert.match(sp.img, /^modules\/sr2e-cyberpirates\/assets\/spirit_portraits\/ancestor-[123]\.webp$/);
        assert.equal(sp.prototypeToken.texture.src, sp.img);
        for (const n of [1, 2, 3]) assert.ok((await fetch(`modules/sr2e-cyberpirates/assets/spirit_portraits/ancestor-${n}.webp`, { method: "HEAD" })).ok, `portrait ${n} loads`);
        assert.sameMembers([...sp.system.powers], PRINTED);
        assert.include(shaman.system.boundSpirits, sp.uuid, "bound to the shaman");
        assert.equal(sp.system.services, 6, "6 successes = 6 services");
        const s = sp.system;
        assert.deepEqual([s.body.value, s.quickness.value, s.strength.value, s.charisma.value, s.intelligence.value, s.willpower.value, s.essence.value, s.reaction.value],
          [6, 4, 5, 4, 4, 4, 4, 4]);
        assert.equal(s.moveMult, 3);
        const sv = sp.system.services;
        await sp.useSpiritPower("divination");
        assert.equal(sp.system.services, sv - 1, "using Divination spends a service");
        const { startFight } = await import("/systems/sr2e/module/spirit-services.mjs");
        assert.ok((await startFight(sp))?.ok, "Fight for me (one service)");
        assert.equal(sp.system.services, sv - 2, "fighting costs one more service");
        const ac = []; const o2 = sp.rollSuccessTest.bind(sp); sp.rollSuccessTest = (d, tn, o) => { ac.push(d); return o2(d, tn, o); };
        await withFaces([5, 1, 1, 1], () => sp.rollSpiritAttack());
        assert.equal(ac[0], 4, "4 Force dice");
        const d = document.createElement("div"); d.innerHTML = game.messages.contents.at(-1).content;
        const b = d.querySelector(".sr2e-resist-btn").dataset;
        assert.equal(b.power, "5"); assert.equal(b.level, "M"); assert.equal(b.damageType, "stun");
      });
    }, { displayName: "SR2E Cyberpirates: ancestor spirit" });
  });
}
