## Context

- **Cambio:** `hu-01-autenticacion-usuarios` para **HU-01 — Autenticación de usuarios** (actividad TO-BE: *Autenticación de usuarios*, **CU-01 — Autenticarse**). Insumo: `.cin324/historias/HU-01.md` (confirmada 2026-11-16).
- **Estado actual:** repositorio con documentación de requisitos (BPMN, HU/Gherkin, modelo de dominio, CU, DSS, EST, trazabilidad) y sin código de aplicación ni estructura de proyecto inicial.
- **Stack confirmado:** TypeScript + Node.js (Express) + EJS, SQLite (`better-sqlite3`), Vitest + supertest. Migraciones SQL numeradas en `src/db/migrations`, registradas en `schema_migrations`.
- **Restricciones del taller:** app web sencilla, SQLite, sin microservicios, **sin autenticación real (selector de rol de demostración)**, sistemas externos simulados, no implementar requisitos no funcionales (RP-15b, etc.).
- **Modelo de dominio:** HU-01 no gestiona entidades del dominio (Proyecto, ParteCasa, Pieza, Torre, GuiaDespacho, Evidencia). No hay diagramas de estado aplicables.
- **Secuencia de referencia:** DSS-03 (autenticación delegada a Servicio de autenticación). Bajo Opción 2, el flujo se adapta a selector de rol.

## Goals / Non-Goals

**Goals:**
- Establecer el contexto de acceso por rol de demostración (*Operario de Bodega*, *Encargado de Despacho*) y habilitar funciones según rol.
- Proteger operaciones según rol y rechazar accesos no autorizados sin modificar datos (CA3).
- Permitir cambio de rol de demostración.
- Dejar base de estructura de app, persistencia/configuración de datos de demo y pruebas automatizadas para los escenarios aplicables de HU-01.
- Simular/abstraer el Servicio de autenticación documentado mediante un adaptador coherente con la demo (sin credenciales reales).

**Non-Goals:**
- Autenticación real, credenciales, contraseñas, hashing o cumplimiento de RP-15b.
- Implementación de CA2 como flujo de “contraseña incorrecta” (no aplicable en selector de rol; se cubre el rechazo de acceso sin rol válido).
- Gestión fina de “proyectos asignados” por usuario si no hay datos/proyectos aún (HU-02+).
- Requisitos no funcionales (RP-13, RP-14, RP-15a, RP-15b) y funcionalidades de negocio de HU-02…HU-11.

## Decisions

1. **Selector de rol de demostración como mecanismo de acceso (Opción 2, confirmada)**
   - **Decisión:** implementar una UI (p. ej. barra/selector en layout EJS) para elegir rol de demostración; el rol activo se mantiene en contexto de sesión (cookie/sesión de servidor simple) para todas las solicitudes.
   - **Rationale:** cumple la regla del taller (“sin autenticación real, usa un selector de rol de demostración”) y permite verificar CA1 (adaptado) y CA3.
   - **Alternativas:** (a) login con credenciales de demo + servicio simulado (Opción 1, descartada por decisión del estudiante); (b) rol fijo por configuración (no permite cambio de perfil).

2. **Autorización por rol en servidor**
   - **Decisión:** centralizar la verificación de rol en middleware/guard de Express que compruebe el rol activo antes de ejecutar operaciones protegidas; en caso de no autorizado, responder con rechazo claro y sin efectos sobre datos.
   - **Rationale:** garantiza CA3 aunque se intente invocar rutas directamente (alineado a RP-16 como comportamiento esperado, dentro de lo simple).
   - **Alternativas:** validación solo en UI (insuficiente).

3. **Rutas/pantallas derivadas de CU-01/DSS-03 (adaptadas)**
   - **Decisión:** 
     - `GET /` (o `/acceso`): pantalla inicial con selector de rol de demostración y estado de acceso actual.
     - `POST /acceso/rol` (o similar): establece/cambia el rol de demostración y redirige mostrando funciones habilitadas según rol.
     - Rutas/acciones protegidas de ejemplo (placeholders para historias futuras) para demostrar CA3; al menos una operación permitida para Encargado de Despacho y no para Operario (o viceversa) como caso verificable.
   - **Rationale:** traduce el flujo de interacción de la ficha y permite pruebas end-to-end con supertest.

4. **Datos de demostración y persistencia**
   - **Decisión:** no crear tablas de entidades del dominio en HU-01. Proveer roles/identidades de demo mediante seed/configuración (y tabla de apoyo simple en SQLite solo si facilita persistencia/consistencia, p. ej. `usuarios_demo` con rol, sin contraseñas reales), marcada como soporte y no como entidad del dominio.
   - **Rationale:** HU-01 no modifica el modelo de dominio; se necesitan datos de demo para operar el selector.
   - **Alternativas:** solo constantes en código (válido si basta; se preferirá seed si ya se inicializa SQLite).

5. **Servicio de autenticación simulado (integración externa documentada)**
   - **Decisión:** definir una interfaz `ServicioAutenticacion` y una implementación `ServicioAutenticacionSimulado` que represente la integración de CU-01/DSS-03; en Opción 2 puede no participar en el flujo principal, pero queda declarada y disponible (p. ej. para resolver rol/identidad de demo) y registrada como simulada.
   - **Rationale:** respeta trazabilidad con artefactos y regla “sistemas externos se simulan mediante adaptadores”.

6. **Estructura inicial del proyecto (primera historia)**
   - **Decisión:** crear esqueleto mínimo según stack: `src/app.ts`, `src/server.ts`, `src/db/*`, `src/integraciones/*`, `src/rutas/*`, `src/vistas/*`, `tests/*`, `package.json`, `tsconfig.json`, `README.md`, migraciones numeradas y `schema_migrations`.
   - **Rationale:** HU-01 es la primera historia implementada; tareas deben incluir estructura, datos de ejemplo y pruebas.

## Risks / Trade-offs

- **[Desviación CA1/CA2 respecto al Gherkin original]** → Mitigación: documentado en ficha/propuesta/specs como adaptación a Opción 2; pruebas cubrirán acceso por rol (CA1 adaptado), rechazo sin rol (sustituto práctico de acceso no concedido) y CA3.
- **[Sesión simple sin seguridad real]** → Mitigación: aceptado por regla del taller; no usar en producción.
- **[Falta de operaciones de negocio para demostrar CA3]** → Mitigación: incluir al menos una ruta/acción protegida de ejemplo claramente asociada a un rol (y documentada como placeholder) para verificar rechazo sin modificar datos.

## Migration Plan

- Aplicar migraciones SQL al iniciar/conectar (`schema_migrations`). Para HU-01 solo migraciones/seed de soporte necesarios (si los hay).
- Sin datos previos de aplicación; seed idempotente.
- Rollback: restaurar/eliminar archivo SQLite local de desarrollo si es necesario.

## Open Questions

- Ninguna bloqueante para planificación: detalles finos de nombres de rutas/plantillas y del caso de ejemplo para CA3 se concretarán en `tasks.md` e implementación, respetando esta decisión y la ficha confirmada.
