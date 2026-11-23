## Why

La consulta de piezas pendientes (HU-06) se generó con un selector de Proyecto que solo muestra el `codigo` y con un selector de Parte de la casa que no distingue qué partes tienen piezas cargadas. Los criterios CA3-CA6, aprobados por el estudiante el 2026-11-22 y confirmados en el commit `e688df6` y en la ficha `.cin324/historias/HU-06.md`, exigen identificar cada proyecto por `cliente` y `codigo`, ofrecer solo las partes con piezas cargadas y avisar cuando el proyecto esté «Sin piezas cargadas». El sistema actual no cumple esos criterios: este ajuste los incorpora a la especificación y al comportamiento generado.

## What Changes

- El selector de Proyecto de `/pendientes` ofrece cada `Proyecto` identificado por su `cliente` y su `codigo` (CA3).
- El selector de Parte de la casa se puebla únicamente con las `ParteCasa` que tienen `Pieza` cargadas en el `Proyecto` elegido; no se ofrecen las partes sin piezas (CA4, CA5).
- Al seleccionar un `Proyecto` en estado «Sin piezas cargadas», el sistema informa que el proyecto no tiene partes de la casa con piezas cargadas (CA6).
- Se conservan sin cambios el listado de piezas «Pendiente» (CA1), el mensaje «0 pendientes» (CA2) y la validación que pide elegir Proyecto y Parte cuando falta alguna.
- Se actualizan las pruebas automáticas con un caso por cada escenario Gherkin de HU-06, incluidos CA3-CA6.
- No se crean tablas ni columnas: se reutilizan `proyectos`, `partes_casa` y `piezas` de HU-02/HU-03.

## Capabilities

### New Capabilities

- Ninguna: el ajuste no introduce una capacidad nueva, solo completa la ya existente.

### Modified Capabilities

- `consulta-piezas-pendientes`: se modifican los requisitos sobre la identificación del `Proyecto` en el selector, las `ParteCasa` ofrecidas según el proyecto elegido y el aviso para proyectos «Sin piezas cargadas». La especificación vigente de esta capacidad aún no está archivada; su fuente actual es `openspec/changes/hu-06-consultar-piezas-pendientes/specs/consulta-piezas-pendientes/spec.md`.

## Impact

- Código afectado: `src/dominio/pendientes.ts` (proyección de proyectos y consulta de partes), `src/rutas/pendientes.ts` y `src/vistas/pendientes.ejs`.
- Pruebas afectadas: `tests/hu-06.consultar-piezas-pendientes.test.ts`.
- Especificaciones: delta sobre la capacidad `consulta-piezas-pendientes`, que se integrará al archivar este cambio.
- Sin migraciones SQL nuevas, sin dependencias nuevas y sin sistemas externos (HU-06 se resuelve dentro de SnapSip). No se implementan requisitos no funcionales ni autenticación real.
- Trazabilidad: actividad del TO-BE «Consultar piezas pendientes» (`02-rediseno-to-be.md:45`), caso de uso `CU-06` (`09-casos-de-uso.md:24`), requisito `RP-06` (`03-requisitos.md:14`).
- Fuera de alcance: HU-01 (selector de rol), HU-03 (simulación de carga de plano/archivo y su CA2), HU-04/HU-05 (torres y asignación de piezas), modificar RP-06 o cambiar el estado de las entidades del dominio.
