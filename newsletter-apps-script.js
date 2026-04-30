// ================================================================
// NEWSLETTER — Google Apps Script
// Catedral de Santo Domingo de la Calzada
//
// INSTRUCCIONES DE USO:
// 1. Desde Google Sheets → Extensiones → Apps Script, pega este código
// 2. Ejecuta setupSheet() una sola vez para preparar la hoja
// 3. Ejecuta createWeeklyTrigger() una sola vez para el envío automático
// 4. Ejecuta createOnEditTrigger() una sola vez para detectar cancelaciones manuales
// 5. Despliega como Web App: Ejecutar como "Yo", Acceso "Cualquiera"
// 6. Copia la URL del Web App y pégala en shared.js (NEWSLETTER_SCRIPT_URL)
// ================================================================

const SHEET_NAME    = 'Suscriptores';
const FOLDER_NAME   = 'Newsletter';
const FROM_EMAIL    = 'info@catedralsantodomingo.org'; // alias configurado en Gmail
const FROM_NAME     = 'Catedral Santo Domingo de la Calzada';
const EMAIL_SUBJECT = 'Newsletter semanal — Catedral de Santo Domingo de la Calzada';

// Columnas de la hoja
const COL_EMAIL    = 1;
const COL_FECHA    = 2;
const COL_CANCELAR = 3;
const COL_BAJA     = 4;
const COL_ESTADO   = 5;

// ── ENDPOINT PRINCIPAL ───────────────────────────────────────────
function doGet(e) {
  const action = (e.parameter.action || '').toLowerCase();

  if (action === 'subscribe')   return handleSubscribe(e);
  if (action === 'unsubscribe') return handleUnsubscribe(e);

  return jsonResponse({ ok: false, error: 'Acción no reconocida' });
}

// ── SUSCRIPCIÓN (desde formulario web) ──────────────────────────
function handleSubscribe(e) {
  const email = (e.parameter.email || '').trim().toLowerCase();
  if (!isValidEmail(email)) return jsonResponse({ ok: false, error: 'Email inválido' });

  const sheet   = getSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow >= 2) {
    const rows = sheet.getRange(2, COL_EMAIL, lastRow - 1, COL_ESTADO).getValues();
    for (let i = 0; i < rows.length; i++) {
      if (String(rows[i][COL_EMAIL - 1]).toLowerCase() === email) {
        const cancelado = rows[i][COL_CANCELAR - 1];
        if (!cancelado) return jsonResponse({ ok: true, alreadySubscribed: true });

        // Estaba cancelado — reactivar
        const row = i + 2;
        sheet.getRange(row, COL_CANCELAR).setValue(false);
        sheet.getRange(row, COL_BAJA).setValue('');
        sheet.getRange(row, COL_ESTADO).setValue('✔️ Activo');
        sendWelcomeEmail(email);
        return jsonResponse({ ok: true });
      }
    }
  }

  // Suscriptor nuevo
  sheet.appendRow([email, new Date(), false, '', '✔️ Activo']);
  sheet.getRange(sheet.getLastRow(), COL_CANCELAR).insertCheckboxes();
  sendWelcomeEmail(email);
  return jsonResponse({ ok: true });
}

// ── BAJA VÍA ENLACE DEL CORREO ──────────────────────────────────
function handleUnsubscribe(e) {
  const email = (e.parameter.email || '').trim().toLowerCase();

  if (!isValidEmail(email)) {
    return HtmlService.createHtmlOutput(unsubscribePageHtml('error'));
  }

  const sheet   = getSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow >= 2) {
    const rows = sheet.getRange(2, COL_EMAIL, lastRow - 1, COL_ESTADO).getValues();
    for (let i = 0; i < rows.length; i++) {
      if (String(rows[i][COL_EMAIL - 1]).toLowerCase() === email) {
        const cancelado = rows[i][COL_CANCELAR - 1];

        if (cancelado) {
          return HtmlService.createHtmlOutput(unsubscribePageHtml('already'));
        }

        const row = i + 2;
        sheet.getRange(row, COL_CANCELAR).setValue(true);
        sheet.getRange(row, COL_BAJA).setValue(new Date());
        sheet.getRange(row, COL_ESTADO).setValue('❌ Cancelado');
        sendCancellationEmail(email);
        return HtmlService.createHtmlOutput(unsubscribePageHtml('success'));
      }
    }
  }

  return HtmlService.createHtmlOutput(unsubscribePageHtml('notfound'));
}

// ── DETECTAR CANCELACIÓN MANUAL EN EL SHEET ─────────────────────
function onCancelEdit(e) {
  const sheet = e.source.getSheetByName(SHEET_NAME);
  if (!sheet || e.range.getSheet().getName() !== SHEET_NAME) return;

  const row = e.range.getRow();
  const col = e.range.getColumn();
  if (col !== COL_CANCELAR || row < 2) return;

  const cancelado = e.range.getValue();
  const email     = sheet.getRange(row, COL_EMAIL).getValue();
  const estado    = sheet.getRange(row, COL_ESTADO).getValue();
  if (!email) return;

  if (cancelado === true && estado !== '❌ Cancelado') {
    sheet.getRange(row, COL_BAJA).setValue(new Date());
    sheet.getRange(row, COL_ESTADO).setValue('❌ Cancelado');
    sendCancellationEmail(email);
  } else if (cancelado === false) {
    sheet.getRange(row, COL_BAJA).setValue('');
    sheet.getRange(row, COL_ESTADO).setValue('✔️ Activo');
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

  const rows = sheet.getRange(2, 1, lastRow - 1, COL_CANCELAR).getValues();
  let sent = 0;

  rows.forEach(row => {
    const email     = String(row[COL_EMAIL - 1]).trim();
    const cancelado = row[COL_CANCELAR - 1];
    if (!email || cancelado) return;

    GmailApp.sendEmail(email, EMAIL_SUBJECT, newsletterBodyText(), {
      from:        FROM_EMAIL,
      name:        FROM_NAME,
      htmlBody:    newsletterBodyHtml(email),
      attachments: [pdfBlob]
    });
    sent++;
  });

  Logger.log(`Newsletter enviada a ${sent} suscriptores. Archivo: ${fileName}`);
}

// ── ENVÍO DE CORREOS ─────────────────────────────────────────────
function sendWelcomeEmail(email) {
  GmailApp.sendEmail(email, '¡Bienvenido/a a la newsletter de la Catedral!', welcomeBodyText(), {
    from:     FROM_EMAIL,
    name:     FROM_NAME,
    htmlBody: welcomeBodyHtml(email)
  });
}

function sendCancellationEmail(email) {
  GmailApp.sendEmail(email, 'Tu suscripción ha sido cancelada', cancellationBodyText(), {
    from:     FROM_EMAIL,
    name:     FROM_NAME,
    htmlBody: cancellationBodyHtml()
  });
}

// ── CONFIGURAR TRIGGERS (ejecutar una sola vez cada uno) ─────────
function createWeeklyTrigger() {
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'sendWeeklyNewsletter') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('sendWeeklyNewsletter')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.SUNDAY)
    .atHour(12)
    .nearMinute(0)
    .create();
  Logger.log('Trigger semanal creado: domingos a las 12:00.');
}

function createOnEditTrigger() {
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'onCancelEdit') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('onCancelEdit')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onEdit()
    .create();
  Logger.log('Trigger onEdit creado para detectar cancelaciones manuales.');
}

// ── CONFIGURAR HOJA (ejecutar una sola vez) ──────────────────────
function setupSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  const headers = ['Email', 'Fecha suscripción', 'Cancelar', 'Fecha de baja', 'Estado'];
  sheet.getRange(1, 1, 1, 5).setValues([headers]);
  sheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#f3e9d2');
  sheet.setColumnWidth(COL_EMAIL,     260);
  sheet.setColumnWidth(COL_FECHA,     180);
  sheet.setColumnWidth(COL_CANCELAR,   90);
  sheet.setColumnWidth(COL_BAJA,      180);
  sheet.setColumnWidth(COL_ESTADO,    120);

  Logger.log('Hoja "Suscriptores" configurada con 5 columnas.');
}

// ── UTILIDADES ───────────────────────────────────────────────────
function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
}

function getScriptUrl() {
  return ScriptApp.getService().getUrl();
}

function unsubscribeLink(email) {
  return `${getScriptUrl()}?action=unsubscribe&email=${encodeURIComponent(email)}`;
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
  if (!latest) Logger.log('No hay PDFs en la carpeta Newsletter.');
  return latest;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── PÁGINA DE CONFIRMACIÓN DE BAJA ──────────────────────────────
function unsubscribePageHtml(status) {
  const messages = {
    success:   { title: 'Baja confirmada',         body: 'Tu suscripción ha sido cancelada correctamente. Lamentamos verte marchar. ¡Hasta pronto y buen Camino!' },
    already:   { title: 'Ya estás dado/a de baja', body: 'Este correo ya no está suscrito a nuestra newsletter.' },
    notfound:  { title: 'No encontrado',            body: 'No encontramos ninguna suscripción asociada a este correo.' },
    error:     { title: 'Error',                    body: 'El enlace de baja no es válido. Por favor, responde al correo de la newsletter para solicitar la baja.' }
  };
  const m = messages[status] || messages.error;
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${m.title} — Catedral de Santo Domingo de la Calzada</title>
  <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;background:#1a1208;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
  .card{background:#faf7f2;max-width:480px;width:100%;border:1px solid #2e2416}
  .card__head{background:#1a1208;padding:28px 36px;text-align:center;border-bottom:1px solid #c9a84c33}
  .card__eyebrow{color:#c9a84c;letter-spacing:4px;font-size:10px;margin:0 0 12px;font-family:Arial,sans-serif}
  .card__title{color:#f5efe6;font-size:22px;font-weight:normal}
  .card__title em{color:#c9a84c;font-style:italic}
  .card__body{padding:32px 36px;color:#2a2118;font-size:15px;line-height:1.7}
  .card__foot{background:#1a1208;padding:16px 36px;text-align:center;border-top:1px solid #2e2416}
  .card__foot p{color:#7a6a55;font-size:11px}</style>
  </head><body><div class="card">
  <div class="card__head">
    <p class="card__eyebrow">— PATRIMONIO · SANTO DOMINGO DE LA CALZADA —</p>
    <h1 class="card__title"><em>${m.title}</em></h1>
  </div>
  <div class="card__body"><p>${m.body}</p></div>
  <div class="card__foot"><p>Catedral de Santo Domingo de la Calzada · La Rioja, España</p></div>
  </div></body></html>`;
}

// ── TEXTOS PLANOS DE LOS CORREOS ────────────────────────────────
function welcomeBodyText() {
  return [
    'Hola,', '',
    '¡Gracias por suscribirte a la newsletter de la Catedral de Santo Domingo de la Calzada!', '',
    'A partir de ahora recibirás automáticamente cada domingo a las 12 del mediodía nuestra',
    'newsletter semanal con noticias, exposiciones, eventos y contenido exclusivo sobre',
    'la Catedral y el Camino de Santiago.', '',
    'Si en algún momento deseas cancelar tu suscripción, usa el enlace de baja',
    'que encontrarás al pie de cada correo de la newsletter.', '',
    'Un cordial saludo,',
    'Catedral de Santo Domingo de la Calzada · La Rioja, España'
  ].join('\n');
}

function cancellationBodyText() {
  return [
    'Hola,', '',
    'Tu suscripción a la newsletter de la Catedral de Santo Domingo de la Calzada',
    'ha sido cancelada correctamente.', '',
    'Lamentamos verte marchar. Ha sido un placer acompañarte en este camino.',
    'Si algún día deseas volver a suscribirte, estaremos aquí esperándote.', '',
    '¡Hasta pronto y buen Camino!', '',
    'Catedral de Santo Domingo de la Calzada · La Rioja, España'
  ].join('\n');
}

function newsletterBodyText() {
  return [
    'Hola,', '',
    'Te enviamos la newsletter de esta semana de la Catedral de Santo Domingo de la Calzada.',
    'Encuéntrala adjunta en este correo.', '',
    'Si deseas cancelar tu suscripción, usa el enlace de baja al pie de este correo.', '',
    'Un saludo,',
    'Catedral de Santo Domingo de la Calzada'
  ].join('\n');
}

// ── HTML DE LOS CORREOS ──────────────────────────────────────────
function _emailFooter(note, email) {
  const bajaLink = email
    ? `<p style="margin:8px 0 0;font-size:11px;color:#7a6a55;">Darse de <a href="${unsubscribeLink(email)}" style="color:#c9a84c;text-decoration:underline;">baja</a></p>`
    : '';
  return `
    <div style="background:#1a1208;padding:20px 40px;text-align:center;border-top:1px solid #2e2416;">
      <p style="color:#f5efe6;font-size:13px;margin:0 0 4px;font-weight:bold;">Catedral de Santo Domingo de la Calzada</p>
      <p style="color:#c9a84c;font-size:10px;letter-spacing:3px;margin:0 0 10px;font-family:Arial,sans-serif;">CAMINO DE SANTIAGO · LA RIOJA · ESPAÑA</p>
      <p style="color:#7a6a55;font-size:11px;margin:0;">${note}</p>
      ${bajaLink}
    </div>`;
}

function welcomeBodyHtml(email) {
  return `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#2a2118;border:1px solid #2e2416;">
    <div style="background:#1a1208;padding:32px 40px;text-align:center;border-bottom:1px solid #c9a84c33;">
      <p style="color:#c9a84c;letter-spacing:4px;font-size:10px;margin:0 0 14px;font-family:Arial,sans-serif;">— PATRIMONIO · SANTO DOMINGO DE LA CALZADA —</p>
      <h1 style="color:#f5efe6;font-size:26px;margin:0;font-weight:normal;">Confirmación de <em style="color:#c9a84c;font-style:italic;">suscripción</em></h1>
    </div>
    <div style="padding:36px 40px;background:#faf7f2;">
      <p style="margin:0 0 16px;">Hola,</p>
      <p style="margin:0 0 16px;">¡Gracias por suscribirte a la newsletter de la <strong>Catedral de Santo Domingo de la Calzada</strong>!</p>
      <p style="margin:0 0 16px;">A partir de ahora recibirás cada <strong>domingo a las 12 del mediodía</strong> nuestra newsletter semanal con noticias, exposiciones, eventos y contenido exclusivo sobre la Catedral y el Camino de Santiago.</p>
      <p style="margin:0;color:#7a6a55;font-size:13px;">Si en algún momento deseas cancelar tu suscripción, usa el enlace del pie de este correo.</p>
    </div>
    ${_emailFooter('Este correo ha sido generado automáticamente en respuesta a su solicitud de suscripción.', email)}
  </div>`;
}

function cancellationBodyHtml() {
  return `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#2a2118;border:1px solid #2e2416;">
    <div style="background:#1a1208;padding:32px 40px;text-align:center;border-bottom:1px solid #c9a84c33;">
      <p style="color:#c9a84c;letter-spacing:4px;font-size:10px;margin:0 0 14px;font-family:Arial,sans-serif;">— PATRIMONIO · SANTO DOMINGO DE LA CALZADA —</p>
      <h1 style="color:#f5efe6;font-size:26px;margin:0;font-weight:normal;">Cancelación de <em style="color:#c9a84c;font-style:italic;">suscripción</em></h1>
    </div>
    <div style="padding:36px 40px;background:#faf7f2;">
      <p style="margin:0 0 16px;">Hola,</p>
      <p style="margin:0 0 16px;">Tu suscripción a la newsletter de la <strong>Catedral de Santo Domingo de la Calzada</strong> ha sido cancelada correctamente.</p>
      <p style="margin:0 0 16px;">Lamentamos verte marchar. Ha sido un placer acompañarte en este camino.</p>
      <p style="margin:0 0 16px;">Si algún día deseas volver a suscribirte, estaremos aquí esperándote con los brazos abiertos.</p>
      <p style="margin:0;color:#7a6a55;font-size:13px;">¡Hasta pronto y buen Camino!</p>
    </div>
    ${_emailFooter('Este correo ha sido generado automáticamente en respuesta a su solicitud de baja.', null)}
  </div>`;
}

function newsletterBodyHtml(email) {
  return `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#2a2118;border:1px solid #2e2416;">
    <div style="background:#1a1208;padding:32px 40px;text-align:center;border-bottom:1px solid #c9a84c33;">
      <p style="color:#c9a84c;letter-spacing:4px;font-size:10px;margin:0 0 14px;font-family:Arial,sans-serif;">— PATRIMONIO · SANTO DOMINGO DE LA CALZADA —</p>
      <h1 style="color:#f5efe6;font-size:26px;margin:0;font-weight:normal;">Newsletter <em style="color:#c9a84c;font-style:italic;">semanal</em></h1>
    </div>
    <div style="padding:36px 40px;background:#faf7f2;">
      <p style="margin:0 0 16px;">Hola,</p>
      <p style="margin:0 0 16px;">Te enviamos la newsletter de esta semana. Encuéntrala <strong>adjunta en este correo</strong>.</p>
      <p style="margin:0;color:#7a6a55;font-size:13px;">Si deseas cancelar tu suscripción, usa el enlace del pie de este correo.</p>
    </div>
    ${_emailFooter('Este correo ha sido generado automáticamente.', email)}
  </div>`;
}
