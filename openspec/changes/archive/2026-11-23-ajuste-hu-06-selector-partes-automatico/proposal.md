## Why

La consulta de piezas pendientes (HU-06) se generó con un selector de Parte de la casa que solo se puebla cuando el formulario `/pendientes` se envía pulsando «Consultar». Como el selector de Parte es obligatorio y queda vacío, el navegador bloquea el envío con «selecciona un elemento de la lista» y el operario no puede elegir ninguna parte. La ronda de validación del 2026-11-22 clasificó esto como defecto de generación (Tipo D): los artefactos del curso ya exigen lo contrario. CA4/CA5 (`07-criterios-aceptacion.md:253-272`) y la ficha confirmada (`.cin324/historias/HU-06.md:30`, flujo paso 3) indican que, al seleccionar el Proyecto, el sistema debe ofrecer sus `ParteCasa` con piezas. El estudiante confirmó el 2026-11-23 que el llenado debe ser **inmediato, sin pulsar «Consultar»**. Este ajuste corrige la generación para cumplir ese comportamiento.

## What Changes

- Al cambiar el Proyecto en `/pendientes`, el selector de Parte se puebla **automáticamente** con las `ParteCasa` de ese proyecto que tienen `Pieza` cargada, sin que el operario pulse «Consultar» ni edite la URL (CA4, CA5).
- Al cambiar de Proyecto se descarta la Parte elegida antes, para que nunca quede seleccionada una parte de otro proyecto (CA5).
- Se añade un manejador mínimo en la vista que reenvía el formulario GET al cambiar de Proyecto; **no se crea un endpoint nuevo ni se añaden dependencias**.
- Se documenta que la decisión anterior que prohibía JavaScript y daba por hecho el envío manual queda corregida (ver `design.md` del cambio `ajuste-hu-06-selectores-proyecto-partes`, aún sin archivar).
- Se añaden pruebas automáticas del llenado automático y del descarte de la Parte al cambiar de Proyecto.
- Se conservan sin cambios: CA1 (piezas «Pendiente»), CA2 («0 pendientes»), CA3 (proyecto por cliente y código), CA6 (aviso «Sin piezas cargadas»), la validación de selección incompleta y el rechazo por rol (HU-01 CA3).

## Capabilities

### New Capabilities

- Ninguna.

### Modified Capabilities

- `consulta-piezas-pendientes`: se añade el requisito de llenado automático del selector de Parte en el instante en que se selecciona el Proyecto, sin pulsar «Consultar», y el descarte de la Parte anterior al cambiar de Proyecto. La especificación de esta capacidad aún no está archivada en `openspec/specs/`; su fuente actual es el delta de `openspec/changes/ajuste-hu-06-selectores-proyecto-partes/specs/consulta-piezas-pendientes/spec.md` (cambio pendiente de archivo).

## Impact

- Código afectado: `src/vistas/pendientes.ejs` (manejador `change` sobre `#proyectoId` que limpia `#parteCasaId` y reenvía el formulario). La ruta `src/rutas/pendientes.ts` y el dominio `src/dominio/pendientes.ts` ya calculan y devuelven las partes desde `?proyectoId=`; solo se verifica su comportamiento, sin cambios funcionales.
- Pruebas afectadas: `tests/hu-06.consultar-piezas-pendientes.test.ts` (nuevas pruebas de llenado automático y de descarte de la Parte al cambiar de Proyecto).
- Especificaciones: delta `ADDED` sobre `consulta-piezas-pendientes`, que se integrará al archivar. Existe otro cambio sin archivar sobre la misma capacidad; al archivar ambos se consolidarán sus requisitos en `openspec/specs/consulta-piezas-pendientes/spec.md`.
- Sin migraciones SQL nuevas, sin dependencias nuevas, sin sistemas externos. No se modifican los artefactos del curso: ya describen el comportamiento esperado.
- Trazabilidad: actividad del TO-BE «Consultar piezas pendientes» (`02-rediseno-to-be.md:45`), caso de uso `CU-06` (`09-casos-de-uso.md:24`), requisito `RP-06` (`03-requisitos.md:14`).
- Fuera de alcance: HU-01 (selector de rol de demostración), HU-03 (simulación de carga de plano/archivo y su CA2), HU-04/HU-05 (torres y asignación), modificar RP-06 o los artefactos del curso, cambiar estados del dominio y añadir autenticación real.
