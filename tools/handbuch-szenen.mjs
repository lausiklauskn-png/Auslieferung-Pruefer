/* Auslieferungsprüfer — die Szenen des Handbuchs (Klaus 2026-10-02: „eigenes
 * Handbuch … eigene Seite wie im Sende-Prüfer“).
 *
 * EINE Liste für Handbuch UND späteres Video: jede Szene hat einen Titel, einen
 * Lesetext, einen SPRECHTEXT (kurz, gesprochen, fürs Video und „▶ Vorführen“,
 * dazu Englisch und Russisch), einen Aufbau im echten Browser und ein Ziel, um
 * das der Leuchtring gelegt wird. Alle Dateien sind die erfundenen Testvorlagen
 * aus testvorlagen/ — keine echten Angaben.
 *
 * ⚠ Die Bilder zeigen die DEUTSCHE Oberfläche, auch beim Vorführen auf
 * Englisch oder Russisch (benannte Grenze, wie im Sende-Prüfer).
 *
 * Wer die Oberfläche oder einen Sprechtext ändert, baut neu
 * (node tools/handbuch-bauen.mjs). Ein geänderter Sprechtext passt nicht mehr
 * zur Aufnahme — neu aufnehmen, neu schneiden (tools/handbuch-ton.mjs).
 */
const breit = { width: 1280, height: 800 };
const handy = { width: 390, height: 844 };

const test = (datei) => "auslieferungspruefer.html?test=" + encodeURIComponent(datei);
const frist = { timeout: 180000 };
async function fertig(p, kennung) {
  await p.waitForSelector(`#ergebnis [data-kennung="${kennung}"]`, frist);
}

export const SZENEN = [
  {
    id: "seite", titel: "Die Seite öffnen",
    text: "Oben wählen Sie, was geprüft wird: eine <b>HTML-Seite</b>, ein <b>Text</b>, ein <b>PDF</b>, eine <b>Adresse</b>, eine <b>Mail</b> oder ein <b>Foto · eine Datei</b>. Alles läuft in diesem Browser. Nichts wird hochgeladen, nichts wird ausgeführt.",
    sprech: "Das ist der Auslieferungsprüfer. Oben wählen Sie, was Sie prüfen wollen: eine Seite, einen Text, ein PDF, eine Mail oder ein Foto. Alles bleibt in Ihrem Browser.",
    sprechText: {
      en: "This is the delivery checker. At the top you choose what to check: a page, a text, a PDF, an email or a photo. Everything stays in your browser.",
      ru: "Это проверка перед отправкой. Вверху вы выбираете, что проверить: страницу, текст, PDF, письмо или фото. Всё остаётся в вашем браузере.",
    },
    ansicht: breit, ziel: ".pr-waehler",
    aufbau: async () => {},
  },
  {
    id: "foto", titel: "Ein Foto prüfen",
    seite: test("Vorlage-1A-Bild-mit-Text.png"),
    text: "Im Reiter <b>Foto · Datei prüfen</b> wählen Sie ein Bild. Der Prüfer liest den Text darin auf dem Gerät und meldet, was er findet: hier eine <b>Anweisung an eine KI</b>, eine Mailadresse und eine IBAN. Oben steht die Zusammenfassung; jede Zahl springt zu ihrer Karte.",
    sprech: "Ein Foto mit Text. Der Prüfer liest es auf dem Gerät und findet eine versteckte Anweisung an eine KI, dazu eine Mailadresse und eine Kontonummer. Jede Zahl oben springt zur passenden Stelle.",
    sprechText: {
      en: "A photo with text. The checker reads it on the device and finds a hidden instruction to an AI, plus an email address and an account number. Each number at the top jumps to its place.",
      ru: "Фото с текстом. Программа читает его прямо на устройстве и находит скрытую инструкцию для ИИ, а также адрес почты и номер счёта. Каждое число вверху ведёт к нужному месту.",
    },
    ansicht: breit, ziel: "#ergebnis .pr-summe",
    aufbau: async (p) => { await fertig(p, "BILD-KI-ANWEISUNG"); },
  },
  {
    id: "pdf", titel: "Ein PDF mit verstecktem Text",
    seite: test("Vorlage-0D-PDF-versteckter-Text.pdf"),
    text: "Bei einem PDF liest der Prüfer die Textebene und vergleicht sie mit dem, was auf der Seite zu <b>sehen</b> ist. Steht Text darin, den man nicht sieht — winzig, weiß auf weiß —, meldet er: <b>Was man sieht und was im Text steht, weicht ab</b>, mit Seite und Wörtern.",
    sprech: "Ein PDF. Der Prüfer vergleicht den Text in der Datei mit dem, was man auf der Seite sieht. Hier steht unsichtbarer Text darin – weiß auf weiß. Er nennt die Seite und die Wörter.",
    sprechText: {
      en: "A PDF. The checker compares the text inside the file with what you can see on the page. Here there is invisible text – white on white. It names the page and the words.",
      ru: "PDF-файл. Программа сравнивает текст в файле с тем, что видно на странице. Здесь есть невидимый текст – белым по белому. Она называет страницу и слова.",
    },
    ansicht: breit, ziel: '#ergebnis [data-kennung="PDF-VERSTECKTER-TEXT"]',
    aufbau: async (p) => { await fertig(p, "PDF-VERSTECKTER-TEXT"); },
  },
  {
    id: "mail", titel: "Eine Mail mit Anhängen",
    seite: test("Vorlage-Alle-als-Mail.eml"),
    text: "Eine gespeicherte Mail (<b>.eml</b>) prüft der Prüfer samt Anhängen. Jeder Anhang wird geöffnet und gelesen, nie ausgeführt. Befunde aus einem Anhang tragen seinen Namen.",
    sprech: "Eine gespeicherte Mail. Der Prüfer öffnet jeden Anhang und liest ihn – ausgeführt wird nichts. Bei jedem Fund steht, aus welchem Anhang er kommt.",
    sprechText: {
      en: "A saved email. The checker opens every attachment and reads it – nothing is run. Each finding says which attachment it comes from.",
      ru: "Сохранённое письмо. Программа открывает каждое вложение и читает его – ничего не запускается. У каждой находки указано, из какого вложения она.",
    },
    ansicht: breit, ziel: "#ergebnis .pr-summe",
    aufbau: async (p) => {
      await p.waitForSelector("#ergebnis .pr-summe", frist);
      await p.waitForFunction(() => /Anhang/.test(document.querySelector("#ergebnis")?.textContent || ""), null, frist);
      await p.waitForTimeout(4000); // Anhänge laufen nach; nur fürs Foto
    },
  },
  {
    id: "karte", titel: "Eine Befundkarte lesen",
    seite: test("Vorlage-1A-Bild-mit-Text.png"),
    text: "Jede Karte nennt die <b>Art</b> des Fundes, die <b>Stelle</b> (Zeile, Seite, Anhang) und den Satz, um den es geht. Bei Bildern liegt eine <b>markierte Kopie</b> dabei: die Stelle ist rot umrandet.",
    sprech: "Jede Karte sagt, was gefunden wurde und wo: Zeile, Seite oder Anhang. Bei einem Bild ist die Stelle rot markiert, und die markierte Kopie lässt sich speichern.",
    sprechText: {
      en: "Each card says what was found and where: line, page or attachment. In a picture the spot is marked in red, and you can save the marked copy.",
      ru: "Каждая карточка говорит, что найдено и где: строка, страница или вложение. На картинке это место обведено красным, и отмеченную копию можно сохранить.",
    },
    ansicht: breit, ziel: '#ergebnis [data-kennung="BILD-KI-ANWEISUNG"]',
    aufbau: async (p) => { await fertig(p, "BILD-KI-ANWEISUNG"); },
  },
  {
    id: "was-tun", titel: "Was jetzt tun",
    seite: test("Vorlage-1A-Bild-mit-Text.png"),
    text: "Unter einer Anweisung an eine KI oder einem Verdacht steht <b>Was jetzt tun</b>: ruhige Schritte, zuerst „Ruhig bleiben“, dann beim Absender auf einem anderen Weg nachfragen. So sieht es am Handy aus.",
    sprech: "Unter jedem ernsten Fund steht, was jetzt zu tun ist. Zuerst: ruhig bleiben. Dann beim Absender nachfragen – auf einem anderen Weg als dem, auf dem die Datei kam.",
    sprechText: {
      en: "Under every serious finding it says what to do now. First: stay calm. Then ask the sender – by another route than the one the file came by.",
      ru: "Под каждой серьёзной находкой написано, что делать дальше. Сначала: сохраняйте спокойствие. Потом спросите отправителя – другим путём, не тем, которым пришёл файл.",
    },
    ansicht: handy, ziel: "#ergebnis [data-was-tun]",
    aufbau: async (p) => { await fertig(p, "BILD-KI-ANWEISUNG"); },
  },
  {
    id: "verdacht", titel: "Bildpunkte auf Verdacht prüfen",
    seite: test("Vorlage-4C-Bild-mit-versteckter-Botschaft.png"),
    text: "Eine Botschaft kann in den untersten Bits der Farben stecken; das Auge sieht sie nicht. Erst auf den Knopf <b>🔍 Bildpunkte auf Verdacht prüfen</b> sucht der Prüfer danach. Das Ergebnis heißt <b>Verdacht</b>, nie „gefunden“. Bei JPEG-Fotos steht „nicht geprüft“ mit Grund.",
    sprech: "Manche Bilder tragen eine Botschaft in den Bildpunkten, unsichtbar fürs Auge. Erst wenn Sie diesen Knopf drücken, sucht der Prüfer danach. Was er findet, heißt Verdacht – mit dem versteckten Satz.",
    sprechText: {
      en: "Some pictures carry a message inside their pixels, invisible to the eye. Only when you press this button does the checker look for it. What it finds is called a suspicion – shown with the hidden sentence.",
      ru: "Некоторые картинки несут сообщение в пикселях, невидимое глазу. Только когда вы нажмёте эту кнопку, программа начнёт искать. Найденное называется подозрением – вместе со скрытой фразой.",
    },
    ansicht: breit, ziel: '#ergebnis [data-verdacht="ja"]',
    aufbau: async (p) => {
      await p.waitForSelector("#ergebnis [data-verdacht-knopf]", frist);
      await p.waitForFunction(() => { const k = document.querySelector("#ergebnis [data-verdacht-knopf]"); return k && !k.disabled; }, null, frist);
      await p.click("#ergebnis [data-verdacht-knopf]");
      await p.waitForSelector('#ergebnis [data-verdacht="ja"]', frist);
    },
  },
  {
    id: "testvorlagen", titel: "Testvorlagen zum Ausprobieren",
    text: "Über den Reitern steht <b>🧪 Testvorlagen zum Ausprobieren</b>. Aufgeklappt zeigt es erfundene Dateien: Bilder, PDFs, eine Mail, Word, Text. Ein Tipp lädt die Vorlage direkt in den Prüfer. Ein Befund ist dort das Soll.",
    sprech: "Zum Ausprobieren gibt es Testvorlagen. Ein Tipp lädt die Datei direkt in den Prüfer. Alles darin ist erfunden – und ein Fund ist hier genau richtig.",
    sprechText: {
      en: "To try it out, there are test files. One tap loads a file straight into the checker. Everything in them is made up – and a finding here is exactly right.",
      ru: "Для пробы есть тестовые файлы. Одно касание загружает файл прямо в программу. Всё в них выдумано – и находка здесь как раз то, что нужно.",
    },
    ansicht: breit, ziel: "details[data-testliste]",
    aufbau: async (p) => { await p.click("details[data-testliste] > summary"); },
  },
];
