/* Auslieferungsprüfer — Service-Worker (offline-fähig).
 *
 * Gebaut nach dem Muster aus PWA Toolpoint (sw.js), samt seinen Lehren:
 *   - Promise.allSettled: eine fehlende Datei kippt die Installation nicht.
 *   - cache:"reload": holt am HTTP-Cache vorbei, sonst landet eine ALTE Datei
 *     im frischen Speicher.
 *   - Seitenaufrufe und die Konfiguration ZUERST aus dem Netz, Speicher als
 *     Rückfall — online immer der neueste Stand, offline geht es trotzdem.
 *   - FREMDE Adressen werden nicht abgefangen.
 *   - Die SBKIM-Module stehen NICHT im Vorrat: sie landen beim ersten Abruf
 *     über den fetch-Zweig darin, ohne mit dem ersten Bild um die Leitung zu
 *     konkurrieren.
 *
 * CACHE-BUST: bei jeder Änderung an einer Datei aus CORE die CACHE_VERSION
 * erhöhen — und die ?v=-Angaben in der Seite mitziehen.
 */
var CACHE_VERSION = "auslieferung-pruefer-v5";

var CORE = [
  "./",
  "index.html",
  "auslieferungspruefer.html",
  "impressum.html",
  "datenschutz.html",
  "manifest.json",
  "assets/style.css?v=80",
  "assets/marke.svg",
  "assets/thema.js?v=80",
  "assets/sprache.js?v=80",
  "assets/i18n-pruefer.js?v=80",
  "assets/i18n-recht.js?v=80",
  "assets/config/netz.js?v=80",
  "assets/config/pruefer-netz.js?v=80",
  "assets/pruefer.js?v=80",
  "assets/pruefer-formate.js?v=80",
  "assets/pruefer-anhang.js?v=80",
  "assets/pruefer-browser.js?v=80",
  "assets/pruefer-mail.js?v=80",
  "assets/pruefer-ui.js?v=80",
  "assets/pruefer-sbkim-init.js?v=80",
  "assets/icon-192.png",
  "assets/icon-512.png"
];

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_VERSION).then(function (c) {
    return Promise.allSettled(CORE.map(function (u) {
      return c.add(new Request(u, { cache: "reload" }));
    }));
  }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE_VERSION; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

function ablegen(req, res) {
  if (res && res.ok && res.type === "basic") {
    var clone = res.clone();
    caches.open(CACHE_VERSION).then(function (c) { c.put(req, clone); }).catch(function () {});
  }
  return res;
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url;
  try { url = new URL(req.url); } catch (_e) { return; }
  if (url.origin !== self.location.origin) return;   // Fremd-Adressen durchreichen

  var frischZuerst = req.mode === "navigate" || /\/assets\/config\/[^/]+\.(js|json)$/.test(url.pathname)
    || /\.json$/.test(url.pathname);
  if (frischZuerst) {
    e.respondWith(
      fetch(req).then(function (res) { return ablegen(req, res); })
                .catch(function () {
                  return caches.match(req).then(function (r) {
                    return r || (req.mode === "navigate" ? caches.match("auslieferungspruefer.html") : undefined);
                  });
                })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(function (r) {
      return r || fetch(req).then(function (res) { return ablegen(req, res); });
    })
  );
});
