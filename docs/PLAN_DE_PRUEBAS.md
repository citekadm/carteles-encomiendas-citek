# Plan de pruebas y aceptación

**Proyecto:** Carteles de encomiendas — Citek  
**Estado:** checklist en ejecución. La sección 11 (formato E y FRÁGIL) tiene resultados de pruebas automáticas en Chromium; el resto de las secciones sigue pendiente y falta la impresión real desde Chrome.  
**Objetivo:** verificar reglas de negocio, integridad de datos, vista previa y resultado impreso.

## 1. Datos y protección de la hoja

- [ ] La aplicación lee la pestaña `Hoja2`.
- [ ] Usa encabezados en fila 1 y datos desde fila 2.
- [ ] Lee las columnas A:G en el orden documentado.
- [ ] Usa `getDisplayValues()` para conservar ceros iniciales y formato visible.
- [ ] No modifica ni elimina datos de `Hoja2`; la única escritura es el alta explícita de un cliente nuevo (sección 2.1).
- [ ] «Recargar clientes» vuelve a obtener los datos actualizados.
- [ ] Un error de lectura se informa de forma comprensible y no genera datos falsos.

## 2. Búsqueda y clientes

- [ ] Buscar por cuenta.
- [ ] Buscar por razón social.
- [ ] Buscar por nombre fantasía.
- [ ] La búsqueda ignora mayúsculas/minúsculas.
- [ ] La búsqueda ignora tildes.
- [ ] Se muestran como máximo 8 sugerencias.
- [ ] Al seleccionar un cliente, se precargan los campos correctos.
- [ ] Se puede ingresar un cliente inexistente manualmente.
- [ ] El cliente manual no se agrega a la hoja salvo que se toque «+ Nuevo cliente».
- [ ] Se puede editar temporalmente un dato de un cliente seleccionado.
- [ ] Al finalizar, la hoja conserva exactamente sus datos originales.
- [ ] Los campos opcionales vacíos no generan líneas ni espacios innecesarios.

## 2.1 Alta de cliente nuevo

- [ ] El botón «+ Nuevo cliente» está al final de los campos del cliente.
- [ ] Sin razón social, avisa y no guarda.
- [ ] Aparece «¿Agregar número de cuenta?» con campo opcional; Cancelar no guarda nada.
- [ ] Guardar con cuenta: agrega una fila al final de `Hoja2` con las 7 columnas en orden.
- [ ] Guardar sin cuenta: agrega la fila con la columna A vacía.
- [ ] Cuenta con ceros iniciales (p. ej. 00777) y teléfono se conservan; un texto que empieza con «=» no se convierte en fórmula.
- [ ] Una cuenta existente se rechaza y no se agrega nada.
- [ ] Razón social ya existente: avisa y permite agregar igual.
- [ ] No se modifica ninguna fila existente.
- [ ] Tras guardar aparece el mensaje de confirmación y el cliente es buscable sin recargar.
- [ ] Dos guardados casi simultáneos desde dos PC generan dos filas distintas.
- [ ] Al escribir en Razón social o Nombre fantasía se sugieren clientes existentes; elegir uno carga sus datos.
- [ ] Con un cliente de la base ya elegido no aparecen sugerencias al editar esos campos.
- [ ] Tras actualizar el despliegue, se reautoriza y el alta funciona desde otra PC autorizada.

## 3. Cantidad de cajas y bultos

Probar todos estos valores y comprobar la cantidad de carteles:

| Cajas | Distribución | Bultos/carteles esperados |
|---:|---|---:|
| 1 | 1 | 1 |
| 2 | 2 | 1 |
| 3 | 3 | 1 |
| 4 | 3 + 1 | 2 |
| 5 | 3 + 2 | 2 |
| 6 | 3 + 3 | 2 |
| 7 | 3 + 3 + 1 | 3 |
| 8 | 3 + 3 + 2 | 3 |
| 9 | 3 + 3 + 3 | 3 |
| 10 | 3 + 3 + 3 + 1 | 4 |
| 999 | 333 grupos de 3 | 333 |

Validaciones negativas:

- [ ] Rechaza 0.
- [ ] Rechaza números negativos.
- [ ] Rechaza decimales.
- [ ] Rechaza texto no numérico.
- [ ] Rechaza 1000 y valores superiores.
- [ ] No genera carteles si la cantidad no es válida.

Comprobar que cada cartel diga solamente `n de N` como identificación del bulto y que no aparezcan cantidades de cajas ni la distribución interna.

## 4. Condición especial

- [ ] Si la columna G tiene texto, se precarga en el campo.
- [ ] Si tiene texto, la casilla aparece marcada por defecto.
- [ ] Si está vacía, la casilla aparece desmarcada por defecto.
- [ ] Se puede editar el texto para el envío actual.
- [ ] El texto editado no modifica la columna G.
- [ ] Con casilla marcada y texto presente, aparece en todos los carteles.
- [ ] Con casilla desmarcada, no aparece en ningún cartel.
- [ ] Con campo vacío, no aparece un recuadro vacío.
- [ ] Se imprime en mayúsculas, centrado, con fondo blanco y borde negro fino.
- [ ] Un texto como «ENVIAR POR NUÑEZ» se imprime como instrucción libre y no se convierte en dirección o agencia.

## 5. «FACTURA EN CAJA»

- [ ] La casilla aparece marcada por defecto.
- [ ] Si está activa, el texto aparece en el primer cartel solamente.
- [ ] No aparece en los carteles segundo y siguientes.
- [ ] Si está desactivada, no aparece en ningún cartel.
- [ ] Tiene fondo amarillo, borde negro fino, negrita y tamaño grande.
- [ ] La condición especial, cuando corresponde, mantiene su ubicación y no se superpone con el bloque de factura.

## 6. Contenido y jerarquía del cartel

- [ ] El texto está centrado.
- [ ] Se usa una tipografía serif similar a Times New Roman.
- [ ] El identificador de bulto aparece arriba, pequeño y en negrita.
- [ ] La razón social aparece en negrita y tamaño medio-grande.
- [ ] El nombre fantasía aparece siempre entre comillas.
- [ ] Dirección y teléfono aparecen en el orden establecido.
- [ ] El departamento es muy grande, negrita y dominante.
- [ ] El remitente aparece en rojo.
- [ ] El remitente conserva exactamente «Rte.: Citek Ltda.».
- [ ] Se conservan las líneas «Cerrito 282 bis - Tel.: 2915 5380» y «MONTEVIDEO».
- [ ] La primera línea del remitente es mayor que las otras dos.
- [ ] No se reemplaza «Rte.:» por «Remitente».
- [ ] Los campos vacíos se omiten sin dejar huecos.
- [ ] Los textos largos se ajustan sin recortarse ni abreviarse.
- [ ] No hay solapamientos ni desbordamientos.

## 7. Paginación e impresión

Las secciones 6 y 7 se repiten para cada formato (A y E); el formato E y FRÁGIL tienen además la sección 11.

Probar cantidades de bultos pares e impares:

- [ ] 1 bulto: una hoja, cartel arriba y mitad inferior vacía.
- [ ] 2 bultos: una hoja completa.
- [ ] 3 bultos: dos hojas; la mitad inferior de la segunda queda vacía.
- [ ] 4 bultos: dos hojas completas.
- [ ] 5 bultos: tres hojas; la mitad inferior de la tercera queda vacía.
- [ ] 6 bultos: tres hojas completas.
- [ ] La línea horizontal punteada está en el centro de cada hoja.
- [ ] Cada hoja es A4 vertical.
- [ ] Cada cartel ocupa exactamente media hoja.
- [ ] No se duplica el último cartel cuando la cantidad es impar.
- [ ] No aparecen controles ni botones impresos.
- [ ] No hay páginas extra en blanco por desbordamiento.
- [ ] La vista previa coincide con la salida impresa.
- [ ] Se realiza una impresión real o salida PDF desde Chrome y se revisan márgenes, escala, saltos y recortes.
- [ ] Se comprueba el efecto de los encabezados y pies automáticos del navegador y se documenta que puede ser necesario desactivarlos.

## 8. Flujo de interfaz

- [ ] Generar carteles actualiza la vista previa y el resumen.
- [ ] Imprimir abre el diálogo de impresión con solo los carteles.
- [ ] Nuevo envío limpia los datos y el estado del envío actual sin tocar la base.
- [ ] Recargar clientes vuelve a leer la base.
- [ ] Los mensajes de validación y error son claros.
- [ ] El diseño es usable en las PC previstas.

## 9. Acceso y publicación

- [ ] La Web App se ejecuta como propietario, según lo acordado.
- [ ] El acceso queda limitado a usuarios autorizados.
- [ ] No se habilita «cualquiera» ni «cualquiera con el enlace».
- [ ] Se verifica el inicio de sesión requerido en cada PC.
- [ ] Se prueba el mismo enlace desde más de una PC autorizada.
- [ ] Se documenta cómo actualizar el despliegue después de cambios.

## 9 bis. PNG y reglas posteriores (especificación, sección 15)

- [ ] «Generar PNG» copia al portapapeles solo el Bulto 1; se pega en WhatsApp y en un mail.
- [ ] Dimensiones 1240 × 874 px (con FRÁGIL, 1754 × 1234 px); el diseño coincide con el cartel impreso.
- [ ] PNG con y sin FACTURA EN CAJA, con y sin condición especial, y con textos largos.
- [ ] Sin cantidad de cajas válida no se genera ni se copia nada.
- [ ] Fantasía igual a razón social (con otras mayúsculas o tildes): no se imprime.
- [ ] El teléfono se imprime como «Tel: número»; sin teléfono no hay línea.
- [ ] Saltos de línea de la dirección respetados.
- [ ] Departamento en mayúsculas y negrita, incluso con «Treinta y Tres» (dos líneas).
- [ ] Condición especial en negrita, mayúsculas y ancho completo.
- [ ] Caso completo (factura, condición, fantasía y teléfono): todo entra en media hoja sin desbordar.
- [ ] Texto que no entra ni al mínimo: aparece el aviso y no se recorta nada.
- [ ] La casilla de condición sigue al texto hasta que se modifica a mano.
- [ ] Tras «Generar carteles», los cambios del formulario actualizan la vista previa.
- [ ] Autopruebas (`autopruebas()` en la consola): todas OK.

## 11. Formato E, FRÁGIL y ajuste de texto

Las marcas [x] corresponden a pruebas automáticas (la última el 2026-11-20, con las herramientas de `tools/pruebas/`) hechas con **Chromium sin interfaz (Playwright)**, que usa la tipografía Liberation Serif (compatible en medidas con Times New Roman). Esas pruebas **no reemplazan** la impresión real desde Chrome en las PC de uso (ver 11.4).

### 11.1 Ajuste de texto y contenido

Resultados de la última corrida (2026-11-20, tras el margen de seguridad del 3 %). Todos los casos sin desbordes ni textos cortados. Tamaños del cartel 1:

| Caso | Resultado |
|---|---|
| Datos cortos con factura y condición, 7 cajas | 2 hojas; fantasía 80 px, razón social 46 px, dirección y teléfono 42 px, departamento 101 px, bulto 67 px |
| Razón social, fantasía y dirección largas, sin condición ni factura, 10 cajas | 2 hojas; fantasía 50 px en 2 líneas, razón social 28 px en 2 líneas, dirección 27 px en 2 líneas, teléfono 33 px en una línea |
| Una sola palabra larguísima en razón social y fantasía | una línea; fantasía 32 px, razón social 27 px |
| Sin teléfono y sin fantasía, departamento «Río Negro» | la razón social pasa a ser el texto principal (85 px); dirección 84 px |
| 999 cajas | 333 carteles en 167 hojas, sin desbordes, ajuste inmediato (menos de 1 s) |
| FRÁGIL con datos cortos y 7 cajas | 3 hojas apaisadas; fantasía 84 px, departamento 153 px |
| FRÁGIL con textos largos, condición larga y «Treinta y Tres» | 2 hojas; condición 17 px en 2 líneas, departamento 89 px en una línea |

- [x] Todos los textos (menos el remitente) usan el mayor tamaño que entra en su recuadro (con un 3 % de margen); las direcciones cortas ya no quedan chicas.
- [x] En el PDF de impresión de Chromium los textos no se parten ni se cortan (casos 1, 2 y 8 revisados mirando el PDF).
- [x] El nombre fantasía es el texto principal y la razón social queda secundaria; sin fantasía, la razón social ocupa su lugar.
- [x] El recuadro del departamento tiene línea simple, igual que los demás.
- [x] El identificador del bulto dice solo `n de N` (`1 de 3`) en los formatos A y E.
- [x] Una palabra: se achica y queda en una línea. Varias palabras: hasta 2 líneas. El teléfono siempre en una línea.
- [x] No hay textos cortados, abreviados ni superpuestos, y el texto respeta el margen interno del recuadro.
- [x] Sin condición ni factura, la franja superior desaparece y el resto se agranda.
- [x] Con solo condición, o solo factura, el otro lado de la franja queda en blanco, sin recuadro.
- [x] Campos vacíos no dejan recuadros ni huecos.
- [ ] Probar más textos reales de la base (razones sociales y direcciones largas de clientes verdaderos).
- [ ] Revisar visualmente un cartel con tres cifras (`333 de 333`) impreso.

### 11.2 Selector de formato

- [x] Por defecto está el formato E.
- [x] Cambiar a A muestra el cartel clásico; FRÁGIL se apaga y se deshabilita.
- [x] «Nuevo envío» mantiene el formato elegido y apaga FRÁGIL.
- [x] El resumen muestra una hoja por bulto con FRÁGIL.
- [x] Autopruebas (`autopruebas()`): 60 comprobaciones OK.

### 11.3 FRÁGIL y PNG

- [x] Con FRÁGIL el PDF de Chromium sale en A4 apaisada (297 × 210 mm), una hoja por bulto.
- [x] Sin FRÁGIL el PDF sale en A4 vertical.
- [x] Las franjas «FRÁGIL» son solo contorno, a 6,35 mm del borde, con la palabra en vertical en cada lado.
- [x] PNG de 1240 × 874 px en los formatos A y E, y de 1754 × 1234 px con FRÁGIL.
- [ ] Revisar el PNG pegado en WhatsApp y en un mail.

### 11.4 Pendiente: impresión real desde Chrome

- [ ] Imprimir en papel formato E con 1, 2, 3 y 4 bultos: sin hojas extra, sin recortes, línea de corte en el centro.
- [ ] Imprimir con FRÁGIL (apaisada): comprobar que Chrome toma la orientación sola y, si no, que la nota de pantalla alcanza.
- [ ] Verificar que las franjas FRÁGIL no se recortan en la impresora real (margen no imprimible).
- [ ] Verificar la legibilidad del texto rojo y del fondo amarillo en la impresora en blanco y negro.
- [ ] Comparar la hoja impresa con la vista previa.
- [ ] Probar con la tipografía Times New Roman real de las PC (las medidas pueden variar levemente respecto de Liberation Serif).

## 12. Aspecto de la interfaz (parte 3)

Verificado el 2026-11-20 con capturas de Chromium sin interfaz (ventana de 1180 px y de 420 px de ancho). No reemplaza la revisión en las PC de uso.

- [x] Tema oscuro con tarjetas con relieve, campos hundidos y acento violeta en toda la pantalla.
- [x] Interruptores con perilla luminosa; el de FRÁGIL se atenúa cuando está deshabilitado.
- [x] Control segmentado de formato: el clic en E o A cambia el formato; FRÁGIL se apaga y se deshabilita con A y se habilita con E; «Nuevo envío» mantiene el formato elegido.
- [x] Botones «−» y «+»: desde vacío ponen 1; respetan el mínimo 1 y el máximo 999.
- [x] Los botones «Imprimir», «Generar PNG» y «Nuevo envío» entran cada uno en una línea.
- [x] Ventana emergente de «¿Agregar número de cuenta?» y sugerencias de búsqueda con el estilo nuevo.
- [x] Con ventana angosta (420 px) las columnas se apilan.
- [x] La impresión no cambia: los PDF de los ocho casos mantienen páginas y orientación.
- [ ] Revisar en las PC de la oficina: legibilidad de las letras claras sobre fondo oscuro con la luz del lugar.
- [ ] Revisar en Chrome real el aspecto de las ventanas emergentes y del selector (el desenfoque de fondo depende del navegador).
- [ ] Confirmar con el usuario que no hace falta un tema claro.

## 10. Criterio de aprobación

La versión solo se acepta cuando todos los puntos críticos están verificados, especialmente:

1. Integridad de la hoja de clientes.
2. Cálculo correcto de bultos para 1–10 y 999 cajas.
3. Condición especial y factura en las posiciones y carteles correctos.
4. Paginación A4 exacta para cantidades pares e impares.
5. Impresión real desde Chrome sin recortes ni páginas adicionales.
6. Acceso restringido a usuarios autorizados.

Registrar para cada prueba: fecha, resultado, navegador, observaciones y evidencia cuando corresponda.
