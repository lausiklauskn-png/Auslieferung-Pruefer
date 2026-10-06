/* Prioritätenliste im Auslieferungsprüfer — app-eigener Klebstoff (Klaus 2026-10-05).
   Der Kern ist assets/prioritaeten.js, byte-1:1 aus Mein-In-and-Out-Book
   (SHA-gepinnt in tests/smoke_knoten.mjs) — dort pflegen, hier neu kopieren.
   Eigener Schlüssel: auslieferungspruefer_prioritaeten_v1 (github.io ist eine
   geteilte Adresse; die Listen der anderen Apps bleiben unberührt).
   · Einstellungen: Aufklapper #prPrio unter „Wann brauche ich das?“.
   · Jedes Ergebnis: Kasten [data-prio-treffer] unter der Zusammenfassung.
     Geprüft wird hier nur, was HEREINKOMMT (Richtung „eingang“): der Kasten
     steht da, die Karten der Befunde werden nicht rot gefärbt, nichts hält an.
   · Karten des Prüfkerns tragen die Stufe ihrer Gruppe (data-prio-stufe).
   Nie „harmlos“: jeder Treffer sagt, wie er gefunden wurde, und gibt eine
   Empfehlung. Nur textContent, kein innerHTML.
   ⚠ Benannte Grenze: der Kasten und die Einstellungen sprechen Deutsch, auch in
   der englischen und russischen Oberfläche — wie die Befundtexte. Und die
   Treffer stehen NICHT im kopierten Bericht. */
(function () {
  "use strict";
  var SCHLUESSEL = "auslieferungspruefer_prioritaeten_v1";
  var letzte = null;                         // {ziel, texte} für ein Neuzeichnen nach einer Änderung
  function P() { return window.Prioritaeten || null; }
  function stand() { var p = P(); return p ? p.laden(SCHLUESSEL) : null; }
  function el(t, a, kinder) {
    var e = document.createElement(t);
    if (a) Object.keys(a).forEach(function (k) { e.setAttribute(k, a[k]); });
    [].concat(kinder || []).forEach(function (k) { if (k != null) e.append(k); });
    return e;
  }
  function treffer(texte) { var p = P(); return p ? p.treffer(texte || [], stand(), "eingang") : null; }

  /* Den Kasten in ein Ergebnis hängen. texte: [{text, stelle}]. */
  function kasten(ziel, texte) {
    if (!ziel) return;
    letzte = { ziel: ziel, texte: texte || [] };
    var alt = ziel.querySelector("[data-prio-treffer]"); if (alt) alt.remove();
    var L = treffer(texte), k;
    if (!L) {
      k = el("div", { class: "pr-prio glass", "data-prio-treffer": "ungeprueft" },
        el("p", { class: "feldhinweis" }, "Prioritätenliste: nicht geladen (assets/prioritaeten.js) — darauf ist nichts geprüft."));
    } else {
      k = el("div", { class: "pr-prio glass", "data-prio-treffer": String(L.length), "data-richtung": "eingang" },
        el("h3", null, "⭐ Aus deiner Prioritätenliste: " + L.length + " Treffer"));
      if (!L.length) k.append(el("p", { class: "feldhinweis" }, (texte && texte.length ?
        "Kein Wort aus deiner Liste gefunden. Gesucht wird nach festen Wörtern — das heißt nicht, dass nichts Wichtiges darin steht." :
        "Hier wurde kein Text gelesen — auf deine Liste ist nichts geprüft.")));
      else {
        var ul = el("ul", { class: "pr-prio-liste" });
        L.forEach(function (t) {
          ul.append(el("li", { "data-prio-gruppe": t.gruppe, "data-prio-stufe": t.stufe },
            [el("b", { "data-prio-wort": "" }, t.wort), " — ", el("b", null, t.gruppeName), " (" + t.stufe + "), ",
             el("span", { "data-prio-stelle": "" }, t.stelle), ". ", el("span", null, t.satz), " ",
             el("span", { "data-prio-empf": "" }, "Empfehlung: " + t.empfehlung)]));
        });
        k.append(ul);
      }
      k.append(el("p", { class: "feldhinweis" }, "Einstellen: „⭐ Was dir wichtig ist“ oben auf der Seite. Die Treffer stehen nicht im kopierten Bericht."));
    }
    var summe = ziel.querySelector(".pr-summe");
    if (summe) summe.after(k); else ziel.prepend(k);
    stufenMarken(ziel);
  }
  /* Karten des Prüfkerns (data-kennung) tragen die Stufe ihrer Gruppe. Der Befund selbst bleibt. */
  function stufenMarken(ziel) {
    var p = P(); if (!p) return;
    var s = stand();
    ziel.querySelectorAll(".pr-karte[data-kennung]").forEach(function (li) {
      if (li.hasAttribute("data-prio-stufe")) return;
      var x = p.stufeFuer(li.getAttribute("data-kennung"), s); if (!x) return;
      li.setAttribute("data-prio-stufe", x.stufe);
      li.append(el("p", { class: "feldhinweis", "data-prio-marke": "" }, "Prioritätenliste: " + x.gruppeName + " (" + x.stufe + ")"));
    });
  }

  /* Text aus einem Ergebnis von PrueferAnhang.pruefe, je Seite, wo es Seiten gibt. */
  function texteAusAnhang(name, r, vorsatz) {
    var aus = [{ text: name || "", stelle: (vorsatz || "") + "„" + name + "“ (Dateiname)" }];
    if (!r) return aus;
    var wo = (vorsatz || "") + "„" + name + "“";
    if (r.seiten && r.seiten.length) r.seiten.forEach(function (s) { if (s && s.text) aus.push({ text: s.text, stelle: wo + ", Seite " + s.seite }); });
    else if (r.text) aus.push({ text: r.text, stelle: wo });
    return aus;
  }

  function einstellungen() {
    var box = document.getElementById("prio-einst");
    if (!box || box.hasAttribute("data-prioritaeten")) return;
    var p = P();
    if (!p) { box.append(el("p", { class: "feldhinweis", "data-prio-fehlt": "" }, "Die Prioritätenliste (assets/prioritaeten.js) ist nicht geladen.")); return; }
    p.baueEinstellungen(box, SCHLUESSEL, function () { if (letzte && letzte.ziel.isConnected) kasten(letzte.ziel, letzte.texte); });
  }
  window.APPrio = { SCHLUESSEL: SCHLUESSEL, kasten: kasten, treffer: treffer, texteAusAnhang: texteAusAnhang, eingebaut: true };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", einstellungen);
  else einstellungen();
})();
