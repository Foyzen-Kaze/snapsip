## 1. Migración y datos
- [x] 1.1 Hacer una copia de seguridad de `data/app.db` y comprobar los estados actuales de `proyectos` antes de aplicar migraciones.
- [x] 1.2 Crear `src/db/migrations/007_estado_aprobacion_proyecto.sql` con reconstrucción aditiva de `proyectos`, `DEFAULT 'Pendiente de aprobación'` y copia de todas las columnas y restricciones existentes.
- [x] 1.3 Convertir solo las filas en «Sin piezas cargadas»: sin `piezas` → «Pendiente de aprobación»; con `piezas` → «En preparación»; dejar intactos los demás estados.
- [x] 1.4 Desactivar `PRAGMA foreign_keys` en `conexion.ts` antes de `BEGIN`, verificar `PRAGMA foreign_key_check` antes de `COMMIT` y reactivarlo en `finally`, conservando los hijos y la `UNIQUE` sobre una base temporal.
- [x] 1.5 Confirmar que `conexion.ts` registra la migración 007 en `schema_migrations` y que el proyecto existente («En preparación», 15 piezas) conserva su estado y sus piezas.

## 2. Rol Supervisor de Proyectos y control de acceso
- [x] 2.1 Agregar `"Supervisor de Proyectos"` a `ROLES_DEMO` en `src/acceso/roles.ts`.
- [x] 2.2 Agregar «Aprobar o rechazar proyecto (HU-12)» a `funcionesPorRol` solo para el Supervisor, sin darle las funciones de HU-02 ni HU-03.
- [x] 2.3 Verificar que el layout y `contextoAcceso.ts` muestran el nuevo rol y sus funciones al cambiar el selector, sin credenciales reales (HU-01 CA1 y DSS-03).

## 3. Dominio de aprobación y rechazo
- [x] 3.1 Agregar constantes de los cinco estados canónicos de EST-04 en `src/dominio/proyectos.ts`, eliminando «Sin piezas cargadas» como valor vigente.
- [x] 3.2 Cambiar `crearProyecto` para persistir el estado inicial «Pendiente de aprobación» con las `ParteCasa` ya creadas y cero `Pieza` (HU-02 CA1).
- [x] 3.3 Implementar `aprobarProyecto(id)` y `rechazarProyecto(id)` con guarda de `estado === "Pendiente de aprobación"`, actualización de una sola columna y resultado que distinga éxito, estado inválido y proyecto no encontrado.
- [x] 3.4 Confirmar que no se crean columnas ni campos de aprobación y que «Aprobado», «En preparación» y «Proyecto completo» implican aprobación.

## 4. Rutas y vistas de `/aprobaciones`
- [x] 4.1 Crear `src/rutas/aprobaciones.ts` con `GET /aprobaciones` protegido por `requiereRol(["Supervisor de Proyectos"])` y listado de proyectos por cliente, código y estado.
- [x] 4.2 Agregar `POST /aprobaciones/:id/aprobar` y `POST /aprobaciones/:id/rechazar` protegidos por el mismo rol, con rechazo sin modificar datos antes de llamar al dominio (HU-12 CA4).
- [x] 4.3 Crear `src/vistas/aprobaciones.ejs` con botones «Aprobar» y «Rechazar» solo para proyectos en «Pendiente de aprobación» y mensajes claros de resultado o rechazo (CA1–CA3).
- [x] 4.4 Registrar el nuevo router en `src/app.ts` y comprobar que `/proyectos` sigue restringido al Encargado de Despacho.

## 5. Ajuste del ciclo nuevo en el código vigente
- [x] 5.1 Cambiar la guarda de `inyectarPiezasDesdePlano` en `src/dominio/piezas.ts` para exigir «Aprobado» y rechazar «Pendiente de aprobación» o «Rechazado» sin insertar piezas ni cambiar el estado (HU-03 CA4).
- [x] 5.2 Actualizar `src/vistas/proyectos.ejs` para mostrar «Inyectar piezas desde plano/archivo» solo con el rol Encargado, estado «Aprobado», partes definidas y cero piezas.
- [x] 5.3 Actualizar `src/dominio/pendientes.ts` para disparar el aviso de HU-06 por ausencia de piezas en «Pendiente de aprobación» o «Rechazado», eliminando `ESTADO_SIN_PIEZAS_CARGADAS`.
- [x] 5.4 Verificar que `src/dominio/torres.ts` y la vista de torres siguen rechazando proyectos sin universo de piezas en «Pendiente de aprobación», «Aprobado» o «Rechazado» (HU-02 CA3 / HU-04).

## 6. Pruebas
- [x] 6.1 Preparar datos de ejemplo en una base SQLite temporal: proyecto «Pendiente de aprobación» con partes y cero piezas, proyecto «Aprobado», proyecto «Rechazado», proyecto «En preparación» con piezas y proyecto «Proyecto completo».
- [x] 6.2 Probar HU-12 CA1: el Supervisor aprueba un proyecto pendiente, queda «Aprobado» y el Encargado ve el botón de inyección.
- [x] 6.3 Probar HU-12 CA2: el Supervisor rechaza un proyecto pendiente, queda «Rechazado» y la inyección se rechaza sin modificar datos.
- [x] 6.4 Probar HU-12 CA3: aprobar o rechazar un proyecto «Aprobado», «Rechazado», «En preparación» o «Proyecto completo» se rechaza con el estado intacto.
- [x] 6.5 Probar HU-12 CA4: Operario, Encargado y petición sin rol son rechazados por `/aprobaciones` y por las rutas POST directas, sin modificar datos.
- [x] 6.6 Actualizar `tests/hu-02.crear-proyecto.test.ts` para esperar «Pendiente de aprobación», con partes creadas y cero piezas (CA1–CA4).
- [x] 6.7 Actualizar `tests/hu-03.inyectar-piezas.test.ts` para inyectar desde «Aprobado» y cubrir el rechazo sin cambios desde «Pendiente de aprobación» y «Rechazado» (CA4).
- [x] 6.8 Actualizar `tests/hu-04.crear-torre.test.ts` para el rechazo con los tres estados sin piezas y conservar la numeración y el mensaje vigente.
- [x] 6.9 Actualizar `tests/hu-06.consultar-piezas-pendientes.test.ts` para el aviso por ausencia de piezas en «Pendiente de aprobación» o «Rechazado» (CA6).
- [x] 6.10 Actualizar `tests/hu-05.asignar-pieza-con-evidencia.test.ts` para eliminar «Sin piezas cargadas» de sus datos de ejemplo, usando los estados vigentes de EST-04.
- [x] 6.11 Agregar en `tests/hu-01.acceso-por-rol.test.ts` una prueba que verifique que el rol *Supervisor de Proyectos* aparece en el selector de HU-01 y habilita «Aprobar o rechazar proyecto (HU-12)».
- [x] 6.12 Ejecutar `npm test` y comprobar que todas las pruebas pasan con la base temporal y con la base migrada.

## 7. Validación final y documentación
- [x] 7.1 Verificar con `grep` que no quede «Sin piezas cargadas» en `src/`, `tests/`, `openspec/specs/` ni en los artefactos vigentes; solo en cambios archivados y registros históricos.
- [x] 7.2 Comprobar que la base migrada conserva el proyecto «En preparación» con sus 15 piezas y que los proyectos nuevos nacen «Pendiente de aprobación».
- [x] 7.3 Revisar que no se agregó ningún campo de aprobación y que la aprobación queda implicada por «Aprobado», «En preparación» y «Proyecto completo».
- [x] 7.4 Actualizar el README con la instalación (`npm install`), la ejecución (`npm run dev`), las pruebas (`npm test`) y el uso de `/aprobaciones` por el Supervisor de Proyectos, indicando el nuevo ciclo de estados y la migración 007.
