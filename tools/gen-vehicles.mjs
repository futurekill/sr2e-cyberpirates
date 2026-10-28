// Small craft (book p.175–178) into packs-src/cp-vehicles as vehicle actors. Every number was read from
// a 300 dpi render. Ships and big submarines (Hull/Bulwark) are reference pages in cp-ships instead.
// The vehicle model has no Sonar, Depth, Fuel or Economy fields, and one Signature: the printed
// "N/M" Signature is normal / Sonar Signature (p.163), so the field takes N and the rest goes in the
// notes. Submarines are `boat` vehicles (the system has no submarine type).
// shortcut: token sizes are estimates (the book prints no dimensions); adjust per scene.
import { idFor, sourceFlag, STATS, writePack } from "./lib.mjs";

const V = "300dpi+visual";
const notes = (desc, rows) => `<p>${desc}</p><ul>${rows.filter(Boolean).map(r => `<li>${r}</li>`).join("")}</ul>`;

function vehicle(x) {
  const _id = idFor("vehicle", x.name);
  return {
    _id, name: x.name, type: "vehicle", img: "icons/svg/anchor.svg",
    system: { vehicleType: x.type, skill: "", handling: x.h, speed: x.spd, acceleration: x.acc, body: x.body, armor: x.armor,
      signature: x.sig, pilot: 0, sensor: x.sensor, cargo: x.cargo, load: x.load, seating: x.seating, cost: x.cost,
      availability: "", conditionMonitor: { value: 0, max: 10 }, autonav: x.autonav, notes: notes(x.desc, x.rows) },
    items: [], effects: [], folder: null, sort: 0,
    flags: sourceFlag({ page: x.page, cell: x.cell, verified: V }), _stats: STATS,
    prototypeToken: { name: x.name, displayName: 0, actorLink: false, width: x.size[0], height: x.size[1], lockRotation: true,
      texture: { src: "icons/svg/anchor.svg", fit: "contain" }, disposition: 0 },
    ownership: { default: 0 }, _key: `!actors!${_id}`
  };
}

const BANCA = "A non-powered Philippine river boat; the statistics apply to any similar small river boat anywhere. It can be fitted with sails or an outboard motor.";
const ROW = "Rowed: Speed = the rowers' combined Strength ÷ 2, Acceleration always 1; rowing is a Complex Action.";
const banca = (variant, o) => ({ name: variant ? `Banca (${variant})` : "Banca", type: "boat", page: 175, cell: `Banca table: ${variant || "Non-powered Banca"}`,
  h: 3, body: 2, armor: 0, sensor: 0, autonav: 0, cargo: 4, load: 40, seating: "8, front to back", size: [2, 6], ...o });

const C = [
  banca("", { spd: 0, acc: 1, sig: 10, cost: 150, desc: BANCA,
    rows: ["Speed: varies — " + ROW, "Sensor —. Entry: open. Fuel: none. Economy: NA."] }),
  banca("Outboard Motor", { spd: 30, acc: 4, sig: 5, cost: 300, desc: BANCA,
    rows: ["Sensor —. Entry: open. Fuel: gasoline (10 liters). Economy: 7 km/liter.", ROW.replace("Rowed:", "If rowed instead:")] }),
  banca("Sail", { spd: 30, acc: 3, sig: 10, cost: 150, desc: BANCA,
    rows: ["Sensor —. Entry: open. Fuel: sail. Economy: NA.", ROW.replace("Rowed:", "If rowed instead:")] }),
  { name: "Mitsuhama Anago", type: "boat", page: 175, cell: "Mitsuhama Anago stat block (cont. p.176)", h: 3, spd: 30, acc: 3, body: 3, armor: 0, sig: 5,
    autonav: 1, sensor: 0, cost: 15000, seating: "1 bucket + 1 bucket + 6 hand-holds", cargo: 2, load: 400, size: [1, 3],
    desc: "A propulsion craft like a water scooter that can also move underwater: it tows divers on long swims and carries bulky cargo to and from the surface. The armed \"Fugu\" variant (underwater and surface assault) has no printed statistics.",
    rows: ["Sonar 0. Depth: 75 meters.", "Entry: open. Fuel: electric (75 PF). Economy: 1 km/PF.", "Other: underwater movement (no life support)."] },
  { name: "Hughes WK-2S Sea Stallion", type: "rotor", page: 176, cell: "Hughes WK-2S Sea Stallion stat block", h: 5, spd: 190, acc: 14, body: 4, armor: 0, sig: 3,
    autonav: 3, sensor: 3, cost: 925000, seating: "2 bucket + 3 bucket (×3)", cargo: 46, load: 2000, size: [12, 12],
    desc: "The naval variant of Hughes's WK-2 Stallion, built for search and rescue, reconnaissance and anti-submarine warfare.",
    rows: ["Entry: 2 + 1 double-sized. Landing/takeoff: VTOL.", "Fuel: jet (1,250 liters). Economy: 0.2 km/liter.",
      "Other: 2 fuselage torpedo mounts (2,000 kg total ordnance weight), magnetic anomaly detector."] },
  { name: "Vulkan Electronaut", type: "boat", page: 178, cell: "Vulkan Electronaut stat block", h: 4, spd: 15, acc: 4, body: 4, armor: 0, sig: 8,
    autonav: 2, sensor: 1, cost: 35000, seating: "1 bucket + 1 bucket", cargo: 12, load: 150, size: [2, 5],
    desc: "A two-person minisub from the Allied German States with many add-on utility modules. Built for recovery work in the drowned cities of North Germany and the United Netherlands; now a popular recreational craft on the Côte d'Azur and in the Caribbean.",
    rows: ["Signature 8/8: Sonar Signature 8. Sonar 1. Depth: 150 meters.", "Entry: 1 hatch. Fuel: electric (250 PF). Economy: 1 km/PF.",
      "Other: enviroseal (water and engine), life support (10 man-hours)."] },
  { name: "Saeder-Krupp D. J. Locker", type: "boat", page: 178, cell: "Saeder-Krupp D. J. Locker stat block", h: 4, spd: 30, acc: 3, body: 4, armor: 0, sig: 6,
    autonav: 2, sensor: 0, cost: 55000, seating: "1 bucket + 1 bucket", cargo: 5, load: 400, size: [2, 5],
    desc: "A two-person submarine for underwater exploration, retrieval and rescue, working down to 900 m on 50 man-hours of independent air. Swivel-mount lamps and an extendible claw (a poor weapon, but it loads the isolated cargo hold underwater).",
    rows: ["Signature 6/7: Sonar Signature 7. Sonar 1. Depth: 900 meters.", "Entry: 1 hatch. Fuel: diesel/electric (300 liters/250 PF). Economy: 1 km/liter; 1 km/PF.",
      "Other: enviroseal (water and engine), life support (10 man-hours), mechanical claw arm (Strength 16).",
      "The claw follows the mechanical arm rules (Rigger 2 p.34), but the operator takes +3 on all Success Tests for its clumsy design."] },
  { name: "Vulkan Delphin RQ7", type: "boat", page: 178, cell: "Delphin RQ7 table: Standard", h: 4, spd: 50, acc: 4, body: 4, armor: 0, sig: 6,
    autonav: 2, sensor: 1, cost: 150000, seating: "2 bucket + 2 bucket", cargo: 160, load: 1500, size: [3, 12],
    desc: "The Electronaut's \"big brother\": room for up to eight people with long-range accommodations, yet still nimble in flooded tunnels.",
    rows: ["Signature 6/6: Sonar Signature 6. Sonar 1. Depth: 150 meters.", "Entry: 1 hatch. Fuel: diesel/electric (300 liters/300 PF). Economy: 1 km/liter; 1 km/PF.",
      "Diesel engine while surfaced, electric batteries while submerged; running the diesel recharges the batteries at 1 PF per hour.",
      "Other: enviroseal (water and engine), life support (80 man-hours), living amenities (Basic)."] },
  { name: "Vulkan Delphin RQ7 (Coastal Patrol)", type: "boat", page: 178, cell: "Delphin RQ7 table: Coastal Patrol Variant", h: 4, spd: 50, acc: 4, body: 4, armor: 9, sig: 5,
    autonav: 2, sensor: 5, cost: 34000000, seating: "2 bucket + 2 bucket", cargo: 152, load: 680, size: [3, 12],
    desc: "The Wasserschutzpolizei coastal-patrol Delphin: four mini-torpedo tubes, a remote-controlled heavy machine gun turret and a plethora of electronic toys.",
    rows: ["Signature 5/5: Sonar Signature 5. Sonar 3. Depth: 150 meters.", "Entry: 1 hatch. Fuel: diesel/electric (300 liters/300 PF). Economy: 1 km/liter; 1 km/PF.",
      "Diesel engine while surfaced, electric batteries while submerged; running the diesel recharges the batteries at 1 PF per hour.",
      "Other: enviroseal (water and engine), life support (80 man-hours), living amenities (Basic), internal mini-torpedo launchers, small turret with HMG and 500 rounds of ammunition.",
      "Mini-torpedoes: standard AVMs (core p.99) that only work against waterborne surface or underwater targets; 4LN damage. Add the weapons from the system compendium."] }
];

writePack("cp-vehicles", C.map(vehicle));
