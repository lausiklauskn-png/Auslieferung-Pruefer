# Brief · Auslieferungsprüfer · ChatGPT-Prüfbericht, Punkte 4–8

**Stand:** 2026-10-01 abends, `origin/main` `e10bbad` (nach #35 „Im Prüfer prüfen“). Die Befunde stammen aus dem
ChatGPT-Prüfbericht vom 2026-10-01 (geprüft an `70b2918`). Jeder wurde damals
im Code **nachgelesen**, aber keiner ist nachgestellt. Die Punkte 1–3 (Sende-Prüfer) sind fertig
(Sende-Pruefer #53, #54). Das Prüfsiegel steht in `BRIEF_2026-10-01_pruefsiegel.md`
und kommt **danach**.

## Pflichtlektüre

1. `CLAUDE.md` (dieses Depot), dann `Sage-Protokol/docs/NETZWEIT.md`
2. frisch abzweigen: `git fetch origin --quiet && git checkout -B <zweig> origin/main`
3. `assets/pruefer-anhang.js` (die eine Tür `pruefe`), `assets/pruefer-ui.js` (Bericht, Marke oben)

## Die Punkte

| # | Befund | wo |
|---|---|---|
| 4 | Text aus **TXT, SVG, HTML, Word/Office** geht nur durch `pruefeText` (Schlüssel, Mail, IBAN), nicht durch die Liste der KI-Anweisungen. „Ignore previous instructions …“ in einer .txt oder .docx bleibt unbemerkt; in PDF und Bild wird es gefunden | `pruefer-anhang.js`, `pruefe()` |
| 5 | Der **Bildpunkt-Verdacht** (Knopf „🔍“) steht nicht im Bericht: „Bericht kopieren/speichern“ liefert den Stand ohne ihn | `pruefer-ui.js` |
| 6 | **„Ungeprüft“ fehlt an drei Stellen**, oben kann fälschlich „kein Befund“ stehen: (a) ohne pdf.js bleibt die Gesamtmarke auf „geprüft“ · (b) eine verworfene unsichere OCR-Zeile (< `OCR_SICHER`) setzt die Marke nicht · (c) eine unbekannte Binärdatei bekommt gar keinen Hinweis | `pruefer-anhang.js` + `pruefer-ui.js` (`ungeprueftSatz`) |
| 7 | **Unsichtbare Zeichen im Bildtext**: übernommen wird nur `KI-ANWEISUNG`, `UNSICHTBARE-ZEICHEN` fällt weg | `bildTextPruefen` |
| 8 | **Ohne Browser grün:** `smoke_start.mjs` und `smoke_vorbelegung.mjs` enden bei fehlendem Browser mit `exit(0)`; `smoke_pruefer.mjs` (Zeile ~1087) sucht noch selbst `chrome-linux/chrome` statt `tests/chromium-finden.mjs`. Ziel wie im Sende-Prüfer: „nicht lauffähig“ = Rückgabe **2**, und `tests/alle.mjs` reicht das durch | `tests/` |

## Startpunkt für Punkt 4

`docs/BRIEF_2026-10-01_punkt4-entwurf.patch` ist ein **ungeprüfter Entwurf**
aus der Sitzung vom 2026-10-01: `dateitextPruefen()` schickt den Text (bei HTML
den Quelltext) durch `PrueferMail.pruefeMail` und übernimmt nur
`KI-ANWEISUNG`, `UNSICHTBARE-ZEICHEN`, `VERSTECKTER-TEXT`. Fehlt
`pruefer-mail.js`, gilt er als ungeprüft. ⚠ Das `"\n"` davor ist da, weil `pruefeMail`
eine erste Zeile wie „Hinweis: …“ sonst als Mailkopf liest; deshalb Zeile − 1.
Weder gefahren noch gegengeprüft. Anwenden mit `git apply`, dann messen.

## Was danach zu tun ist

- Für jede Zusicherung eine Probe in `smoke_anhang` / `smoke_pruefer` und je einen Fall in
  `tests/gegenprobe.sh` (Präfixe `KITEXT:` · `VERDBER:` · `UNGEPR:` · `UNSICHTBILD:` · `LAUF:`).
  Die Gegenprobe in einer **Kopie** fahren, vorher committen. ⚠ Diese Gegenprobe kennt
  `NUR_ANKER` nicht.
- `CACHE_VERSION` und alle `?v=` erhöhen (zuletzt v25 / `?v=98`).
- `pruefer-anhang.js` (und `pruefer-mail.js`, falls geändert) **byte-1:1** in den Sende-Prüfer kopieren
  und dort `ANHANG_SHA` (`MAIL_SHA`) in `tests/anhaenge.mjs` nachziehen, dort `CACHE_VERSION`
  erhöhen (zuletzt `sende-pruefer-v44`), `npm test` grün.
- Ehrlich lassen: Eine Musterliste fängt keine umformulierten Anweisungen; Zitate in Fachartikeln
  bleiben Fehlalarme. Das gehört als Grenze in die Anleitung, nicht als Versprechen.

## Nicht übernehmen (Entscheidung vom 2026-10-01)

Erweiterter LSB-Decoder (mehr Varianten = mehr Fehlalarme) · Backend/Server ·
eigenes Ergebnis-Format mit Prüfsumme (`anhangLauf` reicht) · Texterkennung im
Installations-Vorrat.

## Seit dem ersten Entwurf dazugekommen (#35)

Auf `testvorlagen/` öffnet „🧪 Im Prüfer prüfen“ jede Vorlage über
`auslieferungspruefer.html?test=<Datei>` direkt im Prüfer (Namen nur nach
`^Vorlage-[A-Za-z0-9-]+\.(pdf|png|jpg|txt|svg|docx|eml)$`). Für Punkt 4 bietet sich
eine neue Vorlage an, etwa `Vorlage-H6-Text-mit-KI-Anweisung.txt`: erfunden, gebaut mit
`node tools/testvorlagen-bauen.mjs`, mit eigenem Link auf der Seite. Dann misst sie die
smoke-Probe gleich mit. ⚠ Die Vorlage `H1` (.txt) muss **ohne** KI-Befund bleiben, damit sie als
Gegenrichtung dient.

## Abschluss

PR selbst mergen, wenn alles grün ist. Klaus den Link geben und am Tablet testen lassen,
z. B. mit einer .txt, die „Ignore previous instructions“ enthält, im Eingang „Foto · Datei prüfen“.
Danach den Brief für das Prüfsiegel aufnehmen.
