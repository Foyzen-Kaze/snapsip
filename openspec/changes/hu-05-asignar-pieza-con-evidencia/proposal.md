## Why

SnapSip ya genera el universo de piezas (HU-03), permite consultar pendientes (HU-06) y registra torres (HU-04), pero todavía no puede **asignar un panel a una torre con evidencia fotográfica**. En el AS-IS el operario apilaba y registraba en papel; el TO-BE exige que cada asignación quede respaldada por una fotografía (`02-rediseno-to-be.md:44`). HU-05 es la siguiente historia de la secuencia: con ella las piezas pasan a «Listo» y se habilitan el cierre de torres (HU-07), las guías (HU-08) y los envíos (HU-09). La ficha confirmada `.cin324/historias/HU-05.md` (2026-11-22) reúne lo que debe construirse, incluido el CA6 agregado por el estudiante.

## What Changes

- Nueva capacidad **asignar-pieza-con-evidencia**, accesible solo al **Operario de Bodega** mediante el selector de rol de demostración de HU-01 (sin autenticación real).
- Pantalla propia con el listado de **piezas «Pendiente» y todas las torres del proyecto**, mostrando en ambos casos **código, parte y estado** (corrección del estudiante). No se reutiliza `/proyectos`, restringido al Encargado.
- Asignación de una pieza «Pendiente» a una torre «Abierta» del mismo proyecto y de la misma parte, con evidencia fotográfica obligatoria: la pieza pasa a «Listo» y se crea la `Evidencia` con `responsable`, `fechaHoraCaptura` y `vigente = true` (CA1, EST-01, RP-05). **No se agregan columnas de usuario/fecha a `Pieza`**: esos datos viven en `Evidencia`.
- Rechazos sin cambiar datos: sin evidencia (CA2), pieza «Enviado» (CA5), torre de otra parte —«la torre no corresponde a la parte de la pieza»— (HU-04 CA3) y torre «Cerrada» con sugerencia de registrar otra torre —«se sugiere registrar otra torre para la parte»— (HU-04 CA4). Mensajes tomados literalmente del DSS-01.
- Reasignación de una pieza «Listo» a otra torre Abierta: exige confirmación del reemplazo y nueva evidencia; sin confirmación conserva la asignación anterior. La evidencia previa se conserva en el historial con `vigente = false` (CA3). La invalidación de guías «Vigente» se difiere a HU-08 (no existe tabla `GuiaDespacho`).
- **CA6:** consulta de una torre que muestra sus piezas con **código y estado**.
- Migración SQL nueva (`005_asignacion_piezas.sql`): columna `torre_id` en `piezas` y tabla `evidencias`. Sin tocar 001-004.
- Servicio de almacenamiento de evidencias **simulado** con interfaz + adaptador: tres fotos de demostración elegibles con un clic, ninguna preseleccionada, sin campo de texto ni subida real; disparador de prueba para forzar el fallo de CA4.
- Una prueba automática por escenario cubierto, con los nombres exactos indicados por el estudiante para los rechazos de HU-04.

## Capabilities

### New Capabilities

- `asignar-pieza-con-evidencia`: asignación y reasignación de piezas a torres con evidencia fotográfica obligatoria, rechazos por estado/parte/evidencia y consulta de las piezas contenidas en una torre.

### Modified Capabilities

- Ninguna. No cambian los requisitos de `acceso-por-rol-demo` ni `crear-proyecto`; los rechazos HU-04 CA3/CA4 no estaban en la spec `crear-torre` (quedaron fuera de alcance de HU-04).

## Impact

- Código nuevo: `src/dominio/asignaciones.ts` (validaciones de estado, parte y torre; persistencia atómica; consulta de torre), `src/integraciones/ServicioAlmacenamientoEvidencias.ts` y su adaptador simulado, `src/rutas/asignaciones.ts` y vistas EJS de selección/confirmación/consulta. Registro en `src/app.ts` y enlaces desde el inicio del Operario.
- Migración: `src/db/migrations/005_asignacion_piezas.sql`, registrada por `schema_migrations`. Sin cambios en 001-004; `torres` ya existe desde HU-04.
- Pruebas: `tests/hu-05.asignar-pieza-con-evidencia.test.ts` con base SQLite temporal, incluidos `HU-04 · Rechazo de una pieza de otra parte de la casa` y `HU-04 · Rechazo de una pieza nueva en una torre cerrada`.
- Especificaciones: spec nueva de `asignar-pieza-con-evidencia`, que se integrará al archivar este cambio.
- Sin dependencias nuevas; la librería SQLite del repositorio es `node:sqlite` con migraciones numeradas.
- Trazabilidad: actividad del TO-BE «Asignar pieza a torre con evidencia» (`02-rediseno-to-be.md:44`), caso de uso `CU-05` (`09-casos-de-uso.md:23`), requisito `RP-05` (`03-requisitos.md:13`), DSS-01 (`10-diagramas-secuencia.md:16-40`), estados `EST-01` de Pieza y `EST-02` de Torre (`11-diagramas-estado.md:25-74`). Contexto no funcional: RP-13 y RP-15a.
- Fuera de alcance: invalidación/generación de guías de despacho (HU-08), cierre manual (HU-07), eliminación de torres (HU-10), desasignación (HU-11), envíos (HU-09), subida real de fotos, medición de RP-13, autenticación real y modificación adicional de artefactos del curso (solo se agregaron CA6 y su Gherkin por indicación expresa del estudiante).
