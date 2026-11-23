## Context

HU-06 «Consultar piezas pendientes» ya está generada en el cambio `hu-06-consultar-piezas-pendientes` (sin archivar) y usa TypeScript + Express + EJS + SQLite. El estudiante aprobó los criterios CA3-CA6 el 2026-11-22 (commit `e688df6`, ficha `.cin324/historias/HU-06.md` confirmada) y el sistema actual no los cumple:

- `listarProyectosParaConsulta()` proyecta solo `id, codigo` y la vista pinta `proyecto.codigo`.
- `listarPartesPorProyecto()` devuelve todas las `ParteCasa` del proyecto, tengan o no `Pieza` cargadas.
- La ruta `/pendientes` no distingue el caso de un `Proyecto` en estado «Sin piezas cargadas».

El esquema ya existe y no se amplía: `proyectos(id, codigo, cliente, metraje, estado)` (migración 002), `partes_casa(id, proyecto_id, nombre)` y `piezas(id, proyecto_id, parte_casa_id, codigo, estado)` (migración 003).

## Goals / Non-Goals

**Goals:**
- Mostrar cada proyecto por `cliente` y `codigo` en el selector (CA3).
- Ofrecer solo las partes con piezas cargadas del proyecto elegido (CA4, CA5).
- Avisar cuando el proyecto esté «Sin piezas cargadas» (CA6).
- Cubrir cada escenario Gherkin con una prueba automática.

**Non-Goals:**
- Crear tablas, columnas o migraciones nuevas.
- Cambiar el listado de piezas «Pendiente» (CA1), el mensaje «0 pendientes» (CA2) ni la validación de selección incompleta.
- Modificar HU-01, HU-03, torres o asignación de piezas; cambiar RP-06; implementar requisitos no funcionales.

## Decisions

1. **Proyección de proyectos.** Ampliar la consulta a `SELECT id, codigo, cliente FROM proyectos` y pintar la opción como `${cliente} (${codigo})`. Se descarta crear una entidad `Cliente`: el modelo de dominio la define como atributo de `Proyecto` (`08-modelo-dominio.md:11,34`).
2. **Partes con piezas cargadas.** Modificar `listarPartesPorProyecto()` con un `EXISTS` sobre `piezas` por `parte_casa_id` y `proyecto_id`; no filtrar por `estado`, porque CA4/CA5 dicen «piezas cargadas» y CA2 ya cubre la parte sin piezas «Pendiente». El filtro se conserva como cumplimiento de CA4/CA5, pero los datos de prueba respetan la multiplicidad `ParteCasa` 1 – 1..* `Pieza` (`08-modelo-dominio.md:22`): no se crean `ParteCasa` sin `Pieza`. Alternativa considerada: `JOIN` con `DISTINCT`; se prefiere `EXISTS` para evitar duplicados sin agregar agrupación.
3. **Proyecto sin piezas.** Leer `proyectos.estado` en la capa de dominio y pasar un indicador a la vista cuando sea «Sin piezas cargadas»; en ese caso no consultar partes y mostrar el aviso. El estado viene del atributo `estado` del modelo de dominio (`08-modelo-dominio.md:11`, `12-trazabilidad.md:74`), **no** de EST-01, que es el ciclo de vida de `Pieza`.
4. **Recarga del selector.** Mantener el formulario GET actual (`?proyectoId=…&parteCasaId=…`): al elegir otro proyecto y enviar «Consultar», la ruta recalcula las partes disponibles. No se añade JavaScript ni un endpoint nuevo.
5. **Pruebas.** Una prueba de integración por escenario Gherkin (CA1-CA6). Para CA4-CA6 se preparan datos en la base de prueba con la técnica ya documentada en la ficha (los estados de pieza no se pueden generar desde la UI porque HU-05 aún no existe). El proyecto de CA5 tiene **solo** tres `ParteCasa` —«Muros interiores», «Techo» y «Entrepiso»—, cada una con al menos una `Pieza`; «Muros exteriores» y «Piso» no se crean en ese proyecto, de modo que no se infringe `ParteCasa` 1 – 1..* `Pieza` (`08-modelo-dominio.md:22`).

## Risks / Trade-offs

- **[Riesgo] Clientes repetidos en distintos proyectos → Mitigación:** mostrar siempre `cliente` y `codigo` juntos, tal como pide CA3.
- **[Riesgo] Una parte con piezas todas en estado distinto de «Pendiente» sigue apareciendo en el selector → Mitigación:** es coherente con CA2; el filtro por `estado` sigue solo en la consulta de piezas pendientes.
- **[Riesgo] Cambiar de proyecto sin reenviar el formulario deja visible la selección anterior → Mitigación:** el formulario se envía con «Consultar» y la validación de selección incompleta impide mostrar resultados erróneos.

## Migration Plan

No hay migraciones SQL: se reutilizan las tablas existentes. Tras aplicar el cambio se ejecuta `npm test` y se comprueba `/pendientes` con los datos del seed (proyecto sin piezas, proyecto con piezas en algunas partes). Rollback: regenerar desde el cambio anterior si el ajuste se revierte.

## Open Questions

Ninguna: los textos de los avisos y los nombres de las partes salen del Gherkin y de la ficha confirmada.
