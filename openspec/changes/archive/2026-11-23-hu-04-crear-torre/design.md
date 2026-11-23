## Context

SnapSip ya tiene proyectos (HU-02), universo de piezas simulado (HU-03) y consulta de pendientes (HU-06). Falta registrar la torre física: en el AS-IS se apilaba «verticalmente sobre otros proyectos o hacia el lado» y en el TO-BE se crea en el sistema asociada a un proyecto y a una parte de la casa (`02-rediseno-to-be.md:43`, `userTask` en `to-be.bpmn:101`). HU-04 es la primera historia que escribe en la tabla `torres` y prepara el terreno para HU-05 (asignar piezas), HU-07 (cerrar) y HU-10 (eliminar).

La ficha `.cin324/historias/HU-04.md` quedó confirmada el 2026-11-22. Decisiones relevantes: `codigo = TOR-<codigoProyecto>-<numero>` generado automáticamente; CA3 y CA4 fuera de alcance (pertenecen a HU-05, precedente citado solo HU-03 CA2); la «capacidad física» no se mide; «En preparación o posterior» = «En preparación» o «Proyecto completo».

Stack real: TypeScript + Express + EJS + `node:sqlite` (migraciones numeradas en `src/db/migrations/` registradas en `schema_migrations`) + Vitest/supertest. Selector de rol de demostración, sin autenticación real.

## Goals / Non-Goals

**Goals:**
- Crear una `Torre` con `estado` «Abierta», cero piezas, `numero` correlativo por proyecto y `codigo` generado (CA1, EST-02, RP-04).
- Permitir varias torres por parte conservando las anteriores (CA2).
- Rechazar sin crear si la parte es ajena al proyecto o si el proyecto no tiene universo cargado.
- Restringir la operación al Operario de Bodega.

**Non-Goals:**
- CA3 y CA4 de HU-04 (rechazo de piezas por parte distinta o torre Cerrada) → HU-05; sin cambiar el Gherkin.
- Columna `torre_id` en `piezas` ni cualquier asignación de piezas → HU-05.
- Medir «capacidad física»; cerrar, reabrir o eliminar torres; generar guías.
- Sistemas externos (CU-04 no tiene actores externos) y autenticación real.
- Requisitos no funcionales y modificación de artefactos del curso.

## Decisions

1. **Tabla nueva `torres` desde el modelo de dominio.** Columnas: `id`, `proyecto_id`, `parte_casa_id`, `codigo`, `numero`, `estado` (por defecto «Abierta»), `fecha_hora_eliminacion` y `eliminada_por` (nulas al crear; se usarán en HU-10). `NOT NULL` en `proyecto_id`, `parte_casa_id`, `codigo`, `numero` y `estado` por ser obligatorios en el modelo. FKs con `ON DELETE CASCADE` desde `proyectos` y `partes_casa`: la torre vive dentro de la composición `Proyecto 1 – 0..* ParteCasa` (`08-modelo-dominio.md:21`), por lo que no debe quedar huérfana. `UNIQUE (proyecto_id, numero)` y `UNIQUE (proyecto_id, codigo)`. Alternativa descartada: guardar `numero` por parte; contradice CA1/CA2 y RP-04 («dentro del proyecto»).

2. **La guarda de EST-02 se aplica en la capa de dominio, no solo en la pantalla.** `crearTorre()` verifica que el `Proyecto` exista y esté en «En preparación» o «Proyecto completo» (universo de piezas inyectado) y que la `ParteCasa` pertenezca a ese proyecto. Así un POST manipulado no elude la regla. Mensajes propuestos para revisión: «primero deben inyectarse las piezas del proyecto desde el archivo» (texto íntegro de HU-02 CA3, `07-criterios-aceptacion.md:68`) y «La parte de la casa no pertenece al proyecto seleccionado.»

3. **Numeración correlativa atómica.** `numero = COALESCE(MAX(numero), 0) + 1` sobre `torres WHERE proyecto_id = ?`, calculado e insertado en una transacción; el `UNIQUE (proyecto_id, numero)` es la segunda barrera. Alternativa descartada: `COUNT(*) + 1`, que se desalinearía si una torre se elimina en HU-10.

4. **`codigo` derivado del proyecto y el número.** `TOR-${proyecto.codigo}-${numero}` (p. ej. `TOR-PEND-01-1`), generado y mostrado en la confirmación (Decisión A confirmada). Alternativa descartada: campo libre, sin regla documentada de formato ni unicidad.

5. **Ruta propia y selector repoblado.** `GET /torres/nuevo` y `POST /torres`, ambos con `requiereRol(["Operario de Bodega"])`, porque `/proyectos` es solo del Encargado. El formulario ofrece proyectos elegibles y, al elegir uno, repuebla las partes con el mismo patrón ya validado en HU-06 (petición GET con `?proyectoId=` y manejador `change` mínimo): se evita repetir el defecto del desplegable vacío. El POST vuelve a validar todo en dominio.

6. **Sin integraciones simuladas nuevas.** CU-04 no tiene actores externos; el Servicio de almacenamiento de evidencias pertenece a HU-05/HU-09 y no se declara aquí.

## Risks / Trade-offs

- **[Dos peticiones concurrentes calculen el mismo número] →** transacción `MAX + INSERT` y `UNIQUE (proyecto_id, numero)`; SQLite ya serializa escrituras.
- **[El `codigo` sea predecible y no sirva como confirmación de baja en HU-10] →** HU-10 decidirá su propio mecanismo; se conserva el valor generado porque es lo que pide el modelo y la ficha.
- **[La recarga al cambiar de Proyecto en el formulario] →** patrón idéntico al de HU-06, ya validado; no se añade `fetch` ni dependencias.
- **[Borrar un proyecto con torres] →** FKs en cascada desde `proyectos` y `partes_casa` evitan registros huérfanos.

## Migration Plan

Agregar `004_torres.sql` sin tocar 001-003; el mecanismo existente la aplica al arrancar y la registra en `schema_migrations`. No hay datos que migrar. Rollback en la demo: eliminar el registro de la migración y el archivo; no se usa en producción.

## Open Questions

Ninguna. Los textos de los mensajes de rechazo se proponen en `specs/crear-torre/spec.md` para su revisión en el Paso 6.
