## Context

Hoy `crearProyecto` solo registra `cliente`, `codigo` y `metraje`, y `inyectarPiezasDesdePlano` pide a `GeneradorPlanoSimulado` que invente entre 1 y 5 nombres de parte y hasta 100 piezas. El estudiante aprobó invertir ese orden: las cinco partes y sus cantidades se capturan al crear el proyecto (HU-02, CU-02) y la inyección (HU-03, CU-03) solo genera los códigos de las piezas para esas partes. Existen migraciones 001–005 y una base `data/app.db` con datos que no se pueden borrar ni reiniciar. El stack (TypeScript + Express + EJS + SQLite con `node:sqlite` + Vitest) ya está definido en `.cin324/proyecto.md`.

## Goals / Non-Goals

**Goals:**
- Formulario de HU-02 con cinco campos de cantidad (Piso, Muros exteriores, Muros interiores, Entrepiso, Techo), enteros no negativos, total 1–100.
- Crear atómicamente el `Proyecto` y sus `ParteCasa` con `cantidad_prevista`, sin `Pieza`.
- Inyección de HU-03 en una sola transacción, usando las partes guardadas y las cantidades exactas, con códigos aleatorios únicos por proyecto.
- Migración aditiva 006 que conserve datos existentes y complete `cantidad_prevista` en las partes ya registradas.
- Un único botón por proyecto, oculto después de inyectar; reintentos rechazados.

**Non-Goals:**
- Cambiar el estado inicial «Sin piezas cargadas» ni el estado final «En preparación».
- Crear torres, asignar piezas, guías ni aprobación de HU-12.
- Cargar archivos reales o implementar CA2 de HU-03 (sigue siendo desviación documentada).
- Autenticación real, requisitos no funcionales o reinicio/reescritura de las migraciones 001–005.

## Decisions

1. **Migración aditiva `006_cantidad_prevista_partes.sql`.** `ALTER TABLE partes_casa ADD COLUMN cantidad_prevista INTEGER NOT NULL DEFAULT 0`, seguido de `UPDATE partes_casa SET cantidad_prevista = (SELECT COUNT(*) FROM piezas WHERE piezas.parte_casa_id = partes_casa.id) WHERE cantidad_prevista = 0`. Alternativa descartada: editar la migración 003, porque las bases ya desplegadas no volverían a ejecutarla y se perdería el historial de `schema_migrations`. No se borra ni se reinicia la base.
2. **Validación en dominio antes de insertar (HU-02).** `crearProyecto` recibe las cinco cantidades como `unknown`, exige que cada una sea un entero no negativo (acepta el texto del formulario) y que la suma esté entre 1 y 100; si falla devuelve `PARTES_INVALIDAS` con el mensaje acordado. El proyecto, sus partes y la validación se ejecutan dentro de una transacción, junto con la comprobación de código duplicado. Alternativa descartada: validar solo con atributos HTML, que no resiste una petición directa.
3. **Interfaz del generador con las partes ya definidas.** `GeneradorPlano.generar(codigoProyecto, partes: { nombre, cantidad }[])` representa el plano/archivo simulado: entrega, para cada parte guardada, exactamente `cantidad` códigos. `GeneradorPlanoSimulado` mantiene el muestreo aleatorio sin reposición sobre 650 combinaciones (A1…Z25) y el `rng` inyectable. Alternativa descartada: seguir generando nombres y cantidades en el adaptador y descartarlos en el dominio, que duplicaría reglas y rompería la trazabilidad con HU-02.
4. **La inyección no crea partes.** `inyectarPiezasDesdePlano` lee `partes_casa` de la BD, exige estado «Sin piezas cargadas», ausencia de piezas y al menos una parte con cantidad positiva, llama al generador con esa lista y, en una sola transacción, inserta las piezas en las partes existentes (buscadas por `nombre`) y actualiza el proyecto a «En preparación». Alternativa descartada: insertar partes nuevas con los nombres devueltos por el generador, que produciría duplicados por `UNIQUE (proyecto_id, nombre)`.
5. **Vistas y botón.** `proyecto-nuevo.ejs` muestra los cinco campos; `proyecto-creado.ejs` lista las partes creadas con su cantidad prevista y deja claro que hay cero piezas; `proyectos.ejs` ofrece el botón solo si el rol es Encargado, el estado es «Sin piezas cargadas» y no hay piezas (las partes pueden existir). Después de inyectar, el estado «En preparación» oculta el botón. La ruta `POST /proyectos/:codigo/inyectar-piezas` conserva `requiereRol(["Encargado de Despacho"])` y la guarda de dominio.
6. **Pruebas por escenario Gherkin.** Se actualizan `hu-02.crear-proyecto.test.ts` y `hu-03.inyectar-piezas.test.ts` para preparar las cantidades al crear el proyecto, verificar cantidades exactas, códigos únicos, rechazo de cantidades inválidas, rechazo por rol sin crear piezas y rechazo de reintentos. Las pruebas siguen usando bases temporales en `os.tmpdir()`; no tocan `data/app.db`.

## Risks / Trade-offs

- **[Bases existentes con partes creadas por la inyección antigua]** → Mitigación: la migración 006 rellena `cantidad_prevista` con el número real de piezas de cada parte; esos proyectos ya están «En preparación» y no se reinyectan.
- **[Proyectos antiguos «Sin piezas cargadas» sin partes]** → Mitigación: no se inventan partes; el botón no se ofrece hasta que el proyecto tenga partes definidas (en la práctica, solo proyectos creados con la nueva regla).
- **[Duplicidad de nombres entre el formulario y el generador]** → Mitigación: una sola lista `PARTES_CASA` exportada desde `src/dominio/proyectos.ts`, usada por el formulario, la validación, la creación de `ParteCasa` y el mapeo de nombres del generador.
- **[Cambio de firma del generador]** → Mitigación: único punto de selección en `src/integraciones/index.ts`; las pruebas que inyectan un generador fijo se actualizan a la nueva firma.

## Migration Plan

1. Arrancar la aplicación ejecuta `aplicarMigraciones()`, que detecta `006_cantidad_prevista_partes.sql` y la registra en `schema_migrations`; las migraciones 001–005 quedan intactas.
2. La columna nueva se agrega con valor 0 y se completa con el conteo de piezas existentes por parte. No hay borrado de filas ni conversión destructiva.
3. Rollback de desarrollo: restaurar el código anterior y eliminar la fila de `schema_migrations` de la 006; la columna puede permanecer sin efecto. No aplica a producción (proyecto de taller).

## Open Questions

Ninguna. La decisión de negocio (cinco campos, enteros no negativos, total 1–100, cantidades exactas en la inyección, botón único y rechazo de reintentos) fue confirmada expresamente por el estudiante el 2026-11-26.
