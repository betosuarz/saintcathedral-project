/**
 * BOLETÍN PARROQUIAL — backend independiente (Google Apps Script Web App).
 *
 * Proyecto SEPARADO: no comparte código ni despliegue con el backend de
 * reservas/visitas (emailscathedral-project.js) ni con el formulario de
 * newsletter de la web. Pégalo en un Apps Script NUEVO y vacío.
 *
 * Qué hace:
 *   doGet() devuelve en JSON la URL de descarga del ÚLTIMO PDF subido a la
 *   carpeta de Drive BOLETINES. La web (institucion.html) hace fetch a la URL
 *   /exec de este despliegue y fija el enlace "Descargar (PDF)" de la tarjeta.
 *
 * Despliegue:
 *   1. script.google.com → Proyecto nuevo → pega este archivo.
 *   2. Rellena FOLDER_ID (recomendado) con el ID de la carpeta BOLETINES.
 *   3. Implementar → Nueva implementación → Tipo: Aplicación web.
 *        - Ejecutar como: Yo
 *        - Quién tiene acceso: Cualquiera
 *   4. Copia la URL .../exec y pégala en BOLETIN_API dentro de institucion.html.
 *
 * Para publicar un boletín nuevo: sube el PDF a la carpeta BOLETINES.
 * El sitio servirá automáticamente el más reciente (con hasta CACHE_SEGUNDOS
 * de retardo). No hace falta volver a desplegar ni tocar la web.
 */

var CONFIG_BOLETIN = {
  // Recomendado: ID de la carpeta BOLETINES (está en su URL de Drive,
  // .../folders/ESTE_ES_EL_ID). La carpeta debe ser accesible por la cuenta
  // que despliega este script.
  FOLDER_ID: '1_YvHld3BaKF-zl2EaBm7_cEHJs-jKDO9',
  // Alternativa: si dejas FOLDER_ID vacío, se busca por nombre en tu Drive.
  FOLDER_NAME: 'BOLETINES',
  // Cuánto se cachea el "último boletín" para no consultar Drive en cada visita.
  CACHE_SEGUNDOS: 300
};

function doGet(e) {
  var out = ContentService.createTextOutput();
  out.setMimeType(ContentService.MimeType.JSON);
  try {
    out.setContent(JSON.stringify(obtenerUltimoBoletin_()));
  } catch (err) {
    out.setContent(JSON.stringify({ error: String(err && err.message || err) }));
  }
  return out;
}

function obtenerUltimoBoletin_() {
  var cache = CacheService.getScriptCache();
  var hit = cache.get('ultimoBoletin');
  if (hit) return JSON.parse(hit);

  var folder = CONFIG_BOLETIN.FOLDER_ID
    ? DriveApp.getFolderById(CONFIG_BOLETIN.FOLDER_ID)
    : _carpetaPorNombre(CONFIG_BOLETIN.FOLDER_NAME);

  var files = folder.getFiles();
  var ultimo = null;
  while (files.hasNext()) {
    var f = files.next();
    if (!_esPdf(f)) continue;
    if (!ultimo || f.getLastUpdated() > ultimo.getLastUpdated()) ultimo = f;
  }
  if (!ultimo) throw new Error('No hay ningún PDF en la carpeta BOLETINES');

  ultimo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  var info = {
    url: 'https://drive.google.com/uc?export=download&id=' + ultimo.getId(),
    nombre: ultimo.getName(),
    fecha: ultimo.getLastUpdated().toISOString()
  };
  cache.put('ultimoBoletin', JSON.stringify(info), CONFIG_BOLETIN.CACHE_SEGUNDOS);
  return info;
}

function _carpetaPorNombre(nombre) {
  var it = DriveApp.getFoldersByName(nombre);
  if (!it.hasNext()) throw new Error('No existe la carpeta "' + nombre + '"');
  return it.next();
}

function _esPdf(file) {
  return file.getMimeType() === MimeType.PDF || /\.pdf$/i.test(file.getName());
}
