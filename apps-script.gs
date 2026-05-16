/**
 * HOUSEBOAT JOURNAL — Google Apps Script backend
 *
 * Setup:
 *  1. Open a new Google Sheet.
 *  2. Extensions → Apps Script. Replace the default code with this file.
 *  3. Save. Deploy → New deployment → Type: Web app.
 *     Execute as: Me
 *     Who has access: Anyone
 *  4. Copy the Web app URL into config.js -> JOURNAL_CONFIG.scriptUrl
 *
 * Storage model:
 *  One sheet per section. Each row is one entry. Column A holds the entry id,
 *  Column B holds the entry date (ISO), Column C holds the entry JSON.
 *  Photos are stored as base64 inline in the JSON. That's fine for personal use
 *  but Sheets cells max out at 50,000 chars; the client already resizes images
 *  down to ~500px / ~70% jpeg quality which keeps each photo well under that.
 */

const SECTIONS = [
  'vomit', 'freeloaders', 'fiveyear', 'wants',
  'bosses', 'puppets', 'bias', 'biology', 'compassion'
];

function doGet(e) {
  const section = (e.parameter.section || '').toString();
  if (!SECTIONS.includes(section)) {
    return jsonOut({ error: 'unknown section', entries: [] });
  }
  const sheet = getOrCreateSheet(section);
  const data = sheet.getDataRange().getValues();
  const entries = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row[2]) continue;
    try {
      entries.push(JSON.parse(row[2]));
    } catch (err) {
      // skip malformed row
    }
  }
  // newest first by date if present
  entries.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return jsonOut({ entries });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const section = body.section;
    if (!SECTIONS.includes(section)) {
      return jsonOut({ error: 'unknown section' });
    }
    if (body.action === 'save') {
      const sheet = getOrCreateSheet(section);
      sheet.clear();
      const entries = body.entries || [];
      const rows = entries.map(en => [en.id || '', en.date || '', JSON.stringify(en)]);
      if (rows.length) {
        sheet.getRange(1, 1, rows.length, 3).setValues(rows);
      }
      return jsonOut({ ok: true, count: rows.length });
    }
    return jsonOut({ error: 'unknown action' });
  } catch (err) {
    return jsonOut({ error: String(err) });
  }
}

function getOrCreateSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  return sheet;
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
