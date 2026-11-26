## Context

SnapSip ya implementa HU-01 a HU-06 con un selector de rol de demostración (sin credenciales reales), SQLite con migraciones numeradas y pruebas Vitest + supertest. Los artefactos de requisitos acordados el 2026-11-26 (ficha `.cin324/historias/HU-12.md`, EST-04, RP-17, CU-12, Gherkin HU-02/HU-03/HU-12) definen que `Proyecto` nace «Pendiente de aprobación», que solo el **Supervisor de Proyectos** puede aprobarlo/rechazarlo y que la inyección de piezas exige «Aprobado».

El código vigente todavía usa «Sin piezas cargadas» como estado inicial (`src/dominio/proyectos.ts`), como guarda de inyección (`src/dominio/piezas.ts`), como disparador del aviso de HU-06 (`src/dominio/pendientes.ts`) y como `DEFAULT` de la migración 002. El selector de roles (`src/acceso/roles.ts`) solo ofrece Operario de Bodega y Encargado de Despacho. `data/app.db` tiene un proyecto «En preparación» con 15 piezas y ninguno en el estado eliminado.

Restricciones: una historia por cambio, web sencilla, SQLite local, sin autenticación real, sin requisitos no funcionales y con artefactos del curso como fuente de verdad. Todo el contenido y la interfaz se escriben en español.

## Goals / Non-Goals

**Goals:**
- Cumplir HU-12 CA1–CA4 con transiciones `aprobar proyecto` y `rechazar proyecto` desde «Pendiente de aprobación», con guardas de rol y de estado.
- Alinear HU-02, HU-03, HU-04 y HU-06 al ciclo nuevo de `Proyecto`, eliminando «Sin piezas cargadas» del comportamiento vigente.
- Agregar el rol Supervisor de Proyectos al selector y darle una pantalla propia `/aprobaciones` sin relajar `/proyectos`.
- Conservar los datos ya guardados mediante una migración 007 aditiva, sin reescribir la 002 ni reiniciar la base.
- Representar la aprobación únicamente con el atributo `estado`, sin campos nuevos.

**Non-Goals:**
- Crear una actividad nueva en el BPMN, un DSS propio o un caso de uso distinto de CU-12.
- Implementar autenticación real, auditoría de aprobación (`aprobadoPor`, `fechaAprobacion`) ni `esperandoAprobacion`.
- Permitir aprobar/rechazar desde estados distintos a «Pendiente de aprobación» o revertir un «Rechazado».
- Inyectar piezas, crear torres o generar guías dentro de este cambio; HU-12 solo habilita o bloquea.
- Modificar los cambios OpenSpec archivados ni `Inconsistencias.md`.

## Decisions

1. **Aprobación como estado, no como campo.** Se usa `Proyecto.estado` con los valores de EST-04. No se agrega `aprobado`, `esperandoAprobacion`, `fechaAprobacion` ni `aprobadoPor`; «Aprobado», «En preparación» y «Proyecto completo» implican aprobación. *Alternativa descartada:* un flag independiente, porque duplicaría información y contradice la decisión del estudiante y RP-17.
2. **Operaciones dedicadas en el dominio.** `aprobarProyecto(id)` y `rechazarProyecto(id)` en `src/dominio/proyectos.ts` leerán el proyecto, exigirán `estado === "Pendiente de aprobación"` y ejecutarán un `UPDATE` de una sola columna. El rol se valida en la ruta con `requiereRol(["Supervisor de Proyectos"])` (HU-01 CA3/RP-16), y el estado se valida otra vez en dominio para resistir peticiones directas. *Alternativa descartada:* un genérico `cambiarEstado(id, estado)`, que permitiría transiciones no previstas por EST-04.
3. **Pantalla separada.** `GET /aprobaciones` lista proyectos (cliente, código, estado) y `POST /aprobaciones/:id/aprobar` y `POST /aprobaciones/:id/rechazar` ejecutan las acciones, protegidas para el Supervisor. Los botones solo se ofrecen en «Pendiente de aprobación». *Alternativa descartada:* ampliar `/proyectos` al Supervisor, porque relajaría las restricciones de HU-02/HU-06 y mezclaría las funciones del Encargado.
4. **Rol de demostración.** Se agrega `"Supervisor de Proyectos"` a `ROLES_DEMO` y a `funcionesPorRol` con «Aprobar o rechazar proyecto (HU-12)». El contexto de acceso y el layout ya leen esas listas, por lo que no hace falta un mecanismo de autenticación nuevo. *Alternativa descartada:* un rol oculto por URL, que no cumpliría HU-01 CA1 ni DSS-03.
5. **Guarda de inyección.** `inyectarPiezasDesdePlano` exige `estado === "Aprobado"`; con «Pendiente de aprobación» o «Rechazado» devuelve un rechazo sin insertar piezas ni cambiar el estado (HU-03 CA4). La vista `proyectos.ejs` muestra el botón solo en «Aprobado», para el Encargado, con partes definidas y cero piezas. *Alternativa descartada:* comprobar solo la ausencia de piezas, que permitiría inyectar en un proyecto rechazado.
6. **Aviso de HU-06 por ausencia de piezas.** `proyectoEstaSinPiezas` deja de comparar con «Sin piezas cargadas» y usa «Pendiente de aprobación» o «Rechazado»; el selector de Parte sigue filtrando por `EXISTS` sobre `piezas`. *Alternativa descartada:* mantener el estado eliminado, que ya no existe en EST-04.
7. **Migración 007 aditiva y conversión defensiva.** No se reescribe `002_proyectos.sql`. La migración 007 reconstruye la tabla `proyectos` para fijar `DEFAULT 'Pendiente de aprobación'` y convierte solo las filas «Sin piezas cargadas»: sin `piezas` asociadas → «Pendiente de aprobación»; con piezas → «En preparación» (aprobación implícita). Las demás filas permanecen intactas. *Alternativa descartada:* cambiar solo el código de inserción, que dejaría un `DEFAULT` obsoleto para cualquier inserción futura fuera de la aplicación.
8. **Mensajes de rechazo.** El Gherkin de HU-12 no fija textos literales, así que se usarán mensajes claros y coherentes con el vocabulario del dominio; se conserva literalmente el mensaje de HU-02 CA3/HU-04 ya existente. *Alternativa descartada:* inventar reglas o códigos de error nuevos no documentados.

## Risks / Trade-offs

- **[Reconstrucción de tabla con claves foráneas]** → SQLite no permite `ALTER COLUMN DEFAULT`, y `DROP TABLE proyectos` con `foreign_keys = ON` dispara `ON DELETE CASCADE` sobre `partes_casa` y `piezas`. `conexion.ts` desactiva `foreign_keys` antes de `BEGIN`, ejecuta la migración, valida `PRAGMA foreign_key_check` y reactiva `foreign_keys` en `finally`. Renombrar la tabla con `legacy_alter_table` no basta: SQLite sigue la referencia interna y también borra los hijos. Se probó primero sobre una copia temporal con filas en el estado eliminado.
- **[Datos históricos con piezas pero sin aprobación explícita]** → Se convierten a «En preparación» para no bloquear proyectos ya operativos; es la aprobación implícita acordada. Se documenta en la ficha y en la migración.
- **[Doble comprobación de rol y estado]** → La ruta y el dominio repiten guardas; es deliberado para defender peticiones directas (CA4 y HU-01 CA3). Se cubre con pruebas de petición directa.
- **[Selector de rol manipulable]** → Es una demo sin autenticación real; CA4 se verifica por cookie/contexto, no por identidad. Queda registrado como supuesto de HU-01.
- **[Pruebas con expectativas del ciclo viejo]** → Los archivos `tests/hu-02`, `hu-03`, `hu-04` y `hu-06` deben actualizarse en el mismo cambio; de lo contrario fallarán aunque el código esté correcto.
- **[Sin auditoría de aprobación]** → No se podrá responder quién ni cuándo aprobó; es una decisión confirmada del estudiante, no un defecto.

## Migration Plan

1. Verificar el estado actual de `data/app.db` y hacer una copia de seguridad antes de ejecutar migraciones.
2. Agregar `src/db/migrations/007_estado_aprobacion_proyecto.sql`:
   - crear `proyectos_nueva` con el mismo esquema y `estado TEXT NOT NULL DEFAULT 'Pendiente de aprobación'`;
   - copiar filas con `CASE` solo para `estado = 'Sin piezas cargadas'`, según existan o no piezas;
   - `DROP TABLE proyectos` y `ALTER TABLE proyectos_nueva RENAME TO proyectos`, conservando `UNIQUE (codigo)` y `sqlite_sequence`.
3. Ajustar `src/db/conexion.ts`: desactivar `foreign_keys` antes de `BEGIN` de cada migración, verificar `PRAGMA foreign_key_check` antes de `COMMIT` y reactivar `foreign_keys` en `finally`. El cargador ya aplica migraciones pendientes en orden y registra cada nombre en `schema_migrations`.
4. Ejecutar `npm test` con la base real y con una base temporal para comprobar que no hay regresiones y que un proyecto nuevo nace «Pendiente de aprobación».
5. Rollback: no existe reversión automática; restaurar la copia de `data/app.db` y retirar la fila de `schema_migrations` si se necesita repetir la migración en desarrollo.

## Open Questions

- Ninguna. Las cinco preguntas de validación de HU-12, el rol, la pantalla `/aprobaciones`, la migración 007 y el aviso de HU-06 fueron confirmados por el estudiante el 2026-11-26. Los mensajes literales no definidos por el Gherkin se tratan como decisión de implementación (decisión 8).
