## Context

SnapSip ya tiene proyectos (HU-02), universo de piezas simulado (HU-03), consulta de pendientes (HU-06) y tabla `torres` con torres «Abiertas» (HU-04). Falta el paso central del TO-BE: asignar cada panel a su torre con evidencia fotográfica obligatoria (`02-rediseno-to-be.md:44`, tarea de usuario apoyada por «Validar y registrar piezas`). DSS-01 describe siete variantes (`diagramas/dss-01.puml:21-42`) y EST-01 define las transiciones de `Pieza` (`11-diagramas-estado.md:35-36`).

La ficha `.cin324/historias/HU-05.md` quedó confirmada el 2026-11-22. Decisiones relevantes: no se agregan `asignada_por` ni `fecha_hora_asignacion` a `Pieza` (usuario/fecha/hora van en `Evidencia`); la pantalla muestra piezas «Pendiente» **y todas las torres del proyecto** con código, parte y estado; la evidencia se elige entre **3 fotos de demostración con un clic, ninguna preseleccionada**; los mensajes de rechazo son los literales del DSS-01; la invalidación de guías se difiere a HU-08; CA6 se atiende como lectura dentro de CU-05.

Stack real del repositorio: TypeScript + Express + EJS + **`node:sqlite`** (migraciones numeradas en `src/db/migrations/` registradas en `schema_migrations`) + Vitest/supertest. Selector de rol de demostración, sin autenticación real.

## Goals / Non-Goals

**Goals:**
- Asignar una `Pieza` «Pendiente» a una `Torre` «Abierta» del mismo proyecto y parte, con evidencia fotográfica, dejando la pieza «Listo» y creando la `Evidencia` vigente (CA1, EST-01, RP-05).
- Rechazar sin mutar datos: sin evidencia (CA2), pieza «Enviado» (CA5), torre de otra parte (HU-04 CA3), torre «Cerrada» (HU-04 CA4) y fallo del servicio de evidencias (CA4).
- Reasignar una pieza «Listo» con confirmación, nueva evidencia e historial no vigente (CA3).
- Mostrar el listado para asignación y permitir consultar las piezas de una torre (CA6).
- Restringir todo al Operario de Bodega.

**Non-Goals:**
- Invalidar o generar guías de despacho (HU-08), cerrar torres (HU-07), eliminar torres (HU-10), desasignar piezas (HU-11) ni registrar envíos (HU-09).
- Columnas de usuario/fecha en `piezas`; subida real de archivos; almacenamiento externo real.
- Medición de RP-13, HTTPS/TLS (RP-15a), autenticación real y cambios adicionales en artefactos del curso.

## Decisions

1. **Migración `005_asignacion_piezas.sql`, derivada del modelo de dominio.** Agregar `piezas.torre_id` nullable con FK a `torres(id)` (`ON DELETE SET NULL`: la pieza sobrevive a la torre, `08-modelo-dominio.md:24,33`). Crear `evidencias` con `id`, `pieza_id` (FK en cascada), `fotografia`, `fecha_hora_captura`, `responsable`, `vigente` (entero 0/1, por defecto 1). Sin `asignada_por` ni `fecha_hora_asignacion` en `piezas`: `responsable` y `fechaHoraCaptura` de `Evidencia` registran usuario y fecha/hora exigidos por RP-05 (`08-modelo-dominio.md:31`). Alternativa descartada: columnas en `Pieza`, que duplicarían el dato y contradicen la decisión confirmada del estudiante. No se tocan 001-004.

2. **Todas las reglas se validan en dominio, dentro de una transacción.** `asignarPieza(piezaId, torreId, fotografia, confirmar)` vuelve a leer la pieza y la torre y comprueba, en el orden de DSS-01: evidencia presente → pieza no «Enviado» → torre de la misma parte → torre «Abierta» → pieza «Pendiente» o «Listo» con reemplazo confirmado. Solo después llama al servicio de evidencias; con éxito inserta la `Evidencia` y actualiza `piezas.torre_id` y `piezas.estado`. Alternativa descartada: validar solo en la vista, que un POST manipulado eludiría. Mensajes literales: «se exige evidencia fotográfica», «una pieza enviada no puede reasignarse», «la torre no corresponde a la parte de la pieza» y «se sugiere registrar otra torre para la parte».

3. **Fallo del servicio → rollback, sin cambio de estado (CA4).** Si `almacenar()` lanza error, se propagó antes de cualquier `UPDATE`; la transacción se revierte y la pieza sigue «Pendiente» y sin torre. Se comunica «la evidencia no pudo almacenarse». Alternativa descartada: guardar primero la pieza y luego la evidencia, que dejaría una asignación sin respaldo.

4. **Evidencia simulada con elección de fotos, no texto.** Interfaz `ServicioAlmacenamientoEvidencias` con `almacenar(fotografia): referencia`, más un adaptador simulado que ofrece **3 fotos de demostración** como opciones radio (ninguna preseleccionada, sin campo de texto ni `<input type="file">`). La referencia devuelta se guarda en `evidencias.fotografia`. Para CA4 se usa un disparador explícito de prueba (variable de entorno/hook de test, no una cuarta opción visible), de modo que la interfaz siga mostriendo exactamente tres fotos. Patrón análogo a `generadorPlano` de HU-03.

5. **Reasignación en dos pasos, sin estado intermedio.** Si la pieza está «Listo» en otra torre y falta `confirmar=1`, el POST devuelve una vista de confirmación con pieza, torre actual y torre destino; no se escribe nada. Solo el segundo POST con `confirmar=1` ejecuta: marca `evidencias.vigente = 0` para la pieza, crea la nueva evidencia y mantiene `piezas.estado = 'Listo'` (transición Listo → Listo de EST-01). Alternativa descartada: reasignar en el primer POST, que violaría el Gherkin CA3 «Reasignación no confirmada». La baja de guías Vigentes queda para HU-08.

6. **Rutas propias del Operario, sin colisiones.** `GET /piezas/asignar` muestra el listado; `POST /piezas/asignar` ejecuta o pide confirmación; `GET /torres/consultar/:id` atiende CA6. Las tres usan `requiereRol(["Operario de Bodega"])`. Se elige `/torres/consultar/:id` en lugar de `/torres/:id` para no ambigüedad con `/torres/nuevo` de HU-04; se registra en `src/app.ts` junto a los routers existentes y se añaden enlaces en `src/vistas/inicio.ejs` solo para el Operario. Alternativa descartada: reutilizar `/pendientes` (HU-06), que es solo lectura y filtra por piezas sin torre.

7. **CA6 como lectura de apoyo en CU-05.** `GET /torres/consultar/:id` consulta `piezas WHERE torre_id = ?` y muestra `codigo` y `estado` de cada pieza, junto con el código y la parte de la torre. No hay actividad TO-BE, caso de uso ni DSS propios para «Consultar torre», y el estudiante confirmó no crearlos. La vista reutiliza los mismos datos ya persistidos por la asignación.

8. **Estado «Enviado» y guías, solo en pruebas/diferido.** «Enviado» no se produce en la app hasta HU-09; los escenarios CA5 preparan la fila directamente en la BD SQLite temporal, igual que en HU-03/HU-06. No se crea tabla `GuiaDespacho`.

## Risks / Trade-offs

- **[Dos asignaciones concurrentes de la misma pieza] →** transacción con relectura del estado dentro de `asignarPieza()`; SQLite serializa escrituras. La segunda operación ve la pieza ya «Listo» y sigue la ruta de reasignación con confirmación.
- **[La foto simulada pierde el significado de «evidencia fotográfica»] →** se guarda una referencia a una de tres imágenes de demostración y se muestra en la confirmación y en la consulta de torre; es una limitación explícita de la demo, igual que el generador de planos de HU-03.
- **[Mostrar torres «Cerrada» invites a intentar asignar] →** es intencional: el estudiante pidió «todas las torres del proyecto» y así se puede ejercitar el rechazo HU-04 CA4 desde la interfaz.
- **[Reasignación sin guías que invalidar] →** se documenta en la ficha y en la spec; HU-08 implementará la invalidación cuando exista `GuiaDespacho`.
- **[Confusión entre `fechaHoraCaptura` y fecha de asignación] →** en la demo coinciden; se registró como supuesto confirmado en la ficha.

## Migration Plan

Agregar `005_asignacion_piezas.sql` sin tocar 001-004; el mecanismo existente la aplica al arrancar y la registra en `schema_migrations`. No hay datos que migrar: `piezas.torre_id` nace nulo y `evidencias` nace vacía. Rollback en la demo: eliminar el registro de la migración, quitar la columna y la tabla, y borrar el archivo; no se usa en producción.

## Open Questions

Ninguna. Los mensajes de rechazo se proponen literalmente en `specs/asignar-pieza-con-evidencia/spec.md` para su revisión antes de implementar.
