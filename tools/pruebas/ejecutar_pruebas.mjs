// Ejecuta los casos de casos.json en Chromium sin interfaz: genera los carteles, revisa desbordes y guarda PNG y PDF en salida/.
// Uso:  npm install  &&  python3 construir_pagina.py  &&  node ejecutar_pruebas.mjs
import chromium from '@sparticuz/chromium';
import { chromium as pw } from 'playwright-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
const aqui = path.dirname(fileURLToPath(import.meta.url));
const salida = path.join(aqui, 'salida');
const casos = JSON.parse(fs.readFileSync(path.join(aqui, 'casos.json'), 'utf8'));
const b = await pw.launch({ executablePath: await chromium.executablePath(), args: chromium.args, headless: true });
const p = await b.newPage({ viewport: { width: 1300, height: 900 } });
p.on('pageerror', e => console.log('ERROR DE PÁGINA:', e.message));
await p.goto(pathToFileURL(path.join(salida, 'app.html')).href);
await p.waitForTimeout(300);
const auto = await p.evaluate(() => { const r = window.autopruebas(); return { total: r.total, fallos: r.fallos }; });
console.log('autopruebas:', JSON.stringify(auto));
for (const c of casos) {
  await p.click('#b-nuevo');
  await p.selectOption('#f-formato', c.formato || 'E');
  for (const [id, v] of [['#f-razon', c.razon], ['#f-fantasia', c.fant], ['#f-dir', c.dir], ['#f-tel', c.tel], ['#f-depto', c.depto], ['#f-cajas', String(c.cajas)], ['#f-cond', c.cond]]) await p.fill(id, v || '');
  if ((await p.isChecked('#c-cond')) !== !!c.cond) await p.click('#c-cond', { force: true });
  if ((await p.isChecked('#c-factura')) !== !!c.factura) await p.click('#c-factura', { force: true });
  if (c.fragil) await p.click('#c-fragil', { force: true });
  if (c.logo) await p.click('#seg-logo button[data-v="' + c.logo + '"]'); // logo de fondo: rte o todo (sin logo por defecto)
  if (c.porBulto && c.porBulto !== 3) await p.click('#dial-porbulto .dial-pos[data-v="' + c.porBulto + '"]'); // cajas por bulto (3 por defecto)
  const t0 = Date.now();
  await p.click('#b-generar');
  await p.waitForTimeout(400);
  const ms = Date.now() - t0;
  await p.emulateMedia({ media: 'print' }); // se revisa como sale impreso
  const r = await p.evaluate(() => {
    const out = { hojas: document.querySelectorAll('#impresion .hoja').length, carteles: document.querySelectorAll('#impresion .cartel:not(.vacio)').length, mal: [], tam: {} };
    document.querySelectorAll('#impresion .cartel-e').forEach((cartel, i) => {
      cartel.querySelectorAll('.fit').forEach(e => {
        const padre = e.parentElement, cs = getComputedStyle(padre), lh = parseFloat(getComputedStyle(e).lineHeight), alto = e.getBoundingClientRect().height;
        const interior = padre.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
        const lineas = Math.round(alto / lh), rol = e.dataset.r;
        if (i === 0) out.tam[rol] = getComputedStyle(e).fontSize + ' ' + lineas + 'L';
        if (e.scrollWidth > e.clientWidth + 1 || alto > interior + 1 || lineas > +e.dataset.l) out.mal.push('cartel ' + (i + 1) + ' ' + rol);
      });
      if (cartel.scrollHeight > cartel.clientHeight + 1 || cartel.scrollWidth > cartel.clientWidth + 1) out.mal.push('cartel ' + (i + 1) + ' desborda');
    });
    out.aviso = document.getElementById('avisos').textContent;
    return out;
  });
  if (c.bultos !== undefined && r.carteles !== c.bultos) r.mal.push('BULTOS: esperaba ' + c.bultos + ' y hay ' + r.carteles);
  console.log(c.id, '|', ms + ' ms | hojas', r.hojas, '| carteles', r.carteles, '| desbordes:', r.mal.length ? r.mal.slice(0, 5).join(', ') : 'ninguno', r.aviso ? '| AVISO: ' + r.aviso : '');
  console.log('   tamaños del cartel 1:', JSON.stringify(r.tam));
  await p.screenshot({ path: path.join(salida, c.id + '.png'), fullPage: r.hojas <= 20 }); // con cientos de hojas la captura completa excede la memoria del navegador
  await p.pdf({ path: path.join(salida, c.id + '.pdf'), preferCSSPageSize: true, printBackground: true });
  await p.emulateMedia({ media: 'screen' });
}
await b.close();
