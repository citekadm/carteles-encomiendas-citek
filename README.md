# Carteles de encomiendas — Citek

Aplicación web para generar e imprimir carteles de encomiendas a partir de los datos de clientes almacenados en una hoja de cálculo de Google Sheets.

## Estado del proyecto

**Fase actual: implementación y pruebas.** La aplicación está implementada en `gas/`: lectura de `Hoja2`, búsqueda con autocompletado, alta explícita de clientes nuevos, formulario, un único formato de cartel en recuadros con el logo de CITEK como marca de agua, selector de cajas por bulto con slider (1, 2 o 3), opción FRÁGIL (A4 apaisada), vista previa, impresión A4 y PNG. La interfaz tiene estética oscura con toasts y slider (referencia en `docs/referencias/Referencia_estetica_oscura_premium.jpeg`). Faltan la impresión real desde Chrome (incluidos FRÁGIL y el logo de fondo), las pruebas de acceso y publicación, y la guía final de entrega. Para retomar el trabajo en otra sesión, empezar por [docs/CONTEXTO_DE_SESION.md](docs/CONTEXTO_DE_SESION.md): resume lo hecho, lo pendiente y cómo probar. Las decisiones posteriores a la especificación están en la sección 15 de `docs/ESPECIFICACION_FUNCIONAL.md`, que incluye decisiones del desarrollador pendientes de confirmar (15.6 y 15.9).

## Documentación principal

- [Especificación funcional](docs/ESPECIFICACION_FUNCIONAL.md): requisitos acordados, reglas de negocio, datos, diseño e impresión.
- [Arquitectura y plan de desarrollo](docs/ARQUITECTURA_Y_PLAN.md): estructura, responsabilidades, decisiones técnicas y metodología.
- [Contexto de sesión y próximos pasos](docs/CONTEXTO_DE_SESION.md): estado actual, decisiones pendientes de confirmar, trabajo dividido en partes y cómo probar.
- [Plan de pruebas](docs/PLAN_DE_PRUEBAS.md): escenarios que deben verificarse antes de dar por terminada la aplicación, con los resultados ya registrados (sección 11).

## Estructura del repositorio

```text
.
├── README.md
├── .gitignore
├── docs/
│   ├── ESPECIFICACION_FUNCIONAL.md
│   ├── ARQUITECTURA_Y_PLAN.md
│   ├── PLAN_DE_PRUEBAS.md
│   ├── CONTEXTO_DE_SESION.md
│   └── referencias/        (logos y capturas de referencia de diseño)
├── tools/
│   └── pruebas/            (pruebas automáticas con Chromium sin interfaz)
└── gas/
    ├── appsscript.json
    ├── Code.gs
    ├── Index.html
    ├── Styles.html
    └── JavaScript.html
```

## Plataforma

- Google Apps Script como aplicación web.
- Google Sheets como fuente de datos de clientes.
- Interfaz HTML/CSS/JavaScript.
- Impresión desde Google Chrome en papel A4 vertical (dos carteles por hoja) o, con FRÁGIL, A4 apaisada (un cartel por hoja).

## Regla de trabajo

La documentación es la fuente de verdad. No cambiar requisitos ni agregar funcionalidades sin consultar y obtener aprobación; todo cambio funcional aprobado se registra en la especificación y en el plan de pruebas en el mismo cambio. Los cambios grandes se hacen en una rama de trabajo y se revisan antes de integrarse a la rama principal.

## Seguridad

No subir contraseñas, tokens, archivos de credenciales, identificadores sensibles ni archivos locales de autenticación. En particular, no versionar `.clasprc.json` ni credenciales equivalentes. Revisar cualquier archivo de configuración antes de incorporarlo al repositorio.
