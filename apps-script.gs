// АгроТермінал - збереження анонімних відповідей у Google Таблицю
// 1. Створіть Google Таблицю -> Розширення -> Apps Script, вставте цей код.
// 2. Змініть KEY на власне секретне слово (потрібне лише для перегляду відповідей у панелі викладача).
// 3. Розгорнути -> Нове розгортання -> Тип: Веб-застосунок; Виконувати від: Я; Доступ: Усі.
// 4. Скопіюйте URL веб-застосунку і вставте його в index.html у рядок const ENDPOINT = "...".
const KEY = 'zmini-mene';
const COLS = ['час','код','група','етап','мотиваційний','когнітивний','діяльнісний','рефлексивний','разом','ситуації (1 - правильно)','самооцінка','знання (1 - правильно)','ставлення','хвилин'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName('Відповіді') || ss.insertSheet('Відповіді');
  if (sh.getLastRow() === 0) sh.appendRow(COLS);
  return sh;
}
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  sheet_().appendRow([new Date(), d.id, d.g, d.e, d.M, d.C, d.D, d.R, d.T,
    JSON.stringify(d.k), JSON.stringify(d.s), JSON.stringify(d.q), JSON.stringify(d.mt), d.min]);
  return ContentService.createTextOutput('ok');
}
function doGet(e) {
  if ((e.parameter.key || '') !== KEY) return json_({ error: 'key' });
  const v = sheet_().getDataRange().getValues().slice(1);
  const rows = v.map(r => ({ id: r[1], g: String(r[2]), e: r[3], M: +r[4], C: +r[5], D: +r[6], R: +r[7], T: +r[8],
    k: JSON.parse(r[9] || '[]'), s: JSON.parse(r[10] || '[]'), q: JSON.parse(r[11] || '[]'), mt: JSON.parse(r[12] || '[]'), min: r[13] }));
  return json_({ rows });
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
