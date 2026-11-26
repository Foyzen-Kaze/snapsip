## Why

Al validar HU-02/HU-03 el estudiante confirmó que no se aprecia cómo se establecen las partes de la casa: dos proyectos creados quedaron cada uno con una sola parte y distinta (Techo / Muros interiores), porque hoy las partes se inventan al azar durante la inyección. La decisión aprobada es que las partes se definan al crear el proyecto, con cantidades previstas, y que la inyección use exactamente esas partes.

## What Changes

- **BREAKING (HU-02, CU-02, actividad TO-BE «Crear proyecto»):** el formulario de creación incorpora cinco campos de cantidad —Piso, Muros exteriores, Muros interiores, Entrepiso y Techo— con enteros no negativos y total entre 1 y 100. Al registrar, se crean las `ParteCasa` con cantidad positiva y se guarda la cantidad prevista; el proyecto sigue en «Sin piezas cargadas» y con cero `Pieza`.
- **BREAKING (HU-03, CU-03, actividad TO-BE «Inyectar piezas desde plano/archivo»):** se conserva un único botón por proyecto, que ahora usa las partes ya guardadas y crea todas las piezas en una sola carga con las cantidades exactas y códigos aleatorios únicos dentro del proyecto. Al terminar, el proyecto pasa a «En preparación» y el botón desaparece; los reintentos se rechazan sin modificar datos.
- Se agrega una migración aditiva que incorpora `partes_casa.cantidad_prevista`, conserva las filas y datos existentes y no reinicia la base de datos.
- Se actualizan historias, Gherkin, modelo de dominio, casos de uso, secuencias, estados, trazabilidad, README y fichas de `.cin324/` para que el sistema siga saliendo de los artefactos.

## Capabilities

### New Capabilities

- (ninguna)

### Modified Capabilities

- `crear-proyecto`: el registro del proyecto pasa a crear `ParteCasa` con cantidades previstas, en lugar de dejar cero partes.
- `inyectar-piezas`: la inyección usa las partes registradas al crear el proyecto y las cantidades exactas, en lugar de generar partes y cantidades al azar.

## Impact

- Código: `src/dominio/proyectos.ts`, `src/dominio/piezas.ts`, `src/integraciones/GeneradorPlano.ts`, `src/integraciones/GeneradorPlanoSimulado.ts`, `src/rutas/proyectos.ts`, vistas `proyecto-nuevo`, `proyecto-creado`, `proyectos` e `inyeccion-resultado`.
- Datos: nueva migración `006_cantidad_prevista_partes.sql` (aditiva, sin borrar ni reiniciar la base; las partes existentes se completan con el número de piezas que ya tienen).
- Pruebas: `tests/hu-02.crear-proyecto.test.ts` y `tests/hu-03.inyectar-piezas.test.ts`.
- Artefactos del curso: `02`, `03`, `04`, `07`, `08`, `09`, `10`, `11`, `12`, sus fuentes `.puml` cuando aplica, `README.md` y `.cin324/proyecto.md`.
- Fuera de alcance: HU-04…HU-11, la aprobación de HU-12, la carga real de archivos (CA2 de HU-03 sigue simulada), la autenticación real y los requisitos no funcionales.
