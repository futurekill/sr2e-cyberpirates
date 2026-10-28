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

// typeof guard: importable in plain Node for tools/check-totems.mjs (Hooks exists only in Foundry).
if (typeof Hooks !== "undefined") {
  Hooks.once("setup", () => {
    const totems = globalThis.CONFIG?.SR2E?.totems;
    if (!totems) return console.warn("sr2e-cyberpirates | CONFIG.SR2E.totems not found — is the sr2e system active?");
    Object.assign(totems, CYBERPIRATES_TOTEMS);
  });
}

// Quench (only when the Quench module is active): the totems are registered and the system's own
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
        it("spell dice come through the system's lookup (Nau +2 combat, Osebo −1 health, Sase −1 combat)", () => {
          assert.equal(shaman("nau")._totemSpellDice("combat"), 2);
          assert.equal(shaman("nau")._totemSpellDice("health"), 0);
          assert.equal(shaman("osebo")._totemSpellDice("health"), -1);
          assert.equal(shaman("sase")._totemSpellDice("combat"), -1);
        });
        it("Spirits of the Sky cover mist, storm and wind (Asenna +1)", () => {
          for (const d of ["mist", "storm", "wind"]) assert.equal(CONFIG.SR2E.totems.asenna.conjuringBonus[d], 1, d);
        });
      });
    }, { displayName: "SR2E Cyberpirates: totems" });
  });
}
