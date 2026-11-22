## Why

SnapSip ya permite crear proyectos (HU-02), pero estos nacen sin piezas, por lo que no existe todavía el universo de piezas contra el cual controlar lo que falta en bodega. HU-03 implementa la actividad del TO-BE **«Inyectar piezas desde plano/archivo»** (Iniciativa 1: ingreso estructurado del universo de piezas; CU-03, RP-03), que sustituye la búsqueda frenética del AS-IS por un registro inicial automático en estado «Pendiente».

La indicación del profesor de 2026-11-18 (registrada como supuesto en `.cin324/proyecto.md`) hace que la carga del plano/archivo se **simule en la demo** con un botón, igual que el selector de rol de HU-01. En el sistema real RP-03 sigue siendo cargar un archivo; **no se cambia** el texto de RP-03, HU-03 ni del Gherkin.

## What Changes

- Se agrega, en la vista de un proyecto, el botón **«Inyectar piezas desde plano/archivo»**, visible solo para el rol **Encargado de Despacho** y solo cuando el proyecto está en **«Sin piezas cargadas»**; cualquier otro rol es rechazado sin modificar datos (HU-01 CA3).
- Al pulsarlo, el sistema genera al azar entre **1 y 5 partes de la casa** y hasta **100 piezas**, siempre con **menos partes que piezas** y **al menos una pieza por parte**. Los nombres de las partes se eligen sin repetir de: Techo, Muros exteriores, Muros interiores, Piso, Entrepiso. Cada pieza recibe un código único dentro del proyecto (`<código del proyecto>-P001`, etc.).
- Se registran las partes y piezas: cada **Pieza** en estado **«Pendiente»**, **sin torre asignada** y asociada a su **ParteCasa**; el **Proyecto** pasa de **«Sin piezas cargadas»** a **«En preparación»**. Se muestra cuántas partes y piezas se crearon.
- Se incorpora la **migración 003** con las tablas `partes_casa` y `piezas`, derivadas del modelo de dominio, para que HU-04 pueda usarlas en adelante.
- Se define la interfaz `GeneradorPlanoSimulado` y su implementación aleatoria: la lectura del plano/archivo está **simulada** (sin carga real de archivo, sin validación de plantilla). Se avisa al estudiante de esta simulación.

## Capabilities

### New Capabilities
- `inyectar-piezas`: registro simulado del universo de piezas de un proyecto por parte del Encargado de Despacho: generación aleatoria acotada de ParteCasa y Pieza, creación en estado «Pendiente» sin torre, transición del proyecto a «En preparación» y rechazo por rol o estado no autorizado.

### Modified Capabilities
- (ninguna; las especificaciones vigentes `acceso-por-rol-demo` y `crear-proyecto` no cambian: HU-01 y HU-02 no se tocan)

## Impact

- **Código:** nuevas entidades `ParteCasa`/`Pieza`, generador simulado, lógica de inyección, ruta y vista del botón/resultado en el proyecto; se descarta el script artesanal `src/db/inyectar-hu03.ts`.
- **Base de datos:** migración `003_partes_casa_piezas.sql` (FK a `proyectos`, `ON DELETE CASCADE` por composición); sin tabla `Torre` (HU-04).
- **Pruebas:** una prueba de integración por escenario Gherkin de HU-03 (se implementa CA1; CA2 queda como desviación documentada) y verificación de que HU-02 sigue intacta.
- **Documentación de apoyo:** `README.md` con arranque y pruebas; ficha `.cin324/historias/HU-03.md` e informe `.cin324/validaciones/VAL-HU-03-1.md` ya existentes.
- **Sin impacto** en RP-03, HU-03, `07-criterios-aceptacion.md`, HU-02 ni en los artefactos `02`, `09`, `11`, `12`.

## Fuera de alcance

- Los dos escenarios de **CA2** (formato inválido y filas incompletas) y cualquier validación de plantilla o carga real de archivo.
- Creación de `Torre` (HU-04), asignación con evidencia (HU-05), consulta de pendientes (HU-06) y el resto de historias HU-07…HU-11.
- Requisitos no funcionales y autenticación real.
