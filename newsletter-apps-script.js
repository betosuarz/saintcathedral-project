// ================================================================
// NEWSLETTER — Google Apps Script
// Catedral de Santo Domingo de la Calzada
//
// INSTRUCCIONES DE USO:
// 1. Abre script.google.com y crea un nuevo proyecto
// 2. Pega este código completo
// 3. Ejecuta setupSheet() una sola vez para preparar la hoja
// 4. Ejecuta createWeeklyTrigger() una sola vez para el envío automático
// 5. Despliega como Web App: Ejecutar como "Yo", Acceso "Cualquiera"
// 6. Copia la URL del Web App y pégala en shared.js (NEWSLETTER_SCRIPT_URL)
// ================================================================

const SHEET_NAME    = 'Suscriptores';
const FOLDER_NAME   = 'Newsletter';
const FROM_EMAIL    = 'info@catedralsantodomingo.org'; // debe ser alias en tu Gmail
const FROM_NAME     = 'Catedral Santo Domingo de la Calzada';
const EMAIL_SUBJECT = 'Newsletter semanal — Catedral de Santo Domingo de la Calzada';

// ── RECIBIR SUSCRIPCIÓN DESDE EL FORMULARIO WEB ─────────────────
function doPost(e) {
  try {
    const data  = JSON.parse(e.postData.contents);
    const email = (data.email || '').trim().toLowerCase();

    if (!isValidEmail(email)) {
      return jsonResponse({ ok: false, error: 'Email inválido' });
    }

    const sheet   = getSheet();
    const lastRow = sheet.getLastRow();

    // Comprobar si ya existe
    if (lastRow >= 2) {
      const existing = sheet.getRange(2, 1, lastRow - 1, 1).getValues()
                            .flat().map(v => String(v).toLowerCase());
      if (existing.includes(email)) {
        return jsonResponse({ ok: true, alreadySubscribed: true });
      }
    }

    // Añadir suscriptor nuevo
    sheet.appendRow([email, new Date(), false]);
    sheet.getRange(sheet.getLastRow(), 3).insertCheckboxes();

    return jsonResponse({ ok: true });

  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ── ENVÍO AUTOMÁTICO SEMANAL ─────────────────────────────────────
function sendWeeklyNewsletter() {
  const latestFile = getLatestNewsletter();
  if (!latestFile) return;

  const fileName = latestFile.getName();
  const pdfBlob  = latestFile.getAs('application/pdf');
  pdfBlob.setName(fileName.endsWith('.pdf') ? fileName : fileName + '.pdf');

  const sheet   = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) { Logger.log('Sin suscriptores.'); return; }

  const rows = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
  let sent = 0;

  rows.forEach(row => {
    const email     = String(row[0]).trim();
    const cancelado = row[2]; // checkbox: true = cancelado
    if (!email || cancelado) return;

    GmailApp.sendEmail(email, EMAIL_SUBJECT, bodyText(), {
      from:        FROM_EMAIL,
      name:        FROM_NAME,
      htmlBody:    bodyHtml(),
      attachments: [pdfBlob]
    });
    sent++;
  });

  Logger.log(`Newsletter enviada a ${sent} suscriptores. Archivo: ${fileName}`);
}

// ── CONFIGURAR TRIGGER SEMANAL (ejecutar una sola vez) ───────────
function createWeeklyTrigger() {
  // Eliminar duplicados
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'sendWeeklyNewsletter') {
      ScriptApp.deleteTrigger(t);
    }
  });

  // Domingos a las 12:00 (ajusta la zona horaria del script a Europe/Madrid)
  ScriptApp.newTrigger('sendWeeklyNewsletter')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.SUNDAY)
    .atHour(12)
    .nearMinute(0)
    .create();

  Logger.log('Trigger creado: domingos a las 12:00 hora del script.');
}

// ── CONFIGURAR HOJA (ejecutar una sola vez) ──────────────────────
function setupSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  sheet.getRange(1, 1, 1, 3).setValues([['Email', 'Fecha suscripción', 'Cancelar']]);
  sheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#f3e9d2');
  sheet.setColumnWidth(1, 260);
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(3, 90);

  Logger.log('Hoja "Suscriptores" configurada.');
}

// ── UTILIDADES ───────────────────────────────────────────────────
function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
}

function getLatestNewsletter() {
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (!folders.hasNext()) {
    Logger.log(`Carpeta "${FOLDER_NAME}" no encontrada en Drive.`);
    return null;
  }

  const folder = folders.next();
  const files  = folder.getFilesByType('application/pdf');
  let latest = null, latestDate = new Date(0);

  while (files.hasNext()) {
    const file    = files.next();
    const created = file.getDateCreated();
    if (created > latestDate) { latestDate = created; latest = file; }
  }

  if (!latest) Logger.log('No hay archivos en la carpeta Newsletter.');
  return latest;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function bodyText() {
  return [
    'Hola,',
    '',
    'Te enviamos la newsletter de esta semana de la Catedral de Santo Domingo de la Calzada.',
    'Encuéntrala adjunta en este correo.',
    '',
    'Si deseas cancelar tu suscripción, responde a este correo indicándolo.',
    '',
    'Un saludo,',
    'Catedral de Santo Domingo de la Calzada'
  ].join('\n');
}

function bodyHtml() {
  return `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#2a2118;">
    <div style="background:#1a1208;padding:28px 32px;text-align:center;">
      <p style="color:#c9a84c;letter-spacing:3px;font-size:11px;margin:0 0 6px;">CATEDRAL DE SANTO DOMINGO DE LA CALZADA</p>
      <h1 style="color:#f5efe6;font-size:22px;margin:0;font-weight:normal;">Newsletter semanal</h1>
    </div>
    <div style="padding:32px;background:#faf7f2;border:1px solid #e8ddc8;">
      <p style="margin:0 0 16px;">Hola,</p>
      <p style="margin:0 0 16px;">Te enviamos la newsletter de esta semana. Encuéntrala <strong>adjunta en este correo</strong>.</p>
      <p style="margin:0 0 24px;color:#7a6a55;font-size:13px;">Si deseas cancelar tu suscripción, responde a este correo indicándolo.</p>
      <hr style="border:none;border-top:1px solid #e8ddc8;margin:24px 0;">
      <p style="margin:0;font-size:12px;color:#a08060;text-align:center;">Catedral de Santo Domingo de la Calzada · La Rioja, España</p>
    </div>
  </div>`;
}
