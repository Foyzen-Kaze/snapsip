# Informe de validación — HU-03 · Simulación del plano/archivo en la demo
**Fecha:** 2026-11-18  ·  **Opción:** B (te propongo, tú apruebas)  ·  **Estado:** supuesto acordado; pendiente de generar HU-03

## Resumen
| Obs. | Lo que dijiste | Clasificación | Qué se hace | Artefactos que NO se cambian |
|------|----------------|---------------|-------------|------------------------------|
| OBS-1 | El profesor indicó simular HU-03 porque leer el plano/archivo es demasiado complejo. No es un cambio de requisito: en el sistema real RP-03 sigue siendo cargar el archivo; solo la demo lo simula, como el selector de rol de HU-01. | **Supuesto de demo / desviación documentada** (no tipo A: no hay cambio de requisito) | Registrar el supuesto en `.cin324/proyecto.md` → «Supuestos acordados» y generar HU-03 desde los artefactos tal como están. | `03-requisitos.md` (RP-03), `04-historias-usuario.md` (HU-03), `07-criterios-aceptacion.md` (Gherkin de HU-03) y HU-02/su spec/sus pruebas. |

**Lo que sí funcionó:** HU-01 y HU-02 quedaron generadas y verificadas (4/4 y 7/7). El script artesanal dejó el proyecto en «En preparación» con piezas «Pendiente» sin torre, forma compatible con la precondición de HU-04; aun así se descarta y no se commitea.

## Decisión acordada
1. **No se cambia el texto** de RP-03 (`03-requisitos.md`), de HU-03 (`04-historias-usuario.md`) ni de sus escenarios Gherkin (`07-criterios-aceptacion.md`). La indicación del profesor queda registrada como **supuesto**, con fecha 2026-11-18, en `.cin324/proyecto.md` → «Supuestos acordados».
2. **HU-03 CA2** (formato inválido / filas incompletas) **no se representa en la demo**. Queda como **desviación documentada**, igual que CA2 de HU-01.
3. **La inyección no ocurre al crear el proyecto y HU-02 no se toca.** El proyecto sigue naciendo en «Sin piezas cargadas» (`04-historias-usuario.md:21`, `openspec/specs/crear-proyecto/spec.md`, `tests/hu-02.crear-proyecto.test.ts`).

## Cómo se simula HU-03 en la demo
- Botón **«Inyectar piezas desde plano/archivo»** en el proyecto.
  - Visible solo para el **Encargado de Despacho**.
  - Visible solo si el proyecto está en **«Sin piezas cargadas»**.
  - Si otro rol lo intenta, se **rechaza sin modificar datos** (HU-01 CA3).
- Al presionarlo el sistema genera al azar:
  - entre **1 y 5 partes de la casa**;
  - hasta **100 piezas**;
  - siempre con **menos partes que piezas** y **al menos una pieza en cada parte**.
- Resultado exigido por **CA1**:
  - cada pieza en **«Pendiente»**, **sin torre** y **asociada a su parte**;
  - el proyecto pasa a **«En preparación»**;
  - se muestra **cuántas partes y piezas se crearon**.
- Persistencia: partes y piezas van en **tablas nuevas (migración 003)** con los nombres del modelo de dominio (`ParteCasa`, `Pieza`), para que **HU-04** las use.

## Cómo trabajamos los cambios
Opción **B**: te propongo cada cambio y tú apruebas, modificas o descartas cada uno. Yo no toco el código ni los documentos del curso sin tu aprobación explícita. En esta ronda aprobaste únicamente los dos puntos de la sección siguiente.

## Cambios aprobados y aplicados en esta ronda
- [x] Agregar el supuesto de 2026-11-18 (indicación del profesor) en `.cin324/proyecto.md` → «Supuestos acordados», para que `/cin324-generar-app` lo use al generar HU-03.
- [x] Guardar este informe en `.cin324/validaciones/VAL-HU-03-1.md` (sustituye la versión anterior, que proponía cambiar RP-03/HU-03/Gherkin y quedó descartada).

## Pendiente
- [ ] Generar **HU-03** con `/cin324-generar-app` (Paso 3: ficha de la historia; ya hay stack definido y no se pregunta de nuevo). El botón se implementa como simulación de integración, con interfaz y versión simulada, avisándote de ello.
- [ ] Verificar que HU-02 sigue intacta (spec y pruebas) y que la migración 003 no altera las tablas de HU-01/HU-02.
- [ ] Validar el sistema resultante con `/cin324-validar-sistema` y dejar registrada la desviación de CA2.

## Siguiente paso
Cuando lo indiques, ejecutamos `/cin324-generar-app` para **HU-03** partiendo de los artefactos sin cambios y del supuesto ya registrado. El script artesanal `src/db/inyectar-hu03.ts` se descarta: no se usa como base ni se commitea.
