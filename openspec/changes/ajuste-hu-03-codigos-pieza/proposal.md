## Why

HU-03 generó los códigos de pieza con el formato `<codigo del proyecto>-P001`, pero al validar el sistema el estudiante acordó que en la demo cada pieza debe nombrarse con una letra de la A a la Z y un número del 1 al 25 (p. ej. `A3`, `I5`), elegidos al azar y sin repetir el código completo dentro del proyecto; entre proyectos distintos sí pueden repetirse. El cambio sale del informe `.cin324/validaciones/VAL-HU-03-2.md` y de la ficha confirmada `.cin324/historias/HU-03.md`: es la actividad del TO-BE **«Inyectar piezas desde plano/archivo»** y el caso de uso **CU-03**, y no modifica RP-03, HU-03 ni su Gherkin.

## What Changes

- Sustituir el formato del `codigo` de `Pieza` en el generador simulado: de `<codigo del proyecto>-P001` a una letra A–Z y un número 1–25 al azar (p. ej. `A3`, `I5`).
- Garantizar que el código completo sea único dentro del proyecto; la letra y el número por separado sí pueden repetirse (p. ej. `A3` y `A5`), y proyectos distintos pueden usar los mismos códigos. Reforzar esa unicidad en la base de datos con `UNIQUE (proyecto_id, codigo)` en la migración 003.
- Actualizar las pruebas de HU-03 que hoy comprueban el prefijo `<codigo>-P001` para que comprueben el formato nuevo, la unicidad por proyecto y la repetibilidad entre proyectos con un generador fijo que fuerza el mismo código.
- Mantener sin cambios el botón de demo, los límites de generación (1–5 partes, hasta 100 piezas, menos partes que piezas, al menos una pieza por parte), los estados «Pendiente» / «En preparación» y la desviación documentada de CA2.

## Capabilities

### New Capabilities

- (ninguna)

### Modified Capabilities

- `inyectar-piezas`: se modifica la regla de generación del `codigo` de `Pieza` en el universo simulado (formato letra A–Z + número 1–25, aleatoriedad, unicidad del código completo dentro del proyecto y repetibilidad entre proyectos).

## Impact

- **Código:** `src/integraciones/GeneradorPlanoSimulado.ts` (antes generaba `${codigoProyecto}-P001`…) y `src/dominio/piezas.ts` (el insert incluye `proyecto_id`); la interfaz `GeneradorPlano` y `src/integraciones/index.ts` se conservan.
- **Base de datos:** `src/db/migrations/003_partes_casa_piezas.sql` se edita en sitio (no archivada): `piezas` añade `proyecto_id` y cambia `UNIQUE (parte_casa_id, codigo)` por `UNIQUE (proyecto_id, codigo)`. No se crea la migración 004.
- **Pruebas:** `tests/hu-03.inyectar-piezas.test.ts` (aserciones de formato y unicidad en los escenarios de CA1 y de límites de generación, más repetibilidad forzada y rechazo de duplicado dentro de un proyecto).
- **Documentación de apoyo:** `README.md` (donde se describe la inyección simulada).
- **Sin impacto:** `03-requisitos.md` (RP-03), `04-historias-usuario.md` (HU-03), `07-criterios-aceptacion.md`, modelo de dominio, casos de uso, diagramas de estado y secuencia, matriz de trazabilidad ni dependencias.

## Fuera de alcance

- Cambios en RP-03, en el texto de HU-03 o en su Gherkin; cambios en HU-02 ni en las historias HU-04…HU-11.
- Implementación de CA2 (formato inválido / filas incompletas), que sigue como desviación documentada.
- Cambios de estados, de roles o de la integración simulada del plano/archivo más allá del formato del código; en la base de datos solo se añade `proyecto_id` y se ajusta la restricción de unicidad en `piezas`.
- Requisitos no funcionales y autenticación real.
