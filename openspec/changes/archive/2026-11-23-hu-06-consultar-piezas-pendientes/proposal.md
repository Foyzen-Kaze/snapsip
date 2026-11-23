## Why

El AS-IS obligaba al Operario de Bodega a «buscar frenéticamente las piezas faltantes en la bodega»; el TO-BE sustituye esa búsqueda por una consulta en tiempo real de lo que aún falta por asignar (`02-rediseno-to-be.md:45`). Esta historia implementa esa actividad del TO-BE para la HU-06 (RP-06 / CU-06), una vez que HU-03 ya dejó el universo de piezas cargado.

## What Changes

- Agregar la pantalla/consulta **«Consultar piezas pendientes»** para el **Operario de Bodega**, con selector propio de `Proyecto` y `ParteCasa` (no se reutiliza `/proyectos`, reservado al Encargado de Despacho).
- Listar únicamente `Pieza.codigo` cuyo `Pieza.estado` sea «Pendiente» en la `ParteCasa` elegida, excluyendo otras partes y los demás estados.
- Mostrar explícitamente **«0 pendientes»** solo cuando la parte elegida no tiene piezas pendientes; si falta proyecto o parte, pedir la selección sin mostrar ese mensaje.
- Rechazar el acceso de otros roles sin revelar datos, apoyándose en el control de acceso de demostración ya existente (HU-01).
- Agregar dos pruebas de integración, una por escenario Gherkin de HU-06, y actualizar el README con la nueva consulta.

**Fuera del alcance:** crear torres (HU-04), asignar piezas con evidencia (HU-05), cambiar estados, generar guías, registrar envíos, desasignar piezas, crear columna `torre_id` o tabla `torres`, implementar RP-14 ni autenticación real. No se modifican la HU-06, su Gherkin ni ningún artefacto del curso.

## Capabilities

### New Capabilities
- `consulta-piezas-pendientes`: consulta de piezas en estado «Pendiente» de una `ParteCasa` de un `Proyecto`, con validación de selección, mensaje «0 pendientes» y control de acceso por rol de demostración.

### Modified Capabilities
- (ninguna; `acceso-por-rol-demo` ya contempla el rechazo por rol y no cambia sus requisitos)

## Impact

- **Código:** nueva ruta y vista EJS de consulta; consulta filtrada sobre las tablas existentes `proyectos`, `partes_casa` y `piezas` (migraciones 001 y 003). Sin migración nueva.
- **Acceso:** usa `roles.ts` y la sesión/cookie de rol de demostración; la función «Consultar piezas pendientes (HU-06, pendiente)» pasa a estar implementada.
- **Pruebas:** dos pruebas de integración con SQLite temporal; los datos con otros estados y la parte sin pendientes se preparan directamente en la BD (supuesto confirmado, HU-05 aún no asigna piezas).
- **Documentación de uso:** `README.md`.
- **Sistemas externos:** ninguno; no hay adaptadores ni integraciones simuladas en esta historia.
