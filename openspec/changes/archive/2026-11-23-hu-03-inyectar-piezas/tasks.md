## 1. Datos y migración

- [x] 1.1 Crear `src/db/migrations/003_partes_casa_piezas.sql` con `partes_casa` y `piezas`, FK con `ON DELETE CASCADE`, `estado` por defecto «Pendiente» y restricciones `UNIQUE`; sin columna `torre_id` ni tabla `torres`.
- [x] 1.2 Verificar que `aplicarMigraciones()` registra 003 en `schema_migrations` y que un proyecto recién creado sigue con 0 partes y 0 piezas.

## 2. Integración simulada (plano/archivo)

- [x] 2.1 Crear `src/integraciones/GeneradorPlano.ts` con `UniversoPiezasSimulado` y la interfaz `GeneradorPlano`.
- [x] 2.2 Crear `src/integraciones/GeneradorPlanoSimulado.ts`: 1–5 partes, hasta 100 piezas, partes < piezas, al menos una pieza por parte, nombres sin repetir de la lista acordada y códigos `<codigo del proyecto>-P001`; `rng` inyectable y registro en consola de la llamada simulada.
- [x] 2.3 Crear `src/integraciones/index.ts` con el punto único de selección del generador activo (implementación simulada) y quitar la etiqueta «pendiente» a la función HU-03 en `src/acceso/roles.ts`.

## 3. Lógica de dominio y estados

- [x] 3.1 Crear `src/dominio/piezas.ts` con los tipos `ParteCasa`, `Pieza` y `ResultadoInyeccion`, y las consultas de universo por proyecto.
- [x] 3.2 Implementar `inyectarPiezasDesdePlano(codigoProyecto)` con guarda de estado «Sin piezas cargadas» y sin piezas previas, transición EST-01 a «Pendiente» y cambio de `Proyecto` a «En preparación» en una sola transacción con rollback.
- [x] 3.3 Exponer el contenido simulado (partes, piezas y conteos) para la vista de resultado.

## 4. Rutas y pantallas

- [x] 4.1 Agregar `POST /proyectos/:id/inyectar-piezas` protegido con `requiereRol(["Encargado de Despacho"])`, que rechace sin modificar datos si el estado no es «Sin piezas cargadas».
- [x] 4.2 Crear la vista `src/vistas/inyeccion-resultado.ejs` con cuántas partes y piezas se crearon, el estado del proyecto y enlace de vuelta al listado.
- [x] 4.3 Mostrar el botón «Inyectar piezas desde plano/archivo» en `src/vistas/proyectos.ejs` solo para el rol Encargado de Despacho y solo en proyectos «Sin piezas cargadas»; avisar en la vista de que el plano/archivo está simulado.

## 5. Pruebas automáticas (una por escenario de los specs)

- [x] 5.1 Crear `tests/hu-03.inyectar-piezas.test.ts` con BD temporal y generador de RNG controlado.
- [x] 5.2 Probar «Inyección de piezas desde un archivo válido (simulado)» (CA1): piezas Pendiente sin torre, asociadas a su parte, proyecto «En preparación» y conteos visibles.
- [x] 5.3 Probar «Universo simulado generado dentro de los límites acordados»: 1–5 partes, ≤100 piezas, partes < piezas, ≥1 pieza por parte, nombres sin repetir y códigos únicos con formato `<codigo>-P001`.
- [x] 5.4 Probar «Rechazo de un intento de inyección por otro rol» (HU-01 CA3): 403 y datos sin modificar.
- [x] 5.5 Probar «Proyecto sin opción de inyección después de cargar las piezas»: sin botón y sin nuevas partes/piezas.
- [x] 5.6 Probar los dos escenarios de CA2 adaptados a la demo: no existe carga de archivo inválido y no se registran piezas parciales; dejar constancia de la desviación en el nombre de las pruebas.
- [x] 5.7 Ajustar únicamente la aserción de `tests/hu-02.crear-proyecto.test.ts` sobre existencia de tablas por conteo 0 de filas del proyecto; ejecutar `npm test` y verificar que pasan todas las pruebas (HU-01, HU-02 y HU-03).

## 6. Limpieza y documentación

- [x] 6.1 Eliminar `src/db/inyectar-hu03.ts` y el script npm `db:seed:hu03`, conforme a la decisión aprobada.
- [x] 6.2 Actualizar `README.md` con instalación, arranque, seed, inyección simulada desde la web, cómo probar HU-03 y el aviso de integración simulada y desviación de CA2.
- [x] 6.3 Ejecutar `openspec validate hu-03-inyectar-piezas --strict` y comprobar que la ficha, el supuesto y el informe siguen coherentes.
