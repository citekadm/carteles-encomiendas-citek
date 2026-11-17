# Especificación funcional
## Aplicación de carteles de encomiendas — Citek

**Estado:** requisitos acordados; implementación pendiente.  
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
- Acceso mediante una aplicación web de Apps Script para usuarios autorizados.

### Fuera del alcance de esta versión

- Guardar clientes nuevos en la base.
- Modificar datos de clientes existentes en la hoja de origen.
- Guardar cambios temporales del formulario.
- Selector de direcciones alternativas para un mismo cliente.
- Incorporar artículos distintos de cajas al cálculo de bultos. Se prevé que pueda agregarse en el futuro, pero no se implementará ahora.
- Funciones adicionales no descritas en esta especificación.

## 3. Fuente de datos: Google Sheets

La aplicación se conectará a un archivo de Google Sheets existente. La pestaña que contiene los clientes se llama **`Hoja2`**.

- Fila 1: encabezados.
- Datos: desde la fila 2.
- La aplicación solo debe leer esta hoja. No debe modificar, insertar ni eliminar filas ni celdas.
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
- El cliente ingresado manualmente no se agrega automáticamente a `Hoja2`.
- La selección o edición no debe alterar los datos originales.

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

- Pantalla principal en dos columnas.
- Una columna para el formulario de datos y opciones.
- Otra columna para la vista previa y el resumen del envío.

Controles y acciones:

- Búsqueda/selección de cliente.
- Recargar clientes.
- Campos editables para los datos del envío.
- Cantidad de cajas.
- Casilla «Imprimir FACTURA EN CAJA».
- Campo de condición especial.
- Casilla «Imprimir condición especial».
- Botón **«Generar carteles»**.
- Botón **«Imprimir»**.
- Botón **«Nuevo envío»**.

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
