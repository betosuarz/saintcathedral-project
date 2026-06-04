/**
 * FORMULARIOS WEB — backend independiente (Google Apps Script Web App).
 *
 * Proyecto SEPARADO: no comparte código ni despliegue con reservas/visitas
 * (reservas-backend.js) ni con el boletín (boletin-backend.gs).
 *
 * Qué hace:
 *   doPost() recibe (por fetch) los envíos de los formularios de institucion.html
 *   — Vida comunitaria, Pastoral, Cabildo, Archivo —, los registra en un Google
 *   Sheet y envía el email al destinatario según el asunto. Marca el estado
 *   ✅ (enviado) o ❌ (error) en el Sheet. Devuelve { ok: true|false }.
 *
 * Despliegue:
 *   Implementar → Nueva implementación → Aplicación web
 *     - Ejecutar como: Yo
 *     - Quién tiene acceso: Cualquiera
 *   Copia la URL .../exec y pégala en FORM_API dentro de institucion.html.
 */

var CONFIG_FORM = {
  SHEET_ID: '1cOuVh9N_OsAkfzomybs0aZ2HuH7qV_b2LgPwFn_1eec',  // ID del Google Sheet donde se registran los envíos
  HOJA: 'Envíos',        // nombre de la pestaña
  TZ: 'Europe/Madrid',
  // Destinatario del email según el asunto:
  DESTINOS: {
    'Vida comunitaria': 'santodomingo@iglesiaenlarioja.org',
    'Pastoral':         'santodomingo@iglesiaenlarioja.org',
    'Cabildo':          'santodomingo@iglesiaenlarioja.org',
    'Archivo':          'archivosantodomingo@iglesiaenlarioja.org'
  },
  DESTINO_DEFECTO: 'santodomingo@iglesiaenlarioja.org'
};

var CABECERAS = ['Asunto', 'Nombre', 'Teléfono', 'Correo', 'Comentario', 'Fecha de envío', 'Estado'];

function doPost(e) {
  var salida = ContentService.createTextOutput();
  salida.setMimeType(ContentService.MimeType.JSON);
  try {
    var datos = JSON.parse(e.postData.contents);
    salida.setContent(JSON.stringify(registrarYEnviar_(datos)));
  } catch (err) {
    salida.setContent(JSON.stringify({ ok: false, error: String(err && err.message || err) }));
  }
  return salida;
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, msg: 'Formularios backend activo' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function registrarYEnviar_(datos) {
  var asunto = String(datos.asunto || '').trim() || 'Sin asunto';
  var nombre = String(datos.nombre || '').trim();
  var telefono = String(datos.telefono || '').trim();
  var correo = String(datos.correo || '').trim();
  var comentario = String(datos.comentario || '').trim();

  if (!nombre || !telefono || !correo || !comentario) {
    return { ok: false, error: 'Faltan campos obligatorios' };
  }

  var fecha = Utilities.formatDate(new Date(), CONFIG_FORM.TZ, 'dd/MM/yyyy HH:mm:ss');

  // 1) Registra la fila PRIMERO (si el Sheet falla, corta aquí sin enviar correo).
  var hoja = _hoja();
  hoja.appendRow([asunto, nombre, telefono, correo, comentario, fecha, '⏳']);
  var fila = hoja.getLastRow();

  // 2) Envía el email.
  var destino = CONFIG_FORM.DESTINOS[asunto] || CONFIG_FORM.DESTINO_DEFECTO;
  var enviado = false, errorMsg = '';
  try {
    MailApp.sendEmail({
      to: destino,
      replyTo: correo,
      subject: 'Contacto web · ' + asunto + ' · Santo Domingo de la Calzada',
      body:
        'Asunto: ' + asunto + '\n' +
        'Nombre: ' + nombre + '\n' +
        'Teléfono: ' + telefono + '\n' +
        'Correo: ' + correo + '\n\n' +
        'Comentario:\n' + comentario + '\n\n' +
        'Fecha de envío: ' + fecha + '\n' +
        '— Formulario web (Parroquia / Catedral de Santo Domingo de la Calzada).'
    });
    enviado = true;
  } catch (err) {
    errorMsg = String(err && err.message || err);
  }

  // 3) Actualiza el estado de la fila.
  hoja.getRange(fila, CABECERAS.length).setValue(enviado ? '✅' : '❌');

  return enviado ? { ok: true } : { ok: false, error: errorMsg || 'No se pudo enviar el correo' };
}

function _hoja() {
  // Acepta tanto el ID a secas como la URL completa del Sheet (extrae el ID).
  var m = String(CONFIG_FORM.SHEET_ID || '').match(/[-\w]{25,}/);
  if (!m) throw new Error('CONFIG_FORM.SHEET_ID está vacío o no es válido (pega el ID del Sheet).');
  var ss = SpreadsheetApp.openById(m[0]);
  var hoja = ss.getSheetByName(CONFIG_FORM.HOJA) || ss.insertSheet(CONFIG_FORM.HOJA);
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(CABECERAS);
    hoja.getRange(1, 1, 1, CABECERAS.length).setFontWeight('bold');
    hoja.setFrozenRows(1);
    hoja.setColumnWidths(1, CABECERAS.length, 150);
  }
  return hoja;
}

// Ejecútalo una vez desde el editor para crear cabeceras y dar permisos.
function inicializar() { _hoja(); }