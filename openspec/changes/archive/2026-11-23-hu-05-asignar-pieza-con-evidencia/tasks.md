## 1. Datos y capa de dominio

- [x] 1.1 Crear `src/db/migrations/005_asignacion_piezas.sql`: agregar `piezas.torre_id` nullable con FK a `torres(id)` (`ON DELETE SET NULL`) y crear `evidencias` (`id`, `pieza_id` FK en cascada, `fotografia`, `fecha_hora_captura`, `responsable`, `vigente` por defecto 1). Sin `asignada_por` ni `fecha_hora_asignacion` en `piezas`; sin tocar 001-004.
- [x] 1.2 Crear `src/integraciones/ServicioAlmacenamientoEvidencias.ts` (interfaz con `almacenar(fotografia)`) y `ServicioAlmacenamientoEvidenciasSimulado.ts` con **3 fotos de demostración** y un disparador explícito de prueba para forzar el error de CA4 (no una cuarta opción visible). Registrar la selección en `src/integraciones/index.ts` (patrón de `generadorPlano` de HU-03).
- [x] 1.3 Crear `src/dominio/asignaciones.ts` con `listarPiezasPendientes(proyectoId)` y `listarTorresDelProyecto(proyectoId)`: las piezas «Pendiente» y **todas** las torres («Abierta» y «Cerrada»), con `codigo`, parte de la casa y `estado` (requisito de listado).
- [x] 1.4 Implementar `asignarPieza(piezaId, torreId, fotografia, confirmar)` en transacción: validar en orden evidencia presente → pieza no «Enviado» → misma parte/proyecto → torre «Abierta» → estado Pendiente o Listo con reemplazo confirmado; llamar al servicio de evidencias; con éxito crear `Evidencia` y actualizar `piezas.torre_id` y `piezas.estado = 'Listo'`. Mensajes literales: «se exige evidencia fotográfica», «una pieza enviada no puede reasignarse», «la torre no corresponde a la parte de la pieza», «se sugiere registrar otra torre para la parte» y «la evidencia no pudo almacenarse». Con fallo del servicio, rollback sin cambiar la pieza (CA4).
- [x] 1.5 Implementar la reasignación en dos pasos en `asignarPieza()`: si la pieza está «Listo» en otra torre y falta `confirmar`, devolver un resultado que pida confirmación sin escribir; con `confirmar`, marcar la evidencia anterior `vigente = 0`, crear la nueva y mantener la pieza «Listo» (CA3, LISTO → LISTO de EST-01). Sin invalidar guías (HU-08).
- [x] 1.6 Implementar `consultarTorre(torreId)` en `src/dominio/asignaciones.ts`: devolver torre (código y parte) y sus piezas con `codigo` y `estado`, sin modificar datos (CA6).

## 2. Rutas, vistas y navegación

- [x] 2.1 Crear `src/rutas/asignaciones.ts` con `GET /piezas/asignar` (listado) y `POST /piezas/asignar` (ejecuta la asignación o muestra la confirmación), ambos con `requiereRol(["Operario de Bodega"])`; al rechazar, volver a renderizar con `400` y el mensaje correspondiente.
- [x] 2.2 Agregar `GET /torres/consultar/:id` en el mismo router, protegido por el mismo rol, para atender CA6 sin colisionar con `/torres/nuevo` de HU-04.
- [x] 2.3 Crear `src/vistas/asignacion-nueva.ejs`: tablas de piezas «Pendiente» y de todas las torres con código, parte y estado; selector de pieza y torre; **3 fotos de demostración radio sin ninguna preseleccionada** (sin campo de texto ni `input type="file"`); bloque de error.
- [x] 2.4 Crear `src/vistas/asignacion-confirmar.ejs` con pieza, torre actual, torre destino y aviso de que se conservará la evidencia anterior como historial; formulario con `confirmar=1` y opción de cancelar sin cambios.
- [x] 2.5 Crear `src/vistas/asignacion-creada.ejs` con pieza, torre, código de torre, estado «Listo» y foto de evidencia usada; enlaces a la consulta de torre y al listado.
- [x] 2.6 Crear `src/vistas/torre-consultar.ejs` con el código y la parte de la torre y la tabla de piezas contenidas con **código y estado** (CA6), sin botones de asignación.
- [x] 2.7 Registrar `routerAsignaciones` en `src/app.ts` y añadir los enlaces «HU-05: Asignar pieza» y «Consultar torre» en `src/vistas/inicio.ejs` solo para el Operario de Bodega.

## 3. Pruebas (una por escenario Gherkin cubierto)

- [x] 3.1 Preparar en `tests/hu-05.asignar-pieza-con-evidencia.test.ts` datos de ejemplo en SQLite temporal: proyecto con piezas «Pendiente», torres «Abierta» y «Cerrada» de la misma parte, torre de otra parte, pieza «Enviado» y dos torres Abiertas para reasignar. El estado «Enviado» se inserta directamente en la BD (no se produce en la app hasta HU-09).
- [x] 3.2 Prueba «HU-05 · Listado de piezas pendientes y torres del proyecto con código, parte y estado»: verificar que se muestran piezas «Pendiente» y **todas** las torres del proyecto, con código, parte y estado (requisito de listado).
- [x] 3.3 Prueba «HU-05 · Asignación de una pieza pendiente» (CA1): pieza «Listo», `torre_id` correcto, `Evidencia` vigente con responsable y fecha/hora, código de torre visible.
- [x] 3.4 Prueba «HU-05 · Rechazo de una asignación sin evidencia» (CA2): mensaje «se exige evidencia fotográfica» y pieza sin cambios; verificar que ninguna foto queda preseleccionada en el formulario.
- [x] 3.5 Prueba «**HU-04 · Rechazo de una pieza de otra parte de la casa**» (HU-04 CA3): mensaje «la torre no corresponde a la parte de la pieza» y pieza «Pendiente» sin torre.
- [x] 3.6 Prueba «**HU-04 · Rechazo de una pieza nueva en una torre cerrada**» (HU-04 CA4): rechazo con «se sugiere registrar otra torre para la parte» y pieza y torre sin modificaciones.
- [x] 3.7 Prueba «HU-05 · Rechazo de la reasignación de una pieza enviada» (CA5): mensaje «una pieza enviada no puede reasignarse» y pieza «Enviado» intacta.
- [x] 3.8 Prueba «HU-05 · Rechazo por falla del servicio de almacenamiento de evidencias» (CA4): con el disparador de prueba, mensaje «la evidencia no pudo almacenarse», pieza «Pendiente» y sin fila en `evidencias`.
- [x] 3.9 Prueba «HU-05 · Reasignación confirmada a otra torre» (CA3): pieza «Listo» en la nueva torre, evidencia anterior `vigente = 0`, nueva evidencia vigente y sin tabla de guías creada.
- [x] 3.10 Prueba «HU-05 · Reasignación no confirmada» (CA3): sin `confirmar`, se conservan torre y evidencia anteriores y no se crea evidencia nueva.
- [x] 3.11 Prueba «HU-05 · Consulta de las piezas de una torre» (CA6): se listan las piezas asignadas con su código y estado y no se modifica ningún dato.
- [x] 3.12 Prueba «HU-05 · Rechazo por rol no autorizado» (HU-01 CA3): el Encargado recibe 403 en asignar y consultar, sin ver datos de piezas, torres ni evidencias.
- [x] 3.13 Ejecutar `npm test` y verificar que pasan las 37 pruebas existentes (HU-01, HU-02, HU-03, HU-04, HU-06) y las nuevas de HU-05; sin guías ni envíos (HU-08/HU-09).

## 4. Cierre

- [x] 4.1 Revisar `git status`: solo ficha y artefactos de HU-05, `.cin324/proyecto.md`, código/pruebas de HU-05 y el cambio OpenSpec; sin artefactos del curso nuevos (salvo CA6 ya aprobado) ni migraciones 001-004 tocadas.
- [x] 4.2 Actualizar `README.md` con cómo instalar, sembrar, ejecutar y probar, el recorrido de asignación y consulta de torre, los mensajes de rechazo y la nota de que la invalidación de guías queda para HU-08.
