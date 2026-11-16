## 1. Estructura del proyecto y dependencias (HU-01, primera historia)

- [x] 1.1 Inicializar proyecto Node.js/TypeScript (`package.json`, `tsconfig.json`) con scripts: `dev` (tsx), `build` si aplica, `test` (Vitest), `db:seed`.
- [x] 1.2 Agregar dependencias: `express`, `ejs`, `better-sqlite3` y tipos/dev (`typescript`, `tsx`, `vitest`, `supertest`, `@types/express`, `@types/better-sqlite3`, `@types/supertest`, `@types/node` según corresponda).
- [x] 1.3 Crear estructura base: `src/app.ts` (app Express exportada sin escuchar), `src/server.ts`, `src/db/`, `src/integraciones/`, `src/rutas/`, `src/vistas/`, `src/dominio/` (si aplica), `tests/`, `data/` (o ruta de BD).

## 2. Base de datos, migraciones y datos de ejemplo

- [x] 2.1 Implementar conexión SQLite y aplicación automática de migraciones SQL numeradas en `src/db/migrations/`, registrando ejecuciones en `schema_migrations`.
- [x] 2.2 Crear migración(es) de soporte para HU-01 si corresponde (p. ej. tabla de usuarios/roles de demostración como dato de apoyo, sin modelar entidad del dominio de SnapSip).
- [x] 2.3 Implementar script de seed idempotente (`src/db/seed.ts` y/o `npm run db:seed`) con datos de ejemplo de roles de demostración: *Operario de Bodega* y *Encargado de Despacho*.

## 3. Integración externa simulada (CU-01 / DSS-03)

- [x] 3.1 Definir interfaz `ServicioAutenticacion` y mensajes acordes a CU-01/DSS-03 (verificación de credenciales/identidad) en `src/integraciones/`.
- [x] 3.2 Implementar `ServicioAutenticacionSimulado` como adaptador simulado (registrable en log/consola o tabla de apoyo si se decide), sin autenticación real; documentar que bajo Opción 2 no participa en el flujo principal.

## 4. Lógica de acceso por rol de demostración (HU-01)

- [x] 4.1 Implementar manejo de contexto de acceso/rol de demostración (p. ej. sesión/cookie simple) y utilidades para obtener rol activo.
- [x] 4.2 Implementar middleware/guard de autorización por rol que habilite funciones según rol y rechace operaciones protegidas no autorizadas **sin modificar datos** (CA3), con mensajes claros.
- [x] 4.3 Definir y exponer al menos una operación/ruta protegida de ejemplo asociada a un rol (placeholder para historias futuras) para verificar CA3.

## 5. Interfaz web (EJS) y rutas

- [x] 5.1 Crear layout/vistas EJS con selector de rol de demostración visible (Operario de Bodega / Encargado de Despacho) y estado de acceso actual.
- [x] 5.2 Implementar `GET /` (o `/acceso`) para mostrar selector/acceso y funciones habilitadas según rol activo (o indicación de seleccionar rol).
- [x] 5.3 Implementar `POST /acceso/rol` (o ruta equivalente) para establecer/cambiar el rol de demostración y actualizar las funciones habilitadas (incluye cambio de rol).
- [x] 5.4 Asegurar que el acceso a funciones protegidas sin rol establecido no conceda acceso y solicite establecer un rol de demostración.

## 6. Pruebas automatizadas (Vitest + supertest)

- [x] 6.1 Configurar entorno de pruebas con base SQLite en memoria o temporal y seed de datos de demo.
- [x] 6.2 Prueba `HU-01 · Acceso concedido al seleccionar un rol de demostración (adaptación de CA1)`: al seleccionar un rol válido, el sistema concede acceso y habilita únicamente las funciones autorizadas para ese rol.
- [x] 6.3 Prueba `HU-01 · No se concede acceso sin rol de demostración establecido (CA2 adaptado en demo)`: sin rol establecido, el intento de acceder a función protegida no concede acceso y solicita establecer un rol.
- [x] 6.4 Prueba `HU-01 · Rechazo de una operación no autorizada para el rol (CA3)`: usuario con rol sin autorización solicita operación protegida; el sistema rechaza y conserva los datos sin modificaciones.
- [x] 6.5 Prueba `HU-01 · Cambio de rol de demostración`: al cambiar el rol activo, el contexto y las funciones habilitadas se actualizan según el nuevo rol.
- [x] 6.6 Ejecutar la suite de pruebas y corregir fallos hasta que todas las pruebas de HU-01 pasen.

## 7. Documentación y cierre de la historia

- [x] 7.1 Actualizar `README.md` con cómo instalar dependencias, preparar/cargar datos de ejemplo, ejecutar la aplicación (URL) y correr las pruebas; indicar que la autenticación es un selector de rol de demostración y que el Servicio de autenticación está simulado/omitido según la ficha.
- [x] 7.2 Verificar trazabilidad en código/comentarios breves donde aplique (`HU-01`, `CU-01`, `TO-BE Autenticación de usuarios`) sin modificar artefactos del curso.
