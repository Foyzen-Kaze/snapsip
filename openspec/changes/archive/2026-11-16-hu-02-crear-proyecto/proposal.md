## Why

SnapSip necesita que el Encargado de Despacho registre proyectos de clientes para iniciar el control del universo de piezas de cada casa. Este cambio implementa **HU-02 — Crear proyecto** (actividad TO-BE: *Crear proyecto*, **CU-02 — Crear proyecto**, RP-02), estableciendo el registro base del proyecto en estado inicial para habilitar las historias posteriores (HU-03, HU-04), sobre el acceso por rol de demostración ya disponible (HU-01).

## What Changes

- Agregar la capacidad de **registrar un nuevo proyecto** (cliente, código, metraje) restringida al rol de demostración **Encargado de Despacho** (HU-01).
- Validar que los campos `cliente`, `codigo` y `metraje` sean obligatorios y que el `codigo` sea **único**; rechazar códigos duplicados informando el motivo y conservando el proyecto existente sin modificaciones (CA2).
- Al registrar con éxito, crear el **`Proyecto`** asociado al cliente, conservando código y metraje, en estado **"Sin piezas cargadas"** y sin partes de la casa ni piezas registradas (CA1).
- Incorporar persistencia en SQLite (migración y acceso a datos) y pantallas/rutas para crear y visualizar el resultado del registro, con mensajes claros en español.
- Dejar representable la condición de CA3 (proyecto en "Sin piezas cargadas", sin partes/piezas) como base para que **HU-04** rechace la creación de torres antes de inyectar piezas.

## Capabilities

### New Capabilities
- `crear-proyecto`: registro de proyectos por el Encargado de Despacho, con validación de código único y estado inicial "Sin piezas cargadas" sin partes ni piezas (HU-02, CU-02, RP-02).

### Modified Capabilities
- (ninguna)

## Impact

- **Código:** nuevas rutas/controladores y vistas EJS para crear proyectos; lógica de validación y persistencia del dominio `Proyecto`; uso del middleware/guards de acceso por rol existentes (HU-01).
- **Base de datos:** nueva migración SQL en `src/db/migrations/` para la tabla de proyectos (derivada del modelo de dominio) registrada en `schema_migrations`; datos de ejemplo/seed si aplica.
- **Pruebas:** nuevas pruebas automatizadas (Vitest + supertest) por cada escenario Gherkin de HU-02.
- **Documentación:** actualización de `README.md` (instalar, ejecutar, probar) y registro del cambio en OpenSpec.

**Fuera de alcance (explícito):**
- HU-03 a HU-11 (inyección de piezas, creación/gestión de torres, asignaciones, guías, envíos, evidencias, etc.). La **interacción de rechazo de creación de torre** de CA3 se implementa en **HU-04**; HU-02 solo garantiza el estado/condición inicial del proyecto.
- Requisitos no funcionales (RP-13, RP-14, RP-15a, RP-15b) y **autenticación real** (se mantiene selector de rol de demostración, HU-01).
- Integraciones con sistemas externos (no aplica a CU-02; no se simulan servicios externos en este cambio).
- Cambios a los artefactos del curso (historias, Gherkin, modelo, casos de uso, diagramas).