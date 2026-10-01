/* Fährt alle Proben nacheinander. Rot, sobald eine rot ist — ihr eigener
   Rückgabewert entscheidet, keine Pipe dazwischen. */
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const hier = dirname(fileURLToPath(import.meta.url));
let fehl = 0, stumm = 0;
for (const p of ["smoke_knoten.mjs", "smoke_anhang.mjs", "smoke_pruefer.mjs", "smoke_vorbelegung.mjs", "smoke_start.mjs"]) {
  console.log(`\n══ ${p} ══`);
  const r = spawnSync("node", [join(hier, p)], { stdio: "inherit" });
  /* Punkt 8: Rückgabe 2 heißt „nicht lauffähig" (kein Browser, Paket fehlt) —
     ungeprüft, nicht grün und nicht rot. Durchgereicht als 2. */
  if (r.status === 2) stumm++;
  else if (r.status !== 0) fehl++;
}
console.log(fehl ? `\n✗ ${fehl} Probe(n) rot` + (stumm ? `, ${stumm} nicht lauffähig` : "")
  : stumm ? `\n⊘ ${stumm} Probe(n) nicht lauffähig — ungeprüft, nicht grün` : "\n✓ alle Proben grün");
process.exitCode = fehl ? 1 : stumm ? 2 : 0;
