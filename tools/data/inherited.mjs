// "Use the statistics of X" bases (Cyberpirates p.170 → core Street Gear p.254), snapshotted from the
// sr2e system's weapons pack (PLAN-content.md R1 #10) so generation never reads a sibling checkout.
// Street Gear is canonical (sr2e CLAUDE.md); the Pole Arm's (STR)S is the Street Gear value — the
// combat chapter (p.101) prints (STR+3)S. Street Index from the Street Gear table (300 dpi read).
export const INHERITED_FROM = { system: "sr2e", version: "0.121.0", pack: "sr2e.weapons" };

export const BASES = {
  poleArm: { id: "0027fa445d6a2656", name: "Pole Arm", img: "systems/sr2e/assets/item_icons/weapons/pole-arm.webp",
    damageCode: "(Str)S", damageType: "physical", concealability: 2, reach: 2, weight: 4,
    availability: "4/48 hrs", cost: 500, streetIndex: 2 },
  staff: { id: "4caa88d2088bac75", name: "Staff", img: "systems/sr2e/assets/item_icons/weapons/staff.webp",
    damageCode: "(Str+2)M", damageType: "stun", concealability: 2, reach: 2, weight: 2,
    availability: "3/24 hrs", cost: 50, streetIndex: 1 },
  club: { id: "d527c4c61ac29e8a", name: "Club", img: "systems/sr2e/assets/item_icons/weapons/club.webp",
    damageCode: "(Str+1)M", damageType: "stun", concealability: 5, reach: 1, weight: 1,
    availability: "2/6 hrs", cost: 10, streetIndex: 1 }
};
