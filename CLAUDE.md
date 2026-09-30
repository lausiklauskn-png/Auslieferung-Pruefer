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

✅ **Die alte Seite auf pwa-toolpoint.de leitet seit 2026-09-30 hierher weiter**
(PWA-Toolpoint #155, samt `?adresse=`). Die Prüfer-Dateien liegen dort nicht
mehr; eine byte-1:1-Pflicht nach PWA-Toolpoint gibt es seitdem nicht mehr.

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
Botschaften (Steganografie) und Text im Bild werden NICHT gelesen** (der
Seitentext eines PDFs seit Stufe 2 D schon, siehe unten) — der Plan steht im Sende-Prüfer unter
`docs/BRIEF_2026-09-29_anhaenge-stufe2.md`.

Proben: `tests/smoke_anhang.mjs` (ohne Browser, 36 Zusicherungen, Muster in
`tests/anhang-muster.mjs`) · `tests/smoke_pruefer.mjs` (Eingang, Mail-Anhänge,
SVG läuft nicht, später Lauf) · Gegenprobe `NUR_FALL="ANHANG:"` (19 Fälle).
Cache `auslieferung-pruefer-v2`, alle `?v=77`.

## 🔗 Die Zahlen über den Befunden sind Links (Klaus 2026-09-29)

Klaus: *„sollten die Befunde als Links zur Verfügung stehen, sodass also die
gleich an die Stelle springen … Das ist einfacher als dahin zu scrollen."*

Jede Zahl in der Zusammenfassung („18 Befunde", „2× Absender passt nicht") ist
ein `<a href="#pr-g-N">` auf die erste Karte ihrer Art; die Karte trägt
`id="pr-g-N"` und `data-kennung`. Ein zweiter Tipp springt zur **nächsten**
Karte derselben Art, am Ende wieder zur ersten. Die Gesamtzahl geht durch alle.

- **Ein Hash-Link, kein Skript-Sprung:** er geht ohne JavaScript, der Zurück-Knopf
  führt zurück, und `.pr-karte:target` rahmt die angesprungene Karte ein.
- **Unter der klebenden Kopfleiste** hält `scroll-padding-top` (`--kopf-hoehe`)
  die Karte frei — gemessen: Karte bei 91 px, Leiste endet bei 61 px.
- ⚠ **TAFEL-EVOLUTION, BENANNT:** der Wächter „im Ergebnis steht kein anklickbarer
  Link" verbot jeden `a[href]`. Er ist geschärft, nicht gelockert: erlaubt ist
  nur `#pr-g-<Zahl>` — ein Sprung in dieselbe Seite, nie eine fremde Adresse.
- Cache damals `auslieferung-pruefer-v3`, `?v=78`.
- Proben: `smoke_pruefer` (jede Zahl ein Link auf eine vorhandene Karte · Gesamtzahl
  durch alle · „N×" durch genau N Karten · Ziel trägt IHRE Art · Tipp landet sichtbar
  unter der Leiste · zweiter Tipp zur nächsten Karte) · Gegenprobe `NUR_FALL="SPRUNG:"`
  (4 Fälle, von Hand nachgestellt, jede rote Zeile mit ihrem Namen). Gemessen
  2026-09-29: `smoke_pruefer` **257 grün · 0 ROT**, `SPRUNG:` **4 gefangen · 0 blind**.
  Ein Fall („fremde Art") fing zuerst nur über den Weiter-Sprung; dafür steht jetzt
  ein eigener Wächter.

## PDF: Zeichenketten und Ströme (Klaus 2026-09-29)

Klaus hat zwei echte PDFs aus dem Sende-Prüfer geprüft: eine aus Word („þÿMicrosoft® Word
LTSC", „MicrosoftÂ®", „3 Ströme, 2 NICHT lesbar") und eine aus Illustrator („60 Ströme,
59 NICHT lesbar"). Die Angaben waren richtig, nur falsch gelesen worden:

- **Die Zeichenketten** in `assets/pruefer-formate.js` werden jetzt richtig entschlüsselt:
  UTF-16 mit FE FF (das war „þÿ"), Hex-Zeichenketten `<FEFF…>`, Escapes samt `\ooo` und
  Klammern in Klammern. XMP wird als UTF-8 gelesen (das war „Â®"), Entities aufgelöst.
- **Ströme:** es zählt nur ein `stream` direkt hinter `>>`. Vorher traf die Suche das „stream"
  in „endstream" und erzeugte Scheinströme. Der Filter kommt aus dem eigenen Wörterbuch,
  nicht aus den 400 Zeichen davor. Ein Deckel bleibt (400), aber er wird genannt; vorher
  wurde bei 60 still abgeschnitten.
- Ein kaputter Strom brach unter Node den Lauf ab (unbehandelte Ablehnung von write/close);
  jetzt zählt er als NICHT lesbar.
- `_meta.fassung` 2 · Cache `auslieferung-pruefer-v4`, alle `?v=79`.
- Byte-1:1 in Sende-Pruefer (`FORMATE_SHA`) und PWA-Toolpoint.
- Proben: `smoke_pruefer` (Word-artige Probe-PDF mit erfundenen Angaben, kaputter Strom) ·
  Gegenprobe `NUR_FALL="PDFZK:"` (7 Fälle).
- ⚠ Der Seitentext wird seit Stufe 2 D gelesen (Abschnitt unten). An den echten PDFs selbst ist das Ergebnis
  nicht gemessen; die liegen nur bei Klaus.

## 📄 Stufe 2 D · der Seitentext eines PDFs (Klaus 2026-09-29)

Plan und Entscheidungen: `Sende-Pruefer/docs/BRIEF_2026-09-29_anhaenge-stufe2.md`
(Reihenfolge D → A → B → E → C; Klaus: C bekommt einen eigenen Knopf mit
„Verdacht", E liest höchstens 10 Seiten gegen, die Grenze wird benannt).

- `assets/pruefer-anhang.js` liest die Textebene jeder Seite mit **pdf.js aus dem
  eigenen Ordner `vendor/pdfjs/`** (seit 2026-09-30, Klaus: *„Der Prüfer soll gar nicht
  mehr von Workflow PDF abhängen"*; byte-gleich aus Workflow PDF, SHA-gepinnt in
  `smoke_knoten`, Lizenz in `THIRD_PARTY.md`). Die App setzt den Pfad
  (`PrueferAnhang.pfade({pdfjs})` in `pruefer-ui.js`); pdf.js wird erst geholt, wenn ein
  PDF kommt, und steht **nicht** im Installations-Vorrat. pdf-lib liegt nur für die
  Proben unter `tests/vendor/`. `smoke_knoten` besteht darauf, dass keine ausgelieferte
  Datei `Workflow-PDF` nennt; gemessen in einer Kopie OHNE Workflow-PDF daneben:
  `smoke_pruefer` 275 grün, `ALLEIN:` 2 gefangen. Seit dem HTML-Eingang (unten): 278 grün
  im normalen Baum, `ALLEIN:` 3 gefangen. Cache v10, `?v=85`.
  **HTML-Eingang** (Klaus 2026-09-30, Vorlage 1A): ein PDF oder eine Binärdatei geht an
  den Datei-Weg (`nimmDatei` liest zuerst den Kopf), nicht als Salat ins Quelltext-Feld.
  ⚠ In `probe`-Mustern ist `\|` ein sed-Oder — für `||` steht `..`.
- ⚠ **`isEvalSupported: false`**: pdf.js 3.11 konnte mit einer präparierten Schrift
  Code ausführen (CVE-2024-4367). Ein Wächter liest die Zeile, ein Gegenprobe-Fall dreht sie.
- Anweisungen an eine KI sucht **dieselbe Liste wie der Mail-Eingang**
  (`PrueferMail.pruefeMail`, nur `KI-ANWEISUNG`) → Befund **`PDF-KI-ANWEISUNG`** mit
  „Seite n, Zeile z". Fehlt `pruefer-mail.js` (Sende-Prüfer), steht „ungeprüft" da.
- Der Text geht je Seite durch `pruefeText` (Schlüssel, Mailadressen, IBAN); die Stelle
  nennt „…, Seite n, Zeile z".
- **Höchstens 100 Seiten** (`SEITEN_TEXT_MAX`, gewählt, nicht gemessen); dahinter
  „Seiten 101–N wurden NICHT gelesen". Seiten ohne Textebene (Scans) werden benannt.
  pdf.js fehlt, PDF kaputt oder mit Passwort, 60 s überschritten → „NICHT gelesen …
  ungeprüft", nie sauber.
- Proben: `smoke_anhang` (ohne Browser, pdf.js per `vm` aus `vendor/pdfjs/`) · `smoke_pruefer` (echte Seite) ·
  Gegenprobe `NUR_FALL="PDFTEXT:"` (10 Fälle). Cache `auslieferung-pruefer-v5`, alle `?v=80`.
- ⚠ Nicht gemessen: echte PDFs von Klaus, das Tablet (Zeit, Speicher bei 100 Seiten).

## Netzweit

Freibrief · frisch von `origin/main` · Ton · kein PII · Ehrlichkeit:
[Sage-Protokol/docs/NETZWEIT.md](https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/docs/NETZWEIT.md).
`impressum.html` und `datenschutz.html` tragen Klaus' echte Angaben — das
verlangt § 5 DDG; nicht durch Platzhalter ersetzen.

## 🧪 Testvorlagen für Stufe 2 (Klaus 2026-09-30)

`testvorlagen/` (Seite `testvorlagen/index.html`, nicht in `CORE`, `noindex`):
je eine Vorlage für D (heute) und A · B · E · C (geplant), dazu alle als eine
`.eml`. Alle Angaben erfunden. **Gebaut, nicht von Hand:**
`node tools/testvorlagen-bauen.mjs` (playwright-core + pdf-lib aus dem
Workflow-PDF-Klon). Die Seite nennt je Vorlage, was HEUTE gemessen herauskommt
(2026-09-30: 0D und 3E → „Anweisung an eine KI"; Bilder und Scan → „nicht
gelesen") und was nach dem Schritt herauskommen soll. **Wer einen Schritt baut,
zieht die grüne Zeile dort nach.** Die LSB-Botschaft in 4C ist aus der
gespeicherten PNG nachgelesen (72 Bytes, wörtlich).

**Reiter heißt „Foto · Datei prüfen"** (Klaus 2026-09-30: „als Erstnutzer … würde ich mich nicht versucht fühlen, da ein JPEG einzufügen"). Untertitel nennt JPEG, PNG, SVG, Word, Excel, ZIP. Cache `auslieferung-pruefer-v6`, alle `?v=81`.

## 🧪 Klaus' Tests der Vorlagen — was daraus behoben ist (2026-09-30)

| Befund am Tablet | behoben |
|---|---|
| PDF-Eingang zeigte bei 0D/3E nur Metadaten | liest jetzt den Seitentext mit (`PrueferAnhang.pruefe`, nur `PDF-KI-ANWEISUNG` + Seitentext-Treffer; die PDF-Befunde kommen weiter aus `pruefePdf`) |
| H5 (JPEG als .pdf) im PDF-Eingang: grünes „kein Befund" | geht an den Datei-Weg (`dateiPruefen`), meldet die Tarnung |
| H1 (.txt) als Mail-Anhang ungeprüft | `artVon` erkennt Text (UTF-8 ohne Steuerzeichen) |
| xmlns / w3.org / openxmlformats / purl.org als „fremde Adresse" | `NAMENSRAUM_WIRTE` + `VOR_XMLNS` in JS UND Python |

Gegenprobe `NUR_FALL="VORLAGEN:"` (4 Fälle, 4 gefangen). ⚠ Offen: gleiche
Befund-Arten (2× Metadaten) stehen als getrennte Karten; Steps A/B (Text im Bild).

⚠ **Diese Gegenprobe kennt `NUR_ANKER` NICHT** — am 2026-09-30 startete ein
`NUR_ANKER=1 bash tests/gegenprobe.sh` dadurch einen vollen Lauf im echten
Baum. `TERM` beendet ihn nicht (bash wartet auf das Kind); angehalten mit
`kill -STOP` + `-KILL`, die liegengebliebene Sabotage aus `/tmp/gp_*.bak`
zurückgeholt. **Vor jedem Lauf committen, immer in einer Kopie.**

## 🛡📦 Eigenes Icon (Klaus 2026-09-30)

Schild + Paket mit Haken, aus Klaus' ChatGPT-Bild. Alle Größen unter `icons/`
(favicon-32/48, apple-touch-icon 180, icon-192/512, maskable-512, marke-96 für
die Kopfzeile). Die alten Marktplatz-Dateien `assets/icon-*.png` und
`assets/marke.svg` sind weg. Wer das Icon ändert, erhöht `?v=` und CACHE_VERSION
(zuletzt v12, `?v=87`; seit dem Zusammenfassen v13, `?v=88`).

## 🗂 Gleiche Art, eine Karte (Klaus 2026-09-30)

„2× Metadaten" standen als zwei Karten da. `gruppiere()` fasst jetzt ohne Wirt
nach der ART zusammen (vorher nach dem Satz); verschiedene Wirte bleiben
verschiedene Karten (`wirtAus` kennt auch „lädt von HOST ("). Unterscheiden sich
die Sätze, steht jeder an seiner Stelle (`.pr-stellensatz`), im Fach und im
Bericht stehen alle. „N×" nennt die STELLEN der Art, der Link geht durch ihre
Karten (Tafel-Evolution: vorher die Karten). Gegenprobe `NUR_FALL="GRUPPE:"`
(3 Fälle). Cache v13, `?v=88`.

## 🔤 Stufe 2 A · Text im Bild lesen (2026-09-30)

Bilder (PNG, JPEG, WebP, GIF) und gescannte PDF-Seiten gehen durch die
Texterkennung **auf dem Gerät**: Tesseract.js 7.0.0 (deu/eng/rus) liegt
**byte-gleich aus Workflow-PDF** unter `vendor/tesseract/` (21 MB, SHA-gepinnt in
`smoke_knoten`, Lizenzen in THIRD_PARTY.md), **nicht** im Installations-Vorrat —
der Worker legt es beim ersten Bild ab. Die App setzt den Pfad
(`pfade({tesseract})` in `pruefer-ui.js`).

| | |
|---|---|
| Befund | **`BILD-KI-ANWEISUNG`** („Anweisung im Bild"), dieselbe Liste wie im Mail-Eingang; Stelle „Bildtext Zeile n" bzw. „Seite n, Bildtext Zeile n" |
| Angaben | der Bildtext geht durch `pruefeText` (Mail, IBAN, Schlüssel …) |
| nichts gelesen | **„Text im Bild ungeprüft"** (gestrichelt, Warnfarbe) — nie „kein Befund". Ein Bild ohne Text sieht genauso aus |
| Grenzen (gewählt, nicht gemessen) | `OCR_FRIST` 90 s je Bild · `OCR_SEITEN_MAX` 10 Scan-Seiten · Zeilen unter `OCR_SICHER` 60 % verworfen · lange Kante ≤ 3000 px |
| `file://` | die Texterkennung läuft nicht (der Worker hängt) → sofort „ungeprüft", mit Grund |

**Gemessen im Browser (2026-09-30, lokal):** 1A-Bild 3,3 s (erstes, mit Laden) →
Anweisung Zeile 9 + Mail/IBAN · 1A-Scan-PDF 1,9 s → Seite 1 Zeile 9 · H0 0,5 s,
Text gelesen, kein Befund (die Gegenrichtung) · 4C mit und ohne Botschaft gleich
(Steganografie ist Schritt C) · **2B: die blasse Zeile wird NICHT gefunden** — das
ist Schritt B. `smoke_pruefer` 291 grün · `smoke_anhang` 64 · `smoke_knoten` 153.

⚠ **Tafel-Evolution:** der Wächter „sauberes PNG → kein Befund" ist ersetzt
durch „→ Text im Bild ungeprüft" (das Bild trägt keinen lesbaren Text).

⚠ **Nicht gemessen:** Zeit und Speicher am Tablet; echte Fotos von Klaus.

Gegenprobe `NUR_FALL="OCR:"` (7 Fälle), gefahren in einer Kopie (Stand des ersten Commits): **7 schlagen an · 0 blind · 0 tote Anker**. Die roten Zeilen sind nicht einzeln von Hand gelesen.
