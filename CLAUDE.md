# Auslieferungsprüfer — Sitzungs-Anker

**Eigenständige PWA seit 2026-09-26** (Klaus: *„den Auslieferungsprüfer und den
Sendeprüfer in ein separates PWA-Tool umwandeln … eine 1:1-Kopie, um darin
weiterzuarbeiten … So können wir schon testen, während Kimhub noch separat
läuft."*).

## Woher es kommt

**1:1-Kopie aus `PWA-Toolpoint` (origin/main 6f5d868).** Dort läuft der Prüfer
weiter als Teil des Marktplatzes; hier wird er als eigene App weitergebaut.
Die Python-Fassung („zwei Fassungen, ein Ergebnis") liegt unter `werkzeuge/`,
kopiert aus `Kimhub/werkzeuge/auslieferung-pruefer/`.

**Was gegenüber dem Original anders ist — und nur das:**

| | |
|---|---|
| `index.html` | leitet auf `auslieferungspruefer.html` weiter, samt `?adresse=` |
| `auslieferungspruefer.html` | registriert jetzt selbst `sw.js` (im Marktplatz tat das die Startseite) · „← Marktplatz" und die Marke zeigen auf `https://pwa-toolpoint.de/` statt auf `./` |
| `impressum.html` · `datenschutz.html` | dieselbe Link-Änderung |
| `manifest.json` · `sw.js` · `package.json` | eigen |
| `tests/smoke_pruefer.mjs` | Python-Fassung aus `werkzeuge/` statt aus einem Nachbar-Klon · zwei Abschnitte über die Marktplatz-Startseite herausgenommen (benannt an ihrer Stelle) |
| `tests/gegenprobe.sh` | Kopie, fährt nur die Fälle auf Prüfer-Dateien |

**Seit 2026-09-28 ist dies DIE Fassung** (Klaus: *„da sie baugleich sind, soll
die Fassung auf PWA Toolpoint einfach nur ersetzt werden durch einen neuen
Link"*). `canonical`, `og:url` und `endpoint` zeigen auf die eigene Adresse
`https://lausiklauskn-png.github.io/Auslieferung-Pruefer/auslieferungspruefer.html`.
Die Karte im Marktplatz, die „Prüf es selbst"-Knöpfe der App-Seiten auf
pwa-toolpoint.de und family-projekt.de führen hierher; gemessen wird ab der
nächsten Nacht diese Adresse (Kennung `markt-auslieferungspruefer` bleibt,
der Verlauf reißt nicht ab).

⚠ **Die alte Seite auf pwa-toolpoint.de steht noch** — niemand wird mehr
dorthin geschickt, sie ist nur für alte Lesezeichen da. Sie herauszunehmen
(samt ihren Proben dort) ist ein eigener Schritt.

⚠ **Die SBKIM-Kennung ist eine eigene** — auf `github.io` legt der Browser eine
neue Identität an; die Schublade heißt weiter `auslieferungspruefer`.
`sbkim/pruefer-spore.json` ist noch die signierte Spore aus PWA Toolpoint und
nennt deren Adresse; eine neue entsteht beim Signieren im Siegel dieser App.

## Prüfen

```bash
npm install
node tests/smoke_knoten.mjs           # Knoten, Kanon-Pins, ?v=, Wörterbuch — ohne Browser
node tests/smoke_pruefer.mjs          # echter Browser + Python-Fassung
cp -a . ../ap-kopie && cd ../ap-kopie && bash tests/gegenprobe.sh
```

### Gemessen am 2026-09-26

`npm test` (beide Proben) **grün** · Gegenprobe über alle Fälle auf Prüfer-Dateien,
erster Lauf: **105 gefangen · 24 blind · 1 toter Anker**, 489 Marktplatz-Fälle
nicht gefahren. Die vier Vorbelegungs-Fälle (`AUFKLAPP:`/`PRUEFVOR:`) fangen seit
`tests/smoke_vorbelegung.mjs` wieder — zwei davon Sicherheits-Zusicherungen,
von Hand nachgestellt, jede rote Zeile mit ihrem Namen.

✅ **DIE 20 UNBEWACHTEN FÄLLE SIND BEWACHT (2026-09-26, zweite Sitzung).** Hier
stand: *„20 Fälle sind in diesem Depot unbewacht, und das ist benannt, nicht
behoben … Der Weg: die Prüfer-Abschnitte aus Toolpoints `smoke.mjs` hierher
holen."* Geholt nach **`tests/smoke_knoten.mjs`** (ohne Browser, läuft in
`npm test` zuerst):

| Familie | was dort gemessen wird |
|---|---|
| Knoten | alle 13 Pflicht-Module namentlich · Komma zwischen den Kettengliedern · Schublade im `<head>` vor dem Andock · Suffix in Seite und Konfig gleich · 05b als ES-Modul · 17 vor 15/16, geladen UND gestartet · nicht blockierend, fail-soft · Wappen-Band · Beschreibung (Substanz, wortgleich in beiden Wegen, eigener Name) · Wizard-Bausteine und wer im Semantik-Feld gewinnt · Gerätename per Glue · Relais abgelesen, `netz.js` davor |
| Kanon | SHA-256-Pin auf die 13 Module und den Wizard (Sage-Fassung) |
| Vorrat und ?v= | kein SBKIM-Modul im Vorrat · jede ?v= in Seiten, Skripten und `sw.js` gleich |
| Wörterbuch | kein per `textContent` gesetzter Eintrag trägt eine Entität |
| ohne JavaScript | Knopf heißt nicht „Selbsttest" · „keine Virenprüfung" steht da — in der Datei UND in jeder Sprache |

⚠ **DREI UNTERSCHIEDE ZU TOOLPOINT, alle benannt:** der Wizard wurde drüben
gegen den **Marktplatz**-Wizard verglichen — den gibt es hier nicht, also
steht ein **Pin auf die Sage-Fassung** da (wer ein Modul neu kopiert, zieht
den Pin nach) · die ?v=-Nummern hängen **nicht** an der `CACHE_VERSION`
(v1 gegen ?v=76, beides so übernommen) — gemessen wird, dass alle **gleich**
sind · Wächter mit Marktplatz-Bezug (Spore des Marktplatzes, Knotenkarte)
sind weggelassen.

⚠ **UND ZWEI FÄLLE WAREN AUCH NACH DEM UMZUG BLIND** — „der Knopf heißt wieder
Selbsttest" und „der Satz ‚keine Virenprüfung' verschwindet". Ihre Wächter
standen sehr wohl hier (`smoke_pruefer.mjs`), lasen aber `textContent` im
Browser, **nachdem** `sprache.js` den Satz aus dem Wörterbuch neu geschrieben
hatte. Eine Sabotage an der Datei sahen sie nicht — und genau die Datei liest
ein Leser ohne Skript. Dieselbe Lehre wie in Toolpoints Verfassung („ein
Wächter las den Text NACH dem Wörterbuch"). Gemessen werden jetzt Datei **und**
Wörterbuch; zwei Fälle `WOERTERBUCH:` bewachen die zweite Hälfte.

**Der tote Anker** („es gibt wieder nichts zum Mitnehmen") ist nachgezogen:
die Zeile `mitreihe.hidden = false` gibt es seit dem Umbau auf
`mitreiheZeigen()` nicht mehr; sabotiert wird jetzt `mitreiheZeigen(true);`.

### Gemessen am 2026-09-26 (nach dem Umzug der Wächter)

`npm test` **grün** — `smoke_knoten` **129 grün · 0 ROT**, `smoke_pruefer` und
`smoke_vorbelegung` unverändert grün. Voller Gegenprobe-Lauf in einer
Wegwerf-Kopie (38 min, Stand `8023ead`): **128 gefangen · 2 blind · 0 tote
Anker** · 489 Marktplatz-Fälle nicht gefahren. Die zwei blinden (oben) danach
geschlossen und mit den zwei neuen Fällen gezielt gefahren (`NUR_FALL`):
**6 gefangen · 0 blind**. Jede `sed`-Sabotage auf eine Prüfer-Datei einzeln
gegen `smoke_knoten` nachgestellt: 24 rote Zeilen, jede mit dem Namen ihrer
Zusicherung.

✅ **DER VOLLE LAUF ÜBER DEN ENDSTAND IST GEFAHREN (2026-09-26, dritte
Sitzung).** Hier stand: *„Ein voller Lauf über den Endstand ist NICHT
gefahren — … Das ist eine Folgerung, keine Messung."* Jetzt ist es eine:
Stand `72d7ccb`, Wegwerf-Kopie (`node_modules` verwiesen), 10:41–11:23 UTC
(42 min), im echten Baum lief währenddessen **keine** Probe:
**132 gefangen · 0 blind · 0 tote Anker** · 489 Marktplatz-Fälle nicht
gefahren · Rückgabewert 0, direkt gelesen. Ausgangslage davor `npm test`
grün (`smoke_pruefer` 234 grün). Prüfsumme über die Dateien der Kopie vor und
nach dem Lauf gleich. Die drei Fälle zu „Selbsttest"/„keine Virenprüfung"
(Datei + Wörterbuch) von Hand gegen `smoke_knoten` nachgestellt: je **genau
eine** rote Zeile, jede mit dem Namen ihrer Zusicherung.

⚠ **Zwei Läufe passen nicht nebeneinander.** `smoke_pruefer` hört auf einem
festen Port; wer während der Gegenprobe im echten Baum `npm test` fährt,
bekommt in der Kopie rote Proben aus dem falschen Grund. Der erste Lauf
dieser Sitzung wurde deshalb verworfen.

**Cache-Bump:** wer eine Datei aus `CORE` in `sw.js` ändert, erhöht
`CACHE_VERSION` UND die `?v=`-Angaben in der Seite.

## 📎 Anhänge öffnen und einzelne Dateien prüfen (Klaus 2026-09-29)

Klaus, als der Sende-Prüfer Anhänge prüfen lernte: *„Ist das nicht dann dem
Auslieferungsprüfer …?"* — und auf den Vorschlag, die Prüfung hierher zu legen:
*„bitte so"*.

**`assets/pruefer-anhang.js` wird HIER gepflegt** und byte-1:1 in den
Sende-Prüfer kopiert (dort `assets/pruefer-anhang.js`, per SHA-256 gepinnt in
`tests/anhaenge.mjs`). Wer sie ändert, ändert sie hier, kopiert sie hinüber und
zieht den Pin nach. Einen Python-Zwilling hat sie **nicht** — benannte Grenze.

| | |
|---|---|
| **Eingang „Datei prüfen"** | sechster Reiter (`feld-datei`, `#einzelDatei`): Bild, SVG, Word/Excel/PowerPoint, ZIP, Programm, PDF. Gelesen wird der Dateikopf, nicht der Name; Text in der Datei geht durch `PrueferFormate.pruefeText` wie eine Textdatei |
| **Mail-Eingang** | nach dem Mailtext werden die Anhänge ausgepackt (`ausMail`) und geprüft; Befunde stehen unter „Anhang <Name>". Über 25 MB wird nicht geöffnet, sondern benannt |
| **Findet** | Daten hinter dem Bildende, EXIF/GPS/XMP/PNG-Text, Skripte und fremde Abrufe in SVG, Makros/Einbettungen/Verweise in Office, Programme am Dateikopf, Endung ⟷ Dateikopf; PDFs über `pruefer-formate.js` |

⚠ **TAFEL-EVOLUTION, BENANNT.** Bis hierher galt: *„Ein Anhang wird nicht
geöffnet — geprüft wird, was er zu sein behauptet."* Seit Klaus' Wort werden
Anhänge **gelesen**, nie ausgeführt, angezeigt oder ins Netz geschickt. Geändert
sind pr_45 und pr_56 (DE/EN), der Rat an ANHANG-GEFAEHRLICH und zwei Wächter
(„nicht geöffnet" → „nie ausgeführt"). **`pruefer-mail.js` bleibt unverändert**
(es hat einen Python-Zwilling); sein Satz „Kein Anhang wurde geöffnet" wird nach
dem Öffnen in der Anzeige ersetzt, nicht verschwiegen.

⚠ **Ein spät fertiger Anhang überschreibt nichts:** `anhangLauf` zählt jeden
Reiterwechsel und jede Mail-Prüfung; ein älterer Lauf zeichnet nicht mehr.
Gemessen in beide Richtungen (mit Wechsel: nichts · ohne: der Anhang kommt).

⚠ **BENANNTE GRENZEN:** kein Virenscanner · **in Bildpunkten versteckte
Botschaften (Steganografie), Text im Bild und der Seitentext eines PDFs werden
NICHT gelesen** — die Vorbereitung dafür steht im Sende-Prüfer unter
`docs/BRIEF_2026-09-29_anhaenge-stufe2.md`.

Proben: `tests/smoke_anhang.mjs` (ohne Browser, 36 Zusicherungen, Muster in
`tests/anhang-muster.mjs`) · `tests/smoke_pruefer.mjs` (Eingang, Mail-Anhänge,
SVG läuft nicht, später Lauf) · Gegenprobe `NUR_FALL="ANHANG:"` (19 Fälle).
Cache `auslieferung-pruefer-v2`, alle `?v=77`.

## Netzweit

Freibrief · frisch von `origin/main` · Ton · kein PII · Ehrlichkeit:
[Sage-Protokol/docs/NETZWEIT.md](https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/docs/NETZWEIT.md).
`impressum.html` und `datenschutz.html` tragen Klaus' echte Angaben — das
verlangt § 5 DDG; nicht durch Platzhalter ersetzen.
