// Snapshot the system's LIVE data-model fields (name → field class) into tools/data/schema.json, the
// validator's offline reference. Pack documents are not a schema (some carry stale keys), so the dump
// comes from Foundry itself. In the console of a world running the pinned sr2e version, run:
//   const t = (m) => Object.fromEntries(Object.entries(m).map(([k, d]) => [k, Object.fromEntries(Object.entries(d.schema.fields).map(([f, v]) => [f, v.constructor.name]))]));
//   copy(JSON.stringify({ systemVersion: game.system.version, coreVersion: game.version, Item: t(CONFIG.Item.dataModels), Actor: t(CONFIG.Actor.dataModels) }));
// then: pbpaste | npm run snapshot-schema -- <sr2e version>
// (the version argument overrides a server that hasn't re-read system.json since the last bump).
import { readFileSync, writeFileSync } from "node:fs";

const dump = JSON.parse(readFileSync(0, "utf8"));
const systemVersion = process.argv[2] ?? dump.systemVersion;
const out = { systemVersion, coreVersion: dump.coreVersion, keys: { ...dump.Item, ...dump.Actor } };
writeFileSync("tools/data/schema.json", JSON.stringify(out, null, 1) + "\n");
console.log(`schema snapshot from sr2e ${systemVersion}: ${Object.keys(out.keys).join(", ")}`);
