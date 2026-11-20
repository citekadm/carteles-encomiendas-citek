# Arquitectura prevista y plan de desarrollo

**Proyecto:** Carteles de encomiendas — Citek  
**Estado:** aplicación implementada (formatos A y E, FRÁGIL, alta de clientes); en pruebas, pendiente la impresión real desde Chrome.

## 1. Principios técnicos

- Aplicación web sobre Google Apps Script.
- Google Sheets como fuente de datos de clientes.
- Separar acceso a datos, lógica de negocio, presentación y estilos.
- Mantener las reglas de negocio en funciones pequeñas y comprobables.
- La hoja de clientes es de solo lectura, salvo el alta explícita de un cliente nuevo (`agregarCliente`), que solo agrega una fila al final.
- Los cambios del formulario son temporales y pertenecen al envío actual.
- Vista previa e impresión comparten la misma estructura HTML/CSS.
- No incorporar dependencias externas salvo que se justifique y se apruebe.
- No agregar funcionalidades fuera de la especificación.

## 2. Estructura inicial del repositorio

```text
.
├── README.md
├── .gitignore
├── docs/
│   ├── ESPECIFICACION_FUNCIONAL.md
│   ├── ARQUITECTURA_Y_PLAN.md
│   └── PLAN_DE_PRUEBAS.md
└── gas/
    ├── appsscript.json
    ├── Code.gs
    ├── Index.html
    ├── Styles.html
    └── JavaScript.html
```

`gas/appsscript.json` (manifiesto) se agregó a la estructura inicial. Los archivos de `gas/` contienen la aplicación implementada.

## 3. Responsabilidad prevista por archivo

### `gas/Code.gs`

Responsabilidad de servidor:

- Punto de entrada de la Web App (`doGet`).
- Obtener la hoja `Hoja2` y leer los datos de clientes.
- Entregar al navegador los datos necesarios.
- Validar y normalizar los datos recibidos cuando corresponda.
- No escribir en la hoja de clientes, salvo `agregarCliente()` por acción explícita del usuario.
- Mantener separadas las funciones de acceso a Sheets y las reglas de negocio.

### `gas/Index.html`

- Estructura principal de la interfaz.
- Formulario y distribución de tres columnas (cliente; envío y acciones; vista previa reducida).
- Contenedor de vista previa.
- Inclusión de estilos y JavaScript mediante los mecanismos de plantillas de Apps Script.

### `gas/Styles.html`

- Estilos de interfaz.
- Estilos de los carteles.
- Reglas de impresión A4.
- Reglas de salto de página, dimensiones, corte y adaptación de texto.
- Estilos de los formatos A y E y de las franjas FRÁGIL. La regla `@page` apaisada no está aquí: JavaScript la agrega en `<style id="pagina">` (de `Index.html`) solo con FRÁGIL.
- Diferenciación entre pantalla y papel mediante `@media print`.

### `gas/JavaScript.html`

- Búsqueda y autocompletado de clientes.
- Gestión de selección y edición temporal.
- Validación de cantidad de cajas.
- Cálculo de bultos.
- Estado de casillas y datos del envío.
- Generación de carteles y actualización de vista previa.
- Acciones de imprimir y nuevo envío.
- Formato E: creación del cartel, ajuste de texto por recuadro (`ajustarE`) y hoja FRÁGIL.
- Alta de clientes nuevos y autocompletado en los campos de razón social y fantasía.

La distribución final de funciones podrá detallarse durante el diseño técnico, pero debe conservar esta separación conceptual.

## 4. Reglas de negocio que deben centralizarse

1. Normalización de texto para búsqueda sin distinguir mayúsculas ni tildes.
2. Validación de cantidad de cajas: entero entre 1 y 999.
3. Cálculo de bultos: `Math.ceil(cajas / 3)`.
4. Numeración correlativa: desde 1 hasta el total de bultos.
5. «FACTURA EN CAJA» solo en el primer cartel si la opción está activa.
6. Condición especial en todos los carteles si la opción está activa y el texto no está vacío.
7. Las modificaciones del formulario nunca se escriben en la base; solo el alta explícita «+ Nuevo cliente» agrega una fila.

Evitar duplicar estas reglas en distintos lugares del código.

## 5. Flujo principal

1. Abrir la Web App.
2. Cargar clientes desde `Hoja2`.
3. Buscar por cuenta, razón social o nombre fantasía.
4. Seleccionar un cliente o elegir la carga manual (opcionalmente guardarlo con «+ Nuevo cliente»).
5. Revisar y ajustar temporalmente los datos.
6. Ingresar cantidad de cajas.
7. Elegir el formato de cartel (A o E) y revisar las opciones FRÁGIL, factura y condición especial.
8. Generar carteles y vista previa.
9. Comprobar el resumen y la distribución de bultos.
10. Imprimir desde Chrome.
11. Iniciar un nuevo envío sin alterar la base de clientes.

## 6. Metodología de desarrollo con Claude

El desarrollador principal será Claude. ChatGPT actuará como apoyo para ordenar requisitos, redactar instrucciones y revisar propuestas/cambios.

### Etapa 1 — Análisis, sin programar

Claude debe:

- Leer íntegramente el README y los documentos de `docs/`.
- Resumir las reglas funcionales.
- Identificar decisiones técnicas necesarias.
- Proponer arquitectura y flujo de datos.
- Identificar riesgos específicos de impresión y Apps Script.
- Señalar cualquier contradicción o dato que falte.

**No debe escribir código en esta etapa.** Debe esperar aprobación explícita de la propuesta.

### Etapa 2 — Implementación

Una vez aprobada la arquitectura:

- Crear los archivos completos.
- No entregar fragmentos sueltos ni instrucciones ambiguas para ensamblar código.
- Respetar la especificación.
- No modificar la hoja de clientes (salvo el alta explícita de clientes nuevos).
- No añadir funciones no solicitadas.
- Comentar las partes técnicas relevantes sin llenar el código de comentarios innecesarios.

### Etapa 3 — Pruebas y correcciones

- Ejecutar y documentar los escenarios del plan de pruebas.
- Corregir los problemas encontrados.
- Verificar expresamente la impresión real desde Chrome.
- No declarar resuelta una cuestión de impresión solo porque la vista previa se vea bien.

### Etapa 4 — Entrega

Claude debe entregar:

- Contenido completo y actualizado de cada archivo.
- Explicación de la estructura.
- Instrucciones para configurar el ID del Google Sheets si fuera necesario.
- Instrucciones de instalación/sincronización con Apps Script.
- Instrucciones de autorización y publicación de la Web App.
- Explicación de cómo actualizar una versión desplegada.
- Resultados de las pruebas y limitaciones conocidas.

## 7. GitHub y control de versiones

- El repositorio privado es la referencia central del proyecto.
- Los cambios deben quedar registrados mediante commits descriptivos.
- Revisar los cambios antes de incorporarlos a la rama principal.
- No sobrescribir trabajo existente sin inspeccionar primero el estado actual.
- Para cambios importantes, preferir una rama de trabajo y una revisión antes de integrar.
- Mantener la documentación actualizada cuando se aprueben cambios funcionales.

## 8. Archivos y secretos que no deben versionarse

No subir:

- `.clasprc.json` ni credenciales locales de clasp.
- Tokens, contraseñas, claves privadas o archivos de autenticación.
- Exportaciones de datos reales de clientes.
- Copias de hojas de cálculo con datos personales.
- Archivos temporales locales.

Los identificadores de proyecto o de hoja de cálculo deben tratarse con cuidado y configurarse según el mecanismo que se apruebe. No incluir secretos en el código ni en el repositorio.

## 9. Decisiones técnicas planteadas en la etapa de análisis

Estas cuestiones no alteran los requisitos funcionales. **Todas están resueltas en la sección 10.** Se conserva la lista como registro:

- Cómo se identificará el archivo de Sheets (ID configurado, propiedad del script u otro mecanismo seguro).
- Cómo se refrescará la caché o los datos de clientes al usar «Recargar clientes».
- Cómo se manejarán errores de permisos, hoja inexistente o estructura incorrecta.
- Cómo se garantizará la paginación exacta en A4 en Chrome.
- Qué opciones exactas de acceso estarán disponibles en el despliegue de Apps Script y cómo se autorizarán las PC/usuarios.

Regla permanente: no inventar valores ni asumir decisiones no tomadas. Claude debe explicar ventajas, límites y recomendación, y esperar aprobación donde corresponda.

## 10. Decisiones resueltas en el análisis

- **ID de la planilla:** propiedad de script `SHEET_ID`.
- **Recarga de clientes:** sin caché; «Recargar clientes» lee siempre la hoja.
- **Errores:** código y mensaje diferenciados (sin configuración, planilla inaccesible, hoja inexistente, encabezados distintos) y la aplicación sigue utilizable en modo manual.
- **Paginación en A4:** hoja de 296 mm con dos carteles de 148 mm, `@page` A4 con margen cero, salto de página por hoja y verificación con impresión real desde Chrome.
- **Acceso:** ejecutar como propietario, acceso «solo yo», misma cuenta en ambas PC.
- **Alcance de permisos:** `spreadsheets` (ver sección 15.4 de la especificación).
- **Lógica:** toda la lógica de negocio corre en el navegador como funciones puras (`Reglas`); el servidor solo entrega la interfaz y lee la hoja.
- **Formato E:** cartel armado con recuadros; los tamaños de CSS son máximos y `ajustarE()` busca, por búsqueda binaria en píxeles enteros, el mayor tamaño que entra en el recuadro (una palabra: una línea; varias: hasta 2). Se mide en el DOM, fuera de pantalla y a tamaño real, una vez por variante del envío; los tamaños resultantes se aplican a todos los carteles (ver 15.7 de la especificación).
- **FRÁGIL:** hoja de 297 × 209 mm con el cartel central de 217,7 mm y dos franjas de 33,3 mm. La regla `@page { size: A4 landscape }` se inyecta en `#pagina` al generar y se vacía en otro caso, para no alterar la hoja vertical.
- **Hojas:** `Reglas.hojas(bultos, fragil)`: `ceil(bultos / 2)` o, con FRÁGIL, una por bulto.
- **PNG:** mismo cartel (210 × 148 mm) o, con FRÁGIL, la hoja apaisada completa, a unos 150 ppp.
- **Herramienta de prueba automática:** Chromium sin interfaz con Playwright, sobre una copia de la interfaz con `google.script.run` simulado. Los scripts no se versionan; sus resultados se registran en el plan de pruebas (sección 11).
