# Especificación funcional
## Aplicación de carteles de encomiendas — Citek

**Estado:** requisitos acordados; aplicación implementada y en pruebas (falta la impresión real desde Chrome).  
**Fuente de verdad:** este documento y las decisiones expresamente aprobadas por el usuario.  
**Alcance:** primera versión de la aplicación web.

---

## 1. Objetivo

Crear una aplicación web con Google Apps Script, vinculada a una hoja de cálculo de Google Sheets existente, que permita seleccionar o ingresar un cliente, completar los datos del envío y generar carteles imprimibles para identificar los bultos de una encomienda.

La aplicación debe ser sencilla de utilizar, confiable y especialmente cuidadosa con la distribución de los carteles al imprimir.

## 2. Alcance y límites

### Incluido en la primera versión

- Lectura de la base de clientes existente.
- Búsqueda y autocompletado de clientes.
- Selección de un cliente o ingreso manual de uno nuevo para el envío actual.
- Edición temporal de los datos que se imprimirán.
- Cálculo automático de bultos a partir de la cantidad de cajas.
- Condición especial opcional.
- Opción para imprimir «FACTURA EN CAJA».
- Vista previa de los carteles.
- Impresión en A4 vertical, dos carteles por hoja.
- Dos formatos de cartel a elegir: A (clásico) y E (cuadros) (secciones 8 y 15.5).
- Opción FRÁGIL: un cartel por hoja A4 apaisada, con franjas laterales (sección 15.6).
- Alta explícita de clientes nuevos con «+ Nuevo cliente» (sección 4.1).
- Imagen PNG del primer bulto copiada al portapapeles (sección 15).
- Acceso mediante una aplicación web de Apps Script para usuarios autorizados.

### Fuera del alcance de esta versión

- Guardar clientes nuevos en la base de forma automática o silenciosa (el alta solo existe mediante el botón «+ Nuevo cliente», sección 4.1).
- Modificar datos de clientes existentes en la hoja de origen.
- Guardar cambios temporales del formulario.
- Selector de direcciones alternativas para un mismo cliente.
- Incorporar artículos distintos de cajas al cálculo de bultos. Se prevé que pueda agregarse en el futuro, pero no se implementará ahora.
- Funciones adicionales no descritas en esta especificación.

## 3. Fuente de datos: Google Sheets

La aplicación se conectará a un archivo de Google Sheets existente. La pestaña que contiene los clientes se llama **`Hoja2`**.

- Fila 1: encabezados.
- Datos: desde la fila 2.
- La aplicación lee esta hoja y solo la escribe mediante el alta explícita de un cliente nuevo (sección 4.1), que únicamente agrega una fila al final. No debe modificar ni eliminar filas ni celdas existentes.
- Leer los datos con `getDisplayValues()`, para conservar la representación visible de valores como cuentas y teléfonos, incluidos ceros iniciales y formatos.

### 3.1 Estructura de columnas

| Columna | Encabezado | Uso |
|---|---|---|
| A | Cuenta | Identificación/búsqueda del cliente |
| B | Razon Social | Razón social que se imprime |
| C | Nombre fantasia | Nombre fantasía que se imprime |
| D | Direccion | Dirección que se imprime |
| E | Telefono | Teléfono que se imprime |
| F | Departamento | Departamento que se imprime |
| G | Condiciones Especiales | Texto sugerido para la condición especial del envío |

Los encabezados se han indicado tal como aparecen en la hoja. No asumir nombres alternativos ni reordenar columnas sin aprobación.

## 4. Búsqueda y selección de clientes

La interfaz debe permitir buscar clientes por:

- Cuenta.
- Razón social.
- Nombre fantasía.

Reglas:

- La búsqueda no debe distinguir entre mayúsculas y minúsculas.
- La búsqueda no debe distinguir entre letras con y sin tilde.
- Mostrar hasta 8 resultados de sugerencia.
- Debe existir un botón **«Recargar clientes»** para volver a leer la base cuando haya cambios en la hoja.
- Al elegir un resultado, cargar los datos del cliente en el formulario.
- Si el cliente no existe, permitir completar los datos manualmente para ese envío.
- El cliente ingresado manualmente no se agrega automáticamente a `Hoja2`: solo se agrega si el usuario toca «+ Nuevo cliente» (sección 4.1).
- Al escribir en los campos «Razón social» o «Nombre fantasía» de un cliente manual, se sugieren clientes existentes (hasta 8) con la misma regla de búsqueda; elegir uno carga sus datos. Con un cliente de la base ya elegido no se sugiere nada.
- La selección o edición no debe alterar los datos originales.

### 4.1 Alta de cliente nuevo («+ Nuevo cliente»)

Decisión aprobada por el usuario. Es la **única** escritura permitida sobre `Hoja2`.

- Botón **«+ Nuevo cliente»** al final de los campos de datos del cliente (símbolo + y texto).
- Solo guarda al tocar el botón y confirmar; nunca al editar campos ni de forma silenciosa.
- Obligatorio: razón social. Los demás campos son opcionales.
- Guarda razón social, nombre fantasía, dirección, teléfono, departamento y condición especial tal como están en el formulario.
- Al tocar el botón aparece una ventana «¿Agregar número de cuenta?» con un campo opcional. Si se deja vacío, el cliente se guarda sin cuenta.
- Si ya existe un cliente con la misma razón social, se avisa y se permite agregar igual (caso de otra dirección: la operativa es crear otro registro).
- Una cuenta que ya existe se rechaza (en el cliente y en el servidor).
- Solo se **agrega** una fila al final; nunca se modifican ni eliminan filas existentes.
- Se escribe como texto plano (conserva ceros iniciales y no interpreta «=» como fórmula).
- Un bloqueo del script evita que dos PC que guardan a la vez usen la misma fila.
- Tras guardar, el cliente aparece en el buscador sin recargar y se muestra «Cliente agregado a la base».
- Quien pueda abrir la aplicación puede agregar clientes (se ejecuta como propietario).

## 5. Edición temporal de los datos del envío

Después de seleccionar un cliente, los datos deben poder ajustarse para el envío actual.

La edición temporal puede incluir razón social, nombre fantasía, dirección, teléfono, departamento y condición especial.

- Los cambios solo afectan los carteles del envío en curso.
- No se escriben en la hoja de clientes.
- No se debe guardar silenciosamente ningún cambio.
- Cada cliente tiene una única dirección en la base. No se necesita un selector de direcciones alternativas.
- Si un cliente pasa a tener otra dirección de forma permanente, la operativa definida es crear otro registro de cliente; no implementar direcciones múltiples dentro de esta aplicación.

Los campos sin contenido no deben producir rótulos vacíos ni dejar espacios innecesarios. En particular, si no hay teléfono o nombre fantasía, se omite esa línea y se aprovecha el espacio disponible.

## 6. Condiciones especiales

La columna G (`Condiciones Especiales`) precarga el campo de condición especial del formulario.

Reglas:

1. El texto se puede editar libremente para el envío actual.
2. La edición no debe sobrescribir la columna G ni persistir en ningún otro lugar.
3. Incluir una casilla **«Imprimir condición especial»**.
4. Si el campo contiene texto, la casilla aparece marcada por defecto.
5. Si el campo está vacío, aparece desmarcada por defecto.
6. Si está marcada y hay texto, imprimir la condición en un recuadro independiente en todos los carteles del envío.
7. Si está desmarcada, no imprimir la condición.
8. La condición especial es una instrucción libre. No interpretarla ni convertirla en dirección, agencia, destinatario u otro dato.

Ejemplo de condición: **«ENVIAR POR NUÑEZ»**.

La condición debe imprimirse en mayúsculas, centrada, dentro de un recuadro blanco con borde negro fino.

## 7. Cantidad de cajas y cálculo de bultos

El usuario ingresa la cantidad total de cajas.

Validaciones:

- Debe ser un número entero positivo.
- Mínimo: 1.
- Máximo: 999.
- No aceptar decimales, cero, negativos ni valores superiores a 999.

### 7.1 Regla de agrupación

Cada cartel representa **un bulto**, nunca una caja individual.

Cada bulto agrupa hasta 3 cajas. La agrupación se realiza consecutivamente en grupos de 3 y el último bulto contiene el resto, si lo hubiera.

Fórmula:

`Cantidad de bultos = techo(cantidad de cajas / 3)`

Equivalente en JavaScript: `Math.ceil(cantidadCajas / 3)`.

| Cajas ingresadas | Distribución interna | Carteles/bultos |
|---:|---|---:|
| 1 | 1 | 1 |
| 2 | 2 | 1 |
| 3 | 3 | 1 |
| 4 | 3 + 1 | 2 |
| 5 | 3 + 2 | 2 |
| 6 | 3 + 3 | 2 |
| 7 | 3 + 3 + 1 | 3 |
| 10 | 3 + 3 + 3 + 1 | 4 |
| 999 | 333 grupos de 3 | 333 |

**Importante:** no mostrar en los carteles la cantidad de cajas ni la cantidad de cajas agrupadas en cada bulto. Cada cartel muestra únicamente el número correlativo y el total: `BULTO n DE N`.

## 8. Diseño y contenido del cartel

El diseño debe respetar el estilo del documento Word original y las capturas de referencia compartidas durante la definición del proyecto.

Características generales:

- Texto centrado.
- Tipografía serif similar a Times New Roman.
- Jerarquía clara y lectura rápida.
- Distribución limpia, sin elementos superpuestos.
- Adaptación de tamaño de texto según el contenido disponible.

Las secciones 8.1 a 8.5 describen el **formato A (clásico)**. El **formato E (cuadros)** y su regla de ajuste de texto están en las secciones 15.5 y 15.7.

### 8.1 Orden de los elementos

Cada cartel debe presentar los elementos en este orden:

1. **Identificador del bulto:** `BULTO n DE N`, en la parte superior, tamaño pequeño y negrita.
2. **Razón social:** en negrita, tamaño medio-grande.
3. **Nombre fantasía:** siempre entre comillas.
4. **Dirección.**
5. **Teléfono.**
6. **Departamento:** muy grande y en negrita; debe ser el elemento visual dominante.
7. **FACTURA EN CAJA:** si corresponde según la regla de la sección 8.2.
8. **Condición especial:** si corresponde según la sección 6.
9. **Remitente:** en rojo, al pie del cartel.

### 8.2 «FACTURA EN CAJA»

- Incluir una casilla **«Imprimir FACTURA EN CAJA»** en el formulario.
- Debe estar marcada por defecto.
- Si está activa, imprimir el texto **«FACTURA EN CAJA»** solamente en el primer cartel del envío (Bulto 1).
- Si está desactivada, no imprimirlo en ningún cartel.
- Estilo: fondo amarillo, borde negro fino, negrita y tamaño grande.
- No repetirlo en los carteles siguientes.

### 8.3 Condición especial en el cartel

Cuando la casilla «Imprimir condición especial» esté activa y exista texto:

- Mostrarla dentro de un recuadro blanco con borde negro fino.
- Texto en mayúsculas y centrado.
- Repetirla en todos los carteles del envío.
- En carteles que no tienen «FACTURA EN CAJA», el recuadro de condición especial ocupa la zona correspondiente debajo del departamento.
- No imprimir recuadro vacío.

### 8.4 Remitente

El bloque del remitente debe conservar exactamente estas líneas y el prefijo **«Rte.:»**:

- `Rte.: Citek Ltda.`
- `Cerrito 282 bis - Tel.: 2915 5380`
- `MONTEVIDEO`

Estilo:

- Texto rojo.
- Primera línea (`Rte.: Citek Ltda.`) más grande.
- Segunda y tercera líneas más pequeñas.
- No reemplazar «Rte.:» por «Remitente».

### 8.5 Adaptación de contenido

El contenido puede variar en longitud. El diseño debe adaptar automáticamente el tamaño del texto a la zona disponible:

- Reducir tipografía cuando sea necesario.
- No cortar textos.
- No abreviar nombres ni direcciones automáticamente.
- Mantener legibilidad y jerarquía visual.
- Evitar desbordamientos, solapamientos y recortes.
- Si un campo opcional está vacío, omitirlo y recuperar el espacio que habría ocupado.

## 9. Impresión y paginación

Formato obligatorio:

- Papel A4.
- Orientación vertical.
- Dos carteles por hoja: uno en la mitad superior y otro en la mitad inferior.
- Cada cartel corresponde a un bulto.
- Línea horizontal punteada en el centro de la hoja A4 para facilitar el corte.
- Con la opción FRÁGIL la hoja es A4 apaisada con un cartel por hoja (sección 15.6).

Reglas de paginación:

- Si la cantidad de bultos es par, completar ambas mitades de cada hoja.
- Si la cantidad de bultos es impar, la mitad inferior de la última hoja queda vacía.
- No duplicar el último cartel para llenar el espacio.
- No crear páginas adicionales por desbordamientos o márgenes incorrectos.

La vista previa debe utilizar el mismo HTML y CSS que la impresión, para reducir diferencias entre lo que se ve y lo que se imprime.

Implementación prevista:

- Reglas `@page` y `@media print`.
- Ocultar controles, botones y elementos de interfaz al imprimir.
- Mostrar únicamente los carteles.
- Controlar dimensiones, márgenes, saltos de página y desbordamientos para Chrome.

Advertir al usuario que los encabezados y pies automáticos del navegador pueden requerir desactivarse en el diálogo de impresión.

**La vista previa no sustituye una prueba de impresión real.** Debe probarse la paginación desde Google Chrome y comprobar que no haya hojas extra, recortes ni desplazamientos.

## 10. Interfaz de usuario

La interfaz debe ser moderna, profesional y fácil de utilizar.

Distribución prevista:

- Pantalla principal en tres columnas: datos del cliente; envío, acciones y resumen; vista previa reducida (es solo una referencia).

Controles y acciones:

- Búsqueda/selección de cliente.
- Recargar clientes.
- Campos editables para los datos del envío.
- Cantidad de cajas, con botones ▲/▼ que suman o restan 1 entre 1 y 999.
- Selector «Formato de cartel» (A o E).
- Casilla «Imprimir FRÁGIL» (solo con el formato E).
- Casilla «Imprimir FACTURA EN CAJA».
- Campo de condición especial.
- Casilla «Imprimir condición especial».
- Botón **«Generar carteles»**.
- Botón **«Imprimir»**.
- Botón **«Nuevo envío»**.
- Botón **«Generar PNG»** (sección 15).
- Botón **«+ Nuevo cliente»**, al final de los datos del cliente (sección 4.1).

La vista previa y el resumen deben actualizarse de acuerdo con los datos y opciones seleccionados. Los controles de la interfaz no deben aparecer en el papel.

## 11. Acceso y publicación

La aplicación se publicará como Web App de Google Apps Script.

Decisiones y restricciones acordadas:

- Se utilizará una única cuenta Google propietaria para la aplicación.
- La aplicación se abrirá desde varias PC mediante el mismo enlace.
- Publicar ejecutando como propietario.
- Restringir el acceso a usuarios autorizados; no publicar como «cualquiera» ni «cualquiera con el enlace».
- Verificar las opciones reales de acceso que ofrece Apps Script al momento de desplegar.
- Aclarar si cada PC/usuario debe iniciar sesión con la cuenta propietaria o con una cuenta autorizada, según la configuración finalmente disponible.
- No dar por supuesto que compartir el enlace por sí solo concede acceso.

La guía de publicación debe explicar el despliegue y la autorización de manera explícita, sin debilitar la restricción de acceso.

## 12. Preparación para futuras ampliaciones

Se sabe que en el futuro podría existir un cliente que reciba otro artículo además de cajas.

- No desarrollar esa función ahora.
- Mantener una estructura modular que permita incorporarla posteriormente.
- No agregar controles, campos ni reglas para ese caso en la primera versión.

## 13. Reglas de aceptación generales

La aplicación no se considera terminada hasta que:

- Lee la hoja correcta sin modificarla.
- Busca y selecciona clientes de acuerdo con estas reglas.
- Permite clientes manuales sin guardarlos.
- Mantiene los cambios como temporales.
- Calcula correctamente los bultos.
- Imprime exactamente un cartel por bulto.
- Respeta las reglas de factura y condición especial.
- Mantiene el diseño, orden y remitente definidos.
- Produce A4 vertical con dos carteles por página y paginación correcta.
- Supera el plan de pruebas documentado.
- Se prueba la impresión real desde Chrome.
- Se documentan instalación, configuración, publicación y uso.

## 14. Control de cambios

Esta especificación recoge decisiones ya acordadas. El desarrollador no debe reinterpretar requisitos, introducir funcionalidades no solicitadas ni cambiar reglas de negocio por iniciativa propia. Ante contradicciones, ambigüedades o limitaciones técnicas, debe detenerse y plantear la consulta antes de implementar.

---

## 15. Decisiones aprobadas con posterioridad

Registro de las decisiones tomadas durante el análisis y la implementación. Complementan las secciones anteriores.

### 15.1 Generar PNG

- Botón **«Generar PNG»**: crea una imagen solo del **Bulto 1**, con todos los datos del cartel («BULTO 1 DE N», cliente, departamento, «FACTURA EN CAJA» si está activa, condición especial si corresponde y remitente).
- Formato A5 apaisado (210 × 148 mm) a 150 dpi (1240 × 874 px), con el mismo diseño del cartel. Con FRÁGIL el PNG es la hoja A4 apaisada completa del Bulto 1 (297 × 209 mm, 1754 × 1234 px).
- La imagen se **copia al portapapeles** para pegarla en WhatsApp o en un mail. Si el navegador bloquea la copia, se muestra la imagen para copiarla con el menú contextual.
- Requiere una cantidad de cajas válida y se genera con el estado actual del formulario.

### 15.2 Contenido del cartel

- **N1.** Si el nombre fantasía es igual a la razón social (sin distinguir mayúsculas ni tildes), no se imprime.
- **N2.** La hoja trae solo el número de teléfono; el cartel antepone «Tel: ». Sin teléfono se omite la línea completa.
- **N3.** Se imprimen los datos de la planilla tal como vienen, sin campo de localidad. Los saltos de línea de la dirección se respetan.
- **N4.** Dirección y teléfono van en líneas separadas.
- **N5.** El departamento se imprime siempre en mayúsculas y negrita.
- **N6.** La condición especial se imprime en mayúsculas y negrita, en un recuadro de ancho completo, con tamaño menor que «FACTURA EN CAJA».
- **N7.** (Formato A) Los tamaños del Word original son máximos: razón social 36 pt, fantasía/dirección/teléfono 28 pt, departamento 72 pt, factura 55 pt, condición 24 pt, remitente 28 pt y 18 pt. Cada elemento tiene un tamaño mínimo legible.
- Nombre fantasía entre comillas tipográficas “ ”.
- **Ajuste de texto (D9, formato A):** un elemento puede ocupar hasta dos líneas; si el cartel no entra en media hoja, se reducen todos los textos en cascada hasta el mínimo legible. Si aun así no entra, se avisa en pantalla y no se recorta ni se abrevia nada.

### 15.3 Interfaz y datos

- Ningún campo es obligatorio salvo la cantidad de cajas.
- La búsqueda trata la «ñ» como «n».
- La casilla «Imprimir condición especial» sigue al texto del campo hasta que el usuario la modifica; desde entonces respeta su elección.
- El cliente manual lleva un indicador de origen («de la base» / «manual»).
- El resumen en pantalla muestra la agrupación de cajas (por ejemplo «3+3+3+1»); nunca se imprime.
- Tras «Generar carteles», cualquier cambio del formulario actualiza la vista previa automáticamente.

### 15.4 Plataforma y acceso

- Todo se diseña y prueba en A4 vertical. La página Letter del Word original es solo referencia de estilo.
- La lectura de la planilla con `SpreadsheetApp.openById` exige el alcance `https://www.googleapis.com/auth/spreadsheets` (el alcance `spreadsheets.readonly` no alcanza). Por eso el carácter de solo lectura se garantiza por código y con las pruebas de integridad de la hoja, no por el permiso de Google.
- Acceso: ejecutar como propietario, acceso «solo yo»; las dos PC usan la misma cuenta, de preferencia con un perfil de Chrome dedicado.
- El ID de la planilla se guarda en la propiedad de script `SHEET_ID`, nunca en el repositorio.
- No se usa caché: «Recargar clientes» lee siempre la hoja.

### 15.5 Formato E (cuadros)

Aprobado por el usuario a partir de las maquetas de la sesión de diseño. Se elige con el selector «Formato de cartel»; el formato A sigue disponible y sin cambios.

- **Formato por defecto:** E. El formato elegido se mantiene al pulsar «Nuevo envío»; no se guarda en ningún lado, así que al recargar la página vuelve a E.
- **Estructura, de arriba abajo.** Todo va en recuadros de borde negro fino, sin superposición:
  1. **Franja superior** (solo si hay condición especial o «FACTURA EN CAJA»): la condición a la izquierda y «FACTURA EN CAJA» (fondo amarillo, solo Bulto 1) a la derecha. El lado que no tiene dato queda **en blanco, sin recuadro**.
  2. **Razón social** (negrita) y **nombre fantasía** entre comillas.
  3. **Dirección y teléfono** («Tel: …») en dos celdas del mismo recuadro.
  4. **Departamento**: recuadro de borde grueso, mayúsculas y negrita; ocupa todo el espacio restante.
  5. **Franja inferior**: recuadro «BULTO n DE N» (grande) y recuadro del remitente.
- **Sin condición especial ni factura:** la franja superior desaparece y el resto se acomoda para ocupar la media hoja, con letras de referencia más grandes.
- **Campos vacíos** (fantasía, dirección, teléfono): no se imprime su recuadro ni su línea.
- **Remitente:** las mismas tres líneas de 8.4. El texto sigue en rojo (la especificación original) pero el recuadro es negro, porque las impresoras son blanco y negro.
- **Condición especial:** mayúsculas, negrita y centrada; se repite en todos los carteles.
- **Identificador de bulto:** abajo, junto al remitente; sigue siendo solo `BULTO n DE N`.
- **Tamaños máximos de referencia (px):** razón social 44, fantasía 28, dirección y teléfono 30, departamento 150, condición 30, factura 36, bulto 40. Sin franja superior: 54, 32, 34 y 170 respectivamente. Los mínimos legibles son: razón social 20, fantasía/dirección/teléfono/condición/bulto 14, factura 20, departamento 36.

### 15.6 FRÁGIL

- Casilla **«Imprimir FRÁGIL»**, apagada por defecto y solo disponible con el formato E. Es una opción del envío: se aplica a todos los bultos y «Nuevo envío» la apaga.
- Con FRÁGIL, cada bulto ocupa **una hoja A4 apaisada completa** (297 × 209 mm): al centro el cartel del formato E y a los lados dos franjas con la palabra «FRÁGIL» en vertical (la izquierda se lee de abajo hacia arriba, la derecha de arriba hacia abajo).
- Las franjas son **solo contorno grueso con letras negras, sin relleno**, para no gastar tinta, y quedan a 6,35 mm del borde de la hoja para que la impresora no las recorte.
- El papel pasa a apaisado mediante una regla `@page` que se agrega solo cuando FRÁGIL está activo.
- No se agrega línea de corte. En el resumen, «hojas A4» cuenta una hoja por bulto.
- **Pendientes de confirmar por el usuario** (decididos por el desarrollador): que FRÁGIL se aplique a todos los bultos del envío y no por bulto; que no esté disponible con el formato A; que quede a 6,35 mm del borde.

### 15.7 Regla de ajuste de texto (formato E)

- Los tamaños de la sección 15.5 son **máximos de referencia**, no fijos.
- Si un texto no entra en su recuadro, se **reduce hasta que entre** (si no entra en el ancho o en el alto del recuadro).
- **Una sola palabra:** una línea; solo se achica.
- **Más de una palabra:** puede ocupar **hasta 2 líneas**; se achica solo si con 2 líneas no entra.
- «BULTO n DE N» y «FACTURA EN CAJA» van siempre en una línea. El teléfono usa una línea si el número no tiene espacios.
- Dentro de un recuadro con varios textos, el principal se agranda primero (razón social antes que fantasía; dirección antes que teléfono) y el departamento se ajusta al final con el espacio que queda.
- Nunca se corta ni se abrevia un texto. Si no entra ni con el tamaño mínimo, se avisa en pantalla.
- El ajuste se mide una vez por variante del envío (con y sin «FACTURA EN CAJA»), usando el último bulto, que tiene el número más largo.
