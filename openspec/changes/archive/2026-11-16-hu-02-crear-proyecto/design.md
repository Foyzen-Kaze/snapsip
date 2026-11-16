## Context

- **Cambio:** `hu-02-crear-proyecto` para **HU-02 — Crear proyecto** (actividad TO-BE: *Crear proyecto*, **CU-02 — Crear proyecto**, RP-02). Insumo: `.cin324/historias/HU-02.md` (confirmada 2026-11-16).
- **Estado actual:** HU-01 implementada y archivada. Existe acceso por selector de rol de demostración (HU-01, `acceso-por-rol-demo`), app Express+EJS, SQLite con migraciones (`src/db/migrations/`, `schema_migrations`) y utilidades de BD/pruebas (`src/db/conexion.ts`, `reiniciarBdParaPruebas`), middleware/guards de rol (`src/middleware/contextoAcceso.ts`), y operación protegida de ejemplo.
- **Stack confirmado:** TypeScript + Node.js (Express) + EJS, SQLite (`better-sqlite3` en dependencias; conexión actual vía `node:sqlite`), Vitest + supertest.
- **Restricciones del taller:** app web sencilla, SQLite, sin microservicios, **sin autenticación real** (selector de rol de demostración), sin RNF, sistemas externos simulados; una historia por cambio.
- **Modelo de dominio:** HU-02 gestiona la entidad **`Proyecto`** (`codigo`, `cliente`, `metraje`, `estado`: *Sin piezas cargadas*, *En preparación*, *Proyecto completo*). Al crear: asociado al cliente, en *"Sin piezas cargadas"*, sin `ParteCasa` ni `Pieza`. No hay diagrama de estado propio de Proyecto.
- **Secuencia:** CU-02 no tiene DSS propio (`12-trazabilidad.md`); el flujo se deriva de HU/CA/CU (formulario/solicitud → validación código único y datos obligatorios → registro o rechazo con mensaje, sin modificar existentes en duplicado).

## Goals / Non-Goals

**Goals:**
- Permitir al rol **Encargado de Despacho** registrar un `Proyecto` con `cliente`, `codigo` y `metraje` (obligatorios).
- Garantizar unicidad de `codigo`: rechazar duplicados con mensaje claro y sin modificar el proyecto existente (CA2).
- Persistir el proyecto en estado **"Sin piezas cargadas"** sin partes ni piezas (CA1), dejando la condición de CA3 representable para HU-04.
- Proveer interfaz web (EJS) y rutas protegidas por rol, coherentes con HU-01.
- Cubrir con pruebas automatizadas los escenarios Gherkin de HU-02.

**Non-Goals:**
- Implementar HU-03 a HU-11 (inyección de piezas, torres, guías, envíos, evidencias, etc.). La interacción de rechazo de creación de torre (CU-04) es responsabilidad de **HU-04**.
- Autenticación real, gestión de usuarios/credenciales, o requisitos no funcionales (RP-13, RP-14, RP-15a, RP-15b).
- Integraciones con sistemas externos (CU-02 no las requiere); no se simulan servicios externos en este cambio.
- Modificar artefactos del curso.

## Decisions

- **Persistencia (`Proyecto`)**: tabla `proyectos` derivada del modelo de dominio. Columnas propuestas: `id` (PK autoincrement), `codigo` (TEXT NOT NULL UNIQUE), `cliente` (TEXT NOT NULL), `metraje` (TEXT/NUMERIC NOT NULL según representación simple), `estado` (TEXT NOT NULL, valor inicial `"Sin piezas cargadas"`). Restricción de unicidad en BD además de validación en aplicación (defensa ante condición de carrera; coherente con CA2). No se crean tablas de `ParteCasa`/`Pieza` en HU-02.
  - *Alternativa considerada:* validar unicidad solo en aplicación; se descarta por menor robustez.
- **Rutas/flujo (derivado de CU-02/HU, sin DSS):** 
  - `GET /proyectos/nuevo` (protegida, rol **Encargado de Despacho**): formulario de creación.
  - `POST /proyectos` (protegida, rol **Encargado de Despacho**): procesa solicitud de crear proyecto; en éxito redirige/muestra confirmación con datos y estado; en duplicado o datos faltantes responde con rechazo y mensaje sin modificar datos existentes. 
  - (Opcional de apoyo) `GET /proyectos` listado simple para evidenciar proyectos registrados y su estado; si se incluye, protegido para Encargado de Despacho.
  - *Alternativa:* ruta única; se prefiere separación GET/POST por claridad web.
- **Autorización:** reutilizar `requiereRol(["Encargado de Despacho"])` y comportamiento de HU-01 (rechazo sin modificar datos si rol no autorizado/sin rol).
- **Validación de campos obligatorios:** `cliente`, `codigo`, `metraje` requeridos y no vacíos (tras trim). `metraje` se acepta como valor informado (texto/número) acorde al dato del dominio; sin reglas adicionales no especificadas.
- **CA3 (alcance):** HU-02 no expone CU-04. Se garantiza `estado = "Sin piezas cargadas"` y ausencia de partes/piezas (por diseño no existen). La prueba del escenario CA3 verificará que, dado un proyecto creado, el sistema lo mantiene en estado "Sin piezas cargadas" sin partes de la casa ni piezas registradas, condición previa que HU-04 utilizará para rechazar la creación de torres; la verificación de la interacción de rechazo de torre se difiere a HU-04 (se documenta en la prueba/tareas).
- **Integraciones externas:** ninguna requerida para CU-02; no se declaran adaptadores simulados nuevos.

## Risks / Trade-offs

- **[CA3 cruza HU-04]** El escenario Gherkin menciona la solicitud de crear torre (HU-04). → Mitigación: HU-02 implementa y prueba el estado/condición ("Sin piezas cargadas", sin partes/piezas) y documenta que el rechazo de la operación de torre corresponde a HU-04.
- **[Divergencia `better-sqlite3` vs `node:sqlite`]** La conexión actual usa `node:sqlite` por entorno. → Mitigación: mantener consistencia con la implementación existente de HU-01 (`src/db/conexion.ts`), sin cambiar el enfoque de BD en este cambio.
- **[Unicidad de código con espacios/mayúsculas]** No especificado en requisitos. → Mitigación: comparación directa del valor almacenado/ingresado (tras trim) según lo indicado; no se inventan reglas de normalización.

## Migration Plan

- Agregar migración numerada (p. ej. `002_proyectos.sql`) que cree la tabla `proyectos` con unicidad de `codigo` y estado inicial por defecto `"Sin piezas cargadas"` si aplica.
- Las migraciones se aplican automáticamente al abrir la BD (mecanismo existente). Seed: no obligatorio; puede añadirse dato de ejemplo solo si facilita pruebas/manual, sin alterar comportamiento.
- **Rollback:** revertir cambios de código y, en entorno local de demo, recrear/eliminar el archivo SQLite si es necesario (app de taller, sin migración down formal).

## Open Questions

- Ninguna bloqueante para HU-02 (puntos 1–5 confirmados en la ficha). Formato/validación adicional de `metraje` o `codigo` queda fuera de lo especificado; se tratan como campos obligatorios con valor informado.