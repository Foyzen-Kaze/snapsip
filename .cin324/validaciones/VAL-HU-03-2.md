# Informe de validación — HU-03 · Formato de los códigos de pieza en la demo
**Fecha:** 2026-11-18  ·  **Cambio de OpenSpec validado:** `hu-03-inyectar-piezas`  ·  **Opción:** B (te propongo, tú apruebas)  ·  **Estado:** artefactos actualizados

## Resumen
| Obs. | Lo que observaste | Tipo | Artefacto principal a modificar | También revisar |
|------|-------------------|------|----------------------------------|------------------|
| OBS-1 | Los códigos salen como `5666-P001`, `5666-P002`…; quieres letra A–Z + número 1–25 (p. ej. `A3`, `I5`), al azar y sin repetir dentro del proyecto; entre proyectos distintos sí pueden repetirse. Es un cambio del supuesto acordado, no de RP-03, HU-03 ni del Gherkin. | **A** (cambio de supuesto acordado: el sistema hace lo que dicen los artefactos y quieres otra cosa) | `.cin324/historias/HU-03.md` → precisión sobre `Pieza.codigo` (tabla de entidades, decisión de 2026-11-18 y supuesto «Aleatoriedad acotada») | `.cin324/proyecto.md` → «Supuestos acordados», bloque de HU-03; se verifica que `03`, `04`, `07`, `08`, `09`, `10`, `11`, `12` no fijan el formato; los archivos de `openspec/changes/hu-03-inyectar-piezas/` se regeneran, no se editan aquí |

**Lo que sí funcionó:** creaste 5 partes y 61 piezas, todas en «Pendiente» y sin torre, asociadas a su parte; el proyecto pasó a «En preparación» y se mostraron los conteos. Coincide con HU-03 CA1 y con el supuesto de demo de `.cin324/proyecto.md:26-33`.

## Detalle por observación

### OBS-1 — Códigos de pieza con formato letra + número
- **Lo que dijiste:** «los códigos de las piezas salen como 5666-P001, 5666-P002…; queremos que cada pieza se nombre con una letra de la A a la Z y un número del 1 al 25, por ejemplo A3 o I5, elegidos al azar y sin repetirse dentro del proyecto; en proyectos distintos sí se pueden repetir».
- **Qué dicen hoy los artefactos:**
  - `.cin324/historias/HU-03.md:22`: `codigo` «único dentro del proyecto, p. ej. `<código del proyecto>-P001`».
  - `.cin324/historias/HU-03.md:91`: decisión de 2026-11-18, «código de pieza único por proyecto con formato `<código del proyecto>-P001`».
  - `.cin324/historias/HU-03.md:99`: supuesto «código de pieza único dentro del proyecto».
  - `.cin324/proyecto.md:26-33`: bloque de supuestos de HU-03 (simulación de demo, límites de generación y CA1); hoy **no** escribe el formato del código, así que la precisión nueva debe incorporarse a ese mismo bloque.
  - Especificación generada (solo como evidencia de lo que produjo el código, no se edita aquí): `openspec/changes/hu-03-inyectar-piezas/specs/inyectar-piezas/spec.md:18,27`, `design.md:30`, `proposal.md:10`, `tasks.md:9,28` repiten `<codigo del proyecto>-P001`.
- **Diagnóstico:** tipo **A**. El sistema cumplió los artefactos vigentes; el cambio está en la decisión acordada sobre el formato, no en un defecto de generación. No se toca RP-03 (`03-requisitos.md:11`), HU-03 (`04-historias-usuario.md:25`) ni el Gherkin (`07-criterios-aceptacion.md:72`): ninguno de los tres fija el formato del código.
- **Qué debes modificar tú:**
  - `.cin324/historias/HU-03.md`: sustituir el formato antiguo en los tres lugares citados por «letra de la A a la Z y número del 1 al 25, elegidos al azar; código completo único dentro del proyecto; se permite repetir en proyectos distintos».
  - `.cin324/proyecto.md`: añadir esa misma regla como detalle del supuesto de demo de HU-03, dejando explícito que en el sistema real RP-03 el código sigue viniendo del archivo.
  - **Decisión a confirmar:** interpreto «sin repetirse dentro del proyecto» como que no se repite el **código completo** (par letra+número); la letra y el número pueden repetirse por separado mientras el par sea distinto (p. ej. `A3` y `A5` son válidos). Es la única lectura compatible con «hasta 100 piezas» y 26 letras. Dime si la quieres distinta.
- **Para mantener la consistencia, revisa:**
  - `08-modelo-dominio.md:13` y `diagramas/modelo-de-dominio.puml:36-39`: `Pieza` solo declara el atributo `codigo`, sin formato → **sin cambios**.
  - `03-requisitos.md` (RP-03), `04-historias-usuario.md` (HU-03) y `07-criterios-aceptacion.md` (Gherkin de HU-03): no mencionan el formato → **sin cambios**, como pediste.
  - `09-casos-de-uso.md` (CU-03), `10-diagramas-secuencia.md` (sin DSS propio), `11-diagramas-estado.md` (EST-01), `12-trazabilidad.md`: no describen el dato → **sin cambios**; no hay IDs nuevos.
  - `openspec/changes/hu-03-inyectar-piezas/**`: quedarán desalineados hasta la regeneración; la skill de validación **no** los edita.

## Orden sugerido de edición
1. `.cin324/historias/HU-03.md` (OBS-1: tabla de entidades, decisión y supuesto).
2. `.cin324/proyecto.md` (OBS-1: «Supuestos acordados», bloque de HU-03).
3. Sin cambios en `02`, `03`, `04`, `07`, `08`, `09`, `10`, `11`, `12` ni en trazabilidad. Los archivos de `openspec/` y el `README.md` se actualizan al regenerar con `/cin324-generar-app`.

## Cómo trabajamos los cambios
Opción **B**, elegida por ti: te propongo cada cambio y tú apruebas, modificas o descartas cada uno. No toco el código ni los archivos de `openspec/`, y no aplico ningún cambio sin tu aprobación explícita.

## Cómo sabrás que terminaste
- [ ] Se actualizó `.cin324/historias/HU-03.md` en las tres precisiones sobre el código.
- [ ] Se actualizó `.cin324/proyecto.md` → «Supuestos acordados» con la nueva regla, sin tocar RP-03/HU-03/Gherkin.
- [ ] Confirmamos la interpretación de «sin repetirse» (código completo, no letra ni número por separado).
- [ ] Revisé la consistencia final de los artefactos tocados y todo está ✔.

## Siguiente paso
Cuando todo esté revisado: haz commit de tus artefactos y ejecuta `/cin324-generar-app` para generar el ajuste `ajuste-hu-03-codigos-pieza` (con validación de historia y revisión de especificaciones, sin repetir stack). Después, vuelve a ejecutar `/cin324-validar-sistema` para comprobar que los códigos salen como `A3`, `I5`, etc.
