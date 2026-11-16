# SnapSip

Aplicación web sencilla del proyecto **SnapSip** (CIN 324 — Ingeniería de Requisitos), generada historia por historia a partir de la documentación del repositorio.

## Estado actual
- **HU-01 — Autenticación de usuarios** implementada (cambio OpenSpec: `hu-01-autenticacion-usuarios`).
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
Las migraciones se aplican automáticamente al iniciar la aplicación. Para cargar los datos de ejemplo (roles de demostración) de forma explícita:
```bash
npm run db:seed
```

## Ejecutar la aplicación
```bash
npm run dev
```
Luego abre: **http://localhost:3000**

- Selecciona o cambia el **rol de demostración** en la pantalla principal.
- Ejemplo protegido (HU-01/CA3): `/operaciones/despacho/ejemplo` (solo *Encargado de Despacho*).

## Correr las pruebas
```bash
npm test
```
Las pruebas usan una base SQLite temporal y cubren los escenarios definidos para HU-01 (acceso por rol, rechazo sin rol, rechazo por rol no autorizado sin modificar datos, y cambio de rol).

## Estructura relevante
- `src/app.ts` — crea la app Express (sin escuchar)
- `src/server.ts` — arranque del servidor
- `src/db/` — conexión, migraciones (`migrations/`) y seed
- `src/integraciones/` — interfaces y adaptadores simulados (p. ej. `ServicioAutenticacionSimulado`)
- `src/rutas/`, `src/vistas/`, `src/middleware/`, `src/acceso/` — lógica y UI de HU-01
- `tests/` — pruebas automatizadas por escenario (`HU-01 · ...`)
- `openspec/changes/hu-01-autenticacion-usuarios/` — propuesta, specs, diseño y tareas del cambio

## Notas de trazabilidad
- HU-01 / CU-01 / Actividad TO-BE: *Autenticación de usuarios* (DSS-03 como referencia, adaptado a selector de rol de demostración).
- No se implementan requisitos no funcionales (RP-13, RP-14, RP-15a, RP-15b) ni autenticación real. CA2 (credenciales inválidas) no es aplicable literalmente en esta demo; ver `.cin324/historias/HU-01.md` y `openspec/changes/hu-01-autenticacion-usuarios/specs/`.
