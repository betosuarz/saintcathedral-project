/**
 * TIENDA — backend independiente (Google Apps Script Web App).
 *
 * Proyecto SEPARADO: no comparte código ni despliegue con reservas/visitas
 * (reservas-backend.js), el boletín (boletin-backend.gs) ni los formularios
 * de institución (formsparroquia-backend.gs).
 *
 * Qué hace:
 *   1) doGet(?stock=1)  → devuelve las existencias de cada producto leyendo
 *      la hoja «inventario_tienda». tienda.html lo usa para pintar
 *      «Stock: N» en cada tarjeta y bloquear lo que esté agotado.
 *   2) doPost()         → recibe la solicitud de reserva de tienda.html,
 *      comprueba que hay existencias, la registra en la pestaña «Pedidos»,
 *      avisa por correo a la Catedral y manda acuse al comprador.
 *      Devuelve { ok: true|false }.
 *
 * No hay pasarela de pago: la solicitud es una RESERVA, no una venta
 * cerrada. Los portes se estudian y se confirman después por correo.
 *
 * ── PUESTA EN MARCHA ────────────────────────────────────────────────
 * 1. Entra en Drive con la cuenta info.catedralsantodomingo@gmail.com.
 * 2. Abre la hoja «Tienda / inventario_tienda» → Extensiones → Apps Script.
 * 3. Pega este archivo, guarda y ejecuta una vez `inicializarTienda`
 *    (te pedirá permisos de Sheets y Gmail: acéptalos).
 *    Si prefieres un proyecto suelto, ejecuta antes `buscarHojaInventario`
 *    y pega el ID que imprime en CONFIG_TIENDA.SHEET_ID.
 * 4. Implementar → Nueva implementación → Aplicación web
 *      - Ejecutar como: Yo (info.catedralsantodomingo@gmail.com)
 *      - Quién tiene acceso: Cualquiera
 * 5. Copia la URL .../exec y pégala en TIENDA_API dentro de tienda.html.
 *
 * IMPORTANTE: cada vez que edites este código hay que crear una NUEVA
 * VERSIÓN de la implementación; si no, la web sigue usando la anterior.
 * ────────────────────────────────────────────────────────────────────
 */

var CONFIG_TIENDA = {
  // Vacío = usa la hoja a la que está vinculado el script (lo normal si lo
  // abres desde «inventario_tienda»). Si no, pega aquí el ID o la URL.
  SHEET_ID: '',

  HOJA_INVENTARIO: 'Inventario',          // pestaña con el stock
  HOJA_PEDIDOS: 'Pedidos',                // la rellena el formulario de la web
  TZ: 'Europe/Madrid',

  // Quién recibe el aviso de nueva reserva (puedes poner varios)
  AVISOS: ['diseno.catedralsantodomingo@gmail.com'],
  REMITENTE: 'Catedral de Santo Domingo de la Calzada',

  // Datos de pago que se envían al cliente al aceptar la reserva
  BANCO: {
    entidad: 'Banco LA CAIXA',
    iban: 'ES64 2100 4636 4222 0007 9035',
    concepto: 'Compra artículo religioso - Nombre y apellidos'
  },

  // false = el stock NO se toca al reservar (la reserva aún no es una venta;
  // se descuenta a mano al confirmarla). Ponlo a true si prefieres que cada
  // solicitud reste existencias automáticamente.
  DESCONTAR_STOCK: false,

  // Cloudflare Turnstile: pega la Secret Key para validar el token también
  // en servidor. Vacío = no se verifica (el widget sigue filtrando en el
  // navegador).
  TURNSTILE_SECRET: '',

  SEGUNDOS_CACHE_STOCK: 60
};

/* Una fila = UN producto. Un pedido con tres belenes ocupa tres filas con
   el mismo «Nº pedido». Por eso «Precio (€)» es el precio unitario y
   «Total (€)» la multiplicación por las unidades de esa línea. */
var CABECERAS_PEDIDOS = [
  'Nº pedido', 'Fecha', 'Nombre', 'Teléfono', 'Correo',
  'Dirección', 'Ciudad', 'C.P.', 'Referencia', 'Artículos', 'Unidades',
  'Precio (€)', 'Total (€)',
  'Coste envío (€)', 'IVA envío (€)', 'Total envío (€)',
  'Comentarios', 'Enviar', 'Estado'
];

/** Nº de columna (1-based) de la pestaña Pedidos por el nombre de cabecera. */
function _colPedido(nombre) {
  return CABECERAS_PEDIDOS.indexOf(nombre) + 1;
}

/* ══ ENTRADAS DE LA WEB APP ═══════════════════════════════════════ */

function doGet(e) {
  if (e && e.parameter && e.parameter.stock !== undefined) return _json(consultarStock());
  return ContentService
    .createTextOutput('Tienda backend activo · Catedral de Santo Domingo de la Calzada')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    return _json(registrarPedido_(JSON.parse(e.postData.contents)));
  } catch (err) {
    return _json({ ok: false, error: String(err && err.message || err) });
  }
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ══ INVENTARIO ═══════════════════════════════════════════════════
   Columnas esperadas (el orden da igual, se buscan por el nombre de la
   cabecera y se ignoran tildes y mayúsculas):
     Referencia | Imagen | Precio | Código | Existencias |
     Tienda | Expo | Almacén | Observaciones
   «Código» es lo que casa con la referencia de cada producto en la web
   (B-15, B-16, 6, B-18…) y «Existencias» es el stock que se publica.
═══════════════════════════════════════════════════════════════════ */

function _norm(s) {
  return String(s == null ? '' : s)
    .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

/** Abre el archivo del inventario. */
function _libroTienda_() {
  if (CONFIG_TIENDA.SHEET_ID) {
    var m = String(CONFIG_TIENDA.SHEET_ID).match(/[-\w]{25,}/);
    if (!m) throw new Error('CONFIG_TIENDA.SHEET_ID no parece un ID de hoja válido.');
    return SpreadsheetApp.openById(m[0]);
  }
  // Ojo: en contexto de aplicación web esto no siempre resuelve el archivo,
  // por eso lo recomendable es rellenar SHEET_ID.
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error('El script no ha podido abrir la hoja. Pega el ID en CONFIG_TIENDA.SHEET_ID.');
  }
  return ss;
}

function _hojaInventario() {
  var ss = _libroTienda_();

  var hoja = ss.getSheetByName(CONFIG_TIENDA.HOJA_INVENTARIO);
  if (hoja) return hoja;

  // Si la pestaña no se llama exactamente así, se busca la que tenga las
  // columnas «Código» y «Existencias» en la fila 1.
  var hojas = ss.getSheets();
  for (var i = 0; i < hojas.length; i++) {
    if (hojas[i].getName() === CONFIG_TIENDA.HOJA_PEDIDOS) continue;
    if (hojas[i].getLastRow() < 1 || hojas[i].getLastColumn() < 1) continue;
    var cab = hojas[i].getRange(1, 1, 1, hojas[i].getLastColumn()).getValues()[0].map(_norm);
    if (cab.indexOf(_norm('Código')) >= 0 && cab.indexOf(_norm('Existencias')) >= 0) return hojas[i];
  }

  throw new Error('No encuentro una pestaña con las columnas «Código» y «Existencias». '
    + 'Archivo abierto: «' + ss.getName() + '». Pestañas: '
    + hojas.map(function (h) { return '«' + h.getName() + '»'; }).join(', ') + '.');
}

/** Lee el inventario y lo devuelve indexado por Código. */
function leerInventario_() {
  var hoja = _hojaInventario();
  var datos = hoja.getDataRange().getValues();
  if (!datos.length) {
    throw new Error('La pestaña «' + hoja.getName() + '» está vacía: faltan las cabeceras.');
  }

  var cabeceras = datos[0].map(_norm);
  var col = function (nombre) { return cabeceras.indexOf(_norm(nombre)); };

  var cCodigo = col('Código');
  var cExist = col('Existencias');
  if (cCodigo < 0) throw new Error('Falta la columna «Código» en ' + hoja.getName());
  if (cExist < 0) throw new Error('Falta la columna «Existencias» en ' + hoja.getName());

  var cRef = col('Referencia'), cPrecio = col('Precio');
  var cTienda = col('Tienda'), cExpo = col('Expo'), cAlmacen = col('Almacén');
  var cObs = col('Observaciones');

  var porCodigo = {};
  for (var i = 1; i < datos.length; i++) {
    var codigo = String(datos[i][cCodigo] || '').trim();
    if (!codigo) continue;
    porCodigo[codigo] = {
      codigo: codigo,
      referencia: cRef >= 0 ? String(datos[i][cRef] || '').trim() : '',
      precio: cPrecio >= 0 ? Number(datos[i][cPrecio]) || 0 : 0,
      existencias: Math.max(0, parseInt(datos[i][cExist], 10) || 0),
      tienda: cTienda >= 0 ? (parseInt(datos[i][cTienda], 10) || 0) : 0,
      expo: cExpo >= 0 ? (parseInt(datos[i][cExpo], 10) || 0) : 0,
      almacen: cAlmacen >= 0 ? (parseInt(datos[i][cAlmacen], 10) || 0) : 0,
      observaciones: cObs >= 0 ? String(datos[i][cObs] || '').trim() : '',
      fila: i + 1
    };
  }
  return { porCodigo: porCodigo, hoja: hoja, colExistencias: cExist + 1 };
}

/** { ok:true, stock:{ 'B-15':3, ... } } — lo que consume tienda.html */
function consultarStock() {
  var cache = CacheService.getScriptCache();
  var guardado = cache.get('stock_tienda');
  if (guardado) return JSON.parse(guardado);

  try {
    var inv = leerInventario_().porCodigo;
    var stock = {};
    Object.keys(inv).forEach(function (c) { stock[c] = inv[c].existencias; });
    var salida = {
      ok: true,
      stock: stock,
      actualizado: Utilities.formatDate(new Date(), CONFIG_TIENDA.TZ, 'dd/MM/yyyy HH:mm')
    };
    cache.put('stock_tienda', JSON.stringify(salida), CONFIG_TIENDA.SEGUNDOS_CACHE_STOCK);
    return salida;
  } catch (err) {
    return { ok: false, error: String(err && err.message || err) };
  }
}

/** Borra la caché para que el próximo visitante vea el stock recién editado. */
function refrescarStock() {
  CacheService.getScriptCache().remove('stock_tienda');
  return consultarStock();
}

/**
 * Se dispara sola cada vez que editas la hoja: tira la caché para que el
 * nuevo número de existencias se publique al momento, sin esperar al
 * minuto de caché.
 *
 * HAY QUE INSTALARLA UNA VEZ:
 *   Apps Script → Activadores (el reloj ⏰) → Añadir activador
 *     Función: onEditInventario
 *     Fuente:  Desde hoja de cálculo
 *     Tipo:    Al editar
 */
function onEditInventario(e) {
  try {
    if (e && e.range && e.range.getSheet().getName() === CONFIG_TIENDA.HOJA_PEDIDOS) {
      // Editar Pedidos no afecta al stock, pero la columna «Enviar» sí dispara
      // el correo de respuesta al cliente.
      _alEditarPedidos_(e);
      return;
    }
  } catch (err) { }
  CacheService.getScriptCache().remove('stock_tienda');
}

/**
 * Vigila la columna «Enviar» de la pestaña Pedidos.
 *   Sí → escribe al cliente aceptando la reserva de ese producto.
 *   No → le comunica que no se puede atender ese envío.
 * En ambos casos se incluye lo que haya escrito en «Comentarios».
 * Cada vez que se elige Sí o No se manda el correo: para reenviar tras
 * cambiar el comentario, basta con volver a elegir la opción.
 */
function _alEditarPedidos_(e) {
  var fila = e.range.getRow();
  if (fila < 2) return;
  if (e.range.getColumn() !== _colPedido('Enviar')) return;

  var valor = _norm(e.range.getValue());
  var decision = (valor === 'si') ? 'si' : (valor === 'no' ? 'no' : null);
  if (!decision) return;   // celda vaciada o valor raro: no se hace nada

  enviarRespuestaPedido_(e.range.getSheet(), fila, decision);
}

/** Manda al cliente la respuesta de una línea de pedido concreta. */
function enviarRespuestaPedido_(hoja, fila, decision) {
  var v = hoja.getRange(fila, 1, 1, CABECERAS_PEDIDOS.length).getValues()[0];
  var dato = function (c) { return v[_colPedido(c) - 1]; };

  var correo = String(dato('Correo') || '').trim();
  var estado = hoja.getRange(fila, _colPedido('Estado'));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) {
    estado.setValue('❌ Correo no válido');
    return;
  }

  // El idioma se guardó como nota al registrar el pedido
  var nota = String(hoja.getRange(fila, 1).getNote() || '');
  var idioma = (nota.match(/idioma:(\w+)/) || [])[1] || 'es';

  // Aceptar sin haber puesto los portes mandaría al cliente un envío a
  // 0,00 €. Se distingue la celda vacía del 0 escrito a propósito.
  if (decision === 'si' && String(dato('Coste envío (€)')).trim() === '') {
    estado.setValue('⚠ Falta «Coste envío (€)»: no se ha enviado nada');
    return;
  }

  var totalPedido = Number(dato('Total (€)')) || 0;
  var totalEnvio = Number(dato('Total envío (€)')) || 0;

  var datos = {
    pedido: String(dato('Nº pedido') || ''),
    nombre: String(dato('Nombre') || ''),
    referencia: String(dato('Referencia') || ''),
    articulo: String(dato('Artículos') || ''),
    unidades: parseInt(dato('Unidades'), 10) || 0,
    precio: Number(dato('Precio (€)')) || 0,
    total: totalPedido,
    costeEnvio: Number(dato('Coste envío (€)')) || 0,
    ivaEnvio: Number(dato('IVA envío (€)')) || 0,
    totalEnvio: totalEnvio,
    totalConEnvio: totalPedido + totalEnvio,
    comentarios: String(dato('Comentarios') || '').trim()
  };

  try {
    MailApp.sendEmail({
      to: correo,
      name: CONFIG_TIENDA.REMITENTE,
      replyTo: CONFIG_TIENDA.AVISOS[0],
      subject: respuestaAsunto_(idioma, decision, datos.pedido),
      body: respuestaCuerpo_(idioma, decision, datos)
    });
    estado.setValue((decision === 'si' ? '✅ Aceptado · ' : '✖ Rechazado · ')
      + Utilities.formatDate(new Date(), CONFIG_TIENDA.TZ, 'dd/MM/yyyy HH:mm'));
  } catch (err) {
    estado.setValue('❌ Error al enviar: ' + String(err && err.message || err));
  }
}

/* ══ PEDIDOS ══════════════════════════════════════════════════════ */

function registrarPedido_(datos) {
  var nombre = String(datos.nombre || '').trim();
  var telefono = String(datos.telefono || '').trim();
  var correo = String(datos.email || '').trim();
  var direccion = String(datos.direccion || '').trim();
  var ciudad = String(datos.ciudad || '').trim();
  var cp = String(datos.cp || '').trim();
  var idioma = String(datos.idioma || 'es').trim();
  var lineas = Array.isArray(datos.lineas) ? datos.lineas : [];

  if (!nombre || !telefono || !correo || !direccion || !ciudad || !cp || !lineas.length) {
    return { ok: false, error: 'Faltan campos obligatorios' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) {
    return { ok: false, error: 'Correo no válido' };
  }
  if (!verificarTurnstile_(datos.turnstileToken)) {
    return { ok: false, error: 'Verificación de seguridad no superada' };
  }

  // Una sola ejecución a la vez: dos pedidos simultáneos no pueden llevarse
  // la misma última unidad ni pisarse al escribir en la hoja.
  var cerrojo = LockService.getScriptLock();
  try {
    cerrojo.waitLock(20000);
  } catch (err) {
    return { ok: false, error: 'El servidor está ocupado, inténtalo de nuevo.' };
  }

  try {
    var inv = leerInventario_();

    // El total se recalcula aquí: nunca se confía en el importe que llega
    // del navegador, sólo en las cantidades y en los precios de cada línea.
    var unidades = 0, total = 0, detalle = [], sinStock = [], desajustes = [];
    var articulos = [];   // una entrada por línea: se convertirá en una fila
    for (var i = 0; i < lineas.length; i++) {
      var l = lineas[i];
      var ref = String(l.ref || '').trim();
      var n = Math.max(0, Math.min(99, parseInt(l.unidades, 10) || 0));
      if (!n) continue;

      var ficha = inv.porCodigo[ref];
      if (ficha && ficha.existencias < n) {
        sinStock.push({ ref: ref, pedidas: n, disponibles: ficha.existencias });
        continue;
      }

      // Se registra el precio que vio el cliente en la web, no el del
      // inventario: es el que se le ofreció. Si no coinciden se avisa en
      // el correo interno, porque significa que la web está desfasada.
      var precio = Number(l.precio) || 0;
      if (ficha && ficha.precio && Math.abs(ficha.precio - precio) > 0.005) {
        desajustes.push(ref + ': web ' + eur_(precio) + ' · inventario ' + eur_(ficha.precio));
      }

      unidades += n;
      total += n * precio;

      articulos.push({
        ref: ref,
        referenciaInv: ficha ? ficha.referencia : '',
        nombre: String(l.nombre || ''),
        unidades: n,
        precio: precio
      });

      detalle.push(
        n + ' × ' + String(l.nombre || '') + ' (' + ref + ') — ' + eur_(n * precio)
        + (ficha ? '\n      Stock: ' + ficha.existencias
          + ' · Tienda ' + ficha.tienda + ' · Expo ' + ficha.expo + ' · Almacén ' + ficha.almacen
          + (ficha.observaciones ? ' · ' + ficha.observaciones : '')
          : '\n      (referencia no encontrada en el inventario)')
      );
    }

    if (sinStock.length) return { ok: false, error: 'sin_stock', detalle: sinStock };
    if (!unidades) return { ok: false, error: 'El pedido no tiene unidades' };

    var ahora = new Date();
    var fecha = Utilities.formatDate(ahora, CONFIG_TIENDA.TZ, 'dd/MM/yyyy HH:mm:ss');
    var numPedido = 'TDA-' + Utilities.formatDate(ahora, CONFIG_TIENDA.TZ, 'yyyyMMdd-HHmmss');

    // 1) Registra las filas PRIMERO (si el Sheet falla, corta sin enviar correo).
    var hojaPedidos = _hojaPedidos();
    var primeraFila = hojaPedidos.getLastRow() + 1;
    var cUnidades = _colLetra(_colPedido('Unidades'));
    var cPrecio = _colLetra(_colPedido('Precio (€)'));
    var cCoste = _colLetra(_colPedido('Coste envío (€)'));
    var cIva = _colLetra(_colPedido('IVA envío (€)'));

    var filas = articulos.map(function (a, k) {
      var f = primeraFila + k;
      return [
        numPedido, fecha, nombre, telefono, correo, direccion, ciudad, cp,
        a.referenciaInv, a.nombre + ' (' + a.ref + ')', a.unidades, a.precio,
        '=' + cUnidades + f + '*' + cPrecio + f,    // Total (€)
        '',                                         // Coste envío (a mano)
        '',                                         // IVA envío (a mano)
        '=' + cCoste + f + '+' + cIva + f,          // Total envío (€)
        '',                                         // Comentarios (a mano)
        '',                                         // Enviar (Sí / No)
        '⏳'
      ];
    });
    hojaPedidos.getRange(primeraFila, 1, filas.length, CABECERAS_PEDIDOS.length).setValues(filas);

    // El idioma ya no ocupa columna, pero hace falta para escribirle al
    // cliente en su idioma: se guarda como nota en la celda del nº de pedido.
    for (var k = 0; k < filas.length; k++) {
      hojaPedidos.getRange(primeraFila + k, 1).setNote('idioma:' + idioma);
    }

    if (CONFIG_TIENDA.DESCONTAR_STOCK) descontarStock_(inv, lineas);

    // 2) Aviso a la Catedral y acuse de recibo al comprador.
    var enviado = false, errorMsg = '';
    try {
      MailApp.sendEmail({
        to: CONFIG_TIENDA.AVISOS.join(','),
        replyTo: correo,
        subject: '🎄 Nueva reserva de belén ' + numPedido + ' · ' + nombre,
        body: cuerpoAviso_(numPedido, fecha, idioma, nombre, telefono, correo,
          direccion, ciudad, cp, detalle, unidades, total, desajustes)
      });

      MailApp.sendEmail({
        to: correo,
        name: CONFIG_TIENDA.REMITENTE,
        subject: acuseAsunto_(idioma, numPedido),
        body: acuseCuerpo_(idioma, nombre, numPedido, detalle, total)
      });

      enviado = true;
    } catch (err) {
      errorMsg = String(err && err.message || err);
    }

    // 3) Marca el estado de todas las filas del pedido.
    hojaPedidos.getRange(primeraFila, _colPedido('Estado'), filas.length, 1)
      .setValue(enviado ? '✅' : '❌');

    return enviado
      ? { ok: true, pedido: numPedido, total: Number(total.toFixed(2)) }
      : { ok: false, error: errorMsg || 'No se pudo enviar el correo' };

  } finally {
    cerrojo.releaseLock();
  }
}

/** Resta las unidades vendidas de la columna Existencias. */
function descontarStock_(inv, lineas) {
  var hoja = inv.hoja, col = inv.colExistencias;
  lineas.forEach(function (l) {
    var ficha = inv.porCodigo[String(l.ref || '').trim()];
    var n = parseInt(l.unidades, 10) || 0;
    if (!ficha || !n) return;
    hoja.getRange(ficha.fila, col).setValue(Math.max(0, ficha.existencias - n));
  });
  CacheService.getScriptCache().remove('stock_tienda');
}

function _hojaPedidos() {
  var ss = _hojaInventario().getParent();
  var hoja = ss.getSheetByName(CONFIG_TIENDA.HOJA_PEDIDOS);
  if (!hoja) hoja = ss.insertSheet(CONFIG_TIENDA.HOJA_PEDIDOS);
  if (hoja.getLastRow() === 0) _formatearPedidos_(hoja);
  return hoja;
}

/** Cabeceras, anchos, formatos y desplegable Sí/No de la pestaña Pedidos. */
function _formatearPedidos_(hoja) {
  var n = CABECERAS_PEDIDOS.length;
  hoja.getRange(1, 1, 1, n).setValues([CABECERAS_PEDIDOS])
    .setFontWeight('bold')
    .setBackground('#F5F0E8')
    .setBorder(null, null, true, null, null, null, '#C9A84C', SpreadsheetApp.BorderStyle.SOLID);
  hoja.setFrozenRows(1);

  var anchos = {
    'Nº pedido': 150, 'Fecha': 140, 'Nombre': 190, 'Teléfono': 110, 'Correo': 220,
    'Dirección': 200, 'Ciudad': 140, 'C.P.': 70, 'Referencia': 170, 'Artículos': 220,
    'Unidades': 80, 'Precio (€)': 95, 'Total (€)': 100,
    'Coste envío (€)': 115, 'IVA envío (€)': 110, 'Total envío (€)': 115,
    'Comentarios': 320, 'Enviar': 80, 'Estado': 200
  };
  CABECERAS_PEDIDOS.forEach(function (c, i) { hoja.setColumnWidth(i + 1, anchos[c] || 150); });

  var filas = Math.max(1, hoja.getMaxRows() - 1);
  // Todas las columnas de dinero van seguidas: de «Precio (€)» a «Total envío (€)»
  var primeraMoneda = _colPedido('Precio (€)');
  var nMoneda = _colPedido('Total envío (€)') - primeraMoneda + 1;
  hoja.getRange(2, primeraMoneda, filas, nMoneda).setNumberFormat('#,##0.00 "€"');
  hoja.getRange(2, _colPedido('Unidades'), filas, 1).setHorizontalAlignment('center');

  // Las tres de envío se rellenan a mano: se marcan en claro
  hoja.getRange(1, _colPedido('Coste envío (€)'), 1, 3).setBackground('#EDE6D6');
  hoja.getRange(1, _colPedido('Coste envío (€)')).setNote(
    'A rellenar a mano antes de poner «Sí» en Enviar.\n'
    + 'Si se deja vacía, el correo al cliente no se manda.');

  _validacionEnviar_(hoja);
}

/** Desplegable Sí / No, solo en la columna «Enviar». */
function _validacionEnviar_(hoja) {
  var filas = Math.max(1, hoja.getMaxRows() - 1);
  var columnas = Math.max(hoja.getMaxColumns(), CABECERAS_PEDIDOS.length);

  // Se limpian antes todas las validaciones de la hoja: si en una versión
  // anterior «Enviar» ocupaba otra columna, el desplegable se quedaba allí.
  hoja.getRange(2, 1, filas, columnas).clearDataValidations();

  var regla = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Sí', 'No'], true)
    .setAllowInvalid(false)
    .setHelpText('Sí = se acepta y se avisa al cliente. No = se le comunica que no se acepta.')
    .build();
  hoja.getRange(2, _colPedido('Enviar'), filas, 1).setDataValidation(regla);
}

/* ══ CORREOS ══════════════════════════════════════════════════════ */

function cuerpoAviso_(num, fecha, idioma, nombre, telefono, correo, direccion, ciudad, cp,
                      detalle, unidades, total, desajustes) {
  var aviso = (desajustes && desajustes.length)
    ? '\n⚠ PRECIOS QUE NO COINCIDEN CON EL INVENTARIO\n' +
      'Se ha registrado el precio que vio el cliente en la web. Revisa el catálogo:\n' +
      desajustes.map(function (d) { return '  · ' + d; }).join('\n') + '\n'
    : '';
  return 'NUEVA RESERVA DE BELÉN\n\n' +
    'Nº pedido: ' + num + '\n' +
    'Fecha: ' + fecha + '\n' +
    'Idioma del comprador: ' + idioma + '\n\n' +
    '── CLIENTE ─────────────────────────────\n' +
    'Nombre y apellidos: ' + nombre + '\n' +
    'Teléfono: ' + telefono + '\n' +
    'Correo: ' + correo + '\n' +
    'Dirección: ' + direccion + '\n' +
    'Ciudad: ' + ciudad + '\n' +
    'Código postal: ' + cp + '\n\n' +
    '── PEDIDO ──────────────────────────────\n' +
    detalle.map(function (d) { return '· ' + d; }).join('\n') + '\n\n' +
    'Unidades: ' + unidades + '\n' +
    'TOTAL (sin portes): ' + eur_(total) + '\n' + aviso + '\n' +
    'Portes a cargo del comprador, pendientes de estudiar y confirmar.\n\n' +
    'Para responder al cliente, abre la pestaña «' + CONFIG_TIENDA.HOJA_PEDIDOS + '», escribe lo\n' +
    'que quieras en «Comentarios» y elige Sí o No en la columna «Enviar».\n' +
    'El stock NO se descuenta solo: actualiza «Existencias» al confirmar la venta.';
}

/* ── Respuesta manual desde la columna «Enviar» ─────────────────── */

function _es_(idioma) {
  return idioma === 'es' || idioma === 'ca' || idioma === 'eu';
}

/**
 * Deja el nombre del producto limpio para un correo al CLIENTE.
 * La celda «Artículos» puede llevar más de una línea (los pedidos antiguos
 * guardaban ahí el desglose de stock y ubicaciones): solo se conserva la
 * primera, para que nunca se le escape al cliente información interna.
 */
function _articuloLimpio_(texto) {
  var t = String(texto == null ? '' : texto).split('\n')[0].trim();
  t = t.replace(/^\d+\s*[×x]\s*/i, '');            // "1 × " del formato antiguo
  t = t.replace(/\s*[—-]\s*[\d.,]+\s*€\s*$/, '');  // precio pegado al final
  return t.trim();
}

function respuestaAsunto_(idioma, decision, num) {
  if (_es_(idioma)) {
    return decision === 'si'
      ? 'Reserva confirmada ' + num + ' · Catedral de Santo Domingo de la Calzada'
      : 'Sobre su reserva ' + num + ' · Catedral de Santo Domingo de la Calzada';
  }
  return decision === 'si'
    ? 'Reservation confirmed ' + num + ' · Cathedral of Santo Domingo de la Calzada'
    : 'About your reservation ' + num + ' · Cathedral of Santo Domingo de la Calzada';
}

function respuestaCuerpo_(idioma, decision, d) {
  var articulo = _articuloLimpio_(d.articulo) || _articuloLimpio_(d.referencia);
  var esp = _es_(idioma);

  var ficha = esp
    ? 'SU PEDIDO\n' +
      'Nº de pedido: ' + d.pedido + '\n' +
      'Producto: ' + articulo + '\n' +
      'Unidades: ' + d.unidades + '\n' +
      'Precio por unidad: ' + eur_(d.precio) + '\n' +
      'Total: ' + eur_(d.total) + '\n'
    : 'YOUR ORDER\n' +
      'Order no.: ' + d.pedido + '\n' +
      'Item: ' + articulo + '\n' +
      'Units: ' + d.unidades + '\n' +
      'Unit price: ' + eur_(d.precio) + '\n' +
      'Total: ' + eur_(d.total) + '\n';

  var comentarios = '';
  if (d.comentarios) {
    comentarios = '\n' + (esp ? 'COMENTARIOS DE LA CATEDRAL' : 'MESSAGE FROM THE CATHEDRAL')
      + '\n' + d.comentarios + '\n';
  }

  if (decision === 'si') {
    var envio = esp
      ? '\nCOSTE DE ENVÍO\n' +
        'Portes (€): ' + eur_(d.costeEnvio) + '\n' +
        'IVA (€): ' + eur_(d.ivaEnvio) + '\n' +
        'Total de envío (€): ' + eur_(d.totalEnvio) + '\n\n' +
        'TOTAL PEDIDO + ENVÍO: ' + eur_(d.totalConEnvio) + '\n'
      : '\nSHIPPING COST\n' +
        'Shipping (€): ' + eur_(d.costeEnvio) + '\n' +
        'VAT (€): ' + eur_(d.ivaEnvio) + '\n' +
        'Shipping total (€): ' + eur_(d.totalEnvio) + '\n\n' +
        'ORDER + SHIPPING TOTAL: ' + eur_(d.totalConEnvio) + '\n';

    var banco = CONFIG_TIENDA.BANCO;
    var pago = esp
      ? '\nDATOS BANCARIOS\n' +
        'BANCO: ' + banco.entidad + '\n' +
        'CUENTA: IBAN - ' + banco.iban + '\n' +
        'CONCEPTO: ' + banco.concepto + '\n'
      : '\nBANK DETAILS\n' +
        'BANK: ' + banco.entidad + '\n' +
        'ACCOUNT: IBAN - ' + banco.iban + '\n' +
        'REFERENCE: ' + banco.concepto + '\n';

    var despedida = esp
      ? '\nNos quedamos a la espera de sus noticias.\n' +
        'Cuando realice el ingreso por favor envíennos el justificante a este mismo correo.\n' +
        'Muchas gracias por su solicitud.\n' +
        'Un saludo cordial.\n' +
        'Catedral de Santo Domingo de la Calzada'
      : '\nWe look forward to hearing from you.\n' +
        'Once the transfer is made, please send us the receipt to this same address.\n' +
        'Thank you very much for your request.\n' +
        'Kind regards.\n' +
        'Cathedral of Santo Domingo de la Calzada';

    return (esp
      ? 'Estimado/a ' + d.nombre + ':\n\nLe confirmamos que su reserva ha sido aceptada.\n\n'
      : 'Hello ' + d.nombre + ',\n\nWe are pleased to confirm that your reservation has been accepted.\n\n')
      + ficha + envio + comentarios + pago + despedida;
  }

  return esp
    ? 'Estimado/a ' + d.nombre + ':\n\n' +
      'Lamentamos comunicarle que no podemos atender el envío de este producto.\n\n' + ficha + comentarios +
      '\nSentimos las molestias. Si desea consultarnos cualquier duda o valorar otra ' +
      'opción, responda a este mismo correo y le atenderemos encantados.\n\n' +
      'Un saludo cordial.\n' +
      'Catedral de Santo Domingo de la Calzada'
    : 'Hello ' + d.nombre + ',\n\n' +
      'We are sorry to inform you that we cannot proceed with the shipment of this item.\n\n' + ficha + comentarios +
      '\nWe apologise for the inconvenience. If you have any questions or would like to ' +
      'consider an alternative, just reply to this email and we will be glad to help.\n\n' +
      'Kind regards.\n' +
      'Cathedral of Santo Domingo de la Calzada';
}

function acuseAsunto_(idioma, num) {
  if (idioma === 'es' || idioma === 'ca' || idioma === 'eu') {
    return 'Hemos recibido su reserva ' + num + ' · Catedral de Santo Domingo de la Calzada';
  }
  return 'We have received your reservation ' + num + ' · Cathedral of Santo Domingo de la Calzada';
}

function acuseCuerpo_(idioma, nombre, num, detalle, total) {
  // En el acuse al cliente sobra la ubicación interna de cada pieza
  var lista = detalle.map(function (d) { return '· ' + d.split('\n')[0]; }).join('\n');
  if (idioma === 'es' || idioma === 'ca' || idioma === 'eu') {
    return 'Estimado/a ' + nombre + ':\n\n' +
      'Hemos recibido su solicitud de reserva (nº ' + num + ').\n\n' +
      'SU PEDIDO\n' + lista + '\n\n' +
      'Total de los artículos: ' + eur_(total) + '\n\n' +
      'Los portes de envío corren a cuenta del comprador. Estudiaremos la viabilidad ' +
      'del envío y le confirmaremos por correo electrónico el importe de los portes y ' +
      'la forma de pago antes de preparar el pedido.\n\n' +
      'Gracias por su confianza.\n' +
      'Catedral de Santo Domingo de la Calzada';
  }
  return 'Hello ' + nombre + ',\n\n' +
    'We have received your reservation request (no. ' + num + ').\n\n' +
    'ORDER:\n' + lista + '\n\n' +
    'Items total: ' + eur_(total) + '\n\n' +
    'Shipping costs are payable by the buyer. We will assess whether delivery is ' +
    'feasible and confirm the shipping cost and payment method by email before ' +
    'preparing your order.\n\n' +
    'Thank you.\n' +
    'Cathedral of Santo Domingo de la Calzada';
}

/* ══ UTILIDADES ═══════════════════════════════════════════════════ */

function verificarTurnstile_(token) {
  if (!CONFIG_TIENDA.TURNSTILE_SECRET) return true;
  if (!token) return false;
  try {
    var res = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'post',
      payload: { secret: CONFIG_TIENDA.TURNSTILE_SECRET, response: token },
      muteHttpExceptions: true
    });
    return !!JSON.parse(res.getContentText()).success;
  } catch (err) {
    return false;
  }
}

function eur_(n) {
  var partes = Number(n).toFixed(2).split('.');
  // Millares con punto y decimales con coma: 3.700,00 €
  return partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + partes[1] + ' €';
}

/* ══ AYUDAS PARA LA PUESTA EN MARCHA ══════════════════════════════ */

/* «Existencias» va detrás de las tres ubicaciones porque es su suma.
   El orden de las columnas da igual para el resto del código: siempre se
   buscan por el nombre de la cabecera. */
var CABECERAS_INVENTARIO = [
  'Referencia', 'Imagen', 'Precio', 'Código',
  'Tienda', 'Expo', 'Almacén', 'Existencias', 'Observaciones'
];

/* Los 9 productos tal y como están publicados en tienda.html. Sirven para
   dejar la pestaña ya rellena con los códigos exactos: si un «Código» no
   coincide al carácter con el de la web, ese producto no mostraría stock. */
var PRODUCTOS_WEB = [
  ['Belén Mediano 1', 'b-15.webp', 180,  'B-15'],
  ['Belén Mediano 2', 'b-16.webp', 200,  'B-16'],
  ['Belén Mediano 3', '6.webp',    250,  '6'],
  ['Belén Mediano 4', 'b-18.webp', 265,  'B-18'],
  ['Belén Mediano 5', 'b-23.webp', 370,  'B-23'],
  ['Belén Mediano 6', 'b-24.webp', 570,  'B-24'],
  ['Belén Mediano 7', 'b-4.webp',  570,  'B-4'],
  ['Belén Grande 1',  'b-26.webp', 2350, 'B-26'],
  ['Belén Grande 2',  'b-27.webp', 3700, 'B-27']
];

/**
 * Crea la pestaña «Inventario» delante de «Pedidos», con las cabeceras y
 * los 9 productos ya cargados. Solo hay que rellenar las existencias.
 * Si la pestaña ya existe, no la toca.
 */
function crearHojaInventario() {
  var ss = _libroTienda_();
  var nombre = CONFIG_TIENDA.HOJA_INVENTARIO;

  if (ss.getSheetByName(nombre)) {
    Logger.log('La pestaña «%s» ya existe: no se toca nada.', nombre);
    return;
  }

  var hoja = ss.insertSheet(nombre, 0);   // 0 = primera posición, antes de Pedidos
  var nCols = CABECERAS_INVENTARIO.length;

  hoja.getRange(1, 1, 1, nCols).setValues([CABECERAS_INVENTARIO]);
  hoja.getRange(1, 1, 1, nCols)
    .setFontWeight('bold')
    .setBackground('#F5F0E8')
    .setBorder(null, null, true, null, null, null, '#C9A84C', SpreadsheetApp.BorderStyle.SOLID);
  hoja.setFrozenRows(1);

  // Tienda, Expo y Almacén a 0 para rellenar a mano; Existencias es su suma
  var filas = PRODUCTOS_WEB.map(function (p, i) {
    var f = i + 2;
    return [p[0], p[1], p[2], p[3], 0, 0, 0, '=E' + f + '+F' + f + '+G' + f, ''];
  });
  hoja.getRange(2, 1, filas.length, nCols).setValues(filas);

  hoja.getRange(2, 3, filas.length, 1).setNumberFormat('#,##0.00 "€"');       // Precio
  hoja.getRange(2, 5, filas.length, 4).setNumberFormat('0');                  // Tienda..Existencias
  hoja.getRange(2, 4, filas.length, 5).setHorizontalAlignment('center');      // Código..Existencias
  hoja.getRange(2, 8, filas.length, 1).setFontWeight('bold');                 // Existencias

  [190, 110, 90, 80, 70, 70, 80, 95, 260].forEach(function (ancho, i) {
    hoja.setColumnWidth(i + 1, ancho);
  });

  hoja.getRange(1, 8).setNote(
    'Suma de Tienda + Expo + Almacén.\nEste es el número que se publica en la web como «Stock: N».'
  );

  CacheService.getScriptCache().remove('stock_tienda');
  Logger.log('Pestaña «%s» creada con %s productos. Rellena la columna Existencias.',
    nombre, filas.length);
}

/** Número de columna → letra (5 → 'E'). */
function _colLetra(n) {
  var s = '';
  while (n > 0) {
    var r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

/**
 * Mueve «Existencias» detrás de «Almacén», para que el total quede después
 * de las tres ubicaciones que suma. Conserva los datos y reescribe la
 * fórmula de suma con las columnas nuevas (las celdas con un número escrito
 * a mano se dejan intactas).
 */
function reordenarInventario() {
  var hoja = _hojaInventario();
  var cab = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0].map(_norm);

  var cExist = cab.indexOf(_norm('Existencias')) + 1;
  var cAlmacen = cab.indexOf(_norm('Almacén')) + 1;
  if (!cExist || !cAlmacen) {
    throw new Error('No encuentro «Existencias» o «Almacén» en la fila 1 de «' + hoja.getName() + '».');
  }
  if (cExist === cAlmacen + 1) {
    Logger.log('«Existencias» ya está justo detrás de «Almacén»: no se toca nada.');
    return;
  }

  // moveColumns usa las coordenadas de ANTES de mover
  hoja.moveColumns(hoja.getRange(1, cExist, hoja.getMaxRows(), 1), cAlmacen + 1);
  SpreadsheetApp.flush();

  // Reescribe la suma con la posición nueva de cada columna
  var cab2 = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0].map(_norm);
  var e = cab2.indexOf(_norm('Existencias')) + 1;
  var t = cab2.indexOf(_norm('Tienda')) + 1;
  var x = cab2.indexOf(_norm('Expo')) + 1;
  var a = cab2.indexOf(_norm('Almacén')) + 1;
  var ultima = hoja.getLastRow();

  var rehechas = 0;
  if (ultima > 1 && e && t && x && a) {
    var formulas = hoja.getRange(2, e, ultima - 1, 1).getFormulas();
    for (var i = 0; i < formulas.length; i++) {
      if (!formulas[i][0]) continue;          // número a mano: no se toca
      var f = i + 2;
      hoja.getRange(f, e).setFormula(
        '=' + _colLetra(t) + f + '+' + _colLetra(x) + f + '+' + _colLetra(a) + f);
      rehechas++;
    }
  }

  CacheService.getScriptCache().remove('stock_tienda');
  Logger.log('Columnas: %s', cab2.join(' | '));
  Logger.log('«Existencias» movida a la columna %s. Fórmulas reescritas: %s.', _colLetra(e), rehechas);
  Logger.log('Stock leído ahora: %s', JSON.stringify(refrescarStock()));
}

/**
 * Pone al día la pestaña «Pedidos» con la estructura nueva: cabeceras,
 * anchos, formatos de moneda y desplegable Sí/No en «Enviar».
 * No borra ninguna fila. Si quedan pedidos con el formato antiguo (una
 * fila por pedido, con columna «Idioma»), avisa para que los revises.
 */
function actualizarHojaPedidos() {
  var ss = _hojaInventario().getParent();
  var hoja = ss.getSheetByName(CONFIG_TIENDA.HOJA_PEDIDOS);
  if (!hoja) { Logger.log('No existe la pestaña «%s».', CONFIG_TIENDA.HOJA_PEDIDOS); return; }

  var antiguas = hoja.getLastRow() - 1;
  var cabViejas = hoja.getLastColumn()
    ? hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0].map(_norm)
    : [];
  var eraAntigua = cabViejas.indexOf(_norm('Idioma')) >= 0;

  _formatearPedidos_(hoja);

  Logger.log('Cabeceras actualizadas: %s', CABECERAS_PEDIDOS.join(' | '));
  if (antiguas > 0 && eraAntigua) {
    Logger.log('⚠ Hay %s fila(s) con el formato anterior (una fila por pedido). '
      + 'Los datos siguen ahí, pero las columnas ya no significan lo mismo: '
      + 'si eran pruebas, bórralas.', antiguas);
  } else if (antiguas > 0) {
    Logger.log('%s fila(s) de pedidos conservadas.', antiguas);
  }
}

/** Ejecútalo una vez: crea la pestaña Pedidos y pide los permisos. */
function inicializarTienda() {
  crearHojaInventario();
  _hojaPedidos();
  Logger.log('Pestaña «%s» lista.', CONFIG_TIENDA.HOJA_PEDIDOS);
  Logger.log('Stock leído: %s', JSON.stringify(refrescarStock()));
}

/** Solo si creas el script suelto: imprime el ID de la hoja de inventario. */
function buscarHojaInventario() {
  var carpetas = DriveApp.getFoldersByName('Tienda');
  while (carpetas.hasNext()) {
    var archivos = carpetas.next().getFilesByName('inventario_tienda');
    while (archivos.hasNext()) {
      var f = archivos.next();
      Logger.log('inventario_tienda → SHEET_ID: %s', f.getId());
      return f.getId();
    }
  }
  Logger.log('No he encontrado «Tienda/inventario_tienda» en este Drive.');
  return null;
}

/** Diagnóstico: enseña exactamente qué está leyendo el script. */
function diagnosticoInventario() {
  var hoja = _hojaInventario();
  var libro = hoja.getParent();
  Logger.log('Archivo: %s', libro.getName());
  Logger.log('Pestañas: %s', libro.getSheets().map(function (h) { return '«' + h.getName() + '»'; }).join(', '));
  Logger.log('Pestaña que se está leyendo: «%s»', hoja.getName());

  var datos = hoja.getDataRange().getValues();
  Logger.log('Filas con contenido: %s (incluida la de cabeceras)', datos.length);
  if (!datos.length) { Logger.log('>> La pestaña está completamente vacía.'); return; }

  Logger.log('Cabeceras leídas en la fila 1: %s', JSON.stringify(datos[0]));
  var cabeceras = datos[0].map(_norm);
  ['Código', 'Existencias', 'Referencia', 'Precio', 'Tienda', 'Expo', 'Almacén', 'Observaciones']
    .forEach(function (n) {
      var i = cabeceras.indexOf(_norm(n));
      Logger.log('  %s → %s', n, i < 0 ? 'NO ENCONTRADA' : 'columna ' + (i + 1));
    });

  if (datos.length < 2) { Logger.log('>> Solo hay cabeceras: falta rellenar los productos.'); return; }
  for (var i = 1; i < Math.min(datos.length, 6); i++) {
    Logger.log('Fila %s: %s', i + 1, JSON.stringify(datos[i]));
  }
}

/** Comprueba que los códigos de la hoja casan con los de la web. */
function comprobarCodigos() {
  var DE_LA_WEB = ['B-15', 'B-16', '6', 'B-18', 'B-23', 'B-24', 'B-4', 'B-26', 'B-27'];
  var inv = leerInventario_().porCodigo;
  var faltan = DE_LA_WEB.filter(function (c) { return !inv[c]; });
  var sobran = Object.keys(inv).filter(function (c) { return DE_LA_WEB.indexOf(c) === -1; });
  Logger.log('En la web pero NO en la hoja: %s', faltan.length ? faltan.join(', ') : '(ninguno)');
  Logger.log('En la hoja pero NO en la web: %s', sobran.length ? sobran.join(', ') : '(ninguno)');
  DE_LA_WEB.forEach(function (c) {
    if (inv[c]) Logger.log('  %s → Existencias: %s', c, inv[c].existencias);
  });
}
