## Context

HU-06 · Consultar piezas pendientes (actividad TO-BE del `02-rediseno-to-be.md:45`, CU-06 del `09-casos-de-uso.md:24`, RP-06 del `03-requisitos.md:14`) ya está generada. El cambio `ajuste-hu-06-selectores-proyecto-partes` (aún sin archivar) añadió CA3-CA6: proyectos por `cliente (codigo)`, selector de Parte filtrado por proyecto con piezas y aviso «Sin piezas cargadas».

Estado actual: `src/rutas/pendientes.ts` calcula `partes` solo si la petición trae `?proyectoId=`; `src/vistas/pendientes.ejs` renderiza ambos `<select>` con `required` y no dispara ninguna petición al cambiar de Proyecto. En la pantalla inicial el selector de Parte queda vacío; al elegir un Proyecto no ocurre nada y, al pulsar «Consultar», el navegador bloquea el envío porque la Parte es obligatoria y está vacía («selecciona un elemento de la lista»). La decisión 4 del diseño anterior asumía que el operario enviaría el formulario y prohibía JavaScript: esa suposición es la causa del defecto.

La ronda de validación del 2026-11-22 dictaminó Tipo D (defecto de generación, sin artefactos del curso que cambiar). El estudiante confirmó el flujo y precisó que el llenado debe ocurrir **apenas elige el Proyecto, sin pulsar «Consultar»**.

Restricciones: una sola historia (HU-06); no tocar artefactos del curso; sin autenticación real (selector de rol de demostración de HU-01); sin migraciones ni dependencias nuevas; español en interfaz y artefactos.

## Goals / Non-Goals

**Goals:**
- Poblar el selector de Parte automáticamente al cambiar de Proyecto, con las `ParteCasa` de ese proyecto que tienen `Pieza` cargada (CA4, CA5).
- Descartar la Parte previamente elegida al cambiar de Proyecto (CA5).
- Mantener la ruta y los textos actuales, reutilizando el cálculo de `partes` ya existente.
- Evitar que el `required` del selector de Parte vacío bloquee el reenvío.

**Non-Goals:**
- Crear un endpoint JSON ni una API nueva.
- Añadir bibliotecas, frameworks front-end ni pasos de compilación de cliente.
- Cambiar la consulta de piezas pendientes (CA1), el mensaje «0 pendientes» (CA2), el formato `cliente (codigo)` (CA3), el aviso «Sin piezas cargadas» (CA6), la validación de selección incompleta ni el control de rol.
- Modificar migraciones, estados del dominio o artefactos del curso.
- Decidir el orden de archivado de este cambio y del anterior (se deja para el cierre de la ronda).

## Decisions

1. **Mecanismo: reenvío del formulario GET mediante un manejador `change` mínimo en la vista.** Añadir al final de `src/vistas/pendientes.ejs` un `<script>` que, al dispararse `change` en `#proyectoId`, pone `#parteCasaId.value = ''` y llama a `proyecto.form.submit()`. `HTMLFormElement.submit()` no ejecuta la validación HTML5, así que el `required` vacío de la Parte no bloquea el reenvío. La recarga llega a `/pendientes?proyectoId=<id>&parteCasaId=` y la ruta existente ya devuelve las partes. Alternativas consideradas: (a) `onchange` inline en el `<select>`, equivalente pero mezcla comportamiento en el marcado; se prefiere el `<script>` separado; (b) `fetch` a un nuevo endpoint JSON, descartado porque añade una ruta y manejo del DOM sin beneficio en una demo de una sola página; (c) sustituir el `<select>` por enlaces por proyecto, descartado porque cambia el control que pide el Gherkin.

2. **Sin cambios en la ruta ni en el dominio.** `listarPartesPorProyecto(proyectoId)` ya filtra con `EXISTS` sobre `piezas` (CA4/CA5) y `proyectoEstaSinPiezas()` ya detecta el estado «Sin piezas cargadas» (CA6). El reenvío ejercita el flujo que ya existía para el envío manual; no se duplica lógica, solo se verifica con pruebas.

3. **Descarte de la Parte al cambiar de Proyecto.** El manejador limpia `#parteCasaId` antes de enviar, para no arrastrar un `parteCasaId` de otro proyecto. La ruta ya ignora un `parteCasaId` ajeno a las partes del proyecto (`parteElegida = partes.find(...)` → `haySeleccion = false`), pero limpiar en cliente evita estados confusos en la URL.

4. **Caída graceful sin JavaScript.** Si el navegador no ejecuta el script, el selector de Proyecto y el botón «Consultar» siguen funcionando como antes; no se introduce dependencia que impida cargar la página.

5. **Especificación como requisito `ADDED` distinto.** En lugar de reescribir «Selector de ParteCasa según el Proyecto elegido» (que vive en el delta del cambio anterior sin archivar), se añade «Llenado automático del selector de Parte al elegir Proyecto». Así se evitan colisiones al consolidar ambos deltas y se hace explícita la condición «sin pulsar Consultar» que faltaba.

## Risks / Trade-offs

- **[La recarga completa al cambiar de Proyecto puede percibirse como un salto] →** Es una demo de una sola pantalla y el proyecto elegido se conserva en la URL; se documenta en el README. No se añade `fetch` solo para evitarla.
- **[`form.submit()` omite la validación HTML5, así que el reenvío puede ir sin Parte] →** Es lo deseado durante el reenvío automático: la ruta ya responde «Seleccione un Proyecto y una Parte de la casa para consultar.» sin resultados ni «0 pendientes». El botón «Consultar» sigue validando en el envío del usuario.
- **[Dos deltas sin archivar sobre la misma capacidad] →** Los nombres de requisitos son distintos, así que al archivar se consolidan sin sobrescribirse.
- **[Las pruebas HTTP no ejecutan JavaScript de navegador] →** Se comprueba por un lado que la vista incluye el manejador `change` y por otro que la petición que genera (`?proyectoId=`) devuelve solo las partes del proyecto. Cobertura suficiente para el alcance del curso.

## Migration Plan

Sin migración de datos: no hay tablas ni columnas nuevas. Despliegue = regenerar la vista y ejecutar las pruebas. Rollback = revertir el manejador en la vista; la ruta y el dominio quedan intactos.

## Open Questions

Ninguna. El mecanismo, el vocabulario y el alcance quedaron confirmados por el estudiante el 2026-11-23.
