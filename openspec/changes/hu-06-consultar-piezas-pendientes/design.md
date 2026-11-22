## Context

La HU-03 ya cargó `Proyecto`, `ParteCasa` y `Pieza` en SQLite, con `Pieza.estado` inicial «Pendiente». La actividad del TO-BE «Consultar piezas pendientes» (`02-rediseno-to-be.md:35,45`) y CU-06 (`09-casos-de-uso.md:24`) piden mostrar en tiempo real qué falta por asignar, sin participación de sistemas externos. El Operario de Bodega no puede usar `/proyectos` porque esa ruta está restringida al Encargado de Despacho (`src/rutas/proyectos.ts:9-12`). No hay DSS propio: el flujo se reconstruyó del Gherkin y de la ficha `.cin324/historias/HU-06.md`. EST-01 define «Pendiente» como el estado inicial y `Pendiente → Listo` solo cuando HU-05 asigna la pieza a una torre; `08-modelo-dominio.md:24` indica que un panel Pendiente no está en ninguna torre.

## Goals / Non-Goals

**Goals:**
- Ofrecer al Operario de Bodega una consulta propia, filtrada por `Proyecto` y `ParteCasa`, que liste solo `Pieza.codigo` en estado «Pendiente».
- Diferenciar claramente «falta elegir la parte» de «la parte elegida no tiene pendientes» («0 pendientes»).
- Reutilizar el selector de rol de demostración y las tablas existentes, con una prueba por escenario Gherkin.

**Non-Goals:**
- Crear `Torre`, `torre_id` ni tabla `torres`; asignar piezas (HU-05), cerrar torres (HU-07) ni generar guías (HU-08).
- Modificar estados: la consulta es de solo lectura y no invoca transiciones de EST-01.
- Implementar autenticación real, RP-14 ni integraciones externas (no existen en CU-06).
- Modificar artefactos del curso ni la ficha confirmada.

## Decisions

1. **Ruta y selector propios.** Se agrega una ruta nueva (p. ej. `GET /pendientes`) con un `select` de `Proyecto` y otro de `ParteCasa` dependiente del proyecto. Se descarta reutilizar `/proyectos`: está restringido por rol y su pantalla está pensada para el Encargado. Así se cumple CU-06 sin relajar permisos.
2. **Filtro por estado en lugar de columna `torre_id`.** La consulta une `proyectos → partes_casa → piezas` y aplica `piezas.estado = 'Pendiente'` más el `parte_casa_id` elegido. Se descarta agregar `torre_id` o una tabla `torres`: EST-01 y el modelo de dominio ya representan «sin torre» mediante el estado inicial, y Torre pertenece a HU-04/HU-05. No habrá migración nueva.
3. **Resultado simple.** La vista muestra la lista de `Pieza.codigo` (el atributo que el Operario necesita para ubicar la pieza) y el encabezado con la `ParteCasa.nombre` elegida; no se proyectan atributos de otras entidades.
4. **Mensaje condicionado a la selección.** El controlador valida primero que lleguen `proyectoId` y `parteCasaId`; si falta cualquiera, devuelve la vista pidiendo la selección, sin resultados y sin «0 pendientes». Solo con ambos valores calcula la lista y, si está vacía, muestra «0 pendientes». Esto corrige explícitamente la variante señalada por el estudiante.
5. **Acceso reutilizado.** Se comprueba el rol de demostración activo con la lógica existente de `src/acceso/roles.ts`; si no es Operario de Bodega, se devuelve rechazo sin datos (HU-01 CA3). No se crea un sistema de autenticación ni una nueva función de acceso: se habilita la entrada «Consultar piezas pendientes (HU-06, pendiente)».
6. **Pruebas con datos preparados.** Dos pruebas de integración con SQLite temporal. Como HU-05 todavía no asigna piezas, las pruebas insertan directamente filas con estados distintos y una parte sin pendientes (supuesto aprobado y registrado en `.cin324/proyecto.md`). Se usa el mismo patrón de `schema_migrations` y `crearBaseDeDatos` que en HU-03.
7. **Sin adaptadores.** CU-06 no tiene sistema externo, por lo que no se crea interfaz ni implementación `...Simulado`.

## Risks / Trade-offs

- [La app aún no puede asignar piezas a torre] → Los estados distintos de «Pendiente» se preparan en la BD desde las pruebas; cuando HU-05 exista, esos datos podrán generarse desde la interfaz sin cambiar la consulta.
- [Interpretar «sin torre asignada» como `estado = 'Pendiente'`] → Está respaldado por EST-01 y `08-modelo-dominio.md:24`; si un cambio futuro separa ambos conceptos, se revisará el filtro desde los artefactos, no agregando columnas en silencio.
- [Duplicidad de selectores frente a `/proyectos`] → Es intencional: evita dar acceso del Encargado al Operario si se cambiara el permiso de esa ruta.
- [Pantalla sin DSS propio] → El flujo se documenta en la ficha y se cubre con las pruebas Gherkin; no se inventa un diagrama.

## Migration Plan

Sin cambios de esquema: no hay migración nueva ni datos que migrar. La implementación se limita a agregar la ruta, la vista, la consulta, la habilitación de la función por rol, las pruebas y el README. Reversión: retirar esos archivos/cambios; las tablas de HU-03 permanecen intactas. Después de la implementación se ejecuta `npm test` y `openspec validate`. El cambio se archivará cuando el estudiante lo autorice, integrando el delta en `openspec/specs/`.

## Open Questions

Ninguna. El único supuesto (datos preparados en BD para CA2 y exclusión de estados) fue confirmado por el estudiante y anotado en `.cin324/proyecto.md`.
