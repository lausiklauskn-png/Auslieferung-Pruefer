/* Auslieferungsprüfer — die Szenen des Handbuchs (Klaus 2026-10-02).
 *
 * Abgeleitet aus Sende-Pruefer/tools/handbuch-szenen.mjs: EINE Liste für
 * Handbuch UND Vorführung. Jede Szene hat Titel, Lesetext, Sprechtext (DE,
 * dazu sprechText.en und .ru), einen Aufbau im echten Browser und ein Ziel
 * für den Leuchtring. Die Bilder kommen aus den mitgelieferten, erfundenen
 * Testvorlagen (testvorlagen/, geladen über ?test=).
 *
 * ⚠ BENANNTE GRENZE: die Bilder zeigen die DEUTSCHE Oberfläche, auch in der
 * englischen und russischen Vorführung.
 *
 * Wer die Oberfläche oder einen Sprechtext ändert, baut das Handbuch neu
 * (node tools/handbuch-bauen.mjs) — ein geänderter Sprechtext braucht auch
 * eine neue Aufnahme (tools/handbuch-ton.mjs).
 */
const breit = { width: 1280, height: 800 };

/* Eine Testvorlage laden und warten, bis ein Befund dasteht (Bedingung, keine Uhr). */
async function vorlage(p, basis, name) {
  await p.goto(basis + "auslieferungspruefer.html?test=" + encodeURIComponent(name));
  await p.waitForFunction(() => !!document.querySelector("#ergebnis .pr-kennung"), null, { timeout: 180000 });
}

export const SZENEN = [
  {
    id: "seite", titel: "Die Seite öffnen",
    text: "Oben wählen Sie, was geprüft werden soll: eine <b>HTML-Seite</b>, eine <b>Textdatei</b>, ein <b>PDF</b>, eine <b>Adresse</b>, <b>E-Mails</b> oder <b>Foto · Datei</b>. Alles wird im Browser auf diesem Gerät gelesen. Nichts wird hochgeladen, nichts ausgeführt.",
    sprech: "Das ist der Auslieferungsprüfer. Oben wählen Sie, was geprüft werden soll: eine Seite, eine Datei, ein PDF oder eine Mail. Alles bleibt auf Ihrem Gerät.",
    sprechText: { en: "This is the Delivery Checker. At the top, choose what to check: a web page, a file, a PDF, or an email. Everything stays on your device.", ru: "Это проверка перед отправкой. Вверху выберите, что проверить: страницу, файл, PDF или письмо. Всё остаётся на вашем устройстве." },
    ansicht: breit, ziel: ".pr-waehler",
    aufbau: async () => {},
  },
  {
    id: "datei", titel: "Foto · Datei prüfen",
    text: "Unter <b>Foto · Datei prüfen</b> wählen Sie ein Bild, eine Word- oder Excel-Datei, ein ZIP oder ein PDF. Gelesen wird der Dateikopf, nicht nur der Name. Text in Bildern liest eine Texterkennung auf dem Gerät, auch blasse Schrift.",
    sprech: "Unter „Foto · Datei prüfen“ wählen Sie ein Bild, eine Word-Datei oder ein PDF. Der Prüfer liest, was wirklich drinsteht – auch Text im Bild.",
    sprechText: { en: "Under “Photo · File”, choose an image, a Word file, or a PDF. The checker reads what is really inside – including text in images.", ru: "В разделе «Фото · файл» выберите изображение, файл Word или PDF. Проверка читает, что на самом деле внутри, — даже текст на картинке." },
    ansicht: breit, ziel: "#feld-datei",
    aufbau: async (p) => { await p.click("#reiter-datei"); await p.waitForSelector("#feld-datei:not([hidden])"); },
  },
  {
    id: "pdf", titel: "Ein PDF mit verstecktem Text",
    text: "Ein PDF kann Text tragen, den man nicht sieht: weiß auf weiß oder winzig klein. Der Prüfer liest die Textebene und vergleicht sie mit dem, was auf der Seite zu sehen ist. Die Testvorlage <b>0D</b> zeigt es: <b>Was man sieht und was im Text steht, weicht ab</b>.",
    sprech: "Ein PDF kann Text enthalten, den man nicht sieht. Der Prüfer vergleicht, was im Text steht, mit dem, was auf der Seite zu sehen ist – und meldet die Abweichung.",
    sprechText: { en: "A PDF can contain text you cannot see. The checker compares the text layer with what is visible on the page – and reports the difference.", ru: "PDF может содержать текст, который не видно. Проверка сравнивает текстовый слой с тем, что видно на странице, и сообщает о расхождении." },
    ansicht: breit, ziel: '#ergebnis .pr-karte[data-kennung="PDF-VERSTECKTER-TEXT"]',
    aufbau: async (p, basis) => { await vorlage(p, basis, "Vorlage-0D-PDF-versteckter-Text.pdf"); },
  },
  {
    id: "mail", titel: "Eine E-Mail mit Anhängen",
    text: "Unter <b>E-Mails prüfen</b> legen Sie eine gespeicherte Mail (<b>.eml</b>) hinein. Geprüft werden Absender, Links und Anweisungen an eine KI — und jeder Anhang wird ausgepackt und wie eine eigene Datei geprüft. Die Testvorlage hier trägt alle Fälle in einer Mail.",
    sprech: "Eine gespeicherte Mail prüfen Sie unter „E-Mails prüfen“. Absender, Links und jeder Anhang werden gelesen – nichts wird geöffnet oder ausgeführt.",
    sprechText: { en: "To check a saved email, use “Check emails”. The sender, links, and every attachment are read – nothing is opened or run.", ru: "Сохранённое письмо проверяется в разделе «Проверить письма». Читаются отправитель, ссылки и каждое вложение — ничего не открывается и не запускается." },
    ansicht: breit, ziel: "#feld-mail",
    aufbau: async (p, basis) => { await vorlage(p, basis, "Vorlage-Alle-als-Mail.eml"); },
  },
  {
    id: "befund", titel: "Die Befundkarte",
    text: "Jeder Fund steht auf einer eigenen Karte: <b>was</b> gefunden wurde und <b>wo</b> — mit Zeile oder Seite. Die Zahlen oben sind Links und springen zur Karte. Diese Textdatei (<b>H6</b>) trägt eine <b>Anweisung an eine KI</b> in Zeile 5.",
    sprech: "Jeder Fund steht auf einer eigenen Karte: was gefunden wurde, und wo – mit Zeile oder Seite. Die Zahlen oben springen direkt zur Stelle.",
    sprechText: { en: "Each finding has its own card: what was found, and where – with the line or page. The numbers at the top jump straight to it.", ru: "Каждая находка — на отдельной карточке: что найдено и где — с номером строки или страницы. Числа вверху сразу ведут к нужному месту." },
    ansicht: breit, ziel: "#ergebnis .pr-karte",
    aufbau: async (p, basis) => { await vorlage(p, basis, "Vorlage-H6-Text-mit-KI-Anweisung.txt"); },
  },
  {
    id: "was-tun", titel: "Was jetzt tun",
    text: "Unter einer Anweisung oder einem Verdacht stehen ruhige Schritte: zuerst <b>ruhig bleiben</b>, dann beim Absender <b>auf einem anderen Weg nachfragen</b>. Die Datei nicht an eine KI geben, bevor die Frage geklärt ist.",
    sprech: "Bei einem ernsten Fund sagt der Prüfer, was jetzt zu tun ist: ruhig bleiben, beim Absender auf einem anderen Weg nachfragen und die Datei erst dann weitergeben.",
    sprechText: { en: "For a serious finding, the checker tells you what to do next: stay calm, ask the sender through another channel, and only then pass the file on.", ru: "При серьёзной находке проверка подсказывает, что делать: сохранять спокойствие, уточнить у отправителя другим способом и только потом передавать файл дальше." },
    ansicht: breit, ziel: "#ergebnis [data-was-tun]",
    aufbau: async (p, basis) => { await vorlage(p, basis, "Vorlage-H6-Text-mit-KI-Anweisung.txt"); },
  },
  {
    id: "verdacht", titel: "Bildpunkte auf Verdacht prüfen",
    text: "Eine Botschaft kann in den untersten Bits der Farben stecken; das Auge sieht sie nicht. <b>🔍 Bildpunkte auf Verdacht prüfen</b> läuft nur auf Tipp. Das Ergebnis heißt <b>Verdacht</b>, nie „gefunden“ — und die Stelle wird im Bild markiert.",
    sprech: "In einem Bild kann eine Botschaft versteckt sein, die man nicht sieht. Ein Tipp auf „Bildpunkte auf Verdacht prüfen“ sucht danach – und das Ergebnis heißt ehrlich: Verdacht.",
    sprechText: { en: "An image can hide a message you cannot see. Tap “Check pixels for suspicion” to look for it – and the result is honestly called a suspicion.", ru: "В изображении может быть спрятано невидимое сообщение. Нажмите «Проверить пиксели на подозрение» — и результат честно называется подозрением." },
    ansicht: breit, ziel: "#ergebnis [data-verdacht]",
    aufbau: async (p, basis) => {
      await vorlage(p, basis, "Vorlage-4C-Bild-mit-versteckter-Botschaft.png");
      await p.waitForSelector("#ergebnis [data-verdacht-knopf]:not([disabled])", { timeout: 60000 });
      await p.click("#ergebnis [data-verdacht-knopf]");
      await p.waitForSelector("#ergebnis [data-verdacht]", { timeout: 60000 });
    },
  },
  {
    id: "testvorlagen", titel: "Testvorlagen zum Ausprobieren",
    text: "Unter <b>🧪 Testvorlagen zum Ausprobieren</b> liegen präparierte Dateien, alle erfunden. Ein Tipp lädt sie direkt in den Prüfer. Ein Befund ist hier das Soll; <b>H0</b> und das zweite <b>4C</b>-Bild sind die Gegenprobe ohne Befund.",
    sprech: "Zum Ausprobieren liegen Testvorlagen bereit, alle erfunden. Ein Tipp lädt sie direkt in den Prüfer – so sehen Sie, was er findet, bevor Sie eigene Dateien prüfen.",
    sprechText: { en: "Test files are ready to try, all made up. One tap loads them into the checker – so you see what it finds before you check your own files.", ru: "Для пробы есть тестовые файлы, все вымышленные. Одно нажатие загружает их в проверку — так вы увидите, что она находит, ещё до проверки своих файлов." },
    ansicht: breit, ziel: "[data-testliste]",
    aufbau: async (p) => { await p.click("[data-testliste] summary"); await p.waitForSelector("[data-testliste][open]"); },
  },
];
