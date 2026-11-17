/*
 * Carteles de encomiendas — Citek
 * Etapas 1-2: entrega de la interfaz y lectura de Hoja2 (solo lectura).
 * El ID de la planilla se guarda en Propiedades del script (clave SHEET_ID), nunca en el código.
 */

var HOJA = 'Hoja2';
var ENCABEZADOS = ['Cuenta', 'Razon Social', 'Nombre fantasia', 'Direccion', 'Telefono', 'Departamento', 'Condiciones Especiales'];
var CLAVES = ['cuenta', 'razonSocial', 'fantasia', 'direccion', 'telefono', 'departamento', 'condicion'];

function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle('Carteles de encomiendas — Citek')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Permite incluir Styles y JavaScript dentro de Index mediante <?!= include('...') ?>
function include(nombre) {
  return HtmlService.createHtmlOutputFromFile(nombre).getContent();
}

// Comparación de encabezados tolerante a mayúsculas y tildes (no reordena columnas).
function normalizar_(s) {
  return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function error_(codigo, mensaje) {
  return { ok: false, codigo: codigo, mensaje: mensaje };
}

/**
 * Lee los clientes de Hoja2 (A:G, datos desde la fila 2) con getDisplayValues().
 * Devuelve {ok:true, clientes:[...]} o {ok:false, codigo, mensaje}. Nunca escribe en la planilla.
 */
function cargarClientes() {
  try {
    var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
    if (!id) return error_('SIN_CONFIG', 'Falta configurar SHEET_ID en Propiedades del script.');

    var ss;
    try { ss = SpreadsheetApp.openById(id); }
    catch (e) { return error_('SIN_ACCESO', 'No se pudo abrir la planilla. Revisá el ID y los permisos de la cuenta.'); }

    var hoja = ss.getSheetByName(HOJA);
    if (!hoja) return error_('SIN_HOJA', 'No existe la pestaña "' + HOJA + '" en la planilla.');

    var cab = hoja.getRange(1, 1, 1, ENCABEZADOS.length).getDisplayValues()[0];
    for (var i = 0; i < ENCABEZADOS.length; i++) {
      if (normalizar_(cab[i]) !== normalizar_(ENCABEZADOS[i])) {
        return error_('ENCABEZADOS', 'La columna ' + (i + 1) + ' debería llamarse "' + ENCABEZADOS[i] + '" y dice "' + cab[i] + '".');
      }
    }

    var ultima = hoja.getLastRow();
    if (ultima < 2) return { ok: true, clientes: [] };

    var filas = hoja.getRange(2, 1, ultima - 1, ENCABEZADOS.length).getDisplayValues();
    var clientes = [];
    filas.forEach(function (f) {
      if (f.join('').trim() === '') return; // descarta filas vacías
      var c = {};
      CLAVES.forEach(function (k, j) { c[k] = String(f[j]).trim(); });
      clientes.push(c);
    });
    return { ok: true, clientes: clientes };
  } catch (e) {
    console.error(e);
    return error_('ERROR', 'Error inesperado al leer la planilla.');
  }
}
