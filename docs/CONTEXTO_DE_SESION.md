# Contexto de sesión y próximos pasos

**Proyecto:** Carteles de encomiendas — Citek  
**Última actualización:** 2026-11-26 (estética oscura con toasts y slider de cajas por bulto).  
**Para qué sirve este documento:** que otra sesión (con Claude u otra persona) retome el trabajo sin repetir preguntas ni perder decisiones.

## 1. Cómo retomar

1. Leer `README.md`, este documento y `docs/ESPECIFICACION_FUNCIONAL.md` (en especial las secciones 4.1, 7.1, 10 y 15).
2. Verificar el estado real del repositorio antes de tocar nada (`git ls-remote --heads`), porque el usuario también edita desde la web de GitHub y hace los pull requests él mismo.
3. Trabajar en una rama nueva a partir de la más reciente (ver sección 2) y nunca directamente sobre `main`.
4. No hacer todo a la vez: dividir el pedido en partes, terminar una, probarla y dejar contexto antes de seguir (preferencia expresa del usuario).
5. Todo cambio funcional se registra en la especificación y en el plan de pruebas en el mismo cambio. Ante contradicciones, consultar al usuario antes de implementar.

## 2. Estado del repositorio

Repositorio: `citekadm/carteles-encomiendas-citek`.

- **`main`** tiene integrado el trabajo hasta `ajustes-detalles-4` (PR #11): alta de clientes, formato E, FRÁGIL, ajustes del cartel, estética oscura violeta, logo blanco, cajas por bulto con dial, franja superior a todo el ancho y nueva disposición.
- **`logo-marca-de-agua`**: logo como marca de agua con selector (opciones «remitente» y «cartel»). **No está integrada en `main`.**
- **`formato-unico-neumorfico`**: la rama más reciente; incluye a `logo-marca-de-agua` y los cambios del 2026-11-25 (sección 3). Para integrar todo basta un pull request de esta rama contra `main`.
- Existen además `citekadm-patch-1` y `citekadm-patch-2`, ediciones hechas por el usuario desde la web que **no se revisaron**.
- El Apps Script publicado **no** tiene los cambios más nuevos: hay que copiar los archivos de `gas/` y desplegar una versión nueva (puede pedir reautorizar).

## 3. Último cambio (2026-11-25)

Pedido del usuario y resultado:

1. **Formato clásico (A) eliminado definitivamente**, junto con el selector de formato: no se le iba a dar el uso necesario. Se borraron del código `crearCartel`, `ajustar`, `medir` y los estilos del cartel clásico; quedó solo el cartel en recuadros.
2. **Logo como marca de agua fija**, centrado en medio del cartel y por debajo de todo el texto (la opción «solo en el remitente» se descartó). Se eliminó el selector de logo: es una decisión del diseño. Al 60 % del ancho y con opacidad del 9 % (`.marca-todo`, `gas/Styles.html`).
3. **Estética nueva:** neumorfismo claro, según `docs/referencias/Referencia_estetica_neumorfismo_claro.jpeg`: fondo gris azulado, relieves suaves, campos hundidos, acento azul, interruptores con riel y perilla, botones circulares «−» y «+», lupa en el buscador y selector de cajas por bulto tipo «knob» (perilla con puntos alrededor y punto azul en la opción elegida). Reemplaza al estilo oscuro violeta.
4. El logo del encabezado pasó a su **color rojo de marca** (`docs/referencias/Logo_Citek_rojo.png`), porque el blanco no se vería sobre fondo claro.
5. Se quitó el logo blanco del repositorio y se actualizaron la especificación (secciones 2, 8, 10 y 15.5 a 15.9), el plan de pruebas (secciones 11 a 15), la arquitectura, el README y las herramientas de prueba (11 casos).

## 3 bis. Cambio del 2026-11-26 (rama `estetica-oscura-toasts`)

Pedido del usuario: el estilo claro no le gusta; usar la estética de `docs/referencias/Referencia_estetica_oscura_premium.jpeg`. Resultado (detalle en especificación 15.10): tema oscuro con relieve y brillo; el knob se reemplazó por un **slider 1-2-3 con marcas numeradas**; **FRÁGIL, factura y condición especial pasaron de interruptores a toasts** seleccionables (activo = tarjeta clara con tilde; inactivo = tarjeta oscura). Solo cambió la interfaz de pantalla: cartel, reglas e impresión intactos (12 casos y 100 autopruebas sin fallos). Las pruebas usan ahora `.marca-n[data-v=…]` en lugar del dial.

## 4. Producto vigente en pocas líneas

- **Pantalla (tres columnas):** cliente (con condición especial y «+ Nuevo cliente»); envío (cantidad de cajas con − / +, cajas por bulto con slider, toasts de FRÁGIL, factura y condición) y resumen; acciones y vista previa (siempre visible, escalada al ancho de su tarjeta, tope 360 px).
- **Cartel (media hoja A4, un solo formato):** franja superior opcional (condición y/o «FACTURA EN CAJA»; si hay una sola, ocupa todo el ancho); nombre fantasía como texto principal; razón social; dirección y teléfono; departamento; abajo «n de N» y remitente. Todos los textos (menos el remitente) usan el mayor tamaño que entra en su recuadro (especificación 15.7, con 3 % de margen de seguridad).
- **FRÁGIL:** una hoja A4 apaisada por bulto, con dos franjas laterales solo de contorno (especificación 15.6).
- **Cajas por bulto:** 1, 2 o 3 (3 por defecto); bultos = `techo(cajas / k)` (especificación 7.1). «Nuevo envío» la vuelve a 3 y apaga FRÁGIL.
- **Alta de clientes:** única escritura sobre `Hoja2`; guarda también la condición especial escrita en su campo (especificación 4.1).

## 5. Decisiones del desarrollador que el usuario aún no confirmó

- FRÁGIL se aplica a todos los bultos del envío (no por bulto) y las franjas quedan a 6,35 mm del borde.
- El logo del encabezado en rojo de marca (en lugar de blanco) por el fondo claro.
- Intensidad de la marca de agua: 9 %. Hay que probarla en la impresora de la oficina y ajustarla si hace falta.
- Margen de seguridad del 3 % en los tamaños de letra: los textos quedan un poco más chicos que el máximo que entra.
- Pesos de altura de los recuadros: fantasía 2,6 / razón social 1,5 / dirección-teléfono 1,6 / departamento 3,3 (clases `.e-fant`, `.e-razon`, `.e-dt`, `.e-depto` en `gas/Styles.html`). El departamento resulta algo más chico que antes (unos 105 px con datos cortos) porque la fantasía pasó a ser lo principal.
- Cajas por bulto entendidas como «máximo de cajas por bulto» para todo el envío; mezclar bultos de distinto tamaño en un envío requeriría rediseñar.
- Los textos «Se imprime» / «No se imprime» de los toasts y el dorado como color de selección son decisión del desarrollador.
- Revisar contraste y brillos de la estética oscura en las pantallas de la oficina.

## 6. Tareas abiertas

- Impresión real desde Chrome en las PC de uso (cartel normal, FRÁGIL y marca de agua), con la impresora en blanco y negro (plan de pruebas 11.4 y 14).
- Pruebas de acceso y publicación del Apps Script (sección 9 del plan de pruebas).
- Guía final de entrega (instalación, autorización, publicación y actualización de versiones).
- Probar con la hoja `Hoja2` real, incluido el alta de clientes y la columna de condiciones especiales (en una copia primero).
- Integrar la rama `formato-unico-neumorfico` en `main` y desplegar una versión nueva del Apps Script.
- Revisar `citekadm-patch-1` y `citekadm-patch-2`.

## 7. Cómo probar

Carpeta `tools/pruebas/` (usa Chromium sin interfaz; no reemplaza la impresión real):

```bash
cd tools/pruebas
npm install                      # instala Chromium empaquetado y Playwright
python3 construir_pagina.py      # arma salida/app.html con google.script.run simulado
node ejecutar_pruebas.mjs        # ejecuta casos.json y guarda PNG y PDF en salida/
python3 verificar_pdf.py         # compara páginas y orientación (requiere: pip install pypdf)
```

- `casos.json` tiene 11 casos: datos cortos y largos, una palabra larga, sin teléfono ni fantasía, 999 cajas, FRÁGIL (con textos cortos y largos) y cajas por bulto de a 1 y de a 2. Cada caso declara los bultos, las páginas y la orientación esperados.
- La salida marca «desbordes» si algún texto se sale de su recuadro y compara páginas y orientación de los PDF. Con cientos de hojas solo se guarda el PDF, porque la captura completa excede la memoria del navegador de prueba.
- El navegador de prueba usa Liberation Serif, de medidas equivalentes a Times New Roman; las medidas reales pueden variar levemente.
- Mirar las capturas de `salida/` después de cualquier cambio de diseño: los números solos no detectan todo.
- Para probar los controles (slider, toasts, alta de clientes, PNG, FRÁGIL) se usaron scripts descartables de Playwright.

## 8. Mapa rápido del código

| Archivo | Qué contiene |
|---|---|
| `gas/Code.gs` | `doGet`, `cargarClientes` (lectura de `Hoja2`) y `agregarCliente` (única escritura, con bloqueo). |
| `gas/Index.html` | Estructura de la interfaz; logo del encabezado incrustado en base64; `<style id="pagina">` para la hoja apaisada. |
| `gas/Styles.html` | Interfaz oscura (variables en `:root`), toasts y slider, cartel en recuadros, marca de agua, franjas FRÁGIL y reglas de impresión. |
| `gas/JavaScript.html` | `Reglas` (lógica pura con `autopruebas()`), cartel (`crearCartelE`, `marca`, `entra`, `fijarTam`, `ajustarE`, `medirE`, `crearHojaFragil`), `renderCarteles`, `escalarVista`, slider (`pintarPorBulto`, `elegirPorBulto`), PNG, alta de clientes y eventos. |

## 9. Notas de trabajo

- El usuario escribe en español rioplatense; las respuestas deben ir en español claro y concreto.
- Subir cambios requiere un token de GitHub que el usuario pega en la conversación; el token nunca se guarda en el repositorio y debe revocarse al terminar. Subir siempre a una rama nueva.
- Las capturas de pantalla del usuario muestran la aplicación real en uso; conviene mirarlas con cuidado.
- Los archivos de `docs/referencias/` son las imágenes de diseño aportadas por el usuario y las derivadas del logo; `Referencia_estetica_Obsidian_Home.png` es la referencia oscura anterior, reemplazada.
