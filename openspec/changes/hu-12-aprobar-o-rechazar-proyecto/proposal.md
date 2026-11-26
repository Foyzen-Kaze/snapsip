## Why

Los proyectos se registran hoy en un estado que ya no existe en los artefactos («Sin piezas cargadas») y cualquier Encargado de Despacho puede inyectar piezas sin control previo. La decisión acordada el 2026-11-26 y la ficha confirmada `.cin324/historias/HU-12.md` exigen que el proyecto nazca «Pendiente de aprobación» y que solo el **Supervisor de Proyectos** pueda autorizarlo o rechazarlo (HU-12, actividad TO-BE «Crear proyecto», CU-12). Sin este cambio, el código, las pruebas, los datos y las especificaciones vigentes contradicen EST-04, RP-17 y el Gherkin de HU-02/HU-03/HU-12.

## What Changes

- **BREAKING (HU-12, CU-12):** nueva capacidad para aprobar o rechazar proyectos en estado «Pendiente de aprobación». Aprobar lleva el proyecto a **«Aprobado»** y habilita la inyección; rechazar lo lleva a **«Rechazado»**, estado terminal que bloquea la inyección. CA3 y CA4 rechazan la solicitud sin modificar datos. **No se crea ningún campo de aprobación**: «Aprobado», «En preparación» y «Proyecto completo» implican que el proyecto fue aprobado.
- **BREAKING (HU-02/CU-02, RP-02):** el proyecto se crea en **«Pendiente de aprobación»**, con las cinco `ParteCasa` previstas y cero `Pieza`, en lugar de «Sin piezas cargadas», que se elimina.
- **BREAKING (HU-03/CU-03, RP-03):** la inyección de piezas solo se ofrece y se acepta desde **«Aprobado»**; desde «Pendiente de aprobación» o «Rechazado» se rechaza sin registrar piezas ni cambiar el estado (HU-03 CA4).
- **HU-02 CA3 / HU-04:** la creación de torre se rechaza mientras no exista universo de piezas («Pendiente de aprobación», «Aprobado» o «Rechazado» sin piezas).
- **HU-06 CA6:** se conserva el aviso de proyecto sin piezas, disparado por ausencia de piezas en «Pendiente de aprobación» o «Rechazado», sin inventar un estado nuevo.
- **HU-01/CU-01 y RP-16:** se agrega el rol **Supervisor de Proyectos** al selector de rol de demostración y a la matriz de permisos, con la función «Aprobar o rechazar proyecto (HU-12)». El Supervisor accede a una pantalla propia `/aprobaciones`; `/proyectos` sigue restringido al Encargado de Despacho.
- **Persistencia:** migración **007 aditiva** que cambia el `DEFAULT` de `proyectos.estado` a «Pendiente de aprobación» y convierte defensivamente filas antiguas: sin piezas → «Pendiente de aprobación»; con piezas → «En preparación». No se reescribe la migración 002, no se borra ni se reinicia la base de datos.
- Se retira «Sin piezas cargadas» del código, las pruebas y los datos vigentes; los cambios OpenSpec archivados y `Inconsistencias.md` se conservan como registro histórico.

## Capabilities

### New Capabilities
- `aprobacion-proyecto`: aprobación y rechazo de proyectos por el Supervisor de Proyectos (HU-12, CU-12, RP-17, EST-04), con transiciones desde «Pendiente de aprobación», rechazos sin modificar datos y aprobación implícita en los estados posteriores.

### Modified Capabilities
- `acceso-por-rol-demo`: incluye al Supervisor de Proyectos como rol de demostración y habilita su función de aprobación/rechazo (HU-01 CA1/CA3, RP-16).
- `crear-proyecto`: estado inicial «Pendiente de aprobación» y cero piezas (HU-02 CA1, RP-02, EST-04).
- `inyectar-piezas`: inyección únicamente desde «Aprobado» y rechazo sin cambios desde «Pendiente de aprobación» o «Rechazado» (HU-03 CA1/CA4, RP-03, EST-04).
- `crear-torre`: rechazo de torres cuando el proyecto aún no tiene universo de piezas, con los nuevos estados del ciclo (HU-02 CA3, HU-04, RP-04).
- `consulta-piezas-pendientes`: aviso de ausencia de piezas según los estados vigentes de `Proyecto` (HU-06 CA6).

## Impact

- **Dominio:** `src/dominio/proyectos.ts` (estado inicial y operaciones de aprobación/rechazo con guardas de estado y rol), `src/dominio/piezas.ts` (guarda «Aprobado»), `src/dominio/pendientes.ts` (aviso por ausencia de piezas).
- **Acceso:** `src/acceso/roles.ts` (nuevo rol y función), `src/middleware/contextoAcceso.ts` y layout EJS (selector de rol).
- **Rutas y vistas:** nueva ruta `GET /aprobaciones` y `POST /aprobaciones/:id/aprobar` / `POST /aprobaciones/:id/rechazar`, protegidas para el Supervisor; vista `aprobaciones.ejs`; ajuste de `proyectos.ejs` para mostrar el botón de inyección solo en «Aprobado»; `torres` y `pendientes` conservan sus restricciones.
- **Base de datos:** nueva `src/db/migrations/007_estado_aprobacion_proyecto.sql`; `002_proyectos.sql` queda intacta; `data/app.db` se convierte de forma aditiva al aplicar migraciones.
- **Pruebas:** actualización de `tests/hu-02.crear-proyecto.test.ts`, `hu-03.inyectar-piezas.test.ts`, `hu-04.crear-torre.test.ts` y `hu-06.consultar-piezas-pendientes.test.ts`, más nuevas pruebas de HU-12 (CA1–CA4) y del rol Supervisor.
- **Documentación vigente:** specs principales de las capacidades modificadas y README ya alineados en este ciclo; la ficha `HU-12.md` y `.cin324/proyecto.md` registran la decisión.

**Fuera del alcance:** actividad BPMN nueva, DSS propio, autenticación real, campos de auditoría de aprobación, revertir un proyecto rechazado, inyectar piezas o crear torres, generar guías y requisitos no funcionales.
