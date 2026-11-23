## Context

SnapSip ya tiene HU-01 (selector de rol de demostración) y HU-02 (proyectos que nacen en «Sin piezas cargadas», sin partes ni piezas). El listado de proyectos ya muestra columnas `Partes` y `Piezas` con conteo 0. HU-03 debe poblar ese universo y dejar el proyecto en «En preparación» para desbloquear HU-04.

Ficha confirmada: `.cin324/historias/HU-03.md`. Supuesto vigente: indicación del profesor de 2026-11-18 en `.cin324/proyecto.md` (simulación de la carga de plano/archivo solo en la demo, sin tocar RP-03, HU-03 ni el Gherkin). No hay DSS propio: el flujo se reconstruyó desde el Gherkin y CU-03.

## Goals / Non-Goals

**Goals:**
- Botón «Inyectar piezas desde plano/archivo» en el proyecto, visible solo para *Encargado de Despacho* y solo en estado «Sin piezas cargadas».
- Generación aleatoria acotada y persistencia atómica de `ParteCasa`/`Pieza`, con transición del `Proyecto` a «En preparación» y mensaje de conteos.
- Interfaz `GeneradorPlano` con implementación simulada, explicitamente presentada como integración simulada.
- Migración 003 con tablas derivadas del modelo de dominio para uso de HU-04.

**Non-Goals:**
- CA2 (formato inválido / filas incompletas), carga real de archivos y validación de plantilla: desviación documentada.
- Tabla o columna `Torre` (HU-04); `/completa` calculado; estados «Listo»/«Enviado»; HU-04…HU-11.
- Cambios en RP-03, HU-03, `07-criterios-aceptacion.md`, HU-02, sus specs o los artefactos `02`, `09`, `11`, `12`.
- Requisitos no funcionales y autenticación real.

## Decisions

1. **Tablas desde el modelo de dominio (migración `003_partes_casa_piezas.sql`).**
   - `partes_casa(id, proyecto_id NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE, nombre NOT NULL, UNIQUE(proyecto_id, nombre))`: composición `Proyecto 1 – 0..* ParteCasa`.
   - `piezas(id, parte_casa_id NOT NULL REFERENCES partes_casa(id) ON DELETE CASCADE, codigo NOT NULL, estado TEXT NOT NULL DEFAULT 'Pendiente', UNIQUE(parte_casa_id, codigo))`: composición `ParteCasa 1 – 1..* Pieza`.
   - `ON DELETE CASCADE` en ambas FK por ser composición. No se guarda `/completa` (derivado). **No se crea columna `torre_id` ni tabla `torres`**: «sin torre» es el estado inicial de la pieza, y HU-04 agregará la asignación. Alternativa descartada: crear `torre_id` sin tabla `torres` (FK colgante y columna que esta historia no usa).
2. **Transiciones desde EST-01 y HU-03 CA1.** Una sola función `inyectarPiezasDesdePlano(codigoProyecto)` en `src/dominio/piezas.ts` verifica que el proyecto esté en «Sin piezas cargadas» y sin piezas, ejecuta el evento *inyectar piezas desde plano/archivo* (guarda: generación simulada válida), crea las piezas en «Pendiente» y actualiza el proyecto a «En preparación» dentro de la misma transacción (`BEGIN`/`COMMIT`/`ROLLBACK`, como en `conexion.ts`). Estado inicial por defecto `Pendiente` en la columna `estado`. Alternativa descartada: actualizar el proyecto fuera de la transacción (dejaría estados inconsistentes si falla la inserción).
3. **Rutas desde el flujo reconstruido (sin DSS).** `GET /proyectos` pasa a mostrar el botón solo si `rolActual === "Encargado de Despacho"` y `proyecto.estado === "Sin piezas cargadas"`. `POST /proyectos/:id/inyectar-piezas` aplica la regla protegida con `requiereRol(["Encargado de Despacho"])` (HU-01 CA3: 403 sin modificar datos) y la guarda de estado en dominio; responde con una vista de resultado que muestra cuántas partes y piezas se crearon, o un error sin cambios. Alternativa descartada: endpoint abierto con validación solo en la vista (no resiste un intento directo de otro rol).
4. **Integración simulada.** `src/integraciones/GeneradorPlano.ts` define `GeneradorPlano` y el tipo `UniversoPiezasSimulado`; `GeneradorPlanoSimulado.ts` implementa el generador aleatorio, registra la llamada en consola y devuelve el universo. Un único punto de selección (`src/integraciones/index.ts`) exporta la instancia activa para poder sustituirla por una real sin tocar la lógica. El generador acepta un `rng` inyectable (por defecto `Math.random`) para hacer deterministas las pruebas sin cambiar el comportamiento aleatorio de la demo. Se avisa al estudiante en la guía de pruebas: «esta integración está simulada».
5. **Aleatoriedad acotada y válida por construcción.** `partes = entero 1..5`; `piezas = entero (partes+1)..100`, con lo que siempre hay menos partes que piezas. Se eligen sin repetir `partes` nombres de la lista acordada. Se asigna primero una pieza a cada parte y luego se distribuyen las restantes al azar: garantiza al menos una por parte. Códigos `<codigo del proyecto>-P001`… consecutivos, únicos por proyecto; la restricción `UNIQUE(parte_casa_id, codigo)` y el prefijo por proyecto evitan colisiones.
6. **Ajuste de prueba autorizado (2026-11-18).** `tests/hu-02.crear-proyecto.test.ts:118-123` debe dejar de comprobar que las tablas no existen y comprobar que el proyecto de CA3 tiene 0 filas en `partes_casa`/`piezas`. Es un ajuste de aserción, no de la spec `crear-proyecto`, del código de HU-02 ni de sus otros escenarios; el comportamiento de HU-02 no cambia.
7. **Script artesanal eliminado (2026-11-18).** Borrar `src/db/inyectar-hu03.ts` y el script npm `db:seed:hu03`; la inyección solo existe como flujo web generado desde los artefactos.

## Risks / Trade-offs

- **[La demo no valida archivos → CA2 queda sin cubrir]** → Mitigación: desviación documentada en `.cin324/validaciones/VAL-HU-03-1.md`, en la ficha y en los specs; no se simula un error que el generador no puede producir.
- **[Aleatoriedad → resultados difíciles de repetir a mano]** → Mitigación: `rng` inyectable en el generador para pruebas; la interfaz muestra siempre los conteos reales.
- **[La migración 003 cambia el entorno de la prueba de HU-02]** → Mitigación: ajuste de aserción aprobado por el estudiante (decisión 6); se ejecuta la suite completa.
- **[Códigos de pieza únicos solo por convención de formato]** → Mitigación: numeración consecutiva por proyecto y `UNIQUE` dentro de la parte; se afirma la unicidad en la prueba del universo simulado.

## Migration Plan

1. Agregar `src/db/migrations/003_partes_casa_piezas.sql`; `aplicarMigraciones()` la ejecuta al arrancar y la registra en `schema_migrations` (migraciones anteriores intactas).
2. En bases existentes, las tablas nuevas quedan vacías; los proyectos ya creados conservan su estado. No se requiere backfill ni conversión de datos.
3. Rollback de desarrollo: eliminar el archivo 003 y las tablas `piezas`/`partes_casa`, y retirar la fila de `schema_migrations`. No aplica a producción (proyecto de taller).

## Open Questions

Ninguna: los cinco puntos de la historia y las dos decisiones adicionales (ajuste de la prueba de HU-02 y eliminación del script artesanal) fueron confirmados por el estudiante el 2026-11-18.
