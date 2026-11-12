// АгроПульс - збереження анонімних відповідей у Google Таблицю
// 1. Створіть Google Таблицю -> Розширення -> Apps Script, вставте цей код.
// 2. Змініть KEY на власний пароль (потрібен лише для перегляду результатів на сторінці сайту #results).
// 3. Розгорнути -> Нове розгортання -> Тип: Веб-застосунок; Виконувати від: Я; Доступ: Усі.
// 4. Скопіюйте URL веб-застосунку (закінчується на /exec) і вставте його в index.html у рядок const ENDPOINT = "...".
const KEY = 'zmini-mene';
const COLS = ['час','код','група','етап','вік','стать','мотиваційний','когнітивний','діяльнісний','рефлексивний','разом','відповіді','хвилин'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName('Відповіді') || ss.insertSheet('Відповіді');
  if (sh.getLastRow() === 0) sh.appendRow(COLS);
  return sh;
}
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  sheet_().appendRow([new Date(), d.id, d.g, d.e, d.age, d.sex, d.M, d.C, d.D, d.R, d.T, JSON.stringify(d.a), d.min]);
  return ContentService.createTextOutput('ok');
}
function doGet(e) {
  if ((e.parameter.key || '') !== KEY) return json_({ error: 'key' });
  const v = sheet_().getDataRange().getValues().slice(1);
  const rows = v.map(r => ({ id: r[1], g: String(r[2]), e: r[3], age: String(r[4]), sex: r[5], M: +r[6], C: +r[7], D: +r[8], R: +r[9], T: +r[10],
    a: JSON.parse(r[11] || '{}'), min: r[12] }));
  return json_({ rows });
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
