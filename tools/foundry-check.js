// In-Foundry check (paste into the console of a world with this module enabled, running from the
// dev checkout so packs-src is served). The authoritative counterpart of tools/validate-packs.mjs:
// every source document in packs-src is fetched as authored and compared, recursively (embedded items,
// effects and journal pages included), with what Foundry loaded from the built pack — anything
// rejected, missing, coerced, clamped or dropped is reported. Changes nothing.
(async () => {
  const MOD = "sr2e-cyberpirates", base = `modules/${MOD}/packs-src`;
  const safe = (n) => n.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
  const problems = [];
  // Authored values must survive exactly; keys Foundry adds (defaults, _stats, …) are not authored.
  const diff = (a, b, path, out) => {
    if (Array.isArray(a)) {
      if (!Array.isArray(b)) return out.push(`${path}: array became ${JSON.stringify(b)}`);
      if (a.length && typeof a[0] === "object" && a[0]?._id) {
        for (const x of a) { const y = b.find(z => z?._id === x._id); if (!y) out.push(`${path}[${x.name ?? x._id}]: missing`); else diff(x, y, `${path}[${x.name ?? x._id}]`, out); }
      } else if (JSON.stringify(a) !== JSON.stringify(b)) out.push(`${path}: ${JSON.stringify(a)} → ${JSON.stringify(b)}`);
      return;
    }
    if (a && typeof a === "object") {
      if (!b || typeof b !== "object") return out.push(`${path}: object became ${JSON.stringify(b)}`);
      for (const k of Object.keys(a)) if (!["_key", "_stats", "folder", "sort"].includes(k)) diff(a[k], b[k], path ? `${path}.${k}` : k, out);
      return;
    }
    if (a !== b) out.push(`${path}: ${JSON.stringify(a)} → ${JSON.stringify(b)}`);
  };
  let n = 0;
  for (const pack of game.packs.filter(p => p.metadata.packageName === MOD)) {
    const name = pack.metadata.name;
    if (pack.invalidDocumentIds?.size) problems.push(`${pack.collection}: invalid documents ${[...pack.invalidDocumentIds].join(", ")}`);
    const index = await pack.getIndex();
    if (!index.size) problems.push(`${pack.collection}: empty`);
    for (const entry of index) {
      n++;
      const res = await fetch(`${base}/${name}/${safe(entry.name)}_${entry._id}.json`);
      if (!res.ok) { problems.push(`${pack.collection} ${entry.name}: no source file served (${res.status})`); continue; }
      const src = await res.json();
      const doc = await pack.getDocument(entry._id);
      if (!doc) { problems.push(`${pack.collection} ${entry.name}: failed to load`); continue; }
      const out = [];
      diff(src, doc.toObject(), "", out);
      if (out.length) problems.push(`${pack.collection} ${entry.name}:\n    ${out.join("\n    ")}`);
    }
  }
  console.log(problems.length ? `Cyberpirates packs — ${problems.length} problem(s):\n${problems.join("\n")}`
    : `Cyberpirates packs: all ${n} documents load exactly as authored.`);
})();
