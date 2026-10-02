/* Auslieferungsprüfer — schneidet eine Sprachaufnahme in die Szenen des Handbuchs
 * (Klaus 2026-10-02: „eine professionelle Stimme … nicht die Browserstimme,
 * die so abgehackt klingt" · „Kannst du diese selber teilen?").
 *
 * Eingabe: EINE Aufnahme aller Sprechtexte der Reihe nach (wie sie aus
 * `handbuch/szenen.json` kommen). Geschnitten wird in einer PAUSE (ffmpeg
 * silencedetect): jedes Satzende bekommt eine Pause, Szenengrenzen sind die
 * Satzenden am Szenen-Ende (siehe unten). Der Schnitt liegt in der Mitte
 * der Pause. Sprechtexte: `sprech` (de) bzw. `sprechText.<sprache>`.
 *
 * ⚠ GEMESSEN WIRD NUR DIE LAGE, NICHT DER WORTLAUT. Ohne Spracherkennung
 * prüft das Werkzeug: jedes Satzende trifft eine Pause, und kein Satz ist
 * mehr als 2,5 s länger oder kürzer, als seine Zeichenzahl erwarten lässt.
 * Weicht etwas ab, sagt es das. Ob die Stimme den Text richtig liest,
 * hört nur ein Mensch.
 *
 * Aufruf:  node tools/handbuch-ton.mjs <aufnahme.mp3> [sprache=de]
 * Schreibt handbuch/ton/<sprache>/NN-<id>.mp3 und schnitte.json.
 * Danach: node tools/handbuch-bauen.mjs (hängt die Dateien an die Szenen).
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { SZENEN } from "./handbuch-szenen.mjs";

const W = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [quelle, sprache = "de"] = process.argv.slice(2);
if (!quelle || !fs.existsSync(quelle)) { console.error("Aufruf: node tools/handbuch-ton.mjs <aufnahme.mp3> [sprache]"); process.exit(2); }
if (!/^[a-z]{2}$/.test(sprache)) { console.error("Sprache: zwei Buchstaben, z. B. de"); process.exit(2); }

/* Andrew (Englisch, 2026-10-02) macht zwischen zwei Absätzen NICHT länger
 * Pause als zwischen zwei Sätzen (gemessen: beides 0,40–0,46 s). Eine Grenze
 * „die nächste lange Pause" traf dort mitten in eine Szene. Zugeordnet wird
 * deshalb SATZ für Satz: jedes Satzende bekommt eine eigene Pause (≥ 0,3 s),
 * der Reihe nach, so dass die Summe der Abweichungen von der erwarteten
 * Satzlänge (Zeichen × Sprechtempo der ganzen Aufnahme) am kleinsten ist; längere Pausen wiegen etwas
 * mehr. Pausen, die übrig bleiben, sind Kommas und Doppelpunkte. Die
 * Szenengrenzen sind dann die Satzenden am Ende einer Szene. */
const PAUSE_MIN = 0.3, ABWEICHUNG_MAX = 2.5, LANG_GEWICHT = 4;
const texte = SZENEN.map((s) => (sprache === "de" ? s.sprech : s.sprechText?.[sprache]));
const fehlt = SZENEN.filter((s, i) => !texte[i]).map((s) => s.id);
if (fehlt.length) { console.error(`✗ Kein Sprechtext „${sprache}" für: ${fehlt.join(", ")} (tools/handbuch-szenen.mjs, sprechText.${sprache})`); process.exit(2); }
const lauf = spawnSync("ffmpeg", ["-hide_banner", "-i", quelle, "-af", "silencedetect=noise=-40dB:d=0.2", "-f", "null", "-"], { encoding: "utf8" });
if (lauf.status !== 0) { console.error("✗ ffmpeg konnte die Aufnahme nicht lesen:\n" + lauf.stderr.slice(-400)); process.exit(1); }
const text = lauf.stderr;
const dauer = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", quelle], { encoding: "utf8" }).trim());
/* Ava (Deutsch, 2026-10-03): Klaus hat zwischen die Szenen eine Zeile „…"
 * gesetzt. Die Stimme macht daraus ZWEI Pausen mit einem Hauch dazwischen
 * (gemessen: 19,31–19,66 und 19,72–20,16 s). Einzeln ist jede so lang wie
 * eine Satzpause, und die Szenengrenze fiel einmal einen ganzen Satz zu früh.
 * Pausen, zwischen denen weniger als VERBINDEN s Klang liegt, zählen deshalb
 * als EINE — dann ist die Szenenpause länger als jede Satzpause daneben. */
const VERBINDEN = 0.15;
const roh = [];
for (const m of text.matchAll(/silence_end: ([\d.]+) \| silence_duration: ([\d.]+)/g)) {
  const ende = Number(m[1]), d = Number(m[2]);
  roh.push({ anfang: ende - d, ende });
}
const verbunden = [];
for (const p of roh) {
  const vor = verbunden[verbunden.length - 1];
  if (vor && p.anfang - vor.ende < VERBINDEN) vor.ende = p.ende; else verbunden.push({ ...p });
}
const pausen = [];
for (const { anfang, ende } of verbunden) {
  const d = ende - anfang;
  if (d >= PAUSE_MIN && ende < dauer - 0.3) pausen.push({ mitte: anfang + d / 2, ende, d });
}
/* Sätze der Reihe nach, je mit Szene und erwarteter Endzeit. */
const saetze = [];
texte.forEach((t, si) => t.split(/(?<=[.?])\s+/).forEach((x) => saetze.push({ si, n: x.length + 1 })));
const gesamt = saetze.reduce((a, b) => a + b.n, 0);
let summe = 0; saetze.forEach((x) => { summe += x.n; x.erwartet = (summe / gesamt) * dauer; });
const K = saetze.length - 1, M = pausen.length;
if (M < K) { console.error(`✗ ${K} Satzenden, aber nur ${M} Pausen ≥ ${PAUSE_MIN} s`); process.exit(1); }
/* Ein Satzende am SZENEN-Ende wiegt die Pausenlänge doppelt: dort hat der
 * Sprecher (seit Ava, 2026-10-03) eine eigene, längere Pause gemacht. Ohne das
 * fiel die Grenze zwischen Szene 5 und 6 einen ganzen Satz zu früh — auf das
 * Ende des ERSTEN Satzes (0,41 s statt 0,61 s Pause, 1 s näher an der Stelle,
 * die die Zeichenzahl erwarten ließ). */
const szenenEnde = (k) => saetze[k + 1] && saetze[k + 1].si !== saetze[k].si;
/* Sonia (Englisch, 2026-10-03) liest die erste Szene langsamer als den Rest:
 * die erwartete Stelle (Zeichenanteil × Dauer) lag dadurch in der Mitte der
 * Aufnahme bis zu 2 s hinter der echten, und die Zuordnung rutschte von Szene
 * 2 an um einen Satz zu früh. Gemessen wird deshalb die LÄNGE jedes Satzes
 * (von der Pause davor bis zu seiner), nicht seine Lage — eine Verschiebung
 * des Tempos zieht dann nicht alle folgenden Sätze mit. */
const tempo = dauer / gesamt;
const kosten = (k, i, j) => Math.abs(pausen[j].mitte - (i < 0 ? 0 : pausen[i].mitte) - saetze[k].n * tempo) - LANG_GEWICHT * (szenenEnde(k) ? 2 : 1) * pausen[j].d;
/* D[k][j]: beste Summe, wenn Satzende k auf Pause j liegt. */
const D = Array.from({ length: K }, () => new Float64Array(M).fill(Infinity));
const V = Array.from({ length: K }, () => new Int32Array(M).fill(-1));
for (let j = 0; j < M; j++) D[0][j] = kosten(0, -1, j);
for (let k = 1; k < K; k++) {
  for (let j = k; j < M; j++) {
    for (let i = k - 1; i < j; i++) {
      if (D[k - 1][i] === Infinity) continue;
      const w = D[k - 1][i] + kosten(k, i, j);
      if (w < D[k][j]) { D[k][j] = w; V[k][j] = i; }
    }
  }
}
const rest = (x) => D[K - 1][x] + Math.abs(dauer - pausen[x].mitte - saetze[K].n * tempo);
let j = 0; for (let x = 1; x < M; x++) if (rest(x) < rest(j)) j = x;
const zuordnung = new Array(K);
for (let k = K - 1; k >= 0; k--) { zuordnung[k] = j; j = V[k][j]; }
const grenzen = [];
for (let k = 0; k < K; k++) if (saetze[k + 1].si !== saetze[k].si) grenzen.push({ ...pausen[zuordnung[k]], erwartet: saetze[k].erwartet });
/* Geprüft wird, was auch die Zuordnung misst: wie weit die LÄNGE eines
 * Satzes von der abweicht, die seine Zeichenzahl erwarten lässt. */
const satzAb = saetze.map((x, k) => Math.abs((k < K ? pausen[zuordnung[k]].mitte : dauer) - (k ? pausen[zuordnung[k - 1]].mitte : 0) - x.n * tempo));
const ziel = path.join(W, "handbuch", "ton", sprache);
fs.rmSync(ziel, { recursive: true, force: true }); fs.mkdirSync(ziel, { recursive: true });
const zwei = (n) => String(n).padStart(2, "0");
/* Sind es genau so viele Pausen ≥ PAUSE_MIN wie Satzenden (Svetlana,
 * Russisch, 2026-10-03: 15 für 15), gibt es nur EINE Zuordnung — der Reihe
 * nach. Das wird vermerkt. */
const eindeutig = M === K;
const schnitte = []; let warnungen = 0;
SZENEN.forEach((s, i) => {
  const von = i ? grenzen[i - 1].mitte : 0, bis = i < grenzen.length ? grenzen[i].mitte : dauer;
  const sk = saetze.map((x, k) => k).filter((k) => saetze[k].si === i);
  const ab = sk.length ? Math.max(...sk.map((k) => satzAb[k])) : 0;
  const zahl = saetze.filter((x) => x.si === i).length;
  const passt = ab <= ABWEICHUNG_MAX;
  if (!passt) warnungen++;
  const datei = `${zwei(i + 1)}-${s.id}.mp3`;
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", quelle, "-ss", von.toFixed(3), "-to", bis.toFixed(3), "-c", "copy", path.join(ziel, datei)]);
  schnitte.push({ nr: i + 1, id: s.id, datei: `handbuch/ton/${sprache}/${datei}`, von: +von.toFixed(2), bis: +bis.toFixed(2), saetze: zahl, groessteAbweichung: +ab.toFixed(2) });
  console.log(`${passt ? "✓" : "⚠"} ${zwei(i + 1)} ${s.id.padEnd(11)} ${von.toFixed(2).padStart(7)} – ${bis.toFixed(2).padStart(7)} s · ${zahl} Sätze · Satzlänge höchstens ${ab.toFixed(1)} s neben der erwarteten`);
});
fs.writeFileSync(path.join(ziel, "schnitte.json"), JSON.stringify({
  hinweis: "Gebaut von tools/handbuch-ton.mjs aus einer Aufnahme aller Sprechtexte. Geschnitten in der Mitte einer Pause; gemessen ist die Lage, nicht der Wortlaut.",
  sprache, quelle: path.basename(quelle), dauer: +dauer.toFixed(2), pauseMin: PAUSE_MIN, abweichungMax: ABWEICHUNG_MAX, eindeutig, schnitte,
}, null, 1) + "\n");
if (eindeutig) console.log(`= ${M} Pausen für ${K} Satzenden: die Zuordnung ist eindeutig (der Reihe nach).`);
console.log(warnungen ? `⚠ ${warnungen} Szene(n) mit einem Satz, der über ${ABWEICHUNG_MAX} s länger oder kürzer ist als erwartet — bitte anhören.` : `${SZENEN.length} Szenen geschnitten, kein Satz weicht mehr als ${ABWEICHUNG_MAX} s von der erwarteten Länge ab.`);
