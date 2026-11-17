# Carteles de encomiendas — Citek

Aplicación web para generar e imprimir carteles de encomiendas a partir de los datos de clientes almacenados en una hoja de cálculo de Google Sheets.

## Estado del proyecto

**Fase actual: documentación y definición.** Todavía no se implementó la aplicación. Los archivos de `gas/` son marcadores de posición para la futura implementación en Google Apps Script.

## Documentación principal

- [Especificación funcional](docs/ESPECIFICACION_FUNCIONAL.md): requisitos acordados, reglas de negocio, datos, diseño e impresión.
- [Arquitectura y plan de desarrollo](docs/ARQUITECTURA_Y_PLAN.md): estructura prevista, responsabilidades y metodología.
- [Plan de pruebas](docs/PLAN_DE_PRUEBAS.md): escenarios que deberán verificarse antes de dar por terminada la aplicación.

## Estructura prevista

```text
.
├── README.md
├── .gitignore
├── docs/
│   ├── ESPECIFICACION_FUNCIONAL.md
│   ├── ARQUITECTURA_Y_PLAN.md
│   └── PLAN_DE_PRUEBAS.md
└── gas/
    ├── Code.gs
    ├── Index.html
    ├── Styles.html
    └── JavaScript.html
```

## Plataforma prevista

- Google Apps Script como aplicación web.
- Google Sheets como fuente de datos de clientes.
- Interfaz HTML/CSS/JavaScript.
- Impresión en papel A4 vertical desde Google Chrome.

## Regla de trabajo

La documentación es la fuente de verdad. No cambiar requisitos ni agregar funcionalidades sin consultar y obtener aprobación. La primera tarea de desarrollo será analizar esta documentación y proponer una arquitectura detallada; no comenzar a programar hasta recibir aprobación.

## Seguridad

No subir contraseñas, tokens, archivos de credenciales, identificadores sensibles ni archivos locales de autenticación. En particular, no versionar `.clasprc.json` ni credenciales equivalentes. Revisar cualquier archivo de configuración antes de incorporarlo al repositorio.
