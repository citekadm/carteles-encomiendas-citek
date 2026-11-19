/*
 * Carteles de encomiendas — Citek
 * Interfaz, lectura de Hoja2 y alta explícita de clientes nuevos.
 * El ID de la planilla se guarda en Propiedades del script (clave SHEET_ID), nunca en el código.
 *
 * Única escritura permitida: agregarCliente(), que solo AGREGA una fila al final cuando el usuario lo pide.
 * Nunca modifica ni elimina filas existentes.
 */

var HOJA = 'Hoja2';
var ENCABEZADOS = ['Cuenta', 'Razon Social', 'Nombre fantasia', 'Direccion', 'Telefono', 'Departamento', 'Condiciones Especiales'];
var CLAVES = ['cuenta', 'razonSocial', 'fantasia', 'direccion', 'telefono', 'departamento', 'condicion'];
var MAX_CAMPO = 300; // largo máximo por campo al agregar un cliente

function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle('Carteles de encomiendas — Citek')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Permite incluir Styles y JavaScript dentro de Index mediante <?!= include('...') ?>
function include(nombre) {
  return HtmlService.createHtmlOutputFromFile(nombre).getContent();
}

// Comparación de textos tolerante a mayúsculas y tildes (no reordena columnas).
function normalizar_(s) {
  return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function error_(codigo, mensaje) {
  return { ok: false, codigo: codigo, mensaje: mensaje };
}

/**
 * Abre la planilla y valida la pestaña y los encabezados.
 * Devuelve {ok:true, hoja} o {ok:false, codigo, mensaje}.
 */
function abrirHoja_() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) return error_('SIN_CONFIG', 'Falta configurar SHEET_ID en Propiedades del script.');

  var ss;
  try { ss = SpreadsheetApp.openById(id); }
  catch (e) { console.error('openById falló: ' + e); return error_('SIN_ACCESO', 'No se pudo abrir la planilla. Revisá el ID y los permisos de la cuenta.'); }

  var hoja = ss.getSheetByName(HOJA);
  if (!hoja) return error_('SIN_HOJA', 'No existe la pestaña "' + HOJA + '" en la planilla.');

  var cab = hoja.getRange(1, 1, 1, ENCABEZADOS.length).getDisplayValues()[0];
  for (var i = 0; i < ENCABEZADOS.length; i++) {
    if (normalizar_(cab[i]) !== normalizar_(ENCABEZADOS[i])) {
      return error_('ENCABEZADOS', 'La columna ' + (i + 1) + ' debería llamarse "' + ENCABEZADOS[i] + '" y dice "' + cab[i] + '".');
    }
  }
  return { ok: true, hoja: hoja };
}

/**
 * Lee los clientes de Hoja2 (A:G, datos desde la fila 2) con getDisplayValues().
 * Devuelve {ok:true, clientes:[...]} o {ok:false, codigo, mensaje}. Nunca escribe en la planilla.
 */
function cargarClientes() {
  try {
    var ab = abrirHoja_();
    if (!ab.ok) return ab;
    var hoja = ab.hoja;

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

/**
 * Agrega UN cliente nuevo al final de Hoja2. Solo se invoca por acción explícita del usuario.
 * - Valida y normaliza los datos recibidos (la razón social es obligatoria; la cuenta es opcional).
 * - Rechaza una cuenta que ya existe.
 * - Usa un bloqueo para que dos PC que guardan a la vez no pisen la misma fila.
 * - Escribe como texto plano: conserva ceros iniciales y no interpreta "=..." como fórmula.
 * Devuelve {ok:true, cliente} o {ok:false, codigo, mensaje}.
 */
function agregarCliente(c) {
  var lock = LockService.getScriptLock();
  var tomado = false;
  try {
    var datos = {};
    for (var i = 0; i < CLAVES.length; i++) {
      var k = CLAVES[i];
      var v = c && c[k] != null ? String(c[k]).trim() : '';
      if (v.length > MAX_CAMPO) return error_('LARGO', 'El campo "' + ENCABEZADOS[i] + '" supera los ' + MAX_CAMPO + ' caracteres.');
      datos[k] = v;
    }
    if (!datos.razonSocial) return error_('FALTA_RAZON', 'La razón social es obligatoria.');

    tomado = lock.tryLock(15000);
    if (!tomado) return error_('OCUPADO', 'La base está ocupada con otro guardado. Probá de nuevo en unos segundos.');

    var ab = abrirHoja_();
    if (!ab.ok) return ab;
    var hoja = ab.hoja;

    var ultima = hoja.getLastRow();
    if (datos.cuenta && ultima >= 2) {
      var cuentas = hoja.getRange(2, 1, ultima - 1, 1).getDisplayValues();
      for (var j = 0; j < cuentas.length; j++) {
        if (normalizar_(cuentas[j][0]) === normalizar_(datos.cuenta)) {
          return error_('CUENTA_EXISTE', 'La cuenta ' + datos.cuenta + ' ya existe en la base. No se agregó nada.');
        }
      }
    }

    var fila = Math.max(ultima, 1) + 1;
    if (fila > hoja.getMaxRows()) hoja.insertRowsAfter(hoja.getMaxRows(), 1);
    var rango = hoja.getRange(fila, 1, 1, ENCABEZADOS.length);
    rango.setNumberFormat('@');
    rango.setValues([CLAVES.map(function (k) { return datos[k]; })]);
    SpreadsheetApp.flush();
    return { ok: true, cliente: datos };
  } catch (e) {
    console.error(e);
    return error_('ERROR', 'Error inesperado al guardar el cliente. Revisá la base antes de reintentar.');
  } finally {
    if (tomado) lock.releaseLock();
  }
}
