# Estado del proyecto — generación de la aplicación

## Proyecto
- Nombre: SnapSip
- Repositorio de documentación: esta carpeta
- Última auditoría: 2026-11-16 — resultado: completo (sin bloqueantes ni supuestos pendientes)

## Mapa de artefactos (rutas detectadas)
| Artefacto | Ruta(s) | Estado |
|-----------|---------|--------|
| BPMN AS-IS | `01-proceso-as-is.md`, `diagramas/as-is.bpmn`, `diagramas/proceso-as-is.png` | completo |
| BPMN TO-BE | `02-rediseno-to-be.md`, `diagramas/to-be.bpmn`, `diagramas/to-be.png` | completo |
| Historias de usuario | `04-historias-usuario.md` (HU-01…HU-11) | completo |
| Criterios Gherkin | `07-criterios-aceptacion.md` | completo |
| Modelo de dominio | `08-modelo-dominio.md`, `diagramas/modelo-de-dominio.puml` (fuente de verdad), `diagramas/modelodedominio.png` | completo |
| Casos de uso | `09-casos-de-uso.md`, `diagramas/casos-de-uso.puml`, `diagramas/casos-de-uso.png` | completo |
| Diagramas de estado | `11-diagramas-estado.md`, `diagramas/est-01.puml/.png`, `diagramas/est-02.puml/.png`, `diagramas/est-03.puml/.png` | completo |
| Diagramas de secuencia | `10-diagramas-secuencia.md`, `diagramas/dss-01.puml/.png`, `diagramas/dss-02.puml/.png`, `diagramas/dss-03.puml/.png` | completo |
| Requisitos y atributos de calidad | `03-requisitos.md`, `05-elicitacion.md`, `06-atributos-calidad.md`, `12-trazabilidad.md` | completo |

## Supuestos acordados (por elementos faltantes o dudosos)
- 2026-11-16 (estudiante): Se toma `diagramas/modelo-de-dominio.puml` como fuente de verdad del modelo de dominio; `diagramas/modelodedominio.png` se considera imagen renderizada.
- 2026-11-16 (estudiante): No se requieren identificadores explícitos `ACT-TOBE-xx`; se usa la trazabilidad existente (HU/CU/actividad TO-BE).
- 2026-11-16 (estudiante): Se respeta el término de negocio “Completa” para ParteCasa/proyecto (según HU-08 y modelo de dominio).
- 2026-11-16 (estudiante): Cobertura de HU-10 CA3 en Gherkin (dos escenarios marcados CA3 en `07-criterios-aceptacion.md`) es correcta.
- 2026-11-18 (indicación del profesor): HU-03 se **simula solo en la demo**, igual que el selector de rol de HU-01; en el sistema real RP-03 sigue siendo «cargar el archivo». **No se cambia el texto de RP-03, HU-03 ni del Gherkin.**
  - La inyección NO ocurre al crear el proyecto; HU-02 no se toca (el proyecto sigue naciendo en «Sin piezas cargadas»).
  - Botón «Inyectar piezas desde plano/archivo» en el proyecto, visible solo para el **Encargado de Despacho** y solo si el proyecto está en «Sin piezas cargadas». Si otro rol lo intenta, se rechaza sin modificar datos (HU-01 CA3).
  - Al presionarlo se generan al azar entre **1 y 5 partes de la casa** y hasta **100 piezas**, siempre con **menos partes que piezas** y **al menos una pieza por parte**.
  - Resultado (HU-03 CA1): cada pieza en «Pendiente», sin torre y asociada a su parte; el proyecto pasa a «En preparación»; se muestra cuántas partes y piezas se crearon.
  - Códigos de pieza (confirmado por el estudiante 2026-11-18): en la demo, cada código es una letra de la A a la Z y un número del 1 al 25 (p. ej. `A3`, `I5`), elegidos al azar; el código completo no se repite dentro del proyecto, mientras que la letra y el número por separado sí pueden repetirse; en proyectos distintos los códigos pueden repetirse. En el sistema real RP-03 el código sigue viniendo del archivo; no se cambia el texto de RP-03, HU-03 ni del Gherkin.
  - Partes y piezas se guardan en tablas nuevas (**migración 003**) con los nombres del modelo de dominio (`ParteCasa`, `Pieza`), para que HU-04 las use.
  - **Desviación documentada:** HU-03 CA2 (formato inválido / filas incompletas) no se representa en la demo, igual que CA2 de HU-01.
  - Informe: `.cin324/validaciones/VAL-HU-03-1.md` y `.cin324/validaciones/VAL-HU-03-2.md`. El script artesanal `src/db/inyectar-hu03.ts` se descarta; HU-03 se genera con `/cin324-generar-app` desde los artefactos.
- 2026-11-19 (estudiante, validación de HU-06):
  - La consulta filtra por `Pieza.estado = 'Pendiente'`; **no** se crea la columna `torre_id` ni la tabla `torres`. EST-01 (`diagramas/est-01.puml:13-14`) y `08-modelo-dominio.md:24` («un panel Pendiente no está en ninguna») ya expresan «sin torre asignada»; `Torre` queda para HU-04/HU-05.
  - El Operario de Bodega usa un **selector propio de proyecto y parte de la casa**, porque `/proyectos` está restringido al Encargado de Despacho (`src/rutas/proyectos.ts:9-12`). Si no se eligieron proyecto o parte, el sistema pide elegirlos y **no** muestra «0 pendientes»; ese mensaje es solo para una parte elegida que no tiene piezas pendientes.
  - **Pruebas:** para verificar CA2 y la exclusión de piezas en otros estados del escenario CA1, las pruebas automáticas preparan los datos directamente en la BD, ya que en la app todavía no se pueden asignar piezas a torre (HU-05).

## Stack (se define una sola vez)
- Lenguaje y framework: TypeScript + Node.js (Express) + EJS (vistas servidor)
- Base de datos: SQLite — archivo `data/app.db` (propuesto; se concretará en la implementación) con `better-sqlite3`
- Pruebas: Vitest + supertest
- Cómo instalar: `npm install`
- Cómo ejecutar: `npm run dev` — URL: `http://localhost:3000` (propuesto)
- Cómo probar: `npm test`

## Historias
| Historia | Estado | Cambio de OpenSpec | Fecha | Observaciones |
|----------|--------|--------------------|-------|----------------|
| HU-01 — Autenticación de usuarios | hecha | hu-01-autenticacion-usuarios (archivado: `openspec/changes/archive/2026-11-16-hu-01-autenticacion-usuarios/`) | 2026-11-16 | Ficha: `.cin324/historias/HU-01.md` (Opción 2: selector de rol de demostración). Specs sincronizadas en `openspec/specs/acceso-por-rol-demo/spec.md`. Instalar: `npm install`; seed: `npm run db:seed`; ejecutar: `npm run dev` (http://localhost:3000); pruebas: `npm test` (4/4). Servicio de autenticación simulado/omitido en flujo principal; SQLite vía `node:sqlite`. |
| HU-02 — Crear proyecto | hecha | hu-02-crear-proyecto (archivado: `openspec/changes/archive/2026-11-16-hu-02-crear-proyecto/`) | 2026-11-16 | Ficha: `.cin324/historias/HU-02.md`. Specs sincronizadas en `openspec/specs/crear-proyecto/spec.md`. Instalar: `npm install`; seed: `npm run db:seed`; ejecutar: `npm run dev` (http://localhost:3000); pruebas: `npm test` (7/7). CA3: condición implementada (estado "Sin piezas cargadas", sin partes/piezas); rechazo al crear torre corresponde a HU-04. |
| HU-03 — Inyectar piezas desde plano/archivo | hecha (ajuste de códigos implementado, pendiente de archivo) | hu-03-inyectar-piezas y ajuste-hu-03-codigos-pieza (sin archivar) | 2026-11-18 | Ficha: `.cin324/historias/HU-03.md`, actualizada con el formato de códigos (VAL-HU-03-2). Specs: `openspec/changes/hu-03-inyectar-piezas/` y `openspec/changes/ajuste-hu-03-codigos-pieza/`. Instalar: `npm install`; seed: `npm run db:seed`; ejecutar: `npm run dev` (http://localhost:3000); pruebas: `npm test` (8/8 en HU-03; 19/19 en total). Migración 003 (`partes_casa`, `piezas`, con `piezas.proyecto_id` y `UNIQUE (proyecto_id, codigo)`); botón simulado solo para Encargado de Despacho y solo en «Sin piezas cargadas». CA2 adaptado como desviación documentada. Sin script artesanal. |
| HU-04 — Crear torre | pendiente | — | — | Depende de HU-03 (universo de piezas cargado, partes de la casa). |
| HU-05 — Asignar pieza a torre con evidencia | pendiente | — | — | Depende de HU-04 (torre) y HU-03 (piezas); integra almacenamiento de evidencias (simulado). |
| HU-06 — Consultar piezas pendientes | hecha (pendiente de validación del sistema) | hu-06-consultar-piezas-pendientes (sin archivar) | 2026-11-19 | Ficha: `.cin324/historias/HU-06.md`. Instalar: `npm install`; seed: `npm run db:seed`; ejecutar: `npm run dev` (http://localhost:3000); ruta `/pendientes` solo para Operario de Bodega; pruebas: `npm test` (4/4 en HU-06; 19/19 en total). Sin migración nueva: filtra por `Pieza.estado = 'Pendiente'`, sin `torre_id` ni tabla `torres`. |
| HU-07 — Cierre manual de torre | pendiente | — | — | Depende de HU-04; relaciona con HU-08/RD-01 (invalidación). |
| HU-08 — Generar guía de despacho | pendiente | — | — | Depende de HU-05/HU-07 (piezas Listo, torres Cerradas); incluye validación de completitud. |
| HU-09 — Registrar envío con evidencia | pendiente | — | — | Depende de HU-08 (guía Vigente); integra almacenamiento de evidencias (simulado). |
| HU-10 — Eliminar torre vacía con código | pendiente | — | — | Depende de HU-04. |
| HU-11 — Desasignar pieza de una torre | pendiente | — | — | Depende de HU-05; relaciona con HU-08/RD-01 (invalidación). |

## Validaciones
| Historia | Informe | Estado | Fecha |
|----------|---------|--------|-------|
| HU-03 | `.cin324/validaciones/VAL-HU-03-1.md`, `.cin324/validaciones/VAL-HU-03-2.md` | VAL-1: resuelta; VAL-2: artefactos actualizados, ajuste `ajuste-hu-03-codigos-pieza` completado y pendiente de archivo | 2026-11-18 |
| HU-06 | — | implementada; pendiente de que el estudiante pruebe el sistema | 2026-11-19 |

## Cambios posteriores
| Cambio | Historia afectada | Motivo | Fecha |
|--------|-------------------|--------|-------|
| `ajuste-hu-03-codigos-pieza` | HU-03 | Formato de códigos de pieza en la demo: letra A–Z y número 1–25 al azar, código completo único por proyecto (VAL-HU-03-2). Completado 2026-11-19, pendiente de archivo | 2026-11-18 |
| `hu-06-consultar-piezas-pendientes` | HU-06 | Consulta de piezas «Pendiente» por Proyecto/ParteCasa con selector propio del Operario; «0 pendientes» solo para parte elegida | 2026-11-19 |
