## Why

SnapSip (CIN 324) requiere una base de control de acceso para que Operario de Bodega y Encargado de Despacho accedan únicamente a las funciones que corresponden a su rol. Este cambio implementa **HU-01 — Autenticación de usuarios** (actividad TO-BE: *Autenticación de usuarios*, **CU-01 — Autenticarse**, secuencia de referencia **DSS-03**), estableciendo el contexto de acceso necesario para las historias posteriores (p. ej. HU-02) de forma coherente con la regla del taller.

## What Changes

- Incorporar un **mecanismo de acceso de demostración mediante selector de rol** (Operario de Bodega / Encargado de Despacho), sin autenticación real ni ingreso de credenciales, conforme a la regla del taller.
- Al establecer el rol de demostración, **habilitar únicamente las funciones/proyectos autorizados** para ese rol (adaptación verificable de CA1).
- **Rechazar solicitudes de operaciones protegidas no autorizadas** para el rol activo, sin modificar datos (CA3).
- Permitir **cambiar el rol de demostración** para simular otro perfil y actualizar las funciones habilitadas.
- Incluir datos/identidades de demostración como soporte (seed/configuración simple), sin modelarlos como entidades del dominio de SnapSip.
- Tratar el **Servicio de autenticación** documentado (CU-01/DSS-03) como integración externa **simulada/omitida** en el flujo principal de esta demo (Opción 2).

## Capabilities

### New Capabilities
- `acceso-por-rol-demo`: control de acceso de demostración por rol (selector de rol Operario de Bodega/Encargado de Despacho), habilitación de funciones según rol y rechazo de operaciones no autorizadas sin modificar datos.

### Modified Capabilities
- (ninguna)

## Impact

- **Código (a crear en implementación):** estructura inicial de la aplicación web (TypeScript + Express + EJS), selector/contexto de rol en la interfaz, lógica de autorización por rol, datos de ejemplo de roles/usuarios demo, pruebas automatizadas por escenario aplicable y documentación de ejecución.
- **APIs/rutas:** endpoints o rutas necesarias para establecer/cambiar el rol de demostración y proteger operaciones según rol (detalle en `design.md`).
- **Datos:** soporte SQLite para datos de demo si corresponde (no entidades del dominio); migraciones/seed según `tasks.md`.
- **Sistemas externos:** Servicio de autenticación (CU-01/DSS-03) considerado simulado/omitido en esta implementación de demo.
- **Fuera de alcance:** autenticación real, gestión de credenciales/contraseñas y cumplimiento de requisitos no funcionales (RP-13, RP-14, RP-15a, RP-15b); CA2 (credenciales inválidas) no es aplicable literalmente bajo el selector de rol de demostración (desviación documentada en la ficha); funcionalidades de negocio de HU-02…HU-11 (solo se sientan bases de acceso/rol).
