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
- Cálculo automático de bultos a partir de la cantidad de cajas y de las cajas por bulto elegidas (1, 2 o 3).
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
- Guarda razón social, nombre fantasía, dirección, teléfono, departamento y condición especial tal como están en el formulario. El campo «Condición especial» está dentro de los datos del cliente: lo que se escriba allí al crear un cliente nuevo queda guardado en la columna G, y la ventana de confirmación muestra la condición que se va a guardar.
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

**Cajas por bulto (decisión del usuario):** antes de generar, el usuario elige cuántas cajas lleva como máximo cada bulto: **1, 2 o 3**. El valor por defecto es **3** (cajas apilables de a 3, el caso habitual). Las opciones 1 y 2 sirven para cajas que no se pueden apilar de a 3 y que por eso deben agruparse obligatoriamente de esa manera.

Cada bulto agrupa hasta *k* cajas, donde *k* es la opción elegida. La agrupación se realiza consecutivamente en grupos de *k* y el último bulto contiene el resto, si lo hubiera.

Fórmula:

`Cantidad de bultos = techo(cantidad de cajas / k)`

Equivalente en JavaScript: `Math.ceil(cantidadCajas / porBulto)`, con `porBulto` igual a 1, 2 o 3. Cualquier otro valor se toma como 3.

La opción es del envío: «Nuevo envío» la vuelve a 3. Cambiarla con los carteles ya generados actualiza la vista previa y el resumen. El límite de cajas (1 a 999) no cambia: con 1 caja por bulto, 999 cajas son 999 bultos (500 hojas con dos carteles por hoja).

**Con 3 cajas por bulto:**

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

**Con 2 cajas por bulto:**

| Cajas ingresadas | Distribución interna | Carteles/bultos |
|---:|---|---:|
| 1 | 1 | 1 |
| 2 | 2 | 1 |
| 3 | 2 + 1 | 2 |
| 4 | 2 + 2 | 2 |
| 5 | 2 + 2 + 1 | 3 |
| 7 | 2 + 2 + 2 + 1 | 4 |
| 10 | 2 + 2 + 2 + 2 + 2 | 5 |
| 999 | 499 grupos de 2 + 1 | 500 |

**Con 1 caja por bulto:** cada caja es un bulto (carteles = cajas): 1 → 1, 2 → 2, 5 → 5, 10 → 10, 999 → 999.

**Importante:** no mostrar en los carteles la cantidad de cajas ni la cantidad de cajas agrupadas en cada bulto. Cada cartel muestra únicamente el número correlativo y el total: `n de N`.

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

1. **Identificador del bulto:** `n de N`, en la parte superior, tamaño pequeño y negrita.
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

- Pantalla principal en tres columnas: **cliente** (con su condición especial y el botón «+ Nuevo cliente»); **envío** (cajas, cajas por bulto, formato y opciones) y **resumen**; **acciones** (Generar carteles, Imprimir, Generar PNG, Nuevo envío) y **vista previa**. La vista previa está siempre visible, se escala al ancho de su tarjeta (hasta 360 px) y es solo una referencia.
- **Encabezado:** el logo de CITEK en blanco (`docs/referencias/Logo_Citek_blanco.png`, derivado de `Logo_Citek.png`) reemplaza al título visible, con un leve resplandor violeta para destacar sobre el fondo oscuro. El título «Carteles de encomiendas» queda solo para lectores de pantalla y para la pestaña del navegador.
- **Estilo visual** (decisión del usuario, basada en `docs/referencias/Referencia_estetica_Obsidian_Home.png`): tema oscuro único; tarjetas grandes de esquinas muy redondeadas con relieve suave; campos hundidos; acento violeta; interruptores con perilla luminosa; botones circulares «−» y «+»; control segmentado para el formato; chips y puntos de color para los estados; ventanas emergentes oscuras con fondo desenfocado. El cartel de la vista previa se muestra siempre sobre fondo blanco y la impresión no cambia. No hay tema claro.

Controles y acciones:

- Búsqueda/selección de cliente.
- Recargar clientes.
- Campos editables para los datos del envío.
- Cantidad de cajas, con botones circulares «−» y «+» que restan o suman 1 entre 1 y 999.
- Selector «Cajas por bulto»: **dial circular** con arco de 240°, marcas finas y perilla, como el dial de la referencia (1 / 2 / 3; 3 por defecto). Se elige con un clic o arrastre sobre el arco, con los números 1, 2 y 3 o con las flechas del teclado; el centro muestra el valor y no lleva textos explicativos.
- Selector «Formato de cartel» (control segmentado: E · Cuadros / A · Clásico).
- Casilla «Imprimir FRÁGIL» (solo con el formato E).
- Casilla «Imprimir FACTURA EN CAJA».
- Campo de condición especial (dentro de los datos del cliente).
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

- Botón **«Generar PNG»**: crea una imagen solo del **Bulto 1**, con todos los datos del cartel («1 de N», cliente, departamento, «FACTURA EN CAJA» si está activa, condición especial si corresponde y remitente).
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

Aprobado por el usuario a partir de las maquetas de la sesión de diseño y ajustado en la sesión de ajustes (parte 1). Se elige con el selector «Formato de cartel»; el formato A sigue disponible.

- **Formato por defecto:** E. El formato elegido se mantiene al pulsar «Nuevo envío»; no se guarda en ningún lado, así que al recargar la página vuelve a E.
- **Estructura, de arriba abajo.** Todo va en recuadros con la **misma línea simple** de borde negro (también el departamento), sin superposición:
  1. **Franja superior** (solo si hay condición especial o «FACTURA EN CAJA»): si hay **ambas**, la condición va a la izquierda y «FACTURA EN CAJA» (fondo amarillo, solo Bulto 1) a la derecha; si hay **solo una**, esa ocupa **todo el ancho** de la franja (por ejemplo, «FACTURA EN CAJA» sola en el Bulto 1 y la condición sola en los demás carteles).
  2. **Nombre fantasía**, entre comillas y en negrita: es el **texto principal** del cartel, porque el servicio de cadetería se guía por él. Si no hay fantasía (o es igual a la razón social), la razón social ocupa este lugar como texto principal.
  3. **Razón social**, más chica y sin negrita, debajo de la fantasía.
  4. **Dirección y teléfono** («Tel: …») en dos celdas del mismo recuadro. El ancho de cada celda se reparte según el largo de su texto.
  5. **Departamento**: mayúsculas y negrita, el recuadro más alto después del nombre principal.
  6. **Franja inferior**: recuadro con el identificador del bulto, solo con números (`n de N`, por ejemplo `2 de 5`), y recuadro del remitente.
- **Reparto de alturas.** Las franjas superior e inferior tienen alto fijo (18 mm y 22 mm; con FRÁGIL, 20,5 mm y 26 mm). El resto se reparte por pesos: fantasía (o razón social como principal) 2,6; razón social 1,5; dirección y teléfono 1,6; departamento 3,3. Si falta un recuadro, su espacio se reparte entre los demás.
- **Sin condición especial ni factura:** la franja superior desaparece y el resto se agranda para ocupar la media hoja.
- **Campos vacíos** (fantasía, dirección, teléfono): no se imprime su recuadro ni su línea.
- **Remitente:** las mismas tres líneas de 8.4, con tamaño fijo. El texto sigue en rojo (la especificación original) pero el recuadro es negro, porque las impresoras son blanco y negro.
- **Condición especial:** mayúsculas, negrita y centrada; se repite en todos los carteles.
- **Identificador del bulto (ambos formatos):** solo los números, sin la palabra «BULTO»: `1 de 1`, `2 de 5`. En el formato E va abajo, junto al remitente.

### 15.6 FRÁGIL

- Casilla **«Imprimir FRÁGIL»**, apagada por defecto y solo disponible con el formato E. Es una opción del envío: se aplica a todos los bultos y «Nuevo envío» la apaga.
- Con FRÁGIL, cada bulto ocupa **una hoja A4 apaisada completa** (297 × 209 mm): al centro el cartel del formato E y a los lados dos franjas con la palabra «FRÁGIL» en vertical (la izquierda se lee de abajo hacia arriba, la derecha de arriba hacia abajo).
- Las franjas son **solo contorno grueso con letras negras, sin relleno**, para no gastar tinta, y quedan a 6,35 mm del borde de la hoja para que la impresora no las recorte.
- El papel pasa a apaisado mediante una regla `@page` que se agrega solo cuando FRÁGIL está activo.
- No se agrega línea de corte. En el resumen, «hojas A4» cuenta una hoja por bulto.
- **Pendientes de confirmar por el usuario** (decididos por el desarrollador): que FRÁGIL se aplique a todos los bultos del envío y no por bulto; que no esté disponible con el formato A; que quede a 6,35 mm del borde.

### 15.7 Regla de ajuste de texto (formato E)

- **No hay tamaños fijos de letra** (salvo el remitente). Todos los textos impresos (condición, factura, fantasía, razón social, dirección, teléfono, departamento e identificador del bulto) crecen hasta el **mayor tamaño que entra** en su recuadro, respetando un margen interno de 1 mm arriba y abajo y 2,5 mm a los lados.
- El tamaño final se reduce un 3 % respecto del máximo que entra, como margen de seguridad frente a diferencias mínimas de renderizado entre pantalla, vista previa reducida e impresión (un texto justo en el límite podría pasar a otra línea y cortarse).
- **Una sola palabra:** una línea; solo se achica.
- **Más de una palabra:** puede ocupar **hasta 2 líneas**; se usa el mayor tamaño con el que no pasa de 2 líneas ni se sale del recuadro.
- «FACTURA EN CAJA», el identificador del bulto y el teléfono van siempre en **una línea**. Un número de teléfono no se parte.
- El identificador del bulto se mide con el número más largo del envío (el último bulto), así todos los carteles lo muestran con el mismo tamaño.
- Nunca se corta ni se abrevia un texto. Los mínimos legibles son 14 px (factura 20 px, departamento 36 px); si no entra ni con el mínimo, se avisa en pantalla.
- El ajuste se mide una vez por variante del envío (con y sin «FACTURA EN CAJA»). Si un bulto no tiene franja superior y otro sí, sus tamaños pueden diferir, porque el espacio disponible es distinto.
