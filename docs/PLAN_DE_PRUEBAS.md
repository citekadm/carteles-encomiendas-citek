# Plan de pruebas y aceptación

**Proyecto:** Carteles de encomiendas — Citek  
**Estado:** checklist en ejecución. Las secciones 11 a 15 tienen resultados de pruebas automáticas en Chromium; el resto sigue pendiente y falta la impresión real desde Chrome.
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

Probar todos estos valores **con 3 cajas por bulto (valor por defecto)** y comprobar la cantidad de carteles:

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

Con la opción «Cajas por bulto» (especificación 7.1). Verificado el 2026-11-21 con las autopruebas y la batería de `tools/pruebas/`:

| Cajas | Por bulto | Bultos/carteles esperados | Hojas (2 por hoja) |
|---:|---:|---:|---:|
| 7 | 2 | 4 | 2 |
| 5 | 1 | 5 | 3 |
| 999 | 1 | 999 | 500 |
| 5 | 2 | 3 | 3 (Frágil: una por hoja) |

- [x] Con 2 cajas por bulto: 1→1, 2→1, 3→2, 4→2, 5→3, 7→4, 10→5, 999→500 bultos.
- [x] Con 1 caja por bulto: los bultos son iguales a las cajas (1, 2, 5, 10 y 999).
- [x] Un valor inválido de cajas por bulto se toma como 3.
- [x] La numeración sigue siendo correlativa (`1 de 3`, `2 de 3`, `3 de 3`) y «FACTURA EN CAJA» sale solo en el primer cartel con cualquiera de las opciones.
- [x] Cambiar la opción con los carteles ya generados actualiza la vista previa, el resumen y la distribución (por ejemplo «2+2+2+1 (2 cajas por bulto)»).
- [x] «Nuevo envío» vuelve la opción a 3.
- [x] 999 cajas de a 1: 999 carteles en 500 hojas, sin desbordes y con 500 páginas en el PDF.
- [ ] Imprimir en papel un envío de cajas de a 1 y de a 2 y comprobar las hojas y la numeración.
- [ ] Confirmar con el usuario que las opciones 1 y 2 se entienden como «máximo de cajas por bulto», agrupadas de a 1 o de a 2.

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

Desde el 2026-11-25 hay un único formato de cartel (en recuadros); FRÁGIL y el ajuste de texto tienen además la sección 11.

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

## 11. Cartel en recuadros, FRÁGIL y ajuste de texto

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
- [x] El identificador del bulto dice solo `n de N` (`1 de 3`) en el cartel.
- [x] Una palabra: se achica y queda en una línea. Varias palabras: hasta 2 líneas. El teléfono siempre en una línea.
- [x] No hay textos cortados, abreviados ni superpuestos, y el texto respeta el margen interno del recuadro.
- [x] Sin condición ni factura, la franja superior desaparece y el resto se agranda.
- [x] Con solo condición, o solo factura, esa ocupa todo el ancho de la franja superior (actualizado en la ronda de detalles; antes quedaba un lado en blanco).
- [x] Campos vacíos no dejan recuadros ni huecos.
- [ ] Probar más textos reales de la base (razones sociales y direcciones largas de clientes verdaderos).
- [ ] Revisar visualmente un cartel con tres cifras (`333 de 333`) impreso.

### 11.2 Opciones del envío

- [x] Autopruebas (`autopruebas()`): 100 comprobaciones OK.
- [x] El resumen muestra una hoja por bulto con FRÁGIL.
- [x] «Nuevo envío» apaga FRÁGIL y vuelve las cajas por bulto a 3.
- [x] No existen selectores de formato ni de logo (eliminados el 2026-11-25).

### 11.3 FRÁGIL y PNG

- [x] Con FRÁGIL el PDF de Chromium sale en A4 apaisada (297 × 210 mm), una hoja por bulto.
- [x] Sin FRÁGIL el PDF sale en A4 vertical.
- [x] Las franjas «FRÁGIL» son solo contorno, a 6,35 mm del borde, con la palabra en vertical en cada lado.
- [x] PNG de 1240 × 874 px, y de 1754 × 1234 px con FRÁGIL; ambos incluyen el logo de fondo.
- [ ] Revisar el PNG pegado en WhatsApp y en un mail.

### 11.4 Pendiente: impresión real desde Chrome

- [ ] Imprimir en papel con 1, 2, 3 y 4 bultos: sin hojas extra, sin recortes, línea de corte en el centro.
- [ ] Imprimir con FRÁGIL (apaisada): comprobar que Chrome toma la orientación sola y, si no, que la nota de pantalla alcanza.
- [ ] Verificar que las franjas FRÁGIL no se recortan en la impresora real (margen no imprimible).
- [ ] Verificar la legibilidad del texto rojo y del fondo amarillo en la impresora en blanco y negro.
- [ ] Comparar la hoja impresa con la vista previa.
- [ ] Probar con la tipografía Times New Roman real de las PC (las medidas pueden variar levemente respecto de Liberation Serif).

## 12. Aspecto de la interfaz (neumorfismo claro)

Verificado el 2026-11-25 con capturas de Chromium sin interfaz (ventanas de 1180, 1366 y 420 px de ancho). No reemplaza la revisión en las PC de uso.

- [x] Estética neumórfica clara: fondo gris azulado, tarjetas, botones y casilleros en relieve, campos hundidos, acento azul.
- [x] Interruptores con riel y perilla en relieve; el activado se pinta de azul.
- [x] Botón principal azul y botones secundarios en relieve; «Imprimir», «Generar PNG» y «Nuevo envío» entran cada uno en una línea.
- [x] Casillero de búsqueda con lupa; ventana emergente de «¿Agregar número de cuenta?» y sugerencias con el estilo nuevo.
- [x] Encabezado con el logo de CITEK en rojo; los textos de los interruptores no se parten.
- [x] Con ventana angosta (420 px) las columnas se apilan.
- [x] La impresión no cambia: los PDF de los 11 casos mantienen páginas y orientación.
- [ ] Revisar el contraste de las letras grises sobre el fondo claro en las pantallas de la oficina (el neumorfismo tiene poco contraste por naturaleza).
- [ ] Revisar en Chrome real el desenfoque de fondo de las ventanas emergentes.

## 13. Ajustes de detalle: disposición, selector de cajas por bulto y franja superior

Verificado el 2026-11-23 con Chromium sin interfaz (pantallas de 1180 × 900 y de 1366 × 768) y la batería de `tools/pruebas/` (12 casos, 100 autopruebas, todos sin desbordes y con las páginas esperadas en los PDF).

- [x] Franja superior: con condición y factura van lado a lado; con solo factura (Bulto 1) o solo condición (demás bultos) ocupa todo el ancho; sin ninguna, desaparece y el resto se agranda.
- [x] Selector «knob» de cajas por bulto (ver 12 y 15.9): un clic sobre el arco o sobre los números elige 1, 2 o 3 y la perilla gira hacia el punto azul; arrastrar sobre el arco cambia la opción; sobre la perilla no responde; las flechas, Inicio y Fin del teclado funcionan y respetan el mínimo 1 y el máximo 3; «Nuevo envío» vuelve a 3; cambiar la opción actualiza el resumen y los carteles ya generados.
- [x] No hay textos explicativos junto al selector.
- [x] Nueva disposición: cliente (con la condición especial) a la izquierda; envío y resumen al centro; acciones y vista previa a la derecha, con la vista previa siempre visible y más grande.
- [x] Los botones «Imprimir», «Generar PNG» y «Nuevo envío» entran en una línea en 1180 y en 1366 px de ancho.
- [x] Al crear un cliente nuevo, la condición especial escrita en su campo se envía junto con los demás datos (columna G), y la ventana de confirmación la muestra.
- [ ] Confirmar en la hoja real que la condición queda guardada en la columna G del cliente nuevo.
- [ ] Revisar el selector con pantalla táctil y en las PC de la oficina.
- [ ] Revisar la vista previa en una ventana angosta (menos de 1000 px) y en una pantalla muy ancha.

## 14. Logo de fondo (marca de agua fija)

Verificado el 2026-11-25 con Chromium sin interfaz (11 casos, 100 autopruebas, sin desbordes y con las páginas esperadas en los PDF).

- [x] Todos los carteles llevan el logo de CITEK centrado detrás de todo el texto; los recuadros son transparentes y el amarillo de «FACTURA EN CAJA» se mantiene.
- [x] Con FRÁGIL el logo también aparece, y el PNG exportado lo incluye (1240 × 874 px; con FRÁGIL, 1754 × 1234 px).
- [x] El logo no cambia los tamaños de letra ni la paginación.
- [x] No existe selector de logo: es una decisión fija del diseño.
- [ ] Imprimir en la impresora de la oficina (blanco y negro) y confirmar que el texto se lee bien con la intensidad actual (9 %); ajustar la opacidad si hace falta.
- [ ] Probar la impresión con «Gráficos de fondo» desactivado.

## 15. Formato único (eliminación del formato clásico)

- [x] La pantalla no tiene selectores de formato ni de logo.
- [x] Se eliminó del código el cartel clásico (JavaScript y CSS) y las pruebas automáticas se actualizaron (se quitaron los casos del formato clásico y de las opciones de logo); las 100 autopruebas y los 11 casos pasan.
- [x] Alta de clientes, PNG, FRÁGIL y sugerencias del buscador siguen funcionando.
- [ ] Revisar las secciones 6 y 7 con el cartel único: ya no existe el formato clásico, y los ítems que lo mencionan quedan como referencia histórica.

## 10. Criterio de aprobación

La versión solo se acepta cuando todos los puntos críticos están verificados, especialmente:

1. Integridad de la hoja de clientes.
2. Cálculo correcto de bultos para 1–10 y 999 cajas.
3. Condición especial y factura en las posiciones y carteles correctos.
4. Paginación A4 exacta para cantidades pares e impares.
5. Impresión real desde Chrome sin recortes ni páginas adicionales.
6. Acceso restringido a usuarios autorizados.

Registrar para cada prueba: fecha, resultado, navegador, observaciones y evidencia cuando corresponda.
