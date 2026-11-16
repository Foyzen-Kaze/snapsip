# SnapSip

Aplicación web sencilla del proyecto **SnapSip** (CIN 324 — Ingeniería de Requisitos), generada historia por historia a partir de la documentación del repositorio.

## Estado actual
- **HU-01 — Autenticación de usuarios** implementada (cambio OpenSpec archivado: `hu-01-autenticacion-usuarios`).
- **HU-02 — Crear proyecto** implementada (cambio OpenSpec: `hu-02-crear-proyecto`).
- Acceso mediante **selector de rol de demostración** (*Operario de Bodega* / *Encargado de Despacho*), **sin autenticación real** ni credenciales (regla del taller). El **Servicio de autenticación** documentado (CU-01/DSS-03) se considera **simulado/omitido** en el flujo principal de esta demo (adaptador declarado en `src/integraciones/`).
- Base de datos: **SQLite** (`data/app.db` por defecto), migraciones SQL numeradas en `src/db/migrations/` (registro en `schema_migrations`).

## Requisitos
- Node.js 20+ (probado con versiones recientes)
- npm

## Instalación
```bash
npm install
```

## Preparar / cargar datos de ejemplo
Las migraciones se aplican automáticamente al iniciar la aplicación. Para cargar los datos de ejemplo (roles de demostración, HU-01) de forma explícita:
```bash
npm run db:seed
```

## Ejecutar la aplicación
```bash
npm run dev
```
Luego abre: **http://localhost:3000**

- Selecciona o cambia el **rol de demostración** en la pantalla principal.
- **HU-01 (CA3, ejemplo protegido):** `/operaciones/despacho/ejemplo` (solo *Encargado de Despacho*).
- **HU-02 (Crear proyecto, CU-02, solo *Encargado de Despacho*):** `/proyectos/nuevo` (formulario) y `/proyectos` (listado de proyectos registrados). El proyecto se registra con `cliente`, `codigo` y `metraje`, en estado **"Sin piezas cargadas"**, sin partes de la casa ni piezas.

## Correr las pruebas
```bash
npm test
```
Las pruebas usan una base SQLite temporal y cubren los escenarios definidos para:
- **HU-01:** acceso por rol, rechazo sin rol, rechazo por rol no autorizado sin modificar datos, y cambio de rol.
- **HU-02:** creación de proyecto con código único (CA1), rechazo por código duplicado conservando el existente (CA2) y condición de proyecto en "Sin piezas cargadas" sin partes/piezas (CA3; la interacción de rechazo al crear torre se implementará en HU-04).

## Estructura relevante
- `src/app.ts` — crea la app Express (sin escuchar)
- `src/server.ts` — arranque del servidor
- `src/db/` — conexión, migraciones (`migrations/`) y seed
- `src/dominio/` — lógica de dominio (p. ej. `proyectos.ts`, HU-02)
- `src/integraciones/` — interfaces y adaptadores simulados (p. ej. `ServicioAutenticacionSimulado`)
- `src/rutas/`, `src/vistas/`, `src/middleware/`, `src/acceso/` — rutas, vistas, autorización y acceso por rol
- `tests/` — pruebas automatizadas por escenario (`HU-01 · ...`, `HU-02 · ...`)
- `openspec/` — cambios y especificaciones OpenSpec

## Notas de trazabilidad
- HU-01 / CU-01 / Actividad TO-BE: *Autenticación de usuarios* (DSS-03 como referencia, adaptado a selector de rol de demostración).
- HU-02 / CU-02 / Actividad TO-BE: *Crear proyecto* (RP-02). Sin diagrama de secuencia ni de estado propio de Proyecto; CA3 deja la condición para HU-04.
- No se implementan requisitos no funcionales (RP-13, RP-14, RP-15a, RP-15b) ni autenticación real. CA2 de HU-01 no es aplicable literalmente en esta demo; ver `.cin324/historias/HU-01.md`, `.cin324/historias/HU-02.md` y los artefactos en `openspec/`.
