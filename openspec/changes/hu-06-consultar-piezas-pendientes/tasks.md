## 1. Preparación y acceso

- [x] 1.1 Confirmar que no hace falta migración nueva: `proyectos`, `partes_casa` y `piezas.estado` ya existen desde las migraciones 001–003.
- [x] 1.2 Actualizar `funcionesPorRol` en `src/acceso/roles.ts`: reemplazar «Consultar piezas pendientes (HU-06, pendiente)» por «Consultar piezas pendientes (HU-06)» para *Operario de Bodega*.
- [x] 1.3 Agregar en `src/vistas/inicio.ejs` un enlace visible solo para *Operario de Bodega* hacia `GET /pendientes`, sin exponer `/proyectos`.

## 2. Dominio (solo lectura)

- [x] 2.1 Crear `src/dominio/pendientes.ts` con las interfaces `ProyectoParaSelector` (`id`, `codigo`), `ParteCasaParaSelector` (`id`, `proyecto_id`, `nombre`) y `PiezaPendiente` (`codigo`, `estado`).
- [x] 2.2 Implementar `listarProyectosParaConsulta()` y `listarPartesPorProyecto(proyectoId)` con `SELECT` sobre las tablas existentes, ordenadas por `id`.
- [x] 2.3 Implementar `consultarPiezasPendientes(proyectoId, parteCasaId)` con `JOIN piezas → partes_casa`, filtrando `pc.proyecto_id = ?`, `pc.id = ?` y `p.estado = 'Pendiente'`; devolver solo `codigo` y `estado`, sin `UPDATE`/`INSERT`.
- [x] 2.4 Verificar que la `ParteCasa` consultada pertenezca al `Proyecto` elegido; si no, devolver lista vacía sin revelar piezas de otra parte.

## 3. Ruta y pantalla

- [x] 3.1 Crear `src/rutas/pendientes.ts` con `GET /pendientes` protegido por `requiereRol(["Operario de Bodega"])` y montarlo en `src/app.ts` con `// HU-06, CU-06, TO-BE Consultar piezas pendientes`.
- [x] 3.2 En el controlador, validar `proyectoId` y `parteCasaId`: si falta cualquiera, renderizar la vista pidiendo la selección, sin resultados y sin el mensaje «0 pendientes».
- [x] 3.3 Con ambos valores, cargar proyectos, partes del proyecto, parte elegida y piezas filtradas; pasar a la vista `haySeleccion`, `piezas` y el `nombre` de la parte.
- [x] 3.4 Crear `src/vistas/pendientes.ejs` con selector de **Proyecto**, selector de **Parte de la casa**, botón «Consultar», listado de `Pieza.codigo` (sin torre asignada) y mensaje «0 pendientes para <parte>» solo cuando la parte elegida no tenga filas.
- [x] 3.5 Comprobar que un rol distinto recibe 403 desde `acceso-denegado` y que la respuesta no contiene códigos de piezas (HU-01 CA3).

## 4. Pruebas automatizadas

- [x] 4.1 Crear `tests/hu-06.consultar-piezas-pendientes.test.ts` con BD SQLite temporal, `ejecutarSeed()`, agente con rol *Operario de Bodega* y helper que inserte proyectos/partes/piezas directamente en BD (supuesto aprobado, HU-05 aún no asigna piezas).
- [x] 4.2 **CA1:** parte elegida con `A3` y `B7` en «Pendiente», otra parte con `C9` y una pieza `D4` en estado «Listo» en la parte elegida; verificar que solo se muestran `A3` y `B7`.
- [x] 4.3 **CA2:** parte elegida sin piezas pendientes; verificar lista vacía y mensaje explícito «0 pendientes para <parte>».
- [x] 4.4 Variante confirmada: sin proyecto o sin parte; verificar que se pide la selección y que la respuesta **no** contiene «0 pendientes».
- [x] 4.5 Ejecutar `npm test` y comprobar que pasan las 15 pruebas existentes más las nuevas de HU-06.

## 5. Cierre

- [x] 5.1 Ejecutar `openspec validate "hu-06-consultar-piezas-pendientes"` y revisar `git diff` para confirmar que no se tocaron artefactos del curso.
- [x] 5.2 Actualizar `README.md` como última tarea: HU-06 en «Estado actual», ruta `/pendientes`, uso de los selectores y del mensaje «0 pendientes», nuevo total de pruebas, y corregir el ajuste HU-03 a «completado, pendiente de archivo».
