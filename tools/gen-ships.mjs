// Ships, big submarines, ship weapons and vessel accessories (book p.176–182) as the Cyberpirates
// Ships journal. They are printed in ship-rule terms (Hull, Bulwark, Sonar, Accommodation, Depth,
// Cavitation) that the vehicle model can't hold, so — content only — they are reference pages for a
// GM running the ship rules by hand. Numbers read from 300 dpi renders (OCR misread two: ANDREWS's
// ship damage is 9LN and its extreme-range penalty −6); descriptions are original summaries.
import { journalEntry, writePack } from "./lib.mjs";

const V = "300dpi+visual";
const stats = (rows) => `<table>${rows.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}</table>`;
const vessel = (name, p, desc, rows, extra = "") => [name, `<p>${desc}</p>${stats(rows)}${extra}<p><em>Cyberpirates p.${p}.</em></p>`];
const ship = (h, spd, acc, hull, bul, sig, an, sen, son, cost) => [["Handling", h], ["Speed (Cavitation)", spd], ["Acceleration", acc],
  ["Hull", hull], ["Bulwark", bul], ["Signature / Sonar Signature", sig], ["Autonav", an], ["Sensor", sen], ["Sonar", son], ["Cost", cost]];

const KEY = ["Reading ship statistics", `<p>A <strong>ship</strong> is any vessel over 50 m long and 100 tonnes; anything smaller is a boat (the small craft are vehicle actors in the Cyberpirates Vehicles compendium). Ships use ship ratings in place of some vehicle attributes (p.162–163):</p>
<ul><li><strong>Speed (Cavitation):</strong> the number in parentheses is the Cavitation Threshold. Faster than that, the propellers' noise lowers the ship's Sonar Signature (easier to find and hit by sonar and torpedoes; p.169). Speed × 1.54 = knots. Boats have no Cavitation Threshold.</li>
<li><strong>Hull</strong> replaces Body, on a larger scale: 1 = 100–200 tonnes, 2 = 201–500, 3 = 501–1,000, 4 = 1,001–5,000, 5 = 5,001–10,000, 6 = 10,001–25,000, 7 = 25,000–50,000, 8 = 50,001–100,000, 9 = 100,001–250,000, 10+ = over 250,000.</li>
<li><strong>Bulwark</strong> replaces Armor in ship combat (to convert Hull and Bulwark to Armor or Barrier Ratings, see Ramming, p.164–165).</li>
<li><strong>Signature</strong> "N/M": normal Signature (radar, thermographic and other sensors) / Sonar Signature.</li>
<li><strong>Sonar</strong>: the ship's sonar and contact-analysis capability (Sensors and Sonar, p.168).</li>
<li><strong>Depth</strong> (submarines and minisubs): the safe maximum depth in meters; deeper, the hull takes crush damage (p.168).</li>
<li><strong>Accommodation</strong> replaces Seating: the crew and passengers the ship can house.</li>
<li><strong>Load</strong> works as for vehicles (Rigger 2 p.24). Ship electronics add Hull × 5 to their Flux Rating, but surface-to-surface scanning, jamming and communication stops at the 35 km horizon line.</li></ul>
<p>The ship rules themselves (crews, ship combat, ramming, damage control, sonar, thermoclines) are not automated: run them from the book. <em>Cyberpirates p.162–163.</em></p>`];

const SHIPS = journalEntry("Ships and Submarines", { page: 176, cell: "Ships and Submarines stat blocks p.176–179", verified: V }, [
  KEY,
  vessel("Cunard Princess Victoria Liner", 176, "Cunard Cruise Lines' latest liner, a typical 2050s cruise ship: moderately large with a fair range. Reputable liners keep to patrolled sea lanes; less reputable ones offer entertainment of doubtful legality.",
    [...ship(5, "50 (15)", 1, 6, 0, "1/1", 4, 1, 1, "150M¥"), ["Accommodation", 350], ["Entry points", "4 standard + 2 cargo doors"], ["Cargo", "8,000 CF"], ["Load", "15,000 kg"],
      ["Fuel", "Diesel (15 kiloliters)"], ["Economy", "200 km/kiloliter"], ["Other", "Lifestyle amenities (High)"]]),
  vessel("Maersk Jorgensen-class Fast Freighter", 176, "A small, generic cargo freighter — unusual in an age of container and roll-on/roll-off ships — built by Maersk for tramp shipping with no fixed timetable.",
    [...ship(5, "25 (10)", 1, 8, 0, "1/1", 3, 1, 1, "80M¥"), ["Accommodation", 25], ["Entry points", "2 extra-large cargo doors + 2 standard"], ["Cargo", "270,000 CF"], ["Load", "75,000 kg"],
      ["Fuel", "Diesel (24 kiloliters)"], ["Economy", "150 km/kiloliter"], ["Other", "Crane (5,000 kg)"]]),
  vessel("CSS Stuart-class Corvette", 176, "A fast missile boat built in numbers for the CAS Navy for coastal patrol and defense and to support light surface action groups. Typical fit: a Victory rotary autocannon and sixteen Block II Outlaw missiles (Rigger 2 p.93) in two remote turrets; anti-submarine Stuarts carry four MADCAPs instead, anti-air ones Vogeljäger SAMs.",
    [...ship(3, "70 (30)", 5, 4, 6, "3/4", 4, 4, 3, "30M¥"), ["Accommodation", 35], ["Entry points", "2 standard + 1 extra-large cargo door"], ["Cargo", "125 CF"], ["Load", "2,500 kg"],
      ["Fuel", "Diesel (10 kiloliters)"], ["Economy", "100 km/kiloliter"], ["Other", "Medium remote turret with Victory autocannon and 500 rounds; 2 medium remote turrets with 8 Block II Outlaw missiles"]]),
  vessel("Shiawase Aohana-class Frigate", 177, "One of the first corporate warships after extraterritoriality: an escort for corporate convoys in pirate waters. Strong in anti-submarine work (six ASROCs, twenty MADCAPs, a pad for one Sea Stallion — not included) and air defense (a dozen-plus Javelots, an anti-aircraft Victory autocannon); weak against surface ships (six SS-N-49 Siroccos and a light naval gun).",
    [...ship(4, "45 (20)", 4, 4, 9, "2/4", 4, 6, 4, "100M¥"), ["Accommodation", 300], ["Entry points", "2 standard + 2 standard + 1 double-sized door"], ["Cargo", "1,700 CF"], ["Load", "50,000 kg"],
      ["Fuel", "Gas turbine (50 kiloliters)"], ["Economy", "80 km/kiloliter"], ["Other", "2 medium remote turrets (Victory rotary autocannon with 2,000 rounds; light naval gun with 500 rounds); 2 vertical launch systems (12 tubes each)"]]),
  vessel("MF Akihito-class Carrier", 177, "The Imperial Japanese Navy's nuclear flagship class: over 125,000 tonnes, three reactors, more than fifty aircraft. Its own weapons are for air and missile defense: twenty-four AIM-11RS SAMs (Rigger 2 p.93) and four ANDREWS. Six were in commission as of 2059, two of them on duty in the Philippines (MF Meiji near Manila, MF Hirohito off Subic Bay).",
    [...ship(5, "45", 3, 9, 12, "1/2", 4, 7, 2, "750M¥"), ["Accommodation", "6,000"], ["Entry points", "1 plane elevator + 1 standard + 1 standard"], ["Cargo", "3.75M CF"], ["Load", "100M kg"],
      ["Fuel", "Nuclear"], ["Economy", "Effectively infinite"], ["Other", "Aircraft facilities, flight deck (300 m, catapult and arrestor cables), 2 remote large turrets with AIM-11RS launchers (12 missiles each), 4 remote medium turrets with ANDREWS"]]),
  vessel("Kvaerner Triton-class Medium Transport Submarine", 178, "The most common commercial transport sub: 30,000 tonnes, a bubble-fusion reactor overhauled every twelve years, and an oxygen generator that lets it stay under indefinitely.",
    [...ship(5, "30 (20)", 1, 7, 3, "5/4", 3, 2, 2, "250M¥"), ["Accommodation", 40], ["Entry points", "1 emergency hatch + 2 oversize cargo hatches + 1 passenger hatch"], ["Depth", "4,500 meters"], ["Cargo", "200,000 CF"], ["Load", "25M kg"],
      ["Fuel", "Nuclear"], ["Economy", "Effectively infinite"], ["Other", "Electrolytic oxygen generator, enviroseal (water and engine), living amenities (Basic)"]]),
  vessel("Krasnaya Sormova Vaneyev-class Hunter-Killer Submarine", 179, "An economical medium diesel/electric sub from the Komsomolsk yards, common in brown-water navies — and rumored to be in the hands of pirate gangs preying on unescorted merchantmen.",
    [...ship(3, "45 (30)", 2, 4, 9, "6/6", 3, 4, 4, "125M¥"), ["Accommodation", 85], ["Entry points", "1 hatch + 1 emergency hatch"], ["Depth", "400 meters"], ["Cargo", "400 CF"], ["Load", "50,000 kg"],
      ["Fuel", "Diesel/electric (18 kiloliters/10 kPF)"], ["Economy", "175 km/kiloliter; 100 km/kPF"], ["Other", "Electrolytic oxygen generator, enviroseal (water and engine), living amenities (Basic)"]]),
  vessel("USS New Hampshire-class Attack Submarine", 179, "The UCAS Navy's newest attack sub, replacing the Seawolf II and Toronto classes: SEAL insertion and extraction to cruise-missile strikes. Four torpedo tubes (MADCAPs and Sea Sabers, up to forty stored) and a sixteen-tube vertical launch cluster for cruise missiles or Kingfisher SSAMs.",
    [...ship(4, "50 (35)", 2, 5, 9, "8/8", 4, 7, 9, "800M¥"), ["Accommodation", 105], ["Entry points", "1 hatch + 1 emergency hatch"], ["Depth", "750 meters"], ["Cargo", "600 CF"], ["Load", "75,000 kg"],
      ["Fuel", "Nuclear"], ["Economy", "Effectively infinite"], ["Other", "Electrolytic oxygen generator, enviroseal (water and engine), living amenities (Basic), 4 torpedo tubes, vertical launch system (16 tubes)"]])
]);

const missile = (h, spd, rng, body, sig, int, dmg, wt, cost) => [["Handling", h], ["Speed", spd], ["Range", rng], ["Body", body], ["Signature", sig],
  ["Intelligence", int], ["Damage", dmg], ["Weight", wt], ["Cost", cost]];

const WEAPONS = journalEntry("Ship Weapons and Accessories", { page: 179, cell: "Ship Weapons; Vehicle Accessories p.179–182", verified: V }, [
  ["About ship weapons", `<p>Antiship missiles use Rigger 2's <strong>Extended Range Missile</strong> rules (Rigger 2 p.89). Besides Damage, Weight, Intelligence and Cost they carry vehicle ratings — Handling, a fixed Speed, Body (no Armor) and Signature — and a Range: the farthest the missile can fly. Ship weapons have no Availability or Street Index; the gamemaster sets them. <em>Cyberpirates p.179.</em></p>`],
  vessel("SS-N-49 \"Sirocco\" Antiship Missile", 179, "A Russian antiship missile sold worldwide; the design is over fifteen years old but keeps up its Soviet ancestors' fearsome reputation.",
    missile(4, 800, "350 km", 3, 5, 3, "20SN", "750 kg", "600,000¥")),
  vessel("UGM-188 Sea Saber Antiship Missile", 180, "The North American counterpart of the Sirocco (UCAS, Confederate and Royal Navy): shorter range, but faster, smarter and harder-hitting.",
    missile(3, "1,000", "250 km", 4, 5, 4, "24DN", "900 kg", "750,000¥")),
  vessel("Javelot Aerial Defense Missile", 180, "A French long-range air-defense missile against aircraft, antiship missiles and cruise missiles.",
    missile(3, "1,100", "120 km", 3, 5, 4, "18D", "495 kg", "425,000¥"), "<p>It can also attack surface ships, at <strong>8MN</strong>.</p>"),
  vessel("AN/EDQ-12 ANDREWS", 180, "The Air Defense Naval Directed Energy Weapons System: a particle beam that fries an incoming missile's control circuits (it veers off target — Area-Effect Scatter, Rigger 2 p.60, if you like) or detonates it in flight, equally likely at the gamemaster's call. It also engages aircraft, and fits only nuclear-powered ships.",
    [["Type", "L-ATGM"], ["Concealability", "NA"], ["Ammo", "50"], ["Mode", "SA/BF"], ["Damage", "20D"], ["Weight", "1,200"], ["Cost", "600,000¥"]],
    `<ul><li>Works like a vehicle laser (the Ares Firelance): Power −2 at medium range, −4 at long, −6 at extreme.</li>
<li>Antivehicle: vehicles don't automatically stage the Damage Level down, and only half the vehicle's Armor (round down) reduces the Power.</li>
<li>Ammo is shots before recharging: a full recharge takes 10 minutes; idle, it regains 1 shot per 4 Combat Turns with no firing (firing within three turns wastes the accumulated time).</li>
<li>A rigger jacked into or directly controlling a vehicle or missile it hits takes Physical damage from ASIST backlash (as the Loral-Vought "Zapper", Rigger 2 p.94).</li>
<li>Against other ships: <strong>9LN</strong>. Needs a medium or larger remote turret.</li></ul>`),
  ["Naval guns", `<p>Backup weapons against targets too small for antiship missiles, or against ships that lack them. Remote-operated with autoloaders; light naval guns can fire semi-automatic. Shells against normal targets do explosive damage under the Manual Gunnery or Indirect Fire rules (Rigger 2 p.56), Power −1 per 2 meters from the burst; the second Damage Code is ship damage. Weapon Value for turret space (Rigger 2 p.135): light 7, medium 10.</p>
<table><tr><th></th><th>Light Naval Gun</th><th>Medium Naval Gun</th></tr>
<tr><th>Type</th><td>Special</td><td>Special</td></tr><tr><th>Concealability</th><td>NA</td><td>NA</td></tr>
<tr><th>Ammo</th><td>500</td><td>500</td></tr><tr><th>Mode</th><td>SA</td><td>SS</td></tr>
<tr><th>Damage</th><td>20D / 8LN</td><td>25D / 11MN</td></tr><tr><th>Weight</th><td>250</td><td>600</td></tr>
<tr><th>Cost</th><td>225,000¥</td><td>475,000¥</td></tr>
<tr><th colspan="3">Ammunition (per 100 shots): Concealability NA, damage as weapon</th></tr>
<tr><th>Weight</th><td>2,500</td><td>7,500</td></tr><tr><th>Cost</th><td>8,000¥</td><td>15,000¥</td></tr></table>
<table><tr><th>Range</th><th>Short</th><th>Medium</th><th>Long</th><th>Extreme</th></tr>
<tr><th>Light</th><td>100–2,500 m</td><td>2.5–6 km</td><td>6–12 km</td><td>12–18 km</td></tr>
<tr><th>Medium</th><td>100–4,000 m</td><td>4–12 km</td><td>12–18 km</td><td>18–25 km</td></tr></table>
<p><em>Cyberpirates p.180–181.</em></p>`],
  vessel("Mk 197 MADCAP Torpedo", 181, "The most widely used torpedo of the era: up to 75 knots, an active sonar-seeker warhead as standard (passive sonar or thermal heads available). Launched by subs and surface ships, or dropped from anti-submarine helicopters.",
    missile(4, 115, "15 km", 4, "5/5", 2, "14DN", "750 kg", "350,000¥"),
    "<ul><li>It activates on splashdown; range is measured from the splash point. Sonar Rating 1 for active-sonar range.</li><li>Wire-guided: a rigger on the sub controls it until the cable is cut, then its own Intelligence takes over. Helicopter-dropped MADCAPs have no wire and can't be rigged.</li></ul>"),
  vessel("RUR-15D ASROC", 181, "A MADCAP strapped to a rocket: it flies 4–16 km, then the torpedo drops into the water and homes in.",
    [["Handling", 4], ["Speed", "Rocket 750; torpedo 115"], ["Range", "Rocket 16 km; torpedo 15 km from the splash point"], ["Body", 4], ["Signature", "5/5"],
      ["Intelligence", 2], ["Damage", "14DN"], ["Weight", "2,250 kg (950 kg for the torpedo alone)"], ["Cost", "350,000¥"]],
    "<p>The rocket stage is unguided: no Intelligence in flight, no rigger control after launch, and no blind fire at subs behind a thermocline.</p>"),
  vessel("UIM-199 Kingfisher SSAM", 181, "A subsurface-to-air missile that lets a submerged sub kill dipping-sonar aircraft without surfacing; fired from a torpedo tube or a vertical-launch tube.",
    [["Intelligence", 4], ["Damage", "14D"], ["Weight", "25 kg"], ["Availability", "14/21 days"], ["Cost", "15,000¥"], ["Street Index", "NA"],
      ["Range", "Short 20–100 m · Medium 101–220 m · Long 221–600 m · Extreme 601–2,200 m"]],
    "<p>The sub must be at 50 m or shallower to launch; range counts from where the missile surfaces. Two fit in one vertical-launch tube.</p>"),
  vessel("Torpedo Probe", 182, "A Mark 197 body carrying a sonar array instead of explosives: it reports other subs back to the mother ship over an optical cable.",
    [["Handling", 4], ["Speed", 150], ["Range", "15 km (depth 750 meters)"], ["Body", 4], ["Signature", "5/3"], ["Intelligence", 2], ["Damage", "None"], ["Sonar", 4], ["Weight", "950 kg"], ["Cost", "150,000¥"]],
    "<p>Fixed speed 150 m per Combat Turn (about 100 knots); the cable limits it to 3 km (about 20 turns, a minute of recon). Steered from the sub by joystick, or by rigger link if the sub has a remote control deck.</p>"),
  ["Noisemaker", `<p>A meter-long perforated canister of chemicals that froths into a mass of bubbles, confusing sonar and torpedoes. When a sub releases one, other craft take <strong>+3 to all TNs</strong> to detect or target it for that Combat Turn and the next two (ten seconds).</p>
${stats([["Weight", "75 kg"], ["Cost", "500¥"], ["Availability", "6/48 hours"], ["Street Index", "4.5"]])}<p><em>Cyberpirates p.182.</em></p>`],
  vessel("Decoy", 182, "A torpedo body with a sound system that imitates a moving submarine.",
    [["Handling", 4], ["Speed", 150], ["Range", "15 km (depth 750 meters)"], ["Body", 4], ["Signature", "5/3"], ["Intelligence", 2], ["Damage", "NA"], ["Sonar", 4], ["Weight", "950 kg"], ["Cost", "150,000¥"]],
    "<p>When it deploys, every torpedo fired at the sub makes an <strong>Intelligence (6) Test</strong>: success, it stays locked on the sub; failure, it strikes the decoy.</p>")
]);

writePack("cp-ships", [SHIPS, WEAPONS]);
