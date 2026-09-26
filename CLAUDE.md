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

⚠ **`canonical` zeigt weiter auf pwa-toolpoint.de.** Solange beide Fassungen
live sind, soll die Suchmaschine nur eine davon zählen.

⚠ **Die SBKIM-Kennung ist NICHT die aus PWA Toolpoint.** Die Schublade heißt
auch hier `auslieferungspruefer`, aber auf `github.io` ist das ein anderer
Ursprung — der Browser legt eine eigene Identität an. `endpoint` und
Beschreibung nennen noch pwa-toolpoint.de. Offen, bis Klaus entscheidet, ob
dies ein zweiter Knoten sein soll.

## Prüfen

```bash
npm install
node tests/smoke_pruefer.mjs          # echter Browser + Python-Fassung
cp -a . ../ap-kopie && cd ../ap-kopie && bash tests/gegenprobe.sh
```

**Cache-Bump:** wer eine Datei aus `CORE` in `sw.js` ändert, erhöht
`CACHE_VERSION` UND die `?v=`-Angaben in der Seite.

## Netzweit

Freibrief · frisch von `origin/main` · Ton · kein PII · Ehrlichkeit:
[Sage-Protokol/docs/NETZWEIT.md](https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/docs/NETZWEIT.md).
`impressum.html` und `datenschutz.html` tragen Klaus' echte Angaben — das
verlangt § 5 DDG; nicht durch Platzhalter ersetzen.
