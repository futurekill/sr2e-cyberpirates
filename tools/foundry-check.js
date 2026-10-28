// In-Foundry schema check (paste into the console of a world with this module enabled). Rebuilds every
// document of the module's packs against the LIVE sr2e data models and reports anything Foundry would
// reject, coerce or drop — the authoritative counterpart of tools/validate-packs.mjs. Changes nothing.
(async () => {
  const flat = foundry.utils.flattenObject, problems = [];
  for (const pack of game.packs.filter(p => p.metadata.packageName === "sr2e-cyberpirates")) {
    for (const doc of await pack.getDocuments()) {
      const src = pack.index.get(doc.id) && (await pack.getDocument(doc.id)).toObject(false);
      try {
        const copy = new doc.constructor(foundry.utils.deepClone(src));
        if (!copy.validate({ strict: true, fallback: false })) problems.push(`${pack.collection} ${doc.name}: invalid`);
        const a = flat(src.system ?? {}), b = flat(copy.toObject().system ?? {});
        const diff = Object.keys(a).filter(k => JSON.stringify(a[k]) !== JSON.stringify(b[k]));
        if (diff.length) problems.push(`${pack.collection} ${doc.name}: changed ${diff.join(", ")}`);
        copy.prepareData?.();
      } catch (e) { problems.push(`${pack.collection} ${doc.name}: ${e.message}`); }
    }
  }
  console.log(problems.length ? problems.join("\n") : "Cyberpirates packs: all documents valid against the live schema.");
})();
