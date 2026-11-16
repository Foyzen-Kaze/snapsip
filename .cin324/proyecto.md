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
| HU-03 — Inyectar piezas desde plano/archivo | pendiente | — | — | Depende de HU-02 (proyecto existente, estado inicial). |
| HU-04 — Crear torre | pendiente | — | — | Depende de HU-03 (universo de piezas cargado, partes de la casa). |
| HU-05 — Asignar pieza a torre con evidencia | pendiente | — | — | Depende de HU-04 (torre) y HU-03 (piezas); integra almacenamiento de evidencias (simulado). |
| HU-06 — Consultar piezas pendientes | pendiente | — | — | Depende de HU-03 (piezas/partes). |
| HU-07 — Cierre manual de torre | pendiente | — | — | Depende de HU-04; relaciona con HU-08/RD-01 (invalidación). |
| HU-08 — Generar guía de despacho | pendiente | — | — | Depende de HU-05/HU-07 (piezas Listo, torres Cerradas); incluye validación de completitud. |
| HU-09 — Registrar envío con evidencia | pendiente | — | — | Depende de HU-08 (guía Vigente); integra almacenamiento de evidencias (simulado). |
| HU-10 — Eliminar torre vacía con código | pendiente | — | — | Depende de HU-04. |
| HU-11 — Desasignar pieza de una torre | pendiente | — | — | Depende de HU-05; relaciona con HU-08/RD-01 (invalidación). |

## Validaciones
| Historia | Informe | Estado | Fecha |
|----------|---------|--------|-------|
| — | — | — | — |

## Cambios posteriores
| Cambio | Historia afectada | Motivo | Fecha |
|--------|-------------------|--------|-------|
| — | — | — | — |
