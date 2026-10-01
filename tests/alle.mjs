/* Fährt alle Proben nacheinander. Rot, sobald eine rot ist — ihr eigener
   Rückgabewert entscheidet, keine Pipe dazwischen. */
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const hier = dirname(fileURLToPath(import.meta.url));
let fehl = 0;
for (const p of ["smoke_knoten.mjs", "smoke_anhang.mjs", "smoke_pruefer.mjs", "smoke_vorbelegung.mjs", "smoke_start.mjs"]) {
  console.log(`\n══ ${p} ══`);
  const r = spawnSync("node", [join(hier, p)], { stdio: "inherit" });
  if (r.status !== 0) fehl++;
}
console.log(fehl ? `\n✗ ${fehl} Probe(n) rot` : "\n✓ alle Proben grün");
process.exitCode = fehl ? 1 : 0;
