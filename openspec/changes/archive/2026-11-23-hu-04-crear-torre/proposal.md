## Why

SnapSip ya registra proyectos (HU-02), genera su universo de piezas simulado (HU-03) y permite consultar piezas pendientes (HU-06), pero todavía no puede registrar la **agrupación física** de paneles en la bodega. En el AS-IS la torre se apilaba «verticalmente sobre otros proyectos o hacia el lado» sin registro; el TO-BE exige crearla en el sistema, asociada a un único proyecto y a una única parte de la casa (`02-rediseno-to-be.md:43`). HU-04 es la siguiente historia de la secuencia y habilita HU-05 (asignar piezas), HU-07 (cerrar), HU-10 (eliminar) y HU-08 (guías). La ficha confirmada `.cin324/historias/HU-04.md` (2026-11-22) reúne lo que debe construirse.

## What Changes

- Nueva capacidad **crear-torre**, accesible solo para el **Operario de Bodega** mediante el selector de rol de demostración de HU-01 (sin autenticación real).
- Pantalla propia para crear una torre: ofrece los proyectos con universo de piezas cargado («En preparación» o «Proyecto completo») y las `ParteCasa` del proyecto elegido; no se reutiliza `/proyectos`, restringido al Encargado.
- Registro de la `Torre` al crearla: `codigo` generado como `TOR-<codigoProyecto>-<numero>`, `numero` correlativo **dentro del proyecto**, `estado` **«Abierta»** y cero piezas (CA1, EST-02).
- Creación de una segunda torre para la misma parte con la siguiente numeración correlativa, conservando la torre y las piezas anteriores (CA2). No se mide la «capacidad física», que no es atributo del modelo de dominio.
- Rechazo sin crear la torre si la parte no pertenece al proyecto o si el proyecto está «Sin piezas cargadas» (escenario derivado de RP-04), y rechazo por rol no autorizado sin revelar datos (HU-01 CA3).
- Migración SQL nueva (`004_torres.sql`) con la tabla `torres` derivada del modelo de dominio, incluidas `fechaHoraEliminacion` y `eliminadaPor` nulas al crear (se usarán en HU-10). Sin columna `torre_id` en `piezas`: la asignación de piezas es HU-05.
- Una prueba automática por escenario Gherkin cubierto: CA1, CA2 y el rechazo por parte ajena, más el rechazo por rol.

## Capabilities

### New Capabilities

- `crear-torre`: registro de torres asociadas a un proyecto y a una parte de la casa, con numeración correlativa por proyecto y estado inicial «Abierta».

### Modified Capabilities

- Ninguna. No se alteran los requisitos de `crear-proyecto`, `acceso-por-rol-demo` ni `consulta-piezas-pendientes`.

## Impact

- Código nuevo: `src/dominio/torres.ts` (consulta de proyectos/partes elegibles y creación de torre con numeración correlativa), `src/rutas/torres.ts` (ruta del Operario) y `src/vistas/torres/nuevo.ejs` (formulario y confirmación). Registro en `src/app.ts` y enlace desde el inicio del Operario.
- Migración: `src/db/migrations/004_torres.sql`, registrada por el mecanismo existente de `schema_migrations`. Sin cambios en migraciones 001-003.
- Pruebas: `tests/hu-04.crear-torre.test.ts` con base SQLite temporal.
- Especificaciones: spec nueva de `crear-torre`, que se integrará al archivar este cambio.
- Sin dependencias nuevas ni sistemas externos (CU-04 no tiene actores externos; el almacenamiento de evidencias es de HU-05/HU-09).
- Trazabilidad: actividad del TO-BE «Crear torre» (`02-rediseno-to-be.md:43`), caso de uso `CU-04` (`09-casos-de-uso.md:22`), requisito `RP-04` (`03-requisitos.md:12`), ciclo de vida `EST-02` (`11-diagramas-estado.md:43-74`).
- Fuera de alcance: **CA3 y CA4 de HU-04** (rechazo de piezas por parte distinta o torre Cerrada), que corresponden a HU-05 y se dejan sin implementar sin modificar el Gherkin; asignación con evidencia (HU-05), cierre (HU-07), eliminación (HU-10), reasignación/desasignación (HU-11), guías y envíos (HU-08/HU-09), medición de capacidad física, autenticación real, requisitos no funcionales y modificación de los artefactos del curso.
