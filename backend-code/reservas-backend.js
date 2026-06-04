/**
 * ═══════════════════════════════════════════════════════════════
 *  CATEDRAL DE SANTO DOMINGO DE LA CALZADA
 *  Sistema de gestión de reservas · Google Apps Script
 *  Versión con justificante de pago — abril 2026
 * ═══════════════════════════════════════════════════════════════
 *
 *  INSTRUCCIONES:
 *
 *  1. Pega este código en Apps Script (reemplaza todo el anterior)
 *  2. Ejecuta setupSheet() una vez para recrear cabeceras
 *  3. Ejecuta setupTriggers() una vez
 *  4. Implementar → Gestionar implementaciones → lápiz → Nueva versión → Implementar
 * ═══════════════════════════════════════════════════════════════
 */

// ── CONFIGURACIÓN ────────────────────────────────────────────────
const CONFIG = {
  SHEET_NAME: 'Reservas',
  SHEET_VISITAS_GUIADAS: 'VisitasGuiadas',
  SHEET_CIERRE: 'Cierre',
  SHEET_NO_VISITAS_GUIADAS: 'NoVisitasGuiadas',
  // Cierre · columna Monumento: '*' = los 4 monumentos de Santo Domingo. Vacío = se ignora.
  MONUMENTOS_CIERRE: ['*', 'Catedral', 'Torre', 'San Francisco', 'Ermita Plaza'],
  CIERRE_MONUMENTO_RESERVAS: 'Catedral', // reservas.html solo refleja el cierre de la Catedral
  CALENDAR_ID: '8bac14e3b904230d2c59839deaf077da5709cecb0b79f7a12f3928c2b1637a8d@group.calendar.google.com',
  CALENDAR_VG_ID: 'ed469aa32a2d0fd6802ea37ba514db786b80fd3b7d50ed98c7d15bdfbd0be271@group.calendar.google.com',
  CALENDAR_INDIVIDUAL_ID: '2e70113fbefa9736bee9ce9f2fa68c09abe30bd28bd9c03f4de0223893be3732@group.calendar.google.com',
  CALENDAR_ESCOLAR_ID: '2325e4f5510c3704c26160a09541a9d96e43463a0f349ab7eabfe28c4f1e2366@group.calendar.google.com',
  CALENDAR_CANCELADO_ID: 'd383783e5e800ce2a94b134f15357d204b780800fc9d9e913c709b30a338f864@group.calendar.google.com',
  FORM_URL: 'https://catedralsantodomingo.org/reservas',
  CANCEL_URL: 'https://catedralsantodomingo.org/cancelar',
  EMAIL_REMITENTE: 'entradas@catedralsantodomingo.org',
  EMAIL_INFO: 'info.catedralsantodomingo@gmail.com',
  EMAIL_DISENO: 'diseno.catedralsantodomingo@gmail.com',
  EMAIL_CONTABILIDAD: 'conta.catedralsantodomingo@gmail.com',
  EMAIL_GUIA: 'carlampriorsic@gmail.com',
  NOMBRE_INSTITUCION: 'Catedral de Santo Domingo de la Calzada',
  CARPETA_JUSTIFICANTES: 'Justificantes grupos',
  WEBAPP_URL: 'https://script.google.com/macros/s/AKfycbzVEczVQQ51YyM_9o0SKyafc_LXoL8re47HjWlGljDw3S1lqX3b4aacgmDtV1nXNLPeWA/exec',
};

// ── PRECIOS INDIVIDUALES ─────────────────────────────────────────
const PRECIOS = {
  'Catedral': 7,
  'Torre': 4,
  'Convento San Francisco': 5,
  'Pulsera Turística': 10,
  'Pulsera Turística Peregrino': 5,
  'Visita Guiada Diurna': 14,
  'Visita Guiada VIP': 15,
  'Visita Guiada Nocturna Catedral': 15,
  'Ticket Familiar': 25,
};
const PRECIOS_MENOR_GUIADA = { 'Visita Guiada Diurna': 4, 'Visita Guiada VIP': 5, 'Visita Guiada Nocturna Catedral': 5 };
const PRECIO_MENOR_NOCTURNA = 5; // legacy alias
const PRECIO_GRUPO_POR_PERSONA = 5;
const PRECIO_GRUPO_MINIMO = 125;
const SUPLEMENTO_VISITA_GUIADA = 50;
const SUPLEMENTO_VISITA_GUIADA_CASCO = 100;
const PRECIOS_ESCOLAR = { 'menor12': 0, 'e1213': 2, 'e1415': 3, 'e1617': 4, 'mayor17': 5 };
const LABELS_TRAMO = {
  'menor12': 'Escolares menores de 12 años',
  'e1213': 'Escolares 12–13 años',
  'e1415': 'Escolares 14–15 años',
  'e1617': 'Estudiantes 16–17 años',
  'mayor17': 'Estudiantes mayores de 17 años',
};
function tramoLabel(tramo) { return LABELS_TRAMO[tramo] || (tramo || '—'); }
function tramoPrecio(tramo) {
  if (PRECIOS_ESCOLAR[tramo] !== undefined) return PRECIOS_ESCOLAR[tramo];
  for (var k in LABELS_TRAMO) { if (LABELS_TRAMO[k] === tramo) return PRECIOS_ESCOLAR[k]; }
  return null;
}

// ── CABECERAS ────────────────────────────────────────────────────
const HEADERS = [
  'Marca temporal',         // A  1
  'Tipo de visita',         // B  2
  'Nombre',                 // C  3
  'Email',                  // D  4
  'Teléfono',               // E  5
  'Fecha visita',           // F  6
  'Hora visita',            // G  7
  'Nº personas',            // H  8
  'Tipo de entrada',        // I  9
  'Tarifas (€)',            // J  10
  'Visita guiada Catedral', // K  11
  'TOTAL (€)',              // L  12
  'Centro / Institución',   // M  13
  'NIF / CIF',              // N  14
  'Calle y número',         // O  15
  'Ciudad',                 // P  16
  'Código postal',          // Q  17
  'PROFORMA',               // R  18
  'Comentarios',            // S  19
  'Respuesta',              // T  20
  '¿Aceptar?',              // U  21
  'Estado',                 // V  22
  'Token',                  // W  23
  'Justificante',           // X  24
  'ID Evento',              // Y  25  ← oculto, almacena ID del evento de Calendar
  'Entradas (detalle)',     // Z  26  ← desglose multi-línea (visita individual)
  'Menores (<12)',          // AA 27  ← nº de menores (para tarifa nocturna de grupo y registro)
  'Residentes',             // AB 28  ← nº de residentes (para tarifa nocturna de grupo y registro)
];

const COL_RESPUESTA = 20; // T
const COL_ACEPTAR = 21; // U
const COL_ESTADO = 22; // V
const COL_TOKEN = 23; // W
const COL_JUSTIFICANTE = 24; // X
const COL_EVENTO_ID = 25; // Y


// ══════════════════════════════════════════════════════════════════
//  1. SETUP
// ══════════════════════════════════════════════════════════════════

function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(CONFIG.SHEET_NAME);

  sheet.getRange(1, 1, 1, HEADERS.length).clearContent();
  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setValues([HEADERS]);
  headerRange.setFontWeight('bold')
    .setBackground('#1A1814')
    .setFontColor('#C9A84C')
    .setFontFamily('Arial')
    .setFontSize(10);

  sheet.setFrozenRows(1);

  // A–Z: 26 columnas. Token (X=24) necesita ancho generoso para mostrar el UUID.
  const widths = [160, 100, 180, 220, 120, 110, 80, 80, 160, 100, 130, 100, 200, 110, 200, 130, 100, 100, 260, 260, 85, 160, 280, 200, 60, 340, 90, 90];
  widths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));

  sheet.getRange(2, 10, 500, 1).setNumberFormat('"€"#,##0.00');
  sheet.getRange(2, 12, 500, 1).setNumberFormat('"€"#,##0.00');

  sheet.getRange(1, 10).setBackground('#2a2210').setFontColor('#DFC07A');  // J Tarifas
  sheet.getRange(1, 12).setBackground('#0f2010').setFontColor('#80c060');  // L Total
  sheet.getRange(1, 20).setBackground('#1a1030').setFontColor('#b090f0');  // T Respuesta
  sheet.getRange(1, 23).setBackground('#0f1a2a').setFontColor('#60a0d0');  // W Token
  sheet.getRange(1, 24).setBackground('#0f2020').setFontColor('#60c0a0');  // X Justificante
  sheet.hideColumns(25); // Y ID Evento — uso interno

  Logger.log('Hoja configurada: ' + HEADERS.length + ' columnas.');
}

function setupVisitasGuiadas() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var gold = '#C9A84C';
  var dark = '#1A1814';

  // ── VisitasGuiadas ──────────────────────────────────────────────
  var sheetVG = ss.getSheetByName(CONFIG.SHEET_VISITAS_GUIADAS) || ss.insertSheet(CONFIG.SHEET_VISITAS_GUIADAS);
  var headersVG = ['Fecha', 'Hora', 'Tipo', 'Notas', 'ID Evento Calendar'];
  var rangeVG = sheetVG.getRange(1, 1, 1, headersVG.length);
  rangeVG.setValues([headersVG]).setFontWeight('bold').setBackground(dark).setFontColor(gold).setFontFamily('Arial').setFontSize(10);
  sheetVG.setFrozenRows(1);
  [130, 80, 120, 250, 220].forEach(function (w, i) { sheetVG.setColumnWidth(i + 1, w); });
  sheetVG.getRange(2, 3, 500, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['Diurna', 'VIP', 'Nocturna'], true).setAllowInvalid(false).build()
  );

  // ── Cierre ──────────────────────────────────────────────────────
  var sheetC = ss.getSheetByName(CONFIG.SHEET_CIERRE) || ss.insertSheet(CONFIG.SHEET_CIERRE);
  var headersC = ['Fecha', 'Hora  (* = día completo)', 'Monumento', 'Motivo'];
  var rangeC = sheetC.getRange(1, 1, 1, headersC.length);
  rangeC.setValues([headersC]).setFontWeight('bold').setBackground(dark).setFontColor(gold).setFontFamily('Arial').setFontSize(10);
  sheetC.setFrozenRows(1);
  [130, 160, 150, 300].forEach(function (w, i) { sheetC.setColumnWidth(i + 1, w); });
  // Columna C (Monumento): * = los 4 monumentos · o uno concreto. Vacío = no es cierre válido.
  sheetC.getRange(2, 3, 500, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.MONUMENTOS_CIERRE, true).setAllowInvalid(false).build()
  );

  // ── NoVisitasGuiadas ─────────────────────────────────────────────
  var sheetNVG = ss.getSheetByName(CONFIG.SHEET_NO_VISITAS_GUIADAS) || ss.insertSheet(CONFIG.SHEET_NO_VISITAS_GUIADAS);
  var headersNVG = ['Fecha', 'Hora  (* = bloqueo total)', 'Motivo'];
  var rangeNVG = sheetNVG.getRange(1, 1, 1, headersNVG.length);
  rangeNVG.setValues([headersNVG]).setFontWeight('bold').setBackground(dark).setFontColor(gold).setFontFamily('Arial').setFontSize(10);
  sheetNVG.setFrozenRows(1);
  [130, 160, 300].forEach(function (w, i) { sheetNVG.setColumnWidth(i + 1, w); });

  Logger.log('Pestañas VisitasGuiadas, Cierre y NoVisitasGuiadas configuradas.');
}

function setupTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    var fn = t.getHandlerFunction();
    if (fn === 'onEditTrigger' || fn === 'reconciliarVisitasGuiadasAhora') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('onEditTrigger')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onEdit()
    .create();
  // onEdit NO se dispara al ELIMINAR una fila entera (solo al editar celdas), así que
  // un trigger horario reconcilia los eventos huérfanos de VisitasGuiadas en Calendar.
  ScriptApp.newTrigger('reconciliarVisitasGuiadasAhora')
    .timeBased()
    .everyHours(1)
    .create();
  Logger.log('Triggers instalados (onEdit + reconciliación horaria VG).');
}


// ══════════════════════════════════════════════════════════════════
//  2. CÁLCULO DE TARIFAS
// ══════════════════════════════════════════════════════════════════

function calcularDesglose(tipoVisita, tipoEntrada, nPersonas, nMenores, tramoEdad, nResidentes) {
  var total = parseInt(nPersonas) || 0;
  var menores = parseInt(nMenores) || 0;
  var residentes = parseInt(nResidentes) || 0;
  if (tipoVisita === 'Grupo') {
    // Pagantes = totales − menores − residentes. 13–24 pagantes → 125 € (mínimo); 25+ → 5 €/pagante.
    var pagantes = Math.max(0, total - menores - residentes);
    var tarifa = pagantes >= 25 ? pagantes * PRECIO_GRUPO_POR_PERSONA : PRECIO_GRUPO_MINIMO;
    return { tarifa: tarifa, adultos: pagantes, menores: menores, residentes: residentes, precioAdulto: PRECIO_GRUPO_POR_PERSONA, precioMenor: 0 };
  }
  if (tipoVisita === 'Grupo Escolar') {
    var precio = tramoPrecio(tramoEdad);
    if (precio === null) precio = 0;
    var pagEsc = Math.max(0, total - menores - residentes);
    return { tarifa: pagEsc * precio, adultos: pagEsc, menores: menores, residentes: residentes, precioAdulto: precio, precioMenor: 0, escolar: true };
  }
  if (tipoEntrada === 'Ticket Familiar') {
    return { tarifa: 25, adultos: total, menores: menores, precioAdulto: 25, precioMenor: 0 };
  }
  var adultos = total - menores;
  var precioAdulto = PRECIOS[tipoEntrada] || 0;
  var precioMenor = PRECIOS_MENOR_GUIADA[tipoEntrada] !== undefined ? PRECIOS_MENOR_GUIADA[tipoEntrada] : 0;
  return { tarifa: (adultos * precioAdulto) + (menores * precioMenor), adultos: adultos, menores: menores, precioAdulto: precioAdulto, precioMenor: precioMenor };
}

function calcularTarifaBase(tipoVisita, tipoEntrada, nPersonas, nMenores, tramoEdad, nResidentes) {
  return calcularDesglose(tipoVisita, tipoEntrada, nPersonas, nMenores, tramoEdad, nResidentes).tarifa;
}

function calcularTotal(tarifa, visitaGuiada) {
  if (visitaGuiada === 'Casco Histórico + Catedral') return tarifa + SUPLEMENTO_VISITA_GUIADA_CASCO;
  return tarifa + (visitaGuiada === 'Sí' ? SUPLEMENTO_VISITA_GUIADA : 0);
}
// Grupo con Visita Guiada Nocturna: tarifa por persona (15 €/adulto, 5 €/menor·residente),
// SIN suplemento de grupo. No se trata como guiada a efectos de bloqueo de franja
// (coordinación manual) → NO se incluye en tieneGuiadaGrupo().
function esNocturnaGrupo(visitaGuiada) {
  return visitaGuiada === 'Visita Guiada Nocturna Catedral';
}
function calcularNocturnaGrupo(nPersonas, nMenores, nResidentes) {
  var total = parseInt(nPersonas) || 0;
  var menores = parseInt(nMenores) || 0;
  var residentes = parseInt(nResidentes) || 0;
  var adultos = Math.max(0, total - menores - residentes);
  var pAdulto = PRECIOS['Visita Guiada Nocturna Catedral'];               // 15
  var pReducido = PRECIOS_MENOR_GUIADA['Visita Guiada Nocturna Catedral']; // 5
  var tarifa = adultos * pAdulto + (menores + residentes) * pReducido;
  return { tarifa: tarifa, adultos: adultos, menores: menores, residentes: residentes, precioAdulto: pAdulto, precioReducido: pReducido };
}
function tieneGuiadaGrupo(v) {
  return v === 'Sí' || v === 'Casco Histórico + Catedral';
}
function guiadaLabel(v) {
  if (v === 'Casco Histórico + Catedral') return 'Casco Histórico + Catedral';
  if (v === 'Sí') return 'Catedral';
  if (v === 'Visita Guiada Nocturna Catedral') return 'Visita Guiada Nocturna Catedral';
  return 'No solicitada';
}


// ══════════════════════════════════════════════════════════════════
//  3. WEB APP
// ══════════════════════════════════════════════════════════════════

function doGet(e) {
  if (e && e.parameter) {
    if (e.parameter.editar) return mostrarFormularioEdicion(e.parameter.editar);
    if (e.parameter.justificante) return mostrarFormularioJustificante(e.parameter.justificante);
    if (e.parameter.disponibilidad) return consultarDisponibilidad(e.parameter.disponibilidad, e.parameter.excludeToken || null);
    if (e.parameter.mesVisitas) return consultarVisitasMes(e.parameter.mesVisitas);
    if (e.parameter.datos) return consultarDatosReserva(e.parameter.datos);
    if (e.parameter.cancelarWeb) return _cancelarWebJSON(e.parameter.cancelarWeb);
    if (e.parameter.cancelar) return mostrarConfirmacionCancelacion(e.parameter.cancelar);
    if (e.parameter.confirmarCancelacion) return procesarCancelacion(e.parameter.confirmarCancelacion);
  }
  return ContentService
    .createTextOutput('Web App activa · Catedral de Santo Domingo de la Calzada')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Devuelve las horas bloqueadas para una fecha dada.
// Fuentes: hoja de cálculo (grupos guiados pendientes/confirmados) + eventos de Google Calendar.
// excludeToken: si se pasa (modo edición), se ignoran la fila y el evento del calendario
// de la reserva que se está editando para que pueda ver su propio horario como disponible.
function consultarDisponibilidad(fecha, excludeToken) {
  try {
    var fechaNorm = _normFecha(fecha);
    var franjas = [];

    function addFranja(hh, mm, durMin) {
      var ini = hh * 60 + mm;
      franjas.push({ ini: ini, fin: ini + (durMin || 60) });
    }

    // Buscar eventoId a excluir del calendario si hay token de edición
    var excludeEventoId = null;
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
    if (sheet) {
      var allData = sheet.getDataRange().getValues();

      // Si hay token de edición, localizar su eventoId para excluirlo del calendar
      if (excludeToken) {
        for (var t = 1; t < allData.length; t++) {
          if (String(allData[t][COL_TOKEN - 1]) === String(excludeToken)) {
            excludeEventoId = allData[t][COL_EVENTO_ID - 1] || null;
            break;
          }
        }
      }

      // 1. Hoja: grupos con visita guiada en estados activos
      var estadosActivos = ['✅ Confirmado', '📅 Reservado', '⏳ Pendiente pago'];
      for (var i = 1; i < allData.length; i++) {
        var fila = allData[i];
        // Excluir la reserva que se está editando
        if (excludeToken && String(fila[COL_TOKEN - 1]) === String(excludeToken)) continue;
        if (fila[1] !== 'Grupo' && fila[1] !== 'Grupo Escolar') continue;
        var vg = String(fila[10]);
        if (vg !== 'Sí' && vg !== 'Casco Histórico + Catedral') continue;
        if (estadosActivos.indexOf(String(fila[COL_ESTADO - 1])) === -1) continue;
        if (_normFecha(fila[5]) !== fechaNorm) continue;
        var hh, mm;
        if (fila[6] instanceof Date) {
          hh = fila[6].getHours(); mm = fila[6].getMinutes();
        } else {
          var hp = String(fila[6]).trim().split(':');
          hh = parseInt(hp[0]) || 0; mm = parseInt(hp[1]) || 0;
        }
        // Casco Histórico + Catedral dura 2 horas → bloquea 120 min
        var durMin = vg === 'Casco Histórico + Catedral' ? 120 : 60;
        addFranja(hh, mm, durMin);
      }
    }

    // 2. Google Calendar: eventos con prefijo "VG " (grupos con visita guiada)
    try {
      var calendar = CalendarApp.getCalendarById(CONFIG.CALENDAR_ID);
      if (calendar) {
        var partes = String(fecha).split('-');
        var inicioDia = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]), 0, 0, 0);
        var finDia = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]), 23, 59, 59);
        var eventos = calendar.getEvents(inicioDia, finDia);
        for (var j = 0; j < eventos.length; j++) {
          if (eventos[j].getTitle().indexOf('VG ') !== 0) continue;
          // Excluir el evento de la reserva que se está editando
          if (excludeEventoId && eventos[j].getId() === excludeEventoId) continue;
          var evtIni = eventos[j].getStartTime();
          var evtFin = eventos[j].getEndTime();
          var iniMin = evtIni.getHours() * 60 + evtIni.getMinutes();
          var finMin = evtFin.getHours() * 60 + evtFin.getMinutes();
          var dur = finMin > iniMin ? finMin - iniMin : 60;
          addFranja(evtIni.getHours(), evtIni.getMinutes(), dur);
        }
      }
    } catch (calErr) {
      Logger.log('consultarDisponibilidad - error calendario: ' + calErr.toString());
    }

    // 3. Pestaña Cierre: días y horas bloqueadas administrativamente.
    //    Columnas: A=Fecha, B=Hora, C=Monumento, D=Motivo. reservas.html SOLO refleja el
    //    cierre de la Catedral, así que aquí solo cuentan filas con Monumento '*' o 'Catedral'.
    //    Monumento vacío = no es un cierre válido → se ignora.
    var esDiaBloqueado = false;
    var horasCierre = [];
    var sheetCierre = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_CIERRE);
    if (sheetCierre && sheetCierre.getLastRow() > 1) {
      var cierreData = sheetCierre.getRange(2, 1, sheetCierre.getLastRow() - 1, 3).getValues();
      for (var c = 0; c < cierreData.length; c++) {
        if (!cierreData[c][0]) continue;
        if (_normFecha(cierreData[c][0]) !== fechaNorm) continue;
        var cMon = String(cierreData[c][2] || '').trim();
        if (cMon !== '*' && cMon !== CONFIG.CIERRE_MONUMENTO_RESERVAS) continue; // solo Catedral afecta a reservas
        var cHora = _normHora(cierreData[c][1]);
        if (cHora === '*') { esDiaBloqueado = true; break; }
        if (cHora) {
          horasCierre.push(cHora);
        }
      }
    }

    if (esDiaBloqueado) {
      return jsonResponse({ ok: true, esDiaBloqueado: true, horasOcupadas: [], horasCierre: [], visitasGuiadas: { Diurna: [], VIP: [], Nocturna: [] } });
    }

    // 4. Pestaña VisitasGuiadas: horas programadas por tipo
    var visitasGuiadas = { Diurna: [], VIP: [], Nocturna: [] };
    var sheetVG = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_VISITAS_GUIADAS);
    if (sheetVG && sheetVG.getLastRow() > 1) {
      var vgData = sheetVG.getRange(2, 1, sheetVG.getLastRow() - 1, 3).getValues();
      for (var v = 0; v < vgData.length; v++) {
        if (!vgData[v][0]) continue;
        if (_normFecha(vgData[v][0]) !== fechaNorm) continue;
        var vHora = _normHora(vgData[v][1]);
        var vTipo = String(vgData[v][2]).trim();
        if (!vHora) continue;
        if (visitasGuiadas[vTipo] !== undefined) visitasGuiadas[vTipo].push(vHora);
      }
      visitasGuiadas.Diurna.sort();
      visitasGuiadas.VIP.sort();
      visitasGuiadas.Nocturna.sort();
    }

    // 5. Pestaña NoVisitasGuiadas: horas bloqueadas para visitas guiadas
    var horasNoVisitasGuiadas = [];
    var sheetNVG = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NO_VISITAS_GUIADAS);
    if (sheetNVG && sheetNVG.getLastRow() > 1) {
      var nvgData = sheetNVG.getRange(2, 1, sheetNVG.getLastRow() - 1, 2).getValues();
      var noVGDiaCompleto = false;
      var horasNoVG = [];
      for (var n = 0; n < nvgData.length; n++) {
        if (!nvgData[n][0]) continue;
        if (_normFecha(nvgData[n][0]) !== fechaNorm) continue;
        var nvgHora = _normHora(nvgData[n][1]);
        if (nvgHora === '*') { noVGDiaCompleto = true; break; }
        if (nvgHora) horasNoVG.push(nvgHora);
      }
      if (noVGDiaCompleto) {
        visitasGuiadas.Diurna = [];
        visitasGuiadas.VIP = [];
        visitasGuiadas.Nocturna = [];
        horasNoVisitasGuiadas = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
      } else if (horasNoVG.length > 0) {
        visitasGuiadas.Diurna = visitasGuiadas.Diurna.filter(function (h) { return horasNoVG.indexOf(h) === -1; });
        visitasGuiadas.VIP = visitasGuiadas.VIP.filter(function (h) { return horasNoVG.indexOf(h) === -1; });
        visitasGuiadas.Nocturna = visitasGuiadas.Nocturna.filter(function (h) { return horasNoVG.indexOf(h) === -1; });
        horasNoVisitasGuiadas = horasNoVG;
      }
    }

    // 6. Determinar qué slots quedan bloqueados por solapamiento
    //    Un slot X está bloqueado si su franja [X, X+60) solapa con alguna franja existente [ini, fin).
    var SLOTS = [540, 600, 660, 720, 780, 840, 900, 960, 1020, 1080, 1140]; // 09:00–19:00 en minutos
    var horasOcupadas = [];
    for (var s = 0; s < SLOTS.length; s++) {
      var slotIni = SLOTS[s];
      var slotFin = slotIni + 60;
      for (var f = 0; f < franjas.length; f++) {
        if (slotIni < franjas[f].fin && franjas[f].ini < slotFin) {
          var hStr = String(Math.floor(slotIni / 60)).padStart(2, '0') + ':' + String(slotIni % 60).padStart(2, '0');
          horasOcupadas.push(hStr);
          break;
        }
      }
    }

    return jsonResponse({ ok: true, esDiaBloqueado: false, horasOcupadas: horasOcupadas, horasCierre: horasCierre, visitasGuiadas: visitasGuiadas, horasNoVisitasGuiadas: horasNoVisitasGuiadas });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

// Devuelve, para un mes completo (mes = 'YYYY-MM'), las visitas guiadas programadas
// y los cierres por día. Lo consume el calendario de visitas.html (carga un mes de golpe).
// A diferencia de consultarDisponibilidad (reservas.html, solo Catedral), aquí se devuelven
// TODOS los monumentos del cierre: la web muestra el aviso de cada monumento por separado.
function consultarVisitasMes(mes) {
  try {
    var mm = String(mes || '').trim();
    if (!/^\d{4}-\d{2}$/.test(mm)) return jsonResponse({ ok: false, error: 'mes inválido (use YYYY-MM)' });
    var dias = {};
    function diaDe(key) {
      if (!dias[key]) dias[key] = { visitas: [], cierres: [] };
      return dias[key];
    }

    // VisitasGuiadas: A=Fecha, B=Hora, C=Tipo
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetVG = ss.getSheetByName(CONFIG.SHEET_VISITAS_GUIADAS);
    if (sheetVG && sheetVG.getLastRow() > 1) {
      var vgData = sheetVG.getRange(2, 1, sheetVG.getLastRow() - 1, 3).getValues();
      for (var v = 0; v < vgData.length; v++) {
        if (!vgData[v][0]) continue;
        var vIso = _isoFecha(vgData[v][0]);
        if (vIso.slice(0, 7) !== mm) continue;
        var vHora = _normHora(vgData[v][1]);
        var vTipo = String(vgData[v][2] || '').trim();
        if (!vHora || !vTipo) continue;
        diaDe(vIso).visitas.push({ tipo: vTipo, hora: vHora });
      }
    }

    // Cierre: A=Fecha, B=Hora, C=Monumento, D=Motivo. Monumento vacío = se ignora.
    var sheetC = ss.getSheetByName(CONFIG.SHEET_CIERRE);
    if (sheetC && sheetC.getLastRow() > 1) {
      var cData = sheetC.getRange(2, 1, sheetC.getLastRow() - 1, 4).getValues();
      for (var c = 0; c < cData.length; c++) {
        if (!cData[c][0]) continue;
        var cIso = _isoFecha(cData[c][0]);
        if (cIso.slice(0, 7) !== mm) continue;
        var cMon = String(cData[c][2] || '').trim();
        if (!cMon) continue; // sin monumento → no es un cierre válido
        diaDe(cIso).cierres.push({
          monumento: cMon,
          hora: _normHora(cData[c][1]) || '*',
          motivo: String(cData[c][3] || '').trim()
        });
      }
    }

    // Ordenar las visitas de cada día por hora
    Object.keys(dias).forEach(function (k) {
      dias[k].visitas.sort(function (a, b) { return a.hora < b.hora ? -1 : (a.hora > b.hora ? 1 : 0); });
    });

    return jsonResponse({ ok: true, mes: mm, dias: dias });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

function _normFecha(val) {
  if (!val) return '';
  if (val instanceof Date) {
    return String(val.getDate()).padStart(2, '0') + '/'
      + String(val.getMonth() + 1).padStart(2, '0') + '/'
      + val.getFullYear();
  }
  var s = String(val).trim();
  if (s.indexOf('/') !== -1) return s;
  var p = s.split('-');
  if (p.length === 3 && p[0].length === 4) return p[2] + '/' + p[1] + '/' + p[0];
  return s;
}

function _normHora(val) {
  if (!val && val !== 0) return '';
  if (val instanceof Date) {
    return String(val.getHours()).padStart(2, '0') + ':' + String(val.getMinutes()).padStart(2, '0');
  }
  return String(val).trim();
}

// Normaliza cualquier celda de fecha a ISO 'YYYY-MM-DD' (clave que usa el calendario web).
function _isoFecha(val) {
  if (!val) return '';
  if (val instanceof Date) {
    return val.getFullYear() + '-'
      + String(val.getMonth() + 1).padStart(2, '0') + '-'
      + String(val.getDate()).padStart(2, '0');
  }
  var s = String(val).trim();
  var mIso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (mIso) return mIso[1] + '-' + mIso[2] + '-' + mIso[3];
  var mEs = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/); // DD/MM/YYYY
  if (mEs) return mEs[3] + '-' + String(mEs[2]).padStart(2, '0') + '-' + String(mEs[1]).padStart(2, '0');
  return s;
}

function _sincronizarFilaVisitaGuiada(sheet, row) {
  var rowData = sheet.getRange(row, 1, 1, 5).getValues()[0];
  var fecha = rowData[0];
  var hora = rowData[1];
  var tipo = String(rowData[2]).trim();
  var notas = String(rowData[3]).trim();
  var idViejo = String(rowData[4]).trim();

  var calendar = CalendarApp.getCalendarById(CONFIG.CALENDAR_VG_ID);

  // Eliminar evento anterior si existe
  if (idViejo) {
    try { calendar.getEventById(idViejo).deleteEvent(); } catch (err) { }
    sheet.getRange(row, 5).clearContent();
  }

  // Si la fila está incompleta o el tipo no es válido, no crear evento
  var tiposValidos = ['Diurna', 'VIP', 'Nocturna'];
  if (!fecha || !hora || tiposValidos.indexOf(tipo) === -1) return;

  // Duración: leer de Notas ("Duración: X minutos") o usar defecto por tipo
  var duracion = tipo === 'VIP' ? 90 : 60;
  var matchDur = notas.match(/(\d+)\s*minutos/i);
  if (matchDur) duracion = parseInt(matchDur[1]);

  // Título del evento en Calendar
  var titulos = { 'Diurna': '☀️ VG Diurna', 'VIP': '⭐ VG VIP', 'Nocturna': '🌙 VG Nocturna' };
  var titulo = titulos[tipo];

  // Construir fecha/hora de inicio
  var horaStr = _normHora(hora);
  var partsH = horaStr.split(':');
  var hh = parseInt(partsH[0]);
  var mm = parseInt(partsH[1] || '0');

  var inicio;
  if (fecha instanceof Date) {
    inicio = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), hh, mm, 0);
  } else {
    var norm = _normFecha(fecha);
    var partsF = norm.split('/');
    inicio = new Date(parseInt(partsF[2]), parseInt(partsF[1]) - 1, parseInt(partsF[0]), hh, mm, 0);
  }
  var fin = new Date(inicio.getTime() + duracion * 60000);

  // Crear evento y guardar ID en columna E. La descripción del evento lleva las Notas de la fila.
  try {
    var evento = calendar.createEvent(titulo, inicio, fin, { description: notas });
    sheet.getRange(row, 5).setValue(evento.getId());
    Logger.log('Evento Calendar creado: ' + titulo + ' — ' + inicio);
  } catch (err) {
    Logger.log('Error creando evento Calendar VisitasGuiadas: ' + err.toString());
  }
}

// Borra de Google Calendar los eventos de visitas guiadas que ya no tienen fila en el
// sheet (filas eliminadas o vaciadas). El calendario CALENDAR_VG_ID es exclusivo de
// visitas guiadas, así que cualquier evento cuyo ID no siga en la columna E es huérfano.
// Se puede ejecutar a mano desde el editor con reconciliarVisitasGuiadasAhora().
function _reconciliarVisitasGuiadas(sheet) {
  sheet = sheet || SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_VISITAS_GUIADAS);
  if (!sheet) return;
  var calendar = CalendarApp.getCalendarById(CONFIG.CALENDAR_VG_ID);
  if (!calendar) return;

  SpreadsheetApp.flush(); // asegurar que los IDs recién escritos estén visibles

  // IDs de evento que siguen vivos en el sheet (columna E, índice 5)
  var vivos = {};
  var lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    var ids = sheet.getRange(2, 5, lastRow - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      var id = String(ids[i][0]).trim();
      if (id) vivos[id] = true;
    }
  }

  // Recorrer los eventos del calendario en un rango amplio y borrar los que no estén vivos.
  var desde = new Date(); desde.setFullYear(desde.getFullYear() - 1);
  var hasta = new Date(); hasta.setFullYear(hasta.getFullYear() + 2);
  var eventos = calendar.getEvents(desde, hasta);
  for (var j = 0; j < eventos.length; j++) {
    try {
      if (!vivos[eventos[j].getId()]) eventos[j].deleteEvent();
    } catch (err) {
      Logger.log('Error borrando evento huérfano VG: ' + err.toString());
    }
  }
}

// Wrapper sin argumentos para ejecutar la limpieza manualmente desde el editor de Apps Script.
function reconciliarVisitasGuiadasAhora() {
  _reconciliarVisitasGuiadas();
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.action === 'justificante') return procesarJustificante(data);
    if (data.token) return procesarEdicion(data);

    // ── Anti-spam (solo reservas nuevas) ─────────────────────────────
    // Honeypot: campo oculto que un humano deja vacío; si llega relleno, es un bot.
    if (data.website) return jsonResponse({ ok: false, error: 'Solicitud rechazada.' });
    // Cloudflare Turnstile: el token lo genera el widget del formulario y se
    // verifica aquí contra Cloudflare. Sin token válido no se crea la reserva.
    if (!verificarTurnstile(data.turnstileToken)) {
      return jsonResponse({ ok: false, error: 'Verificación de seguridad no superada.' });
    }

    // Nueva reserva
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) return jsonResponse({ ok: false, error: 'Hoja no encontrada. Ejecuta setupSheet().' });

    var nextRow = Math.max(sheet.getLastRow(), 1) + 1;
    var timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');
    var esGrupo = data.tipoVisita === 'Grupo';
    var esEscolar = data.tipoVisita === 'Grupo Escolar';
    var esGrupoOrEscolar = esGrupo || esEscolar;
    var guiada = esGrupoOrEscolar ? (data.visitaGuiada || 'No') : 'No';
    var tarifa, total;
    if (!esGrupoOrEscolar && data.entradas && data.entradas.length) {
      // Visita individual con varias entradas: total = suma de subtotales
      total = 0;
      for (var _ei = 0; _ei < data.entradas.length; _ei++) total += Number(data.entradas[_ei].subtotal) || 0;
      tarifa = total;
    } else if (esEscolar && data.entradas && data.entradas.length) {
      // Escolar: contadores por tramo → suma de subtotales + suplemento de visita guiada (si aplica).
      var baseEsc = 0;
      for (var _ee = 0; _ee < data.entradas.length; _ee++) baseEsc += Number(data.entradas[_ee].subtotal) || 0;
      tarifa = baseEsc;
      total = calcularTotal(baseEsc, guiada);
    } else if (esGrupo && esNocturnaGrupo(guiada)) {
      // Grupo con Visita Guiada Nocturna: 15 €/adulto + 5 € menores/residentes, sin suplemento.
      var _noc = calcularNocturnaGrupo(data.numPersonas, data.menores, data.residentes);
      tarifa = _noc.tarifa; total = _noc.tarifa;
    } else {
      tarifa = calcularTarifaBase(data.tipoVisita, data.tipoEntrada, data.numPersonas, data.menores, data.tramoEdad, data.residentes);
      total = calcularTotal(tarifa, guiada);
    }
    var token = Utilities.getUuid();

    var rowData = [
      timestamp,
      data.tipoVisita || '',
      data.nombre || '',
      data.email || '',
      data.telefono || '',
      data.fechaVisita || '',
      data.horaVisita || '',
      data.numPersonas || '',
      esGrupoOrEscolar ? '—' : (data.tipoEntrada || '—'),
      esEscolar ? tarifa : (esGrupo ? tarifa : tarifa),
      esGrupoOrEscolar ? guiada : '—',
      total,
      esGrupoOrEscolar ? (data.nombreCentro || '—') : '—',
      esGrupoOrEscolar ? (data.nifCif || '—') : '—',
      esGrupoOrEscolar ? (data.calleNumero || '—') : '—',
      esGrupoOrEscolar ? (data.ciudad || '—') : '—',
      esGrupoOrEscolar ? (data.cp || '—') : '—',
      esGrupoOrEscolar ? (data.necesitaFactura || 'No') : '—',
      data.comentarios || '',
      '',        // Respuesta
      '',        // ¿Aceptar?
      'Pendiente',
      token,
      '',        // Justificante
    ];

    sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);
    sheet.getRange(nextRow, 10).setNumberFormat('"€"#,##0.00');
    sheet.getRange(nextRow, 12).setNumberFormat('"€"#,##0.00');
    if ((!esGrupoOrEscolar || esEscolar) && data.desgloseEntradas) sheet.getRange(nextRow, 26).setValue(data.desgloseEntradas);
    sheet.getRange(nextRow, 27).setValue(parseInt(data.menores) || 0);
    sheet.getRange(nextRow, 28).setValue(parseInt(data.residentes) || 0);

    var cell = sheet.getRange(nextRow, COL_ACEPTAR);
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Sí', 'No'], true)
      .setAllowInvalid(false)
      .build();
    cell.setDataValidation(rule);
    cell.setFontWeight('bold').setHorizontalAlignment('center');

    GmailApp.sendEmail(
      CONFIG.EMAIL_DISENO,
      'Nueva reserva de la Catedral',
      'Nueva reserva realizada desde el formulario de la web de la Catedral.'
    );

    return jsonResponse({ ok: true, row: nextRow });

  } catch (err) {
    Logger.log('Error en doPost: ' + err.toString());
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

// Verifica el token de Cloudflare Turnstile contra el endpoint siteverify.
// El secreto NO vive en este fichero (el repo es público): se lee de las
// Propiedades del Script (Configuración del proyecto → Propiedades del script →
// clave TURNSTILE_SECRET). Si la propiedad no está puesta, se omite la
// verificación (fail-open) para no bloquear las reservas antes de configurarla.
// Ejecuta esta función UNA VEZ desde el editor de Apps Script para conceder el
// permiso de "conectar con un servicio externo" (script.external_request) que
// necesita verificarTurnstile() para llamar a Cloudflare. Al ejecutarla saldrá
// el diálogo de autorización: acéptalo. Después, redespliega una versión nueva.
function autorizarUrlFetch() {
  var resp = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'post',
    payload: { secret: 'test', response: 'test' },
    muteHttpExceptions: true
  });
  Logger.log('Permiso de UrlFetchApp concedido. Respuesta de prueba de Cloudflare: ' + resp.getContentText());
}

function verificarTurnstile(token) {
  var secret = PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET');
  if (!secret) return true; // fail-open mientras no se configure el secreto
  if (!token) return false;
  try {
    var resp = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'post',
      payload: { secret: secret, response: token },
      muteHttpExceptions: true
    });
    var result = JSON.parse(resp.getContentText());
    if (result.success !== true) console.log('Turnstile rechazado: ' + resp.getContentText());
    return result.success === true;
  } catch (e) {
    console.log('Turnstile error: ' + e);
    return false;
  }
}

function procesarJustificante(data) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
    var allData = sheet.getDataRange().getValues();

    var rowIndex = -1;
    for (var i = 1; i < allData.length; i++) {
      if (allData[i][COL_TOKEN - 1] === data.token) { rowIndex = i + 1; break; }
    }
    if (rowIndex === -1) return jsonResponse({ ok: false, error: 'Reserva no encontrada.' });

    // Guardar fichero en Drive
    var folders = DriveApp.getFoldersByName(CONFIG.CARPETA_JUSTIFICANTES);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(CONFIG.CARPETA_JUSTIFICANTES);
    var blob = Utilities.newBlob(Utilities.base64Decode(data.fileData), data.mimeType, data.fileName);
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    var fileUrl = file.getUrl();

    // Guardar URL directa — Sheets la convierte en enlace clicable automáticamente
    sheet.getRange(rowIndex, COL_JUSTIFICANTE).setValue(fileUrl);
    sheet.getRange(rowIndex, COL_ESTADO).setValue('📎 Justificante enviado');
    sheet.getRange(rowIndex, COL_ACEPTAR).setValue('');

    // Restaurar validación en ¿Aceptar?
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Sí', 'No'], true).setAllowInvalid(false).build();
    var cellAceptar = sheet.getRange(rowIndex, COL_ACEPTAR);
    cellAceptar.setDataValidation(rule);
    cellAceptar.setFontWeight('bold').setHorizontalAlignment('center');

    // Notificar al admin y a info
    var datos = mapRowToData(allData[rowIndex - 1]);
    var fechaFormato = formatearFecha(datos.fechaVisita);
    var asuntoJust = '📎 Justificante recibido — ' + datos.nombre + ' — ' + fechaFormato;
    var cuerpoJust = datos.nombre + ' (' + datos.email + ') ha subido su justificante de pago.\n\n'
      + 'Archivo: ' + data.fileName + '\nEnlace: ' + fileUrl
      + '\n\nRevisa el justificante y pulsa Sí en ¿Aceptar? para confirmar la reserva.';
    GmailApp.sendEmail(CONFIG.EMAIL_REMITENTE, asuntoJust, cuerpoJust);
    GmailApp.sendEmail(CONFIG.EMAIL_INFO, asuntoJust, cuerpoJust);

    Logger.log('Justificante recibido de ' + datos.email + ' → ' + fileUrl);
    return jsonResponse({ ok: true });

  } catch (err) {
    Logger.log('Error en procesarJustificante: ' + err.toString());
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

function procesarEdicion(data) {
  try {
    var resultado = _editarReserva(data);
    return jsonResponse(resultado);
  } catch (err) {
    Logger.log('Error en procesarEdicion: ' + err.toString());
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

// Llamada desde google.script.run (formulario web) — devuelve objeto plano, no ContentService
function procesarEdicionWeb(data) {
  try {
    return _editarReserva(data);
  } catch (err) {
    Logger.log('Error en procesarEdicionWeb: ' + err.toString());
    return { ok: false, error: err.toString() };
  }
}

function _editarReserva(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  var allData = sheet.getDataRange().getValues();
  var rowIndex = -1;
  for (var i = 1; i < allData.length; i++) {
    if (allData[i][COL_TOKEN - 1] === data.token) { rowIndex = i + 1; break; }
  }
  if (rowIndex === -1) return { ok: false, error: 'Reserva no encontrada.' };

  var ant = mapRowToData(allData[rowIndex - 1]);
  var tipoVisita = data.tipoVisita || ant.tipoVisita;
  var esGrupo = tipoVisita === 'Grupo';
  var esEscolar = tipoVisita === 'Grupo Escolar';
  var esGrupoOrEscolar = esGrupo || esEscolar;

  var visitaGuiada = esGrupoOrEscolar ? (data.visitaGuiada || 'No') : '—';
  var numPersonas = data.numPersonas || ant.numPersonas;
  var menoresVal = parseInt(data.menores) || 0;
  var residentesVal = parseInt(data.residentes) || 0;
  var menores = esGrupoOrEscolar ? 0 : menoresVal; // tarifa individual usa menores; grupos normales no
  var esNocGrupo = esGrupo && esNocturnaGrupo(visitaGuiada);
  var tipoEntrada = esGrupoOrEscolar ? '—' : (data.tipoEntrada || ant.tipoEntrada || '—');
  // Tarifas / total:
  //  · Individual/Escolar con carrito en el payload → recalcular desde los subtotales.
  //  · Individual sin carrito en el payload → conservar lo anterior (solo cambiaron fecha/datos).
  //  · Grupo nocturna → 15 €/adulto + 5 € menores/residentes (sin suplemento).
  //  · Grupo → recalcular por pagantes.
  var esInd = !esGrupoOrEscolar;
  var tieneCarrito = esInd && data.entradas && data.entradas.length;
  var nuevasTarifas, nuevoTotal;
  if (tieneCarrito) {
    var _t = 0;
    for (var _ei = 0; _ei < data.entradas.length; _ei++) _t += Number(data.entradas[_ei].subtotal) || 0;
    nuevasTarifas = _t; nuevoTotal = _t;
  } else if (esEscolar && data.entradas && data.entradas.length) {
    var _te = 0;
    for (var _ee = 0; _ee < data.entradas.length; _ee++) _te += Number(data.entradas[_ee].subtotal) || 0;
    nuevasTarifas = _te; nuevoTotal = calcularTotal(_te, visitaGuiada);
  } else if (esInd && ant.entradasDetalle && String(ant.entradasDetalle).trim()) {
    nuevasTarifas = ant.tarifas; nuevoTotal = ant.total;
  } else if (esNocGrupo) {
    var _noc = calcularNocturnaGrupo(numPersonas, menoresVal, residentesVal);
    nuevasTarifas = _noc.tarifa; nuevoTotal = _noc.tarifa;
  } else {
    nuevasTarifas = calcularTarifaBase(tipoVisita, tipoEntrada, numPersonas,
      menoresVal, data.tramoEdad || '', residentesVal);
    nuevoTotal = calcularTotal(nuevasTarifas, visitaGuiada);
  }

  sheet.getRange(rowIndex, 2).setValue(tipoVisita);
  sheet.getRange(rowIndex, 3).setValue(data.nombre || ant.nombre);
  sheet.getRange(rowIndex, 4).setValue(data.email || ant.email);
  sheet.getRange(rowIndex, 5).setValue(data.telefono || ant.telefono);
  sheet.getRange(rowIndex, 6).setValue(data.fechaVisita || ant.fechaVisita);
  sheet.getRange(rowIndex, 7).setValue(data.horaVisita || ant.horaVisita);
  sheet.getRange(rowIndex, 8).setValue(numPersonas);
  sheet.getRange(rowIndex, 9).setValue(tipoEntrada);
  sheet.getRange(rowIndex, 10).setValue(nuevasTarifas);
  sheet.getRange(rowIndex, 11).setValue(visitaGuiada);
  sheet.getRange(rowIndex, 12).setValue(nuevoTotal);
  sheet.getRange(rowIndex, 13).setValue(esGrupoOrEscolar ? (data.nombreCentro || ant.nombreCentro || '') : '—');
  sheet.getRange(rowIndex, 14).setValue(esGrupoOrEscolar ? (data.nifCif || ant.nifCif || '') : '—');
  sheet.getRange(rowIndex, 15).setValue(esGrupoOrEscolar ? (data.calleNumero || ant.calleNumero || '') : '—');
  sheet.getRange(rowIndex, 16).setValue(esGrupoOrEscolar ? (data.ciudad || ant.ciudad || '') : '—');
  sheet.getRange(rowIndex, 17).setValue(esGrupoOrEscolar ? (data.cp || ant.cp || '') : '—');
  sheet.getRange(rowIndex, 18).setValue(esGrupoOrEscolar ? (data.necesitaFactura || ant.necesitaFactura || 'No') : '—');
  sheet.getRange(rowIndex, 19).setValue(data.comentarios !== undefined ? data.comentarios : ant.comentarios);
  // Individual/Escolar: actualizar el desglose multi-línea (col Z) si cambió el carrito.
  if ((!esGrupoOrEscolar || esEscolar) && data.desgloseEntradas) sheet.getRange(rowIndex, 26).setValue(data.desgloseEntradas);
  sheet.getRange(rowIndex, 27).setValue(menoresVal);
  sheet.getRange(rowIndex, 28).setValue(residentesVal);

  var editTimestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
  sheet.getRange(rowIndex, COL_ACEPTAR).setValue('');
  sheet.getRange(rowIndex, COL_ESTADO).setValue('✏️ Editado: ' + editTimestamp);

  notificarEdicion(ant, data, rowIndex);
  return { ok: true, editado: true };
}

function notificarEdicion(ant, nuevo, row) {
  try {
    var cambios = [];
    var compares = [
      ['Tipo de visita', ant.tipoVisita, nuevo.tipoVisita],
      ['Nombre', ant.nombre, nuevo.nombre],
      ['Email', ant.email, nuevo.email],
      ['Teléfono', ant.telefono, nuevo.telefono],
      ['Fecha', String(ant.fechaVisita), nuevo.fechaVisita],
      ['Hora', String(ant.horaVisita), nuevo.horaVisita],
      ['Nº de personas', String(ant.numPersonas), String(nuevo.numPersonas || '')],
      ['Visita guiada', ant.visitaGuiada, nuevo.visitaGuiada],
      ['Comentarios', ant.comentarios, nuevo.comentarios],
    ];
    compares.forEach(function (c) {
      if (c[2] !== undefined && String(c[2] || '') !== String(c[1] || ''))
        cambios.push(c[0] + ': ' + c[1] + ' → ' + c[2]);
    });
    GmailApp.sendEmail(CONFIG.EMAIL_REMITENTE, '✏️ Reserva editada — ' + ant.nombre,
      ant.nombre + ' (' + ant.email + ') ha editado su reserva (fila ' + row + ').\n\n'
      + (cambios.length ? cambios.join('\n') : 'Sin cambios detectados.')
      + '\n\nRevisa la reserva y vuelve a indicar Sí o No en ¿Aceptar?');
  } catch (err) { Logger.log('Error notificando edición: ' + err.toString()); }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}


// ══════════════════════════════════════════════════════════════════
//  4. FORMULARIOS WEB (edición y justificante)
// ══════════════════════════════════════════════════════════════════

var CSS_COMUN = 'body{margin:0;padding:0;background:#12100E;font-family:Arial,sans-serif;color:#FDFAF4;}'
  + '.w{max-width:520px;margin:40px auto;padding:0 20px;box-sizing:border-box;}'
  + '.c{background:#1A1814;border:1px solid rgba(201,168,76,0.25);border-radius:6px;overflow:hidden;}'
  + '.h{background:linear-gradient(135deg,#1a1814,#221f14);padding:32px 40px;border-bottom:2px solid #C9A84C;text-align:center;}'
  + '.h p{margin:0 0 6px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;}'
  + '.h h1{margin:0;font-family:Georgia,serif;font-size:22px;font-weight:300;color:#FDFAF4;}'
  + '.b{padding:30px 40px;}'
  + '.info{background:rgba(201,168,76,0.06);border-left:2px solid #C9A84C;padding:12px 16px;margin-bottom:22px;font-size:12px;color:rgba(255,255,255,0.55);line-height:1.6;border-radius:0 3px 3px 0;}'
  + '.info strong{color:#C9A84C;}'
  + '.f{margin-bottom:16px;}'
  + '.f label{display:block;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#8C8070;margin-bottom:6px;}'
  + '.f input,.f textarea,.f input[type=file]{width:100%;box-sizing:border-box;background:#12100E;border:1px solid rgba(201,168,76,0.2);border-radius:3px;color:#FDFAF4;font-size:14px;padding:10px 12px;outline:none;font-family:Arial;}'
  + '.f input[type=file]{padding:8px 12px;cursor:pointer;}'
  + '.f input:focus,.f textarea:focus{border-color:#C9A84C;}'
  + '.f textarea{resize:vertical;min-height:72px;}'
  + '.btn{width:100%;background:#C9A84C;color:#12100E;border:none;border-radius:3px;padding:13px;font-size:13px;font-weight:bold;cursor:pointer;letter-spacing:1px;text-transform:uppercase;margin-top:6px;}'
  + '.btn:hover{background:#DFC07A;}'
  + '#msg{display:none;margin-top:14px;padding:11px 16px;border-radius:3px;font-size:13px;text-align:center;}'
  + '.ok{background:rgba(80,180,80,0.12);border:1px solid rgba(80,180,80,0.35);color:#80c080;}'
  + '.err{background:rgba(220,60,60,0.1);border:1px solid rgba(220,60,60,0.3);color:#e08080;}'
  + '.ft{background:#12100E;padding:18px 40px;border-top:1px solid rgba(201,168,76,0.1);text-align:center;}'
  + '.ft p{margin:0;font-size:10px;color:rgba(255,255,255,0.2);line-height:1.5;}'
  + '@media(max-width:560px){'
  + '.w{margin:0;padding:0;}'
  + '.c{border-radius:0;border-left:none;border-right:none;}'
  + '.h{padding:24px 20px;}'
  + '.h h1{font-size:18px;}'
  + '.b{padding:24px 20px;}'
  + '.ft{padding:14px 20px;}'
  + '.f input,.f textarea{font-size:16px;}' /* evita zoom en iOS */
  + '}';

function consultarDatosReserva(token) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
    var allData = sheet.getDataRange().getValues();
    var fila = null;
    for (var i = 1; i < allData.length; i++) {
      if (allData[i][COL_TOKEN - 1] === token) { fila = allData[i]; break; }
    }
    if (!fila) return jsonResponse({ ok: false, error: 'Reserva no encontrada.' });
    var d = mapRowToData(fila);
    var fechaVal = d.fechaVisita instanceof Date
      ? Utilities.formatDate(d.fechaVisita, Session.getScriptTimeZone(), 'yyyy-MM-dd')
      : String(d.fechaVisita).trim().split('/').reverse().join('-');
    var horaVal = d.horaVisita instanceof Date
      ? Utilities.formatDate(d.horaVisita, Session.getScriptTimeZone(), 'HH:mm')
      : String(d.horaVisita).trim().substring(0, 5);
    var tramoKey = '';
    if (d.tipoVisita === 'Grupo Escolar') {
      for (var k in LABELS_TRAMO) { if (LABELS_TRAMO[k] === d.tipoEntrada || k === d.tipoEntrada) { tramoKey = k; break; } }
    }
    return jsonResponse({
      ok: true,
      estado: String(fila[COL_ESTADO - 1] || ''),
      tipoVisita: d.tipoVisita,
      nombre: d.nombre, email: d.email, telefono: d.telefono,
      fechaVisita: fechaVal, horaVisita: horaVal,
      numPersonas: d.numPersonas,
      menores: d.menores, residentes: d.residentes,
      tipoEntrada: d.tipoVisita === 'Grupo Escolar' ? tramoKey : d.tipoEntrada,
      visitaGuiada: d.visitaGuiada,
      nombreCentro: d.nombreCentro, nifCif: d.nifCif,
      calleNumero: d.calleNumero, ciudad: d.ciudad, cp: d.cp,
      necesitaFactura: d.necesitaFactura, comentarios: d.comentarios,
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

function mostrarFormularioEdicion(token) {
  // Redirigir al TOP window (no al iframe sandbox de Apps Script). Si no se
  // rompe el iframe, reservas.html queda atrapado en el marco de ancho desktop
  // y pierde su diseño responsive en móvil. window.top.location lo saca a la
  // web real; el enlace target="_top" es el fallback si el navegador bloquea
  // la navegación automática del top sin interacción del usuario.
  var url = CONFIG.FORM_URL + '?editar=' + encodeURIComponent(token);
  var j = JSON.stringify(url);
  var html = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/>'
    + '<meta name="viewport" content="width=device-width, initial-scale=1"/></head>'
    + '<body style="margin:0;font-family:Arial,sans-serif;background:#12100E;color:#FDFAF4;text-align:center;padding:48px 20px;">'
    + '<p style="font-family:Georgia,serif;font-size:18px;color:#C9A84C;margin:0 0 10px;">Catedral de Santo Domingo de la Calzada</p>'
    + '<p style="color:rgba(255,255,255,0.7);font-size:14px;">Abriendo tu reserva…</p>'
    + '<p style="margin-top:18px;"><a id="go" href="' + url + '" target="_top" style="color:#C9A84C;font-size:14px;">Pulsa aquí si no se abre automáticamente</a></p>'
    + '<script>try{window.top.location.href=' + j + ';}catch(e){var a=document.getElementById("go");if(a)a.click();}<\/script>'
    + '</body></html>';
  return HtmlService.createHtmlOutput(html)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function mostrarConfirmacionCancelacion(token) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) return HtmlService.createHtmlOutput('<p>Error: hoja no encontrada.</p>');
  var allData = sheet.getDataRange().getValues();
  var fila = null;
  for (var i = 1; i < allData.length; i++) {
    if (allData[i][COL_TOKEN - 1] === token) { fila = allData[i]; break; }
  }
  if (!fila) return HtmlService.createHtmlOutput('<p style="font-family:Arial;color:#c66;padding:40px;text-align:center;">Reserva no encontrada o enlace caducado.</p>');

  var d = mapRowToData(fila);
  var estadoActual = String(fila[COL_ESTADO - 1]);
  var yaCancelada = estadoActual.indexOf('Cancelado') !== -1;

  if (yaCancelada) {
    return HtmlService.createHtmlOutput(
      '<body style="background:#12100E;font-family:Arial;text-align:center;padding:60px;color:#FDFAF4;">'
      + '<p style="font-family:Georgia;font-size:18px;color:#C9A84C;">Catedral de Santo Domingo de la Calzada</p>'
      + '<p style="color:rgba(255,255,255,0.6);">Esta reserva ya fue cancelada anteriormente.</p>'
      + '</body>'
    ).addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  var fechaFormato = formatearFecha(d.fechaVisita);
  var horaFormato = formatearHora(d.horaVisita);

  var html = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/>'
    + '<meta name="viewport" content="width=device-width,initial-scale=1"/>'
    + '<title>Cancelar reserva · Catedral</title><style>' + CSS_COMUN + '</style></head><body>'
    + '<div class="w"><div class="c">'
    + '<div class="h"><p>— Patrimonio · Santo Domingo de la Calzada —</p><h1>Cancelar <em style="color:#e0a0a0;">reserva</em></h1></div>'
    + '<div class="b">'
    + '<div class="info"><strong>Titular:</strong> ' + d.nombre + '<br/>'
    + '<strong>Fecha:</strong> ' + fechaFormato + ' a las ' + horaFormato + ' h<br/>'
    + '<strong>Tipo:</strong> ' + d.tipoVisita + (d.tipoEntrada && d.tipoEntrada !== '—' ? ' — ' + d.tipoEntrada : '') + '<br/>'
    + '<strong>Nº de personas:</strong> ' + d.numPersonas + '</div>'
    + '<p style="font-size:14px;line-height:1.7;color:rgba(255,255,255,0.65);margin:0 0 24px;">'
    + '¿Está seguro de que desea <strong style="color:#e0a0a0;">cancelar</strong> esta reserva? Esta acción no se puede deshacer.</p>'
    + '<div style="display:flex;gap:10px;flex-wrap:wrap;">'
    + '<a href="' + CONFIG.WEBAPP_URL + '?confirmarCancelacion=' + token + '" '
    + 'style="flex:1;min-width:140px;display:block;background:rgba(180,60,60,0.15);border:1px solid rgba(180,60,60,0.5);color:#e08080;'
    + 'padding:13px 10px;border-radius:3px;text-decoration:none;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;text-align:center;">'
    + '✕ Sí, cancelar reserva</a>'
    + '<a id="keepBtn" href="https://catedralsantodomingo.org/" target="_top" '
    + 'style="flex:1;min-width:140px;display:block;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.35);color:#C9A84C;'
    + 'padding:13px 10px;border-radius:3px;text-decoration:none;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;text-align:center;">'
    + '← Mantener reserva</a>'
    + '</div></div>'
    + '<div class="ft"><p>Catedral de Santo Domingo de la Calzada · Camino de Santiago · La Rioja</p></div>'
    + '</div></div>'
    // "Mantener reserva": confirma en la misma página sin cancelar nada (el
    // javascript:history.back() anterior no hacía nada dentro del iframe de
    // Apps Script). Si el JS no corriera, el href + target="_top" es el fallback.
    + '<script>(function(){var k=document.getElementById("keepBtn");if(!k)return;k.addEventListener("click",function(e){e.preventDefault();var b=document.querySelector(".b");if(b){b.innerHTML="<p style=\'text-align:center;color:#C9A84C;font-size:15px;line-height:1.8;margin:10px 0 6px;\'>✓ Tu reserva sigue activa.</p><p style=\'text-align:center;color:rgba(255,255,255,0.55);font-size:13px;line-height:1.7;margin:0;\'>No se ha cancelado nada. Ya puedes cerrar esta ventana.</p>";}});})();<\/script>'
    + '</body></html>';

  return HtmlService.createHtmlOutput(html)
    .setTitle('Cancelar reserva · Catedral de Santo Domingo')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// GET ?confirmarCancelacion= (correos antiguos): devuelve página HTML.
function procesarCancelacion(token) {
  var r = _cancelarReserva(token);
  return _paginaCancelacion(r.ok, r.error, r.datos);
}

// GET ?cancelarWeb= (cancelar.html en la web): devuelve JSON.
function _cancelarWebJSON(token) {
  var r = _cancelarReserva(token);
  return jsonResponse({ ok: r.ok, error: r.error || '' });
}

// Lógica central de cancelación. Devuelve { ok, error, datos }.
function _cancelarReserva(token) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) return { ok: false, error: 'Hoja no encontrada.' };
    var allData = sheet.getDataRange().getValues();
    var rowIndex = -1;
    for (var i = 1; i < allData.length; i++) {
      if (allData[i][COL_TOKEN - 1] === token) { rowIndex = i + 1; break; }
    }
    if (rowIndex === -1) return { ok: false, error: 'Reserva no encontrada o enlace caducado.' };

    var fila = allData[rowIndex - 1];
    var estadoActual = String(fila[COL_ESTADO - 1]);
    if (estadoActual.indexOf('Cancelado') !== -1) return { ok: false, error: 'Esta reserva ya fue cancelada anteriormente.' };

    var datos = mapRowToData(fila);

    // Mover evento a calendario Cancelado
    var nuevoEventoId = _moverEventoACancelado(datos);

    // Actualizar estado en Sheets
    sheet.getRange(rowIndex, COL_ESTADO).setValue('🚫 Cancelado por usuario');
    if (nuevoEventoId) sheet.getRange(rowIndex, COL_EVENTO_ID).setValue(nuevoEventoId);

    // Correo al usuario
    enviarCorreoCancelacion(datos);

    // Notificación a info
    var fechaF = formatearFecha(datos.fechaVisita);
    GmailApp.sendEmail(
      CONFIG.EMAIL_INFO,
      '🚫 Reserva cancelada por usuario — ' + datos.nombre + ' — ' + fechaF,
      datos.nombre + ' (' + datos.email + ') ha cancelado su reserva del ' + fechaF + ' a las ' + formatearHora(datos.horaVisita) + ' h.\n'
      + 'Tipo: ' + datos.tipoVisita + (datos.tipoEntrada && datos.tipoEntrada !== '—' ? ' — ' + datos.tipoEntrada : '') + '\n'
      + 'Nº de personas: ' + datos.numPersonas + '\nTotal: ' + fmtEur(datos.total)
    );

    Logger.log('Reserva cancelada por usuario: ' + datos.nombre + ' — fila ' + rowIndex);
    return { ok: true, error: '', datos: datos };

  } catch (err) {
    Logger.log('Error en _cancelarReserva: ' + err.toString());
    return { ok: false, error: 'Error interno: ' + err.message };
  }
}

function _paginaCancelacion(ok, error, datos) {
  var body;
  if (ok) {
    var fechaF = formatearFecha(datos.fechaVisita);
    body = '<p style="font-family:Georgia;font-size:18px;color:#C9A84C;margin:0 0 16px;">Catedral de Santo Domingo de la Calzada</p>'
      + '<p style="font-size:20px;color:#e0a0a0;margin:0 0 12px;">Reserva cancelada</p>'
      + '<p style="color:rgba(255,255,255,0.65);font-size:14px;line-height:1.7;margin:0;">Su reserva del <strong style="color:#FDFAF4;">' + fechaF + '</strong> ha sido cancelada correctamente. En breve recibirá un correo de confirmación.</p>';
  } else {
    body = '<p style="font-family:Georgia;font-size:18px;color:#C9A84C;margin:0 0 16px;">Catedral de Santo Domingo de la Calzada</p>'
      + '<p style="font-size:16px;color:#e08080;margin:0 0 12px;">No se pudo procesar la cancelación</p>'
      + '<p style="color:rgba(255,255,255,0.5);font-size:13px;">' + (error || 'Inténtelo de nuevo o contacte con nosotros en el 941 34 00 33.') + '</p>';
  }
  return HtmlService.createHtmlOutput(
    '<body style="background:#12100E;font-family:Arial;text-align:center;padding:60px 20px;color:#FDFAF4;">' + body + '</body>'
  ).addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function _strikethrough(str) {
  // Aplica el carácter Unicode U+0336 (combining long stroke overlay) a cada carácter
  var result = '';
  var i = 0;
  while (i < str.length) {
    var code = str.charCodeAt(i);
    if (code >= 0xD800 && code <= 0xDBFF && i + 1 < str.length) {
      // Par sustituto (emoji): añadir el par completo + tachado
      result += str[i] + str[i + 1] + '̶';
      i += 2;
    } else {
      result += str[i] + '̶';
      i++;
    }
  }
  return result;
}

function _moverEventoACancelado(datos) {
  if (!datos.eventoId) return null;
  var canceladoEn = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
  var calIds = [CONFIG.CALENDAR_ID, CONFIG.CALENDAR_INDIVIDUAL_ID, CONFIG.CALENDAR_ESCOLAR_ID, CONFIG.CALENDAR_VG_ID];
  var tituloOriginal = null, descripcionOriginal = null, inicioOriginal = null, finOriginal = null;

  for (var i = 0; i < calIds.length; i++) {
    try {
      var cal = CalendarApp.getCalendarById(calIds[i]);
      if (!cal) continue;
      var evt = cal.getEventById(datos.eventoId);
      if (evt) {
        tituloOriginal = evt.getTitle();
        descripcionOriginal = evt.getDescription();
        inicioOriginal = evt.getStartTime();
        finOriginal = evt.getEndTime();
        evt.deleteEvent();
        break;
      }
    } catch (e) { }
  }

  if (!inicioOriginal) return null;

  try {
    var calCancelado = CalendarApp.getCalendarById(CONFIG.CALENDAR_CANCELADO_ID);
    if (!calCancelado) return null;
    var tituloTachado = _strikethrough(tituloOriginal || '');
    var nuevaDesc = (descripcionOriginal || '') + '\nCANCELADO: ' + canceladoEn;
    var nuevoEvt = calCancelado.createEvent(tituloTachado, inicioOriginal, finOriginal, { description: nuevaDesc });
    try { nuevoEvt.setColor(CalendarApp.EventColor.GRAY); } catch (e) { }
    Logger.log('Evento movido a Cancelado: ' + tituloOriginal);
    return nuevoEvt.getId();
  } catch (err) {
    Logger.log('Error creando evento cancelado: ' + err.toString());
    return null;
  }
}

function _mostrarFormularioEdicionLegacy(token) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) return HtmlService.createHtmlOutput('<p>Error: hoja no encontrada.</p>');
  var allData = sheet.getDataRange().getValues();
  var fila = null;
  for (var i = 1; i < allData.length; i++) {
    if (allData[i][COL_TOKEN - 1] === token) { fila = allData[i]; break; }
  }
  if (!fila) return HtmlService.createHtmlOutput('<p style="font-family:Arial;color:#c66;padding:40px;text-align:center;">Reserva no encontrada o enlace caducado.</p>');

  var d = mapRowToData(fila);
  var fechaVal = d.fechaVisita instanceof Date
    ? Utilities.formatDate(d.fechaVisita, Session.getScriptTimeZone(), 'yyyy-MM-dd')
    : String(d.fechaVisita).trim().split('/').reverse().join('-');
  var horaVal = d.horaVisita instanceof Date
    ? Utilities.formatDate(d.horaVisita, Session.getScriptTimeZone(), 'HH:mm')
    : String(d.horaVisita).trim();
  var esGrupo = d.tipoVisita === 'Grupo';
  var campoMenores = ''; // columna "Menores <12" eliminada; el carrito de entradas ya recoge los menores

  var html = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/>'
    + '<meta name="viewport" content="width=device-width,initial-scale=1"/>'
    + '<title>Editar reserva · Catedral</title><style>' + CSS_COMUN + '</style></head><body>'
    + '<div class="w"><div class="c">'
    + '<div class="h"><p>— Patrimonio · Santo Domingo de la Calzada —</p><h1>Editar <em style="color:#DFC07A;">reserva</em></h1></div>'
    + '<div class="b">'
    + '<div class="info"><strong>Titular:</strong> ' + d.nombre + '<br/>'
    + '<strong>Visita:</strong> ' + d.tipoVisita + (d.tipoEntrada && d.tipoEntrada !== '—' ? ' — ' + d.tipoEntrada : '') + '<br/>'
    + 'Puede modificar fecha, hora, nº de personas y comentarios.</div>'
    + '<form id="frm">'
    + '<input type="hidden" name="token" value="' + token + '"/>'
    + '<div class="f"><label>Fecha de visita</label><input type="date" name="fechaVisita" value="' + fechaVal + '" required/></div>'
    + '<div class="f"><label>Hora de visita</label><input type="time" name="horaVisita" value="' + horaVal + '" required/></div>'
    + '<div class="f"><label>Nº de personas</label><input type="number" name="numPersonas" min="1" value="' + d.numPersonas + '" required/></div>'
    + campoMenores
    + '<div class="f"><label>Comentarios</label><textarea name="comentarios">' + (d.comentarios || '') + '</textarea></div>'
    + '<button type="submit" class="btn">Guardar cambios</button></form>'
    + '<div id="msg"></div></div>'
    + '<div class="ft"><p>Catedral de Santo Domingo de la Calzada · Camino de Santiago · La Rioja<br/>Tras editar, su reserva será revisada de nuevo.</p></div>'
    + '</div></div>'
    + '<script>'
    + 'document.getElementById("frm").addEventListener("submit",function(ev){'
    + 'ev.preventDefault();'
    + 'var fd=new FormData(this),obj={};fd.forEach(function(v,k){obj[k]=v;});'
    + 'var btn=this.querySelector("button");btn.disabled=true;btn.textContent="Guardando...";'
    + 'var m=document.getElementById("msg");'
    + 'if(typeof google==="undefined"||!google.script||!google.script.run){'
    + 'm.className="err";m.textContent="Error: la página debe abrirse desde el enlace del correo, no guardada localmente.";m.style.display="block";btn.disabled=false;btn.textContent="Guardar cambios";return;'
    + '}'
    + 'google.script.run'
    + '.withSuccessHandler(function(r){'
    + 'var m=document.getElementById("msg");'
    + 'if(r&&r.ok){m.className="ok";m.textContent="Reserva actualizada. Recibirá respuesta por correo.";btn.style.display="none";document.getElementById("frm").style.opacity=".5";}'
    + 'else{m.className="err";m.textContent="Error al guardar: "+(r&&r.error?r.error:"respuesta inesperada del servidor");btn.disabled=false;btn.textContent="Guardar cambios";}'
    + 'm.style.display="block";'
    + '})'
    + '.withFailureHandler(function(e){'
    + 'var m=document.getElementById("msg");'
    + 'var msg=e&&e.message?e.message:"error desconocido";'
    + 'var hint=msg.indexOf("not found")!==-1||msg.indexOf("no encontr")!==-1?"Publique una nueva versión de la implementación (Implementar → Gestionar → lápiz → Nueva versión) y vuelva a intentarlo.":"";'
    + 'm.className="err";m.textContent="Error técnico: "+msg+(hint?" — "+hint:"");m.style.display="block";btn.disabled=false;btn.textContent="Guardar cambios";'
    + '})'
    + '.procesarEdicionWeb(obj);'
    + '});</script></body></html>';

  return HtmlService.createHtmlOutput(html)
    .setTitle('Editar reserva · Catedral de Santo Domingo')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function mostrarFormularioJustificante(token) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) return HtmlService.createHtmlOutput('<p>Error: hoja no encontrada.</p>');
  var allData = sheet.getDataRange().getValues();
  var fila = null;
  for (var i = 1; i < allData.length; i++) {
    if (allData[i][COL_TOKEN - 1] === token) { fila = allData[i]; break; }
  }
  if (!fila) return HtmlService.createHtmlOutput('<p style="font-family:Arial;color:#c66;padding:40px;text-align:center;">Enlace no válido o caducado.</p>');

  var d = mapRowToData(fila);
  var estado = fila[COL_ESTADO - 1];
  var yaEnviado = fila[COL_JUSTIFICANTE - 1] && String(fila[COL_JUSTIFICANTE - 1]).trim();

  if (yaEnviado) {
    return HtmlService.createHtmlOutput(
      '<body style="background:#12100E;font-family:Arial;text-align:center;padding:60px;color:#FDFAF4;">'
      + '<p style="font-family:Georgia;font-size:18px;color:#C9A84C;">Catedral de Santo Domingo de la Calzada</p>'
      + '<p style="color:rgba(255,255,255,0.6);">Ya hemos recibido su justificante de pago. En breve recibirá confirmación por correo.</p>'
      + '</body>'
    );
  }

  var fechaFormato = formatearFecha(d.fechaVisita);

  var html = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/>'
    + '<meta name="viewport" content="width=device-width,initial-scale=1"/>'
    + '<title>Justificante de pago · Catedral</title><style>' + CSS_COMUN
    + '.progress{display:none;margin-top:10px;height:4px;background:rgba(201,168,76,0.15);border-radius:2px;overflow:hidden;}'
    + '.progress-bar{height:100%;width:0%;background:#C9A84C;transition:width 0.3s;border-radius:2px;}'
    + '</style></head><body>'
    + '<div class="w"><div class="c">'
    + '<div class="h"><p>— Patrimonio · Santo Domingo de la Calzada —</p><h1>Justificante de <em style="color:#DFC07A;">pago</em></h1></div>'
    + '<div class="b">'
    + '<div class="info"><strong>Titular:</strong> ' + d.nombre + '<br/>'
    + '<strong>Fecha de visita:</strong> ' + fechaFormato + '<br/>'
    + '<strong>Nº de personas:</strong> ' + d.numPersonas + '<br/>'
    + 'Adjunte el justificante bancario del pago realizado (PDF, imagen o documento).</div>'
    + '<form id="frm">'
    + '<div class="f"><label>Archivo justificante</label>'
    + '<input type="file" id="fichero" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" required/></div>'
    + '<div class="progress" id="prog"><div class="progress-bar" id="bar"></div></div>'
    + '<button type="submit" class="btn">Enviar justificante</button></form>'
    + '<div id="msg"></div></div>'
    + '<div class="ft"><p>Catedral de Santo Domingo de la Calzada · Camino de Santiago · La Rioja<br/>'
    + 'Una vez revisado el justificante, recibirá la confirmación definitiva de su reserva.</p></div>'
    + '</div></div>'
    + '<script>'
    + 'document.getElementById("frm").addEventListener("submit",function(ev){'
    + 'ev.preventDefault();'
    + 'var file=document.getElementById("fichero").files[0];'
    + 'if(!file){alert("Seleccione un archivo.");return;}'
    + 'if(file.size>20*1024*1024){alert("El archivo no puede superar 20 MB.");return;}'
    + 'var btn=this.querySelector("button");btn.disabled=true;btn.textContent="Enviando...";'
    + 'document.getElementById("prog").style.display="block";'
    + 'var reader=new FileReader();'
    + 'reader.onprogress=function(e){if(e.lengthComputable){document.getElementById("bar").style.width=Math.round(e.loaded/e.total*50)+"%";}};'
    + 'reader.onload=function(e){'
    + 'document.getElementById("bar").style.width="60%";'
    + 'var base64=e.target.result.split(",")[1];'
    + 'var obj={action:"justificante",token:"' + token + '",fileName:file.name,mimeType:file.type,fileData:base64};'
    + 'fetch("' + CONFIG.WEBAPP_URL + '",{method:"POST",redirect:"follow",body:JSON.stringify(obj)})'
    + '.then(function(r){document.getElementById("bar").style.width="90%";return r.text();})'
    + '.then(function(t){'
    + 'document.getElementById("bar").style.width="100%";'
    + 'var r;try{r=JSON.parse(t);}catch(ex){r={ok:false,error:t};}'
    + 'var m=document.getElementById("msg");'
    + 'if(r.ok){m.className="ok";m.textContent="✓ Justificante enviado correctamente. Le confirmaremos la reserva en breve.";btn.style.display="none";document.getElementById("frm").style.opacity=".5";}'
    + 'else{m.className="err";m.textContent="Error: "+(r.error||"inténtelo de nuevo");btn.disabled=false;btn.textContent="Enviar justificante";document.getElementById("prog").style.display="none";}'
    + 'm.style.display="block";})'
    + '.catch(function(ex){var m=document.getElementById("msg");m.className="err";m.textContent="Error de conexión: "+ex.message;m.style.display="block";btn.disabled=false;btn.textContent="Enviar justificante";document.getElementById("prog").style.display="none";});'
    + '};'
    + 'reader.readAsDataURL(file);'
    + '});</script></body></html>';

  return HtmlService.createHtmlOutput(html)
    .setTitle('Justificante de pago · Catedral de Santo Domingo')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


// ══════════════════════════════════════════════════════════════════
//  5. TRIGGER onEdit
// ══════════════════════════════════════════════════════════════════

function onEditTrigger(e) {
  var sheet = e.source.getActiveSheet();

  // ── Sincronizar VisitasGuiadas → Google Calendar ─────────────────
  if (sheet.getName() === CONFIG.SHEET_VISITAS_GUIADAS) {
    // Sincroniza todas las filas del rango editado (cubre pegar varias a la vez).
    var firstRow = Math.max(2, e.range.getRow());
    var lastRow = e.range.getLastRow();
    for (var r = firstRow; r <= lastRow; r++) _sincronizarFilaVisitaGuiada(sheet, r);
    // Limpia eventos huérfanos en Calendar (filas eliminadas o vaciadas).
    _reconciliarVisitasGuiadas(sheet);
    return;
  }

  if (sheet.getName() !== CONFIG.SHEET_NAME) return;

  var col = e.range.getColumn();
  var row = e.range.getRow();
  if (col !== COL_ACEPTAR || row < 2) return;

  var valor = sheet.getRange(row, COL_ACEPTAR).getValue();
  if (valor !== 'Sí' && valor !== 'No') return;

  var estado = sheet.getRange(row, COL_ESTADO).getValue();
  if (estado === '✅ Enviado' || estado === '📅 Reservado' || estado === '❌ Denegado' || estado === '✅ Confirmado' || estado === '⏳ Pendiente pago') return;

  var fila = sheet.getRange(row, 1, 1, HEADERS.length).getValues()[0];
  var datos = mapRowToData(fila);

  try {
    if (valor === 'No') {
      var esEdicionDen = String(estado).indexOf('✏️') === 0;
      if (esEdicionDen) {
        enviarDenegacionModificacion(datos);
        sheet.getRange(row, COL_ESTADO).setValue('❌ Modificación denegada');
      } else {
        enviarCorreoDenegacion(datos);
        sheet.getRange(row, COL_ESTADO).setValue('❌ Denegado');
      }
      Logger.log('Denegado fila ' + row + ' — ' + datos.nombre);
      return;
    }

    // valor === 'Sí'
    var esGrupo = datos.tipoVisita === 'Grupo';
    var esEscolar = datos.tipoVisita === 'Grupo Escolar';
    var esGrupoOrEscolar = esGrupo || esEscolar;
    var esGrupoGuiado = esGrupoOrEscolar && tieneGuiadaGrupo(datos.visitaGuiada);
    var tieneJustificante = datos.justificante && String(datos.justificante).trim();

    if (esGrupoGuiado && tieneJustificante) {
      // Segunda confirmación: pago verificado → confirmar definitivamente
      enviarConfirmacionFinalGrupo(datos);
      reenviarJustificante(datos);
      actualizarEventoCalendarJustificante(datos);
      sheet.getRange(row, COL_ESTADO).setValue('✅ Confirmado');
      Logger.log('Confirmado con pago fila ' + row + ' — ' + datos.nombre);

    } else if (esGrupoOrEscolar) {
      // Primera confirmación (o re-confirmación tras edición) de grupo o escolar
      var editadoEnGrupo = String(estado).indexOf('✏️') === 0 ? String(estado).replace('✏️ Editado: ', '') : null;
      if (editadoEnGrupo && datos.eventoId) _eliminarEventoCalendar(datos.eventoId);
      if (editadoEnGrupo) { enviarConfirmacionModificacion(datos); } else { enviarCorreoConfirmacion(datos); }
      var eventoId = crearEventoCalendar(datos, row, editadoEnGrupo);
      sheet.getRange(row, COL_EVENTO_ID).setValue(eventoId);
      if (datos.necesitaFactura === 'Sí') enviarProformaContabilidad(datos); // también tras edición → contabilidad siempre con datos actualizados
      if (esGrupoGuiado) {
        notificarGuia(datos);
        sheet.getRange(row, COL_ESTADO).setValue('⏳ Pendiente pago');
      } else {
        sheet.getRange(row, COL_ESTADO).setValue('📅 Reservado');
      }
      Logger.log((esEscolar ? 'Escolar' : 'Grupo') + ' confirmado fila ' + row + ' — ' + datos.nombre);

    } else {
      // Individual (cualquier tipo de entrada)
      var editadoEnInd = String(estado).indexOf('✏️') === 0 ? String(estado).replace('✏️ Editado: ', '') : null;
      if (editadoEnInd && datos.eventoId) _eliminarEventoCalendar(datos.eventoId);
      if (editadoEnInd) { enviarConfirmacionModificacion(datos); } else { enviarCorreoConfirmacion(datos); }
      var eventoIdInd = crearEventoCalendar(datos, row, editadoEnInd);
      if (eventoIdInd) sheet.getRange(row, COL_EVENTO_ID).setValue(eventoIdInd);
      notificarGuia(datos);
      var esNocturna = datos.tipoEntrada === 'Visita Guiada Nocturna Catedral';
      sheet.getRange(row, COL_ESTADO).setValue(esNocturna ? '📅 Reservado' : '✅ Enviado');
      Logger.log('Individual confirmado fila ' + row + ' — ' + datos.nombre);
    }

  } catch (err) {
    sheet.getRange(row, COL_ESTADO).setValue('❌ Error: ' + err.message);
    Logger.log('Error fila ' + row + ': ' + err.toString());
  }
}

function mapRowToData(fila) {
  return {
    timestamp: fila[0],
    tipoVisita: fila[1],
    nombre: fila[2],
    email: fila[3],
    telefono: fila[4],
    fechaVisita: fila[5],
    horaVisita: fila[6],
    numPersonas: fila[7],
    tipoEntrada: fila[8],
    tarifas: fila[9],
    visitaGuiada: fila[10],
    total: fila[11],
    nombreCentro: fila[12],
    nifCif: fila[13],
    calleNumero: fila[14],
    ciudad: fila[15],
    cp: fila[16],
    necesitaFactura: fila[17],
    comentarios: fila[18],
    respuesta: fila[19],
    token: fila[22],
    justificante: fila[23],
    eventoId: fila[24],
    entradasDetalle: fila[25],
    menores: fila[26],
    residentes: fila[27],
  };
}


// ══════════════════════════════════════════════════════════════════
//  6. CORREOS
// ══════════════════════════════════════════════════════════════════

function enviarCorreoConfirmacion(d) {
  GmailApp.sendEmail(d.email, 'Confirmación de visita · ' + CONFIG.NOMBRE_INSTITUCION, '', {
    htmlBody: buildEmailHTML(d),
    name: CONFIG.NOMBRE_INSTITUCION,
    from: CONFIG.EMAIL_REMITENTE,
  });
  Logger.log('Confirmación enviada a: ' + d.email);
}

function enviarConfirmacionFinalGrupo(d) {
  var fechaFormato = formatearFecha(d.fechaVisita);
  GmailApp.sendEmail(d.email, 'Reserva confirmada · ' + CONFIG.NOMBRE_INSTITUCION, '', {
    htmlBody: buildConfirmacionFinalHTML(d, fechaFormato),
    name: CONFIG.NOMBRE_INSTITUCION,
    from: CONFIG.EMAIL_REMITENTE,
  });
  Logger.log('Confirmación final enviada a: ' + d.email);
}

function reenviarJustificante(d) {
  try {
    var url = String(d.justificante).trim();
    if (!url) { Logger.log('URL del justificante vacía'); return; }
    var idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!idMatch) { Logger.log('No se pudo extraer file ID del justificante'); return; }
    var file = DriveApp.getFileById(idMatch[1]);
    var blob = file.getBlob().setName(file.getName());
    var fechaFormato = formatearFecha(d.fechaVisita);
    var asunto = 'Justificante de pago - Visita de Grupo ' + fechaFormato;
    var cuerpo = 'Justificante de pago recibido de ' + d.nombre + ' (' + (d.nombreCentro || '—') + ').\n'
      + 'Fecha de visita: ' + fechaFormato + '\nNº personas: ' + d.numPersonas
      + '\nTotal: ' + fmtEur(d.total);
    GmailApp.sendEmail(CONFIG.EMAIL_CONTABILIDAD, asunto, cuerpo, { attachments: [blob], name: CONFIG.NOMBRE_INSTITUCION });
    Logger.log('Justificante reenviado a contabilidad');
  } catch (err) {
    Logger.log('Error reenviando justificante: ' + err.toString());
  }
}

function enviarProformaContabilidad(d) {
  var fechaFormato = formatearFecha(d.fechaVisita);
  var guiada = tieneGuiadaGrupo(d.visitaGuiada) ? guiadaLabel(d.visitaGuiada) : 'No';
  GmailApp.sendEmail(CONFIG.EMAIL_CONTABILIDAD, 'Proforma para pago - Reserva de grupo para el ' + fechaFormato, '', {
    htmlBody: buildProformaHTML(d, fechaFormato, guiada),
    name: CONFIG.NOMBRE_INSTITUCION,
    from: CONFIG.EMAIL_REMITENTE,
  });
  Logger.log('Proforma enviada a contabilidad para: ' + d.nombre);
}

function enviarCorreoDenegacion(d) {
  GmailApp.sendEmail(d.email, 'Solicitud de visita · ' + CONFIG.NOMBRE_INSTITUCION, '', {
    htmlBody: buildDenialEmailHTML(d),
    name: CONFIG.NOMBRE_INSTITUCION,
    from: CONFIG.EMAIL_REMITENTE,
  });
  Logger.log('Denegación enviada a: ' + d.email);
}

function notificarGuia(d) {
  var TIPOS_GUIADA_IND = ['Visita Guiada Diurna', 'Visita Guiada VIP', 'Visita Guiada Nocturna Catedral'];
  var esGrupoOrEscolar = d.tipoVisita === 'Grupo' || d.tipoVisita === 'Grupo Escolar';
  var esIndGuiada = !esGrupoOrEscolar && TIPOS_GUIADA_IND.indexOf(d.tipoEntrada) !== -1;
  if (!esGrupoOrEscolar && !esIndGuiada) return;

  var tipo, nombreMostrar;
  if (esGrupoOrEscolar) {
    tipo = d.tipoVisita;
    nombreMostrar = d.nombreCentro || d.nombre;
  } else {
    tipo = d.tipoEntrada.replace('Visita Guiada ', '').replace(' Catedral', '');
    nombreMostrar = d.nombre;
  }

  var fechaHora = formatearFecha(d.fechaVisita) + ' ' + formatearHora(d.horaVisita);
  var asunto = 'Notificación VG ' + tipo + ' ' + nombreMostrar + ' - ' + fechaHora;
  var cuerpo = 'Se ha aprobado una visita guiada.\n\n'
    + 'Tipo: ' + tipo + '\n'
    + 'Nombre / Entidad: ' + nombreMostrar + '\n'
    + 'Fecha y hora: ' + fechaHora + '\n'
    + 'Nº personas: ' + (d.numPersonas || '—') + '\n'
    + (d.comentarios ? 'Comentarios: ' + d.comentarios + '\n' : '');

  GmailApp.sendEmail(CONFIG.EMAIL_GUIA, asunto, cuerpo, {
    name: CONFIG.NOMBRE_INSTITUCION,
    from: CONFIG.EMAIL_REMITENTE,
  });
  Logger.log('Notificación a la guía enviada: ' + asunto);
}

function enviarConfirmacionModificacion(d) {
  GmailApp.sendEmail(d.email, 'Modificación de reserva · ' + CONFIG.NOMBRE_INSTITUCION, '', {
    htmlBody: buildModificacionAprobadaHTML(d),
    name: CONFIG.NOMBRE_INSTITUCION,
    from: CONFIG.EMAIL_REMITENTE,
  });
  Logger.log('Confirmación de modificación enviada a: ' + d.email);
}

function enviarDenegacionModificacion(d) {
  GmailApp.sendEmail(d.email, 'Modificación de reserva · ' + CONFIG.NOMBRE_INSTITUCION, '', {
    htmlBody: buildModificacionDenegadaHTML(d),
    name: CONFIG.NOMBRE_INSTITUCION,
    from: CONFIG.EMAIL_REMITENTE,
  });
  Logger.log('Denegación de modificación enviada a: ' + d.email);
}

function enviarCorreoCancelacion(d) {
  GmailApp.sendEmail(d.email, 'Cancelación de reserva · ' + CONFIG.NOMBRE_INSTITUCION, '', {
    htmlBody: buildCancelacionHTML(d),
    name: CONFIG.NOMBRE_INSTITUCION,
    from: CONFIG.EMAIL_REMITENTE,
  });
  Logger.log('Correo de cancelación enviado a: ' + d.email);
}

function buildCancelacionHTML(d) {
  var fechaFormato = formatearFecha(d.fechaVisita);
  var horaFormato = formatearHora(d.horaVisita);
  var esGrupo = d.tipoVisita === 'Grupo';
  var esEscolar = d.tipoVisita === 'Grupo Escolar';
  var esGrupoOrEscolar = esGrupo || esEscolar;
  var tarifaStr = fmtEur(d.tarifas);
  var totalStr = fmtEur(d.total);

  // Mismo bloque de detalles específicos que en los correos de confirmación
  var precioTramo = esEscolar ? tramoPrecio(d.tipoEntrada) : null;
  var detallesEspecificos = esEscolar
    ? tdRow('Centro escolar', d.nombreCentro || '—')
    + tdRow('NIF / CIF', d.nifCif || '—')
    + tdRow('Desglose por tramos', d.entradasDetalle ? String(d.entradasDetalle).replace(/\n/g, '<br>') : tramoLabel(d.tipoEntrada))
    + tdRowColor('Visita guiada', guiadaLabel(d.visitaGuiada), tieneGuiadaGrupo(d.visitaGuiada) ? '#c09090' : '#8C8070')
    : esGrupo
      ? tdRow('Centro / Institución', d.nombreCentro || '—')
      + tdRow('NIF / CIF', d.nifCif || '—')
      + tdRowColor('Visita guiada', guiadaLabel(d.visitaGuiada), tieneGuiadaGrupo(d.visitaGuiada) ? '#c09090' : '#8C8070')
      : (d.entradasDetalle && String(d.entradasDetalle).trim())
        ? ''
        : tdRow('Tipo de entrada', d.tipoEntrada || '—');

  var desgloseHTML = esGrupoOrEscolar ? '' : buildDesgloseHTML(d);

  return '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/></head>'
    + '<body style="margin:0;padding:0;background:#12100E;font-family:Arial,sans-serif;">'
    + '<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#12100E"><tr><td align="center" style="padding:40px 20px;">'
    + '<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#1A1814;border:1px solid rgba(180,80,80,0.2);border-radius:6px;overflow:hidden;">'
    + '<tr><td style="background:linear-gradient(135deg,#1a1814,#1f1616);padding:40px 48px 36px;border-bottom:2px solid #c08080;text-align:center;">'
    + '<p style="margin:0 0 8px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c09090;">— Patrimonio · Santo Domingo de la Calzada —</p>'
    + '<h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:300;color:#FDFAF4;">Cancelación de <em style="color:#e0a0a0;">reserva</em></h1>'
    + '</td></tr>'
    + '<tr><td style="padding:36px 48px 28px;">'
    + '<p style="margin:0 0 12px;font-size:14px;color:#FDFAF4;">Estimado/a <strong style="color:#e0b0b0;">' + d.nombre + '</strong>,</p>'
    + '<p style="margin:0;font-size:14px;line-height:1.7;color:rgba(255,255,255,0.65);">Le confirmamos que su reserva en la <strong style="color:#FDFAF4;">' + CONFIG.NOMBRE_INSTITUCION + '</strong> ha sido <strong style="color:#e0a0a0;">cancelada correctamente</strong>.</p>'
    + '</td></tr>'
    + '<tr><td style="padding:0 48px;"><div style="height:1px;background:linear-gradient(90deg,transparent,rgba(180,80,80,0.35),transparent);"></div></td></tr>'
    + '<tr><td style="padding:28px 48px;">'
    + '<p style="margin:0 0 16px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#c09090;">✦ Datos de la reserva cancelada</p>'
    + '<table width="100%" cellpadding="0" cellspacing="0">'
    + tdRow('Tipo de visita', d.tipoVisita)
    + tdRowDate('Fecha', fechaFormato)
    + tdRowDate('Hora', horaFormato + ' h')
    + tdRow('Nº de personas', d.numPersonas)
    + detallesEspecificos
    + tdRow('Tarifas', tarifaStr)
    + desgloseHTML
    + '<tr><td style="padding:14px 0 0;"><span style="font-size:12px;font-weight:bold;color:#c09090;text-transform:uppercase;letter-spacing:1px;">TOTAL</span></td>'
    + '<td style="padding:14px 0 0;text-align:right;"><span style="font-size:22px;color:#e0b0b0;font-family:Georgia,serif;font-weight:bold;">' + totalStr + '</span></td></tr>'
    + '</table></td></tr>'
    + '<tr><td style="padding:0 48px;"><div style="height:1px;background:linear-gradient(90deg,transparent,rgba(180,80,80,0.25),transparent);"></div></td></tr>'
    + '<tr><td style="padding:28px 48px 28px;">'
    + '<table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(180,80,80,0.05);border-left:2px solid #c08080;border-radius:0 3px 3px 0;">'
    + '<tr><td style="padding:20px 24px;">'
    + '<p style="margin:0 0 8px;font-size:14px;line-height:1.7;color:rgba(255,255,255,0.75);">Esperamos poder recibirle en otra ocasión. ¡Nos vemos muy pronto!</p>'
    + '<p style="margin:0;font-size:12px;line-height:1.7;color:rgba(255,255,255,0.45);">Si realizó algún pago y tiene dudas sobre el reembolso, no dude en contactarnos al <strong style="color:rgba(255,255,255,0.65);">941 34 00 33</strong>.</p>'
    + '</td></tr></table></td></tr>'
    + footer('rgba(180,80,80,0.1)')
    + '</table></td></tr></table></body></html>';
}

function fmtEur(val) {
  var n = parseFloat(val);
  return isNaN(n) ? String(val) : n.toFixed(2).replace('.', ',') + ' €';
}

function buildDesgloseHTML(d) {
  // Visita individual con varias entradas: desglose línea a línea (guardado en la columna AA)
  if (d.entradasDetalle && String(d.entradasDetalle).trim()) {
    var _lineas = String(d.entradasDetalle).trim().split('\n');
    var _out = '';
    for (var _i = 0; _i < _lineas.length; _i++) {
      var _l = _lineas[_i].trim();
      if (!_l) continue;
      _out += '<tr><td colspan="2" style="padding:5px 0 5px 12px;border-bottom:1px solid rgba(255,255,255,0.04);"><span style="font-size:12px;color:#8a8070;">↳ ' + _l + '</span></td></tr>';
    }
    return _out;
  }
  if (d.tipoEntrada === 'Ticket Familiar') return '';
  var menores = parseInt(d.menores) || 0;
  if (menores === 0 || d.menores === '—') return '';
  var totalPersonas = parseInt(d.numPersonas) || 0;
  var adultos = totalPersonas - menores;
  var precioAdulto = PRECIOS[d.tipoEntrada] || 0;
  var precioMenor = PRECIOS_MENOR_GUIADA[d.tipoEntrada] !== undefined ? PRECIOS_MENOR_GUIADA[d.tipoEntrada] : 0;
  var row1 = '<tr><td style="padding:4px 0 4px 12px;border-bottom:1px solid rgba(255,255,255,0.03);"><span style="font-size:11px;color:#6a6050;">↳ ' + adultos + ' adulto' + (adultos !== 1 ? 's' : '') + ' × ' + fmtEur(precioAdulto) + '</span></td>'
    + '<td style="padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.03);text-align:right;"><span style="font-size:11px;color:#8a8070;">' + fmtEur(adultos * precioAdulto) + '</span></td></tr>';
  var menorLabel = precioMenor > 0
    ? menores + ' menor' + (menores !== 1 ? 'es' : '') + ' (<12 años) × ' + fmtEur(precioMenor)
    : menores + ' menor' + (menores !== 1 ? 'es' : '') + ' (<12 años) — gratuito';
  var row2 = '<tr><td style="padding:4px 0 8px 12px;border-bottom:1px solid rgba(255,255,255,0.05);"><span style="font-size:11px;color:#6a6050;">↳ ' + menorLabel + '</span></td>'
    + '<td style="padding:4px 0 8px;border-bottom:1px solid rgba(255,255,255,0.05);text-align:right;"><span style="font-size:11px;color:#8a8070;">' + (precioMenor > 0 ? fmtEur(menores * precioMenor) : 'gratuito') + '</span></td></tr>';
  return row1 + row2;
}

function buildEmailHTML(d) {
  var esGrupo = d.tipoVisita === 'Grupo';
  var esEscolar = d.tipoVisita === 'Grupo Escolar';
  var esGrupoOrEscolar = esGrupo || esEscolar;
  var esGrupoGuiado = esGrupoOrEscolar && tieneGuiadaGrupo(d.visitaGuiada);
  var esNocturna = !esGrupoOrEscolar && d.tipoEntrada === 'Visita Guiada Nocturna Catedral';
  var tieneGuiada = esGrupoGuiado || esNocturna || esNocturnaGrupo(d.visitaGuiada);
  var fechaFormato = formatearFecha(d.fechaVisita);
  var horaFormato = formatearHora(d.horaVisita);
  var horaRangoFormato = horaFormato;
  if (d.visitaGuiada === 'Casco Histórico + Catedral') {
    var _hpFin = horaFormato.split(':');
    var _hhFin = parseInt(_hpFin[0] || 0) + 2;
    horaRangoFormato = horaFormato + ' – ' + String(_hhFin).padStart(2, '0') + ':' + (_hpFin[1] || '00');
  }
  var tarifaStr = fmtEur(d.tarifas);
  var totalStr = fmtEur(d.total);

  var precioTramo = esEscolar ? tramoPrecio(d.tipoEntrada) : null;
  var detallesEspecificos = esEscolar
    ? tdRow('Centro escolar', d.nombreCentro || '—')
    + tdRow('NIF / CIF', d.nifCif || '—')
    + tdRow('Desglose por tramos', d.entradasDetalle ? String(d.entradasDetalle).replace(/\n/g, '<br>') : tramoLabel(d.tipoEntrada))
    + tdRowColor('Visita guiada', guiadaLabel(d.visitaGuiada), '#C9A84C')
    + tdRow('Necesita factura', d.necesitaFactura || '—')
    : esGrupo
      ? tdRow('Centro / Institución', d.nombreCentro || '—')
      + tdRow('NIF / CIF', d.nifCif || '—')
      + tdRowColor('Visita guiada', guiadaLabel(d.visitaGuiada), '#C9A84C')
      + tdRow('Necesita factura', d.necesitaFactura || '—')
      : (d.entradasDetalle && String(d.entradasDetalle).trim())
        ? ''
        : tdRow('Tipo de entrada', d.tipoEntrada || '—');

  var desgloseHTML = esGrupoOrEscolar ? '' : buildDesgloseHTML(d);

  var bloqueComentarios = d.comentarios
    ? '<tr><td style="padding:0 48px 28px;"><p style="margin:0 0 8px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8C8070;">Sus comentarios</p>'
    + '<p style="margin:0;font-size:13px;line-height:1.7;color:rgba(255,255,255,0.5);font-style:italic;">' + d.comentarios + '</p></td></tr>'
    : '';

  var bloqueRespuesta = (d.respuesta && String(d.respuesta).trim())
    ? '<tr><td style="padding:0 48px 28px;"><p style="margin:0 0 8px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;">✦ Mensaje de la Catedral</p>'
    + '<div style="background:rgba(201,168,76,0.08);border-left:2px solid #C9A84C;border-radius:0 3px 3px 0;padding:16px 20px;">'
    + '<p style="margin:0;font-size:13px;line-height:1.7;color:rgba(255,255,255,0.78);">' + String(d.respuesta).trim() + '</p></div></td></tr>'
    : '';

  // Bloque pago (solo para grupos con visita guiada)
  var bloquePago = (((esGrupoGuiado) || (esGrupoOrEscolar && d.necesitaFactura === 'Sí')) && d.token)
    ? '<tr><td style="padding:0 48px 28px;">'
    + '<div style="background:rgba(201,168,76,0.06);border-left:2px solid #C9A84C;border-radius:0 3px 3px 0;padding:18px 20px;">'
    + '<p style="margin:0 0 14px;font-size:13px;line-height:1.7;color:rgba(255,255,255,0.75);">'
    + 'El departamento de contabilidad les enviará la proforma para realizar el pago. '
    + 'Una vez nos envíe el justificante su reserva será confirmada automáticamente. '
    + 'Adjúntelo haciendo clic en el siguiente botón:</p>'
    + '<div style="text-align:center;">'
    + '<a href="' + CONFIG.WEBAPP_URL + '?justificante=' + d.token + '" '
    + 'style="display:inline-block;background:#C9A84C;color:#12100E;padding:12px 28px;border-radius:3px;text-decoration:none;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">'
    + 'Enviar justificante de pago</a></div></div></td></tr>'
    : '';

  var bloqueEditar = d.token
    ? '<tr><td style="padding:0 48px 28px;text-align:center;">'
    + '<a href="' + CONFIG.FORM_URL + '?editar=' + d.token + '" '
    + 'style="display:inline-block;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.35);color:#C9A84C;'
    + 'padding:10px 22px;border-radius:3px;text-decoration:none;font-size:11px;letter-spacing:1px;text-transform:uppercase;font-weight:bold;margin-right:10px;">'
    + '✎ Editar reserva</a>'
    + '<a href="' + CONFIG.CANCEL_URL + '?token=' + d.token + '" '
    + 'style="display:inline-block;background:rgba(180,60,60,0.1);border:1px solid rgba(180,60,60,0.35);color:#e08080;'
    + 'padding:10px 22px;border-radius:3px;text-decoration:none;font-size:11px;letter-spacing:1px;text-transform:uppercase;font-weight:bold;">'
    + '✕ Cancelar reserva</a></td></tr>'
    : '';

  return emailWrap(
    '<tr><td style="background:linear-gradient(135deg,#1a1814,#221f14);padding:40px 48px 36px;border-bottom:2px solid #C9A84C;text-align:center;">'
    + '<p style="margin:0 0 8px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;">— Patrimonio · Santo Domingo de la Calzada —</p>'
    + '<h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:300;color:#FDFAF4;">Confirmación de <em style="color:#DFC07A;">visita</em></h1>'
    + '</td></tr>'
    + '<tr><td style="padding:36px 48px 24px;">'
    + '<p style="margin:0 0 12px;font-size:14px;color:#FDFAF4;">Estimado/a <strong style="color:#DFC07A;">' + d.nombre + '</strong>,</p>'
    + '<p style="margin:0;font-size:14px;line-height:1.7;color:rgba(255,255,255,0.65);">Hemos recibido su solicitud de visita' + (esGrupo ? ' en grupo' : '') + ' a la <strong style="color:#FDFAF4;">' + CONFIG.NOMBRE_INSTITUCION + '</strong>. A continuación encontrará el resumen de su reserva.</p>'
    + '</td></tr>'
    + divider()
    + '<tr><td style="padding:28px 48px;">'
    + '<p style="margin:0 0 16px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;">✦ Detalles de la reserva</p>'
    + '<table width="100%" cellpadding="0" cellspacing="0">'
    + tdRow('Tipo de visita', d.tipoVisita)
    + tdRowDate('Fecha', fechaFormato)
    + tdRowDate('Hora', horaRangoFormato + ' h')
    + tdRow('Nº de personas', d.numPersonas)
    + detallesEspecificos
    + tdRow('Tarifas', tarifaStr)
    + desgloseHTML
    + '<tr><td style="padding:14px 0 0;"><span style="font-size:12px;font-weight:bold;color:#C9A84C;text-transform:uppercase;letter-spacing:1px;">TOTAL</span></td>'
    + '<td style="padding:14px 0 0;text-align:right;"><span style="font-size:22px;color:#DFC07A;font-family:Georgia,serif;font-weight:bold;">' + totalStr + '</span></td></tr>'
    + '</table></td></tr>'
    + divider('0.25')
    + '<tr><td style="padding:28px 48px;">'
    + '<table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(201,168,76,0.06);border-left:2px solid #C9A84C;border-radius:0 3px 3px 0;">'
    + '<tr><td style="padding:16px 20px;"><p style="margin:0;font-size:12px;line-height:1.7;color:rgba(255,255,255,0.65);"><strong style="color:#C9A84C;">Importante:</strong> '
    + (tieneGuiada
      ? 'Rogamos acudir con 10 minutos de antelación a las taquillas de la Catedral. Las visitas guiadas comienzan a la hora reservada y no podrán retrasarse ni prolongarse fuera del horario asignado.<br/>Horarios sujetos a modificaciones por celebraciones litúrgicas.'
      : 'Horarios sujetos a modificaciones por celebraciones litúrgicas.')
    + (esGrupoGuiado ? ' Una vez confirmado el pago, la reserva quedará definitivamente efectuada.' : '')
    + (!tieneGuiada && esGrupoOrEscolar ? ' La reserva será registrada una vez confirmada.' : '')
    + (!esGrupoOrEscolar && !esNocturna ? ' Recojan sus entradas en las taquillas de nuestros monumentos.' : '')
    + (esEscolar ? ' Las tarifas se calculan por tramo de edad y por tipo de visita.' : '')
    + '</p></td></tr></table></td></tr>'
    + bloqueComentarios
    + bloqueRespuesta
    + bloquePago
    + bloqueEditar
    + footer('rgba(201,168,76,0.12)')
  );
}

function buildConfirmacionFinalHTML(d, fechaFormato) {
  var totalStr = fmtEur(d.total);
  var _horaFin2 = formatearHora(d.horaVisita);
  if (d.visitaGuiada === 'Casco Histórico + Catedral') {
    var _hF2base = formatearHora(d.horaVisita);
    var _hpF2 = _hF2base.split(':');
    _horaFin2 = _hF2base + ' – ' + String(parseInt(_hpF2[0] || 0) + 2).padStart(2, '0') + ':' + (_hpF2[1] || '00');
  }
  return emailWrap(
    '<tr><td style="background:linear-gradient(135deg,#1a1814,#141f14);padding:40px 48px 36px;border-bottom:2px solid #60c080;text-align:center;">'
    + '<p style="margin:0 0 8px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#80c080;">— Patrimonio · Santo Domingo de la Calzada —</p>'
    + '<h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:300;color:#FDFAF4;">Reserva <em style="color:#a0e0a0;">confirmada</em></h1>'
    + '</td></tr>'
    + '<tr><td style="padding:36px 48px 28px;">'
    + '<p style="margin:0 0 12px;font-size:14px;color:#FDFAF4;">Estimado/a <strong style="color:#a0e0a0;">' + d.nombre + '</strong>,</p>'
    + '<p style="margin:0;font-size:14px;line-height:1.7;color:rgba(255,255,255,0.65);">Hemos recibido y verificado su justificante de pago. Su reserva de visita guiada en la <strong style="color:#FDFAF4;">' + CONFIG.NOMBRE_INSTITUCION + '</strong> queda <strong style="color:#a0e0a0;">definitivamente confirmada</strong>.</p>'
    + '</td></tr>'
    + '<tr><td style="padding:0 48px;"><div style="height:1px;background:linear-gradient(90deg,transparent,rgba(80,180,80,0.35),transparent);"></div></td></tr>'
    + '<tr><td style="padding:28px 48px;">'
    + '<table width="100%" cellpadding="0" cellspacing="0">'
    + tdRowDate('Fecha', fechaFormato)
    + tdRowDate('Hora', _horaFin2 + ' h')
    + tdRow('Nº de personas', d.numPersonas)
    + tdRow('Centro / Institución', d.nombreCentro || '—')
    + '<tr><td style="padding:14px 0 0;"><span style="font-size:12px;font-weight:bold;color:#80c080;text-transform:uppercase;letter-spacing:1px;">TOTAL PAGADO</span></td>'
    + '<td style="padding:14px 0 0;text-align:right;"><span style="font-size:22px;color:#a0e0a0;font-family:Georgia,serif;font-weight:bold;">' + totalStr + '</span></td></tr>'
    + '</table></td></tr>'
    + '<tr><td style="padding:28px 48px;">'
    + '<table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(80,180,80,0.06);border-left:2px solid #60c080;border-radius:0 3px 3px 0;">'
    + '<tr><td style="padding:16px 20px;"><p style="margin:0;font-size:12px;line-height:1.7;color:rgba(255,255,255,0.65);">Les esperamos el día de su visita. Si tienen alguna duda puede ponerse en contacto con nosotros al <strong style="color:rgba(255,255,255,0.85);">941 34 00 33</strong>.</p></td></tr></table></td></tr>'
    + (d.token
      ? '<tr><td style="padding:0 48px 28px;text-align:center;">'
      + '<a href="' + CONFIG.CANCEL_URL + '?token=' + d.token + '" '
      + 'style="display:inline-block;background:rgba(180,60,60,0.1);border:1px solid rgba(180,60,60,0.35);color:#e08080;'
      + 'padding:10px 28px;border-radius:3px;text-decoration:none;font-size:11px;letter-spacing:1px;text-transform:uppercase;font-weight:bold;">'
      + '✕ Cancelar reserva</a></td></tr>'
      : '')
    + footer('rgba(80,180,80,0.08)')
  );
}

function buildDenialEmailHTML(d) {
  var fechaFormato = formatearFecha(d.fechaVisita);
  var esGrupo = d.tipoVisita === 'Grupo';
  var bloqueMotivo = (d.respuesta && String(d.respuesta).trim())
    ? '<tr><td style="padding:0 48px 28px;"><p style="margin:0 0 8px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#c09090;">Motivo</p>'
    + '<div style="background:rgba(200,80,80,0.06);border-left:2px solid #c08080;border-radius:0 3px 3px 0;padding:16px 20px;">'
    + '<p style="margin:0;font-size:13px;line-height:1.7;color:rgba(255,255,255,0.72);">' + String(d.respuesta).trim() + '</p></div></td></tr>'
    : '';
  var bloqueEditar = d.token
    ? '<tr><td style="padding:0 48px 28px;text-align:center;">'
    + '<a href="' + CONFIG.FORM_URL + '?editar=' + d.token + '" '
    + 'style="display:inline-block;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.35);color:#C9A84C;'
    + 'padding:10px 28px;border-radius:3px;text-decoration:none;font-size:11px;letter-spacing:1px;text-transform:uppercase;font-weight:bold;">'
    + '✎ Editar reserva</a></td></tr>'
    : '';

  return '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/></head>'
    + '<body style="margin:0;padding:0;background:#12100E;font-family:Arial,sans-serif;">'
    + '<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#12100E"><tr><td align="center" style="padding:40px 20px;">'
    + '<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#1A1814;border:1px solid rgba(180,80,80,0.25);border-radius:6px;overflow:hidden;">'
    + '<tr><td style="background:linear-gradient(135deg,#1a1814,#1f1616);padding:40px 48px 36px;border-bottom:2px solid #c08080;text-align:center;">'
    + '<p style="margin:0 0 8px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c09090;">— Patrimonio · Santo Domingo de la Calzada —</p>'
    + '<h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:300;color:#FDFAF4;">Solicitud de <em style="color:#e0a0a0;">visita</em></h1>'
    + '</td></tr>'
    + '<tr><td style="padding:36px 48px 28px;">'
    + '<p style="margin:0 0 12px;font-size:14px;color:#FDFAF4;">Estimado/a <strong style="color:#e0b0b0;">' + d.nombre + '</strong>,</p>'
    + '<p style="margin:0;font-size:14px;line-height:1.7;color:rgba(255,255,255,0.65);">Lamentamos informarle de que no ha sido posible confirmar su solicitud de visita'
    + (esGrupo ? ' en grupo' : '') + ' a la <strong style="color:#FDFAF4;">' + CONFIG.NOMBRE_INSTITUCION + '</strong>'
    + ' para el <strong style="color:#FDFAF4;">' + fechaFormato + '</strong>.</p>'
    + '</td></tr>'
    + '<tr><td style="padding:0 48px;"><div style="height:1px;background:linear-gradient(90deg,transparent,rgba(180,80,80,0.35),transparent);"></div></td></tr>'
    + bloqueMotivo + bloqueEditar
    + '<tr><td style="padding:28px 48px;">'
    + '<table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(180,80,80,0.05);border-left:2px solid #c08080;border-radius:0 3px 3px 0;">'
    + '<tr><td style="padding:16px 20px;"><p style="margin:0;font-size:12px;line-height:1.7;color:rgba(255,255,255,0.65);">Si lo desea, puede editar su reserva o ponerse en contacto con nosotros al <strong style="color:rgba(255,255,255,0.85);">941 34 00 33</strong> para resolver cualquier duda.</p></td></tr></table></td></tr>'
    + footer('rgba(180,80,80,0.1)')
    + '</table></td></tr></table></body></html>';
}

function buildModificacionAprobadaHTML(d) {
  var esGrupo = d.tipoVisita === 'Grupo';
  var esEscolar = d.tipoVisita === 'Grupo Escolar';
  var esGrupoOrEscolar = esGrupo || esEscolar;
  var esGrupoGuiado = esGrupoOrEscolar && tieneGuiadaGrupo(d.visitaGuiada);
  var esNocturna = !esGrupoOrEscolar && d.tipoEntrada === 'Visita Guiada Nocturna Catedral';
  var tieneGuiada = esGrupoGuiado || esNocturna || esNocturnaGrupo(d.visitaGuiada);
  var fechaFormato = formatearFecha(d.fechaVisita);
  var horaFormato = formatearHora(d.horaVisita);
  var horaRangoFormato = horaFormato;
  if (d.visitaGuiada === 'Casco Histórico + Catedral') {
    var _hpFin3 = horaFormato.split(':');
    var _hhFin3 = parseInt(_hpFin3[0] || 0) + 2;
    horaRangoFormato = horaFormato + ' – ' + String(_hhFin3).padStart(2, '0') + ':' + (_hpFin3[1] || '00');
  }
  var tarifaStr = fmtEur(d.tarifas);
  var totalStr = fmtEur(d.total);

  // Mismo bloque de detalles específicos que buildEmailHTML
  var precioTramo = esEscolar ? tramoPrecio(d.tipoEntrada) : null;
  var detallesEspecificos = esEscolar
    ? tdRow('Centro escolar', d.nombreCentro || '—')
    + tdRow('NIF / CIF', d.nifCif || '—')
    + tdRow('Desglose por tramos', d.entradasDetalle ? String(d.entradasDetalle).replace(/\n/g, '<br>') : tramoLabel(d.tipoEntrada))
    + tdRowColor('Visita guiada', guiadaLabel(d.visitaGuiada), '#C9A84C')
    + tdRow('Necesita factura', d.necesitaFactura || '—')
    : esGrupo
      ? tdRow('Centro / Institución', d.nombreCentro || '—')
      + tdRow('NIF / CIF', d.nifCif || '—')
      + tdRowColor('Visita guiada', guiadaLabel(d.visitaGuiada), '#C9A84C')
      + tdRow('Necesita factura', d.necesitaFactura || '—')
      : (d.entradasDetalle && String(d.entradasDetalle).trim())
        ? ''
        : tdRow('Tipo de entrada', d.tipoEntrada || '—');

  var desgloseHTML = esGrupoOrEscolar ? '' : buildDesgloseHTML(d);

  var bloqueRespuesta = (d.respuesta && String(d.respuesta).trim())
    ? '<tr><td style="padding:0 48px 28px;"><p style="margin:0 0 8px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;">✦ Mensaje de la Catedral</p>'
    + '<div style="background:rgba(201,168,76,0.08);border-left:2px solid #C9A84C;border-radius:0 3px 3px 0;padding:16px 20px;">'
    + '<p style="margin:0;font-size:13px;line-height:1.7;color:rgba(255,255,255,0.78);">' + String(d.respuesta).trim() + '</p></div></td></tr>'
    : '';

  var bloqueComentarios = d.comentarios
    ? '<tr><td style="padding:0 48px 28px;"><p style="margin:0 0 8px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8C8070;">Sus comentarios</p>'
    + '<p style="margin:0;font-size:13px;line-height:1.7;color:rgba(255,255,255,0.5);font-style:italic;">' + d.comentarios + '</p></td></tr>'
    : '';

  var bloquePago = (((esGrupoGuiado) || (esGrupoOrEscolar && d.necesitaFactura === 'Sí')) && d.token)
    ? '<tr><td style="padding:0 48px 28px;">'
    + '<div style="background:rgba(201,168,76,0.06);border-left:2px solid #C9A84C;border-radius:0 3px 3px 0;padding:18px 20px;">'
    + '<p style="margin:0 0 14px;font-size:13px;line-height:1.7;color:rgba(255,255,255,0.75);">'
    + 'Recuerde que para confirmar definitivamente la reserva modificada debe enviar el justificante de pago:</p>'
    + '<div style="text-align:center;">'
    + '<a href="' + CONFIG.WEBAPP_URL + '?justificante=' + d.token + '" '
    + 'style="display:inline-block;background:#C9A84C;color:#12100E;padding:12px 28px;border-radius:3px;text-decoration:none;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">'
    + 'Enviar justificante de pago</a></div></div></td></tr>'
    : '';

  return emailWrap(
    '<tr><td style="background:linear-gradient(135deg,#1a1814,#221f14);padding:40px 48px 36px;border-bottom:2px solid #C9A84C;text-align:center;">'
    + '<p style="margin:0 0 8px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;">— Patrimonio · Santo Domingo de la Calzada —</p>'
    + '<h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:300;color:#FDFAF4;">Modificación de <em style="color:#DFC07A;">reserva</em></h1>'
    + '</td></tr>'
    + '<tr><td style="padding:36px 48px 24px;">'
    + '<p style="margin:0 0 12px;font-size:14px;color:#FDFAF4;">Estimado/a <strong style="color:#DFC07A;">' + d.nombre + '</strong>,</p>'
    + '<p style="margin:0;font-size:14px;line-height:1.7;color:rgba(255,255,255,0.65);">Su solicitud de modificación de reserva en la <strong style="color:#FDFAF4;">' + CONFIG.NOMBRE_INSTITUCION + '</strong> ha sido <strong style="color:#DFC07A;">aprobada</strong>. A continuación encontrará los datos actualizados de su visita.</p>'
    + '</td></tr>'
    + divider()
    + '<tr><td style="padding:28px 48px;">'
    + '<p style="margin:0 0 16px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;">✦ Datos actualizados de la reserva</p>'
    + '<table width="100%" cellpadding="0" cellspacing="0">'
    + tdRow('Tipo de visita', d.tipoVisita)
    + tdRowDate('Fecha', fechaFormato)
    + tdRowDate('Hora', horaRangoFormato + ' h')
    + tdRow('Nº de personas', d.numPersonas)
    + detallesEspecificos
    + tdRow('Tarifas', tarifaStr)
    + desgloseHTML
    + '<tr><td style="padding:14px 0 0;"><span style="font-size:12px;font-weight:bold;color:#C9A84C;text-transform:uppercase;letter-spacing:1px;">TOTAL</span></td>'
    + '<td style="padding:14px 0 0;text-align:right;"><span style="font-size:22px;color:#DFC07A;font-family:Georgia,serif;font-weight:bold;">' + totalStr + '</span></td></tr>'
    + '</table></td></tr>'
    + divider('0.25')
    + '<tr><td style="padding:28px 48px;">'
    + '<table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(201,168,76,0.06);border-left:2px solid #C9A84C;border-radius:0 3px 3px 0;">'
    + '<tr><td style="padding:16px 20px;"><p style="margin:0;font-size:12px;line-height:1.7;color:rgba(255,255,255,0.65);"><strong style="color:#C9A84C;">Importante:</strong> '
    + (tieneGuiada
      ? 'Rogamos acudir con 10 minutos de antelación a las taquillas de la Catedral. Las visitas guiadas comienzan a la hora reservada y no podrán retrasarse ni prolongarse fuera del horario asignado.<br/>Horarios sujetos a modificaciones por celebraciones litúrgicas.'
      : 'Horarios sujetos a modificaciones por celebraciones litúrgicas.')
    + (esGrupoGuiado ? ' Una vez confirmado el pago, la reserva quedará definitivamente efectuada.' : '')
    + (!tieneGuiada && esGrupoOrEscolar ? ' La reserva será registrada una vez confirmada.' : '')
    + (!esGrupoOrEscolar && !esNocturna ? ' Recojan sus entradas en las taquillas de nuestros monumentos.' : '')
    + ' Si tiene alguna duda puede contactarnos en el <strong style="color:rgba(255,255,255,0.85);">941 34 00 33</strong>.'
    + '</p></td></tr></table></td></tr>'
    + bloqueComentarios
    + bloqueRespuesta
    + bloquePago
    + (d.token
      ? '<tr><td style="padding:0 48px 28px;text-align:center;">'
      + '<a href="' + CONFIG.FORM_URL + '?editar=' + d.token + '" '
      + 'style="display:inline-block;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.35);color:#C9A84C;'
      + 'padding:10px 22px;border-radius:3px;text-decoration:none;font-size:11px;letter-spacing:1px;text-transform:uppercase;font-weight:bold;margin-right:10px;">'
      + '✎ Editar reserva</a>'
      + '<a href="' + CONFIG.CANCEL_URL + '?token=' + d.token + '" '
      + 'style="display:inline-block;background:rgba(180,60,60,0.1);border:1px solid rgba(180,60,60,0.35);color:#e08080;'
      + 'padding:10px 22px;border-radius:3px;text-decoration:none;font-size:11px;letter-spacing:1px;text-transform:uppercase;font-weight:bold;">'
      + '✕ Cancelar reserva</a></td></tr>'
      : '')
    + footer('rgba(201,168,76,0.12)')
  );
}

function buildModificacionDenegadaHTML(d) {
  var fechaFormato = formatearFecha(d.fechaVisita);
  var esGrupo = d.tipoVisita === 'Grupo';

  var bloqueMotivo = (d.respuesta && String(d.respuesta).trim())
    ? '<tr><td style="padding:0 48px 28px;"><p style="margin:0 0 8px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#c09090;">Motivo</p>'
    + '<div style="background:rgba(200,80,80,0.06);border-left:2px solid #c08080;border-radius:0 3px 3px 0;padding:16px 20px;">'
    + '<p style="margin:0;font-size:13px;line-height:1.7;color:rgba(255,255,255,0.72);">' + String(d.respuesta).trim() + '</p></div></td></tr>'
    : '';

  return '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/></head>'
    + '<body style="margin:0;padding:0;background:#12100E;font-family:Arial,sans-serif;">'
    + '<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#12100E"><tr><td align="center" style="padding:40px 20px;">'
    + '<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#1A1814;border:1px solid rgba(180,80,80,0.25);border-radius:6px;overflow:hidden;">'
    + '<tr><td style="background:linear-gradient(135deg,#1a1814,#1f1616);padding:40px 48px 36px;border-bottom:2px solid #c08080;text-align:center;">'
    + '<p style="margin:0 0 8px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c09090;">— Patrimonio · Santo Domingo de la Calzada —</p>'
    + '<h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:300;color:#FDFAF4;">Modificación de <em style="color:#e0a0a0;">reserva</em></h1>'
    + '</td></tr>'
    + '<tr><td style="padding:36px 48px 28px;">'
    + '<p style="margin:0 0 12px;font-size:14px;color:#FDFAF4;">Estimado/a <strong style="color:#e0b0b0;">' + d.nombre + '</strong>,</p>'
    + '<p style="margin:0;font-size:14px;line-height:1.7;color:rgba(255,255,255,0.65);">Lamentamos informarle de que su solicitud de modificación de reserva'
    + (esGrupo ? ' de grupo' : '') + ' en la <strong style="color:#FDFAF4;">' + CONFIG.NOMBRE_INSTITUCION + '</strong>'
    + ' para el <strong style="color:#FDFAF4;">' + fechaFormato + '</strong> <strong style="color:#e0a0a0;">no ha podido ser aprobada</strong>.</p>'
    + '</td></tr>'
    + '<tr><td style="padding:0 48px;"><div style="height:1px;background:linear-gradient(90deg,transparent,rgba(180,80,80,0.35),transparent);"></div></td></tr>'
    + bloqueMotivo
    + '<tr><td style="padding:28px 48px;">'
    + '<table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(180,80,80,0.05);border-left:2px solid #c08080;border-radius:0 3px 3px 0;">'
    + '<tr><td style="padding:16px 20px;"><p style="margin:0;font-size:12px;line-height:1.7;color:rgba(255,255,255,0.65);">Su reserva original sigue en vigor con los datos previos a la modificación. Para cualquier consulta puede ponerse en contacto con nosotros al <strong style="color:rgba(255,255,255,0.85);">941 34 00 33</strong>.</p></td></tr></table></td></tr>'
    + footer('rgba(180,80,80,0.1)')
    + '</table></td></tr></table></body></html>';
}

function buildProformaHTML(d, fechaFormato, guiada) {
  var horaFormato = formatearHora(d.horaVisita);
  var esEscolar = d.tipoVisita === 'Grupo Escolar';
  var subtituloProforma = esEscolar ? 'Reserva de grupo escolar confirmada' : 'Reserva de grupo confirmada';
  var labelCentro = esEscolar ? 'Centro escolar' : 'Centro / Institución';

  var tramoEsc = d.tipoEntrada;
  var precioEsc = tramoPrecio(tramoEsc);
  if (precioEsc === null) precioEsc = 0;
  // Pagantes = totales − menores − residentes (base del desglose de grupo/escolar/nocturna).
  var _menP = parseInt(d.menores) || 0, _resP = parseInt(d.residentes) || 0;
  var _aduP = Math.max(0, (parseInt(d.numPersonas) || 0) - _menP - _resP);
  var _redP = _menP + _resP;
  var subtotalEsc = precioEsc * _aduP;
  var bloqueImporte = esEscolar
    ? '<tr><td style="padding:28px 48px;"><p style="margin:0 0 16px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;">✦ Tarifas escolares</p>'
    + '<table width="100%" cellpadding="0" cellspacing="0">'
    + tdRow('Desglose por tramos', d.entradasDetalle ? String(d.entradasDetalle).replace(/\n/g, '<br>') : tramoLabel(tramoEsc))
    + tdRow('Nº de alumnos', d.numPersonas)
    + (tieneGuiadaGrupo(d.visitaGuiada) ? tdRowColor('Suplemento visita guiada', '+ ' + fmtEur(d.visitaGuiada === 'Casco Histórico + Catedral' ? SUPLEMENTO_VISITA_GUIADA_CASCO : SUPLEMENTO_VISITA_GUIADA) + ' / grupo', '#C9A84C') : '')
    + '<tr><td style="padding:14px 0 0;"><span style="font-size:12px;font-weight:bold;color:#C9A84C;text-transform:uppercase;letter-spacing:1px;">TOTAL A PAGAR</span></td>'
    + '<td style="padding:14px 0 0;text-align:right;"><span style="font-size:24px;color:#DFC07A;font-family:Georgia,serif;font-weight:bold;">' + fmtEur(d.total) + '</span></td></tr>'
    + '</table></td></tr>'
    : esNocturnaGrupo(d.visitaGuiada)
    ? '<tr><td style="padding:28px 48px;"><p style="margin:0 0 16px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;">✦ Importe · Visita Guiada Nocturna</p>'
    + '<table width="100%" cellpadding="0" cellspacing="0">'
    + tdRow(_aduP + ' adulto' + (_aduP !== 1 ? 's' : '') + ' × ' + fmtEur(15), fmtEur(_aduP * 15))
    + (_redP > 0 ? tdRow(_redP + ' menor' + (_redP !== 1 ? 'es' : '') + '/residente' + (_redP !== 1 ? 's' : '') + ' × ' + fmtEur(5), fmtEur(_redP * 5)) : '')
    + '<tr><td style="padding:14px 0 0;"><span style="font-size:12px;font-weight:bold;color:#C9A84C;text-transform:uppercase;letter-spacing:1px;">TOTAL A PAGAR</span></td>'
    + '<td style="padding:14px 0 0;text-align:right;"><span style="font-size:24px;color:#DFC07A;font-family:Georgia,serif;font-weight:bold;">' + fmtEur(d.total) + '</span></td></tr>'
    + '</table></td></tr>'
    : '<tr><td style="padding:28px 48px;"><p style="margin:0 0 16px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;">✦ Importe</p>'
    + '<table width="100%" cellpadding="0" cellspacing="0">'
    + tdRow('Tarifa base (' + _aduP + ' pagantes × ' + fmtEur(PRECIO_GRUPO_POR_PERSONA) + ', mín. ' + fmtEur(PRECIO_GRUPO_MINIMO) + ')', fmtEur(d.tarifas))
    + (tieneGuiadaGrupo(d.visitaGuiada) ? tdRow('Suplemento visita guiada', fmtEur(d.visitaGuiada === 'Casco Histórico + Catedral' ? SUPLEMENTO_VISITA_GUIADA_CASCO : SUPLEMENTO_VISITA_GUIADA)) : '')
    + '<tr><td style="padding:14px 0 0;"><span style="font-size:12px;font-weight:bold;color:#C9A84C;text-transform:uppercase;letter-spacing:1px;">TOTAL A PAGAR</span></td>'
    + '<td style="padding:14px 0 0;text-align:right;"><span style="font-size:24px;color:#DFC07A;font-family:Georgia,serif;font-weight:bold;">' + fmtEur(d.total) + '</span></td></tr>'
    + '</table></td></tr>';

  return emailWrap(
    '<tr><td style="background:linear-gradient(135deg,#1a1814,#221f14);padding:36px 48px 32px;border-bottom:2px solid #C9A84C;text-align:center;">'
    + '<p style="margin:0 0 6px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;">— Contabilidad · Catedral de Santo Domingo —</p>'
    + '<h1 style="margin:0;font-family:Georgia,serif;font-size:26px;font-weight:300;color:#FDFAF4;">Proforma para <em style="color:#DFC07A;">pago</em></h1>'
    + '<p style="margin:10px 0 0;font-size:12px;color:rgba(255,255,255,0.4);">' + subtituloProforma + '</p>'
    + '</td></tr>'
    + '<tr><td style="padding:28px 48px;"><p style="margin:0 0 16px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;">✦ Datos del grupo</p>'
    + '<table width="100%" cellpadding="0" cellspacing="0">'
    + tdRow('Responsable', d.nombre) + tdRow('Email', d.email) + tdRow('Teléfono', d.telefono || '—')
    + tdRow(labelCentro, d.nombreCentro || '—') + tdRow('NIF / CIF', d.nifCif || '—')
    + tdRow('Calle y número', d.calleNumero || '—') + tdRow('Ciudad', d.ciudad || '—') + tdRow('Código postal', d.cp || '—')
    + tdRow('Necesita factura', d.necesitaFactura || '—')
    + '</table></td></tr>'
    + divider('0.3')
    + '<tr><td style="padding:28px 48px;"><p style="margin:0 0 16px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;">✦ Detalles de la visita</p>'
    + '<table width="100%" cellpadding="0" cellspacing="0">'
    + tdRowDate('Fecha', fechaFormato) + tdRowDate('Hora', horaFormato + ' h') + tdRow('Nº de alumnos / personas', d.numPersonas)
    + tdRowColor('Visita guiada', guiada, tieneGuiadaGrupo(d.visitaGuiada) ? '#C9A84C' : '#FDFAF4')
    + tdRow('Comentarios', d.comentarios || '—')
    + (d.respuesta ? tdRow('Respuesta enviada al cliente', d.respuesta) : '')
    + '</table></td></tr>'
    + divider('0.3')
    + bloqueImporte
    + footer('rgba(201,168,76,0.12)')
  );
}

// Helpers HTML de correo
function emailWrap(contenido) {
  return '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/></head>'
    + '<body style="margin:0;padding:0;background:#12100E;font-family:Arial,sans-serif;">'
    + '<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#12100E"><tr><td align="center" style="padding:40px 20px;">'
    + '<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#1A1814;border:1px solid rgba(201,168,76,0.2);border-radius:6px;overflow:hidden;">'
    + contenido
    + '</table></td></tr></table></body></html>';
}
function divider(opacity) {
  var op = opacity || '0.4';
  return '<tr><td style="padding:0 48px;"><div style="height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,' + op + '),transparent);"></div></td></tr>';
}
function footer(borderColor) {
  return '<tr><td style="background:#12100E;padding:28px 48px;border-top:1px solid ' + (borderColor || 'rgba(201,168,76,0.12)') + ';text-align:center;">'
    + '<p style="margin:0 0 8px;font-family:Georgia,serif;font-size:15px;font-weight:300;color:#FDFAF4;">' + CONFIG.NOMBRE_INSTITUCION + '</p>'
    + '<p style="margin:0;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#8C8070;">Camino de Santiago · La Rioja · España</p>'
    + '<p style="margin:16px 0 0;font-size:10px;color:rgba(255,255,255,0.25);line-height:1.6;">Este correo ha sido generado automáticamente en respuesta a su solicitud de reserva.</p>'
    + '</td></tr>';
}
function tdRow(label, value) {
  return '<tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);"><span style="font-size:11px;color:#8C8070;text-transform:uppercase;letter-spacing:1px;">' + label + '</span></td>'
    + '<td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);text-align:right;"><span style="font-size:13px;color:#FDFAF4;">' + value + '</span></td></tr>';
}
function tdRowDate(label, value) {
  return '<tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);"><span style="font-size:11px;color:#8C8070;text-transform:uppercase;letter-spacing:1px;">' + label + '</span></td>'
    + '<td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);text-align:right;"><span style="font-size:14px;color:#FDFAF4;font-family:Georgia,serif;">' + value + '</span></td></tr>';
}
function tdRowColor(label, value, color) {
  return '<tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);"><span style="font-size:11px;color:#8C8070;text-transform:uppercase;letter-spacing:1px;">' + label + '</span></td>'
    + '<td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);text-align:right;"><span style="font-size:13px;color:' + color + ';">' + value + '</span></td></tr>';
}


// ══════════════════════════════════════════════════════════════════
//  7. GOOGLE CALENDAR
// ══════════════════════════════════════════════════════════════════

function actualizarEventoCalendarJustificante(d) {
  if (!d.eventoId || !d.justificante) return;
  try {
    var calId = d.tipoVisita === 'Grupo Escolar' ? CONFIG.CALENDAR_ESCOLAR_ID : CONFIG.CALENDAR_ID;
    var calendar = CalendarApp.getCalendarById(calId) || CalendarApp.getDefaultCalendar();
    var evento = calendar.getEventById(d.eventoId);
    if (!evento) { Logger.log('Evento no encontrado para ID: ' + d.eventoId); return; }

    var url = String(d.justificante).trim();

    var descActual = evento.getDescription();
    var descActualizada = descActual.replace(
      '💳 Justificante de pago: Pendiente',
      '💳 Justificante de pago: ' + url
    );
    evento.setDescription(descActualizada);
    Logger.log('Evento Calendar actualizado con justificante: ' + url);
  } catch (err) {
    Logger.log('Error actualizando evento Calendar: ' + err.toString());
  }
}

function _eliminarEventoCalendar(eventoId) {
  if (!eventoId) return;
  var calIds = [CONFIG.CALENDAR_ID, CONFIG.CALENDAR_INDIVIDUAL_ID, CONFIG.CALENDAR_ESCOLAR_ID];
  for (var i = 0; i < calIds.length; i++) {
    try {
      var cal = CalendarApp.getCalendarById(calIds[i]);
      if (!cal) continue;
      var evt = cal.getEventById(eventoId);
      if (evt) { evt.deleteEvent(); return; }
    } catch (e) { }
  }
}

function crearEventoCalendar(d, row, editadoEn) {
  var calId = d.tipoVisita === 'Grupo Escolar' ? CONFIG.CALENDAR_ESCOLAR_ID
    : d.tipoVisita === 'Grupo' ? CONFIG.CALENDAR_ID
      : CONFIG.CALENDAR_INDIVIDUAL_ID;
  var calendar = CalendarApp.getCalendarById(calId) || CalendarApp.getDefaultCalendar();
  var anio, mes, dia;
  if (d.fechaVisita instanceof Date) {
    anio = d.fechaVisita.getFullYear(); mes = d.fechaVisita.getMonth() + 1; dia = d.fechaVisita.getDate();
  } else {
    var s = String(d.fechaVisita).trim();
    var partes = s.indexOf('/') !== -1 ? s.split('/') : s.split('-');
    if (partes[0].length === 4) { anio = parseInt(partes[0]); mes = parseInt(partes[1]); dia = parseInt(partes[2]); }
    else { dia = parseInt(partes[0]); mes = parseInt(partes[1]); anio = parseInt(partes[2]); }
  }
  var hh, mm;
  if (d.horaVisita instanceof Date) { hh = d.horaVisita.getHours(); mm = d.horaVisita.getMinutes(); }
  else { var hp = String(d.horaVisita).trim().split(':'); hh = parseInt(hp[0]) || 0; mm = parseInt(hp[1]) || 0; }

  var inicio = new Date(anio, mes - 1, dia, hh, mm, 0);
  var durEventoMin = (d.visitaGuiada === 'Casco Histórico + Catedral') ? 120 : 60;
  var fin = new Date(inicio.getTime() + durEventoMin * 60000);
  var esGrupo = d.tipoVisita === 'Grupo';
  var esEscolar = d.tipoVisita === 'Grupo Escolar';
  var esNocturna = !esGrupo && !esEscolar && d.tipoEntrada === 'Visita Guiada Nocturna Catedral';
  var titulo, descripcion, colorEvento;
  var reg = 'Fila en Sheets: ' + row + '\nRegistrado: ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');

  if (esEscolar) {
    var guiadaEsc = d.visitaGuiada === 'Casco Histórico + Catedral' ? 'Casco Histórico + Catedral' : (d.visitaGuiada === 'Sí' ? 'Catedral' : 'No');
    var nombreEsc = (d.nombreCentro || d.nombre) + ' · ' + d.numPersonas + ' alumnos';
    titulo = tieneGuiadaGrupo(d.visitaGuiada) ? 'VG 🎒 ' + nombreEsc : '🎒 ' + nombreEsc;
    descripcion = ['🎒 GRUPO ESCOLAR', '─────────────────────────────',
      'RESPONSABLE: ' + d.nombre, 'EMAIL: ' + d.email, 'TELÉFONO: ' + d.telefono,
      'CENTRO ESCOLAR: ' + (d.nombreCentro || '—'), 'NIF/CIF: ' + (d.nifCif || '—'),
      'Nº DE ALUMNOS: ' + d.numPersonas, 'VISITA GUIADA: ' + guiadaEsc,
      '💶 Desglose por tramos:',
      (d.entradasDetalle ? String(d.entradasDetalle).split('\n').map(function (x) { return '   · ' + x; }).join('\n') : '   · ' + tramoLabel(d.tipoEntrada)),
      d.visitaGuiada === 'Casco Histórico + Catedral' ? '💶 Suplemento guiada: 100 € / grupo' : (d.visitaGuiada === 'Sí' ? '💶 Suplemento guiada: 50 € / grupo' : ''),
      '💶 TOTAL: ' + fmtEur(parseFloat(d.total) || 0),
      'NECESITA FACTURA: ' + (d.necesitaFactura || '—'),
      'DIRECCIÓN: ' + [d.calleNumero, d.ciudad, d.cp].filter(Boolean).join(', '),
      'COMENTARIOS: ' + (d.comentarios || 'Ninguno'),
      '💳 Justificante de pago: Pendiente',
      '─────────────────────────────', reg,
    ].filter(function (l) { return l !== ''; }).join('\n');
    colorEvento = CalendarApp.EventColor.TEAL;

  } else if (esGrupo) {
    var esNocG = esNocturnaGrupo(d.visitaGuiada);
    var guiada = d.visitaGuiada === 'Casco Histórico + Catedral' ? 'Casco Histórico + Catedral' : (d.visitaGuiada === 'Sí' ? 'Catedral' : (esNocG ? 'Visita Guiada Nocturna Catedral' : 'No'));
    var nombreGrupo = (d.nombreCentro || d.nombre) + ' · ' + d.numPersonas + ' pers. · ' + fmtEur(d.total);
    // La nocturna de grupo NO lleva prefijo "VG " (no bloquea franja; coordinación manual).
    titulo = (esNocG ? '🌙 ' : '') + (tieneGuiadaGrupo(d.visitaGuiada) ? 'VG ' + nombreGrupo : nombreGrupo);
    var _menG = parseInt(d.menores) || 0, _resG = parseInt(d.residentes) || 0;
    var _aduG = Math.max(0, (parseInt(d.numPersonas) || 0) - _menG - _resG);
    descripcion = ['📋 RESERVA DE GRUPO', '─────────────────────────────',
      'RESPONSABLE: ' + d.nombre, 'EMAIL: ' + d.email, 'TELÉFONO: ' + d.telefono,
      'CENTRO / INSTITUCIÓN: ' + (d.nombreCentro || '—'), 'NIF/CIF: ' + (d.nifCif || '—'),
      'Nº DE PERSONAS: ' + d.numPersonas, 'VISITA GUIADA: ' + guiada,
      esNocG ? '   · ' + _aduG + ' adulto' + (_aduG !== 1 ? 's' : '') + ' × 15 € · ' + (_menG + _resG) + ' reducido' + ((_menG + _resG) !== 1 ? 's' : '') + ' × 5 €' : '',
      '💶 Tarifas: ' + fmtEur(d.tarifas), '💶 TOTAL: ' + fmtEur(d.total),
      'NECESITA FACTURA: ' + (d.necesitaFactura || '—'), 'DIRECCIÓN: ' + [d.calleNumero, d.ciudad, d.cp].filter(Boolean).join(', '),
      'COMENTARIOS: ' + (d.comentarios || 'Ninguno'),
      '💳 Justificante de pago: Pendiente',
      '─────────────────────────────', reg,
    ].filter(function (l) { return l !== ''; }).join('\n');
    colorEvento = esNocG ? CalendarApp.EventColor.CYAN : CalendarApp.EventColor.YELLOW;

  } else if (esNocturna) {
    var menores = parseInt(d.menores) || 0;
    var adultos = (parseInt(d.numPersonas) || 0) - menores;
    titulo = '🌙 Visita Nocturna — ' + d.nombre + ' (' + d.numPersonas + ' pers.) — ' + fmtEur(d.total);
    var pAdultoNoc = PRECIOS['Visita Guiada Nocturna Catedral'];
    var pMenorNoc = PRECIOS_MENOR_GUIADA['Visita Guiada Nocturna Catedral'];
    var lineas = ['   · ' + adultos + ' adulto' + (adultos !== 1 ? 's' : '') + ' × ' + pAdultoNoc + ' € = ' + fmtEur(adultos * pAdultoNoc)];
    if (menores > 0) lineas.push('   · ' + menores + ' menor' + (menores !== 1 ? 'es' : '') + ' × ' + pMenorNoc + ' € = ' + fmtEur(menores * pMenorNoc));
    descripcion = ['🌙 VISITA GUIADA NOCTURNA CATEDRAL', '─────────────────────────────',
      'NOMBRE: ' + d.nombre, 'EMAIL: ' + d.email, 'TELÉFONO: ' + d.telefono,
      'Nº DE PERSONAS: ' + d.numPersonas, '   · Adultos: ' + adultos, '   · Menores <12: ' + menores,
      '💶 Desglose tarifas:'].concat(lineas).concat([
        '💶 Tarifas: ' + fmtEur(d.tarifas), '💶 TOTAL: ' + fmtEur(d.total),
        'COMENTARIOS: ' + (d.comentarios || 'Ninguno'), '─────────────────────────────', reg,
      ]).join('\n');
    colorEvento = CalendarApp.EventColor.CYAN;

  } else {
    // Visita individual normal (Catedral, Torre, Convento, Pulsera…)
    var menoresInd = parseInt(d.menores) || 0;
    var adultosInd = (parseInt(d.numPersonas) || 0) - menoresInd;
    var _desgInd = d.entradasDetalle ? String(d.entradasDetalle).trim() : '';
    var _nomCorto = String(d.nombre || '').trim().split(/\s+/).slice(0, 2).join(' ') || 'Visita individual';
    titulo = '🎫 ' + _nomCorto;
    descripcion = ['🎫 VISITA INDIVIDUAL', '─────────────────────────────',
      'NOMBRE: ' + d.nombre, 'EMAIL: ' + d.email, 'TELÉFONO: ' + (d.telefono || '—'),
      _desgInd ? '' : 'TIPO DE ENTRADA: ' + (d.tipoEntrada || '—'),
      _desgInd ? '💶 Desglose:\n' + _desgInd.split('\n').map(function (x) { return '   · ' + x; }).join('\n') : '',
      'Nº DE PERSONAS: ' + d.numPersonas,
      (!_desgInd && adultosInd > 0) ? '   · Adultos: ' + adultosInd : '',
      (!_desgInd && menoresInd > 0) ? '   · Menores <12: ' + menoresInd : '',
      '💶 Tarifas: ' + fmtEur(d.tarifas), '💶 TOTAL: ' + fmtEur(d.total),
      'COMENTARIOS: ' + (d.comentarios || 'Ninguno'),
      '─────────────────────────────', reg,
    ].filter(function (l) { return l !== ''; }).join('\n');
    colorEvento = CalendarApp.EventColor.GREEN;
  }

  if (editadoEn) descripcion += '\nEDITADO: ' + editadoEn;
  var evento = calendar.createEvent(titulo, inicio, fin, { description: descripcion });
  try { evento.setColor(colorEvento); } catch (err) { }
  Logger.log('Evento creado: ' + titulo);
  return evento.getId();
}


// ══════════════════════════════════════════════════════════════════
//  8. UTILIDADES
// ══════════════════════════════════════════════════════════════════

function formatearFecha(fechaVal) {
  if (!fechaVal) return '—';
  try {
    var fecha;
    if (fechaVal instanceof Date) { fecha = fechaVal; }
    else {
      var s = String(fechaVal).trim();
      var p = s.indexOf('/') !== -1 ? s.split('/') : s.split('-');
      fecha = p[0].length === 4
        ? new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2]))
        : new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0]));
    }
    var dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    var meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return dias[fecha.getDay()] + ', ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getFullYear();
  } catch (err) { return String(fechaVal); }
}

function formatearHora(horaVal) {
  if (!horaVal) return '—';
  if (horaVal instanceof Date) return String(horaVal.getHours()).padStart(2, '0') + ':' + String(horaVal.getMinutes()).padStart(2, '0');
  return String(horaVal).trim();
}


// ══════════════════════════════════════════════════════════════════
//  9. REENVÍO MANUAL (pruebas)
// ══════════════════════════════════════════════════════════════════

function reenviarCorreoManual() {
  var ROW = 2;
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  var fila = sheet.getRange(ROW, 1, 1, HEADERS.length).getValues()[0];
  enviarCorreoConfirmacion(mapRowToData(fila));
  Logger.log('Correo reenviado a ' + mapRowToData(fila).email);
}
