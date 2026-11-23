## 1. Generador y base de datos

- [x] 1.1 Modificar `src/integraciones/GeneradorPlanoSimulado.ts`: sustituir `${codigoProyecto}-P001` por el algoritmo del diseño (letra A–Z + número 1–25, muestreo sin reposición sobre 650 combinaciones, con el `rng` inyectable ya existente).
- [x] 1.2 Conservar sin cambios la interfaz `GeneradorPlano`, el registro en consola de la llamada simulada y los límites acordados (1–5 partes, hasta 100 piezas, menos partes que piezas, al menos una pieza por parte).
- [x] 1.3 Editar `src/db/migrations/003_partes_casa_piezas.sql` (no archivada; **no crear la 004**): añadir `proyecto_id INTEGER NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE` a `piezas` y sustituir `UNIQUE (parte_casa_id, codigo)` por `UNIQUE (proyecto_id, codigo)`.
- [x] 1.4 Ajustar `src/dominio/piezas.ts:112` para insertar también `proyecto_id` (junto a `parte_casa_id` y `codigo`), conservando la transacción y las transiciones a «Pendiente» / «En preparación».

## 2. Pruebas (una por escenario Gherkin)

- [x] 2.1 Ajustar la prueba «Inyección de piezas desde un archivo válido (simulado en la demo) — CA1»: sustituir `startsWith("CASA-001-P")` por la comprobación del formato `/^[A-Z]([1-9]|1[0-9]|2[0-5])$/` y de que no se repite ningún código en el proyecto.
- [x] 2.2 Ajustar la prueba «Universo simulado generado dentro de los límites acordados»: mantener los límites y los nombres de parte, y cambiar la aserción `<codigo>-P001` por formato letra A–Z + número 1–25 y unicidad dentro de cada proyecto.
- [x] 2.3 Añadir la prueba del escenario «Códigos repetibles en proyectos distintos» con un **generador de prueba fijo**: sustituir `generadorPlano.generar` por un stub que devuelve siempre el mismo `codigo` (p. ej. `A3`) para ambos proyectos, verificar que `A3` se persiste en los dos sin error de `UNIQUE` y que dentro de cada proyecto el código completo sigue siendo único. Sin depender del azar.
- [x] 2.4 Verificar la restricción en base de datos: un intento de repetir el mismo `codigo` dentro de **un mismo** proyecto debe fallar por `UNIQUE (proyecto_id, codigo)`.
- [x] 2.5 Comprobar que siguen pasando sin cambios las pruebas de rechazo por otro rol, ocultación del botón tras inyectar y las dos adaptaciones de CA2.

## 3. Pantalla, documentación y verificación

- [x] 3.1 Comprobar que `src/vistas/inyeccion-resultado.ejs` muestra los códigos con el formato nuevo sin necesidad de cambiar la vista.
- [x] 3.2 Actualizar `README.md` con el formato `A3`…`Z25`, la elección al azar, la unicidad del código completo dentro del proyecto reforzada por `UNIQUE (proyecto_id, codigo)` en la 003 y la repetibilidad entre proyectos; conservar instalación, arranque y pruebas.
- [x] 3.3 Ejecutar `npm test` y verificar que pasan todas las pruebas (las 13 existentes más las 2 nuevas: repetibilidad forzada entre proyectos y rechazo de duplicado dentro de un proyecto).
