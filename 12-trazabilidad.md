# Trazabilidad

Esta matriz enlaza cada requisito de la [Entrega 1](./03-requisitos.md) con su [historia de usuario](./04-historias-usuario.md), su [caso de uso](./09-casos-de-uso.md), su [diagrama de secuencia](./10-diagramas-secuencia.md), su [diagrama de estado](./11-diagramas-estado.md) y las clases del [modelo de dominio](./08-modelo-dominio.md) que intervienen.

Identificadores de los diagramas:

- **Secuencia:** DSS-01 Asignar pieza a torre con evidencia · DSS-02 Generar guía de despacho y registrar envío con evidencia · DSS-03 Autenticarse
- **Estado:** EST-01 Pieza · EST-02 Torre · EST-03 GuiaDespacho

Los diagramas de secuencia y de estado de cada fila son los que declaran ese requisito en su campo «Requisitos» de [10-diagramas-secuencia.md](./10-diagramas-secuencia.md) y [11-diagramas-estado.md](./11-diagramas-estado.md).

## Matriz de trazabilidad

| Requisito (Entrega 1) | Historia | Caso de uso | Secuencia | Estado | Clases del dominio |
|-----------------------|----------|-------------|-----------|--------|---------------------|
| RP-01 | HU-01 | CU-01 | DSS-03 | — | — |
| RP-02 | HU-02 | CU-02 | — | — | Proyecto |
| RP-03 | HU-03 | CU-03 | — | EST-01 | Proyecto, ParteCasa, Pieza |
| RP-04 | HU-04 | CU-04 | DSS-01 | EST-02 | Torre, ParteCasa, Proyecto |
| RP-05 | HU-05 | CU-05 | DSS-01 | EST-01, EST-03 | Pieza, Torre, Evidencia, GuiaDespacho |
| RP-06 | HU-06 | CU-06 | — | — | Pieza, ParteCasa |
| RP-07 | HU-07 | CU-07 | — | EST-02, EST-03 | Torre, GuiaDespacho |
| RP-08 | HU-08 | CU-08 | DSS-02 | — | ParteCasa, Proyecto, Pieza |
| RP-09 | HU-08 | CU-08 | DSS-02 | EST-03 | GuiaDespacho, Proyecto, ParteCasa, Pieza, Torre |
| RP-10 | HU-09 | CU-09 | DSS-02 | EST-01, EST-02, EST-03 | GuiaDespacho, Pieza, Torre, Evidencia |
| RP-11 | HU-10 | CU-10 | — | EST-02 | Torre |
| RP-12 | HU-11 | CU-11 | DSS-02 | EST-01, EST-03 | Pieza, Torre, Evidencia, GuiaDespacho |
| RP-13 | HU-05 | CU-05 | DSS-01 | — | Pieza, Torre, Evidencia |
| RP-14 | HU-01, HU-06, HU-08 | CU-01, CU-06, CU-08 | DSS-02, DSS-03 | — | — |
| RP-15a | HU-01 a HU-11 | CU-01 a CU-11 | DSS-01, DSS-02, DSS-03 | — | — |
| RP-15b | HU-01 | CU-01 | DSS-03 | — | — |
| RP-16 | HU-01 a HU-11 | CU-01 a CU-11 | DSS-03 | — | — |
| RD-01 | HU-05, HU-07, HU-08, HU-09, HU-11 | CU-05, CU-07, CU-08, CU-09, CU-11 | DSS-02 | EST-01, EST-02, EST-03 | GuiaDespacho, Pieza, Torre |

## Correspondencia con el TO-BE de la Entrega 1

La actividad TO-BE es el campo «Actividad TO-BE asociada» de cada historia en [04-historias-usuario.md](./04-historias-usuario.md), que coincide con el título de la historia y con la tarea del [diagrama TO-BE](./02-rediseno-to-be.md). El caso de uso lleva el nombre que tiene en [09-casos-de-uso.md](./09-casos-de-uso.md): un verbo en infinitivo tomado del «quiero…» de la historia.

| Historia | Actividad TO-BE asociada | Caso de uso |
|----------|---------------------------|-------------|
| HU-01 | Autenticación de usuarios | CU-01 Autenticarse |
| HU-02 | Crear proyecto | CU-02 Crear proyecto |
| HU-03 | Inyectar piezas desde plano/archivo | CU-03 Inyectar piezas desde plano/archivo |
| HU-04 | Crear torre | CU-04 Crear torre |
| HU-05 | Asignar pieza a torre con evidencia (incluye la tarea del sistema Validar y registrar piezas) | CU-05 Asignar pieza a torre con evidencia |
| HU-06 | Consultar piezas pendientes | CU-06 Consultar piezas pendientes |
| HU-07 | Cierre manual de torre | CU-07 Cerrar torre manualmente |
| HU-08 | Generar guía de despacho (incluye Validar completitud por Parte o Proyecto) | CU-08 Generar guía de despacho |
| HU-09 | Registrar envío con evidencia | CU-09 Registrar envío con evidencia |
| HU-10 | Eliminar torre vacía con código | CU-10 Eliminar torre vacía con código |
| HU-11 | Desasignar pieza de una torre | CU-11 Desasignar pieza de una torre |

Tareas del TO-BE sin historia ni caso de uso propio:

| Tarea del TO-BE | Tipo | Dónde se trata |
|-----------------|------|----------------|
| Validar y registrar piezas | Tarea de servicio (la ejecuta el sistema) | Dentro de CU-05 / HU-05 |
| Validar completitud por Parte o Proyecto | Tarea de servicio (la ejecuta el sistema) | Dentro de CU-08 / HU-08 (RP-08) |
| Cargar camión | Tarea manual (sin apoyo del sistema) | Nota «Cargar camión» de DSS-02, entre CU-08 y CU-09 |

## Trazabilidad con el código y las pruebas

Esta sección enlaza cada historia implementada con su cambio de OpenSpec, su especificación vigente, el código que la realiza y sus pruebas automáticas. Cada cambio de OpenSpec está archivado en [`openspec/changes/archive/`](./openspec/changes/archive/) con su `proposal.md`, `design.md`, `tasks.md` y `specs/`, y sus requisitos están integrados en [`openspec/specs/`](./openspec/specs/). Las pruebas se ejecutan con `npm test` (ver [README](./README.md)) y cada una lleva el prefijo `HU-xx · ` seguido del nombre del escenario Gherkin de [07-criterios-aceptacion.md](./07-criterios-aceptacion.md).

### Historia → OpenSpec → código → prueba

| Historia | Cambio de OpenSpec (archivado) | Especificación vigente | Operación del actor (ruta) | Código | Pruebas |
|----------|--------------------------------|------------------------|----------------------------|--------|---------|
| HU-01 | `hu-01-autenticacion-usuarios` | [acceso-por-rol-demo](./openspec/specs/acceso-por-rol-demo/spec.md) | `GET /`, `POST /acceso/rol`, `GET /operaciones/despacho/ejemplo` | [rutas/acceso.ts](./src/rutas/acceso.ts), [rutas/operaciones.ts](./src/rutas/operaciones.ts), [middleware/contextoAcceso.ts](./src/middleware/contextoAcceso.ts), [acceso/roles.ts](./src/acceso/roles.ts), [ServicioAutenticacionSimulado.ts](./src/integraciones/ServicioAutenticacionSimulado.ts), migración [001](./src/db/migrations/001_usuarios_demo.sql) | [hu-01.acceso-por-rol.test.ts](./tests/hu-01.acceso-por-rol.test.ts) |
| HU-02 | `hu-02-crear-proyecto` | [crear-proyecto](./openspec/specs/crear-proyecto/spec.md) | `GET /proyectos/nuevo`, `POST /proyectos`, `GET /proyectos` | [dominio/proyectos.ts](./src/dominio/proyectos.ts) (`crearProyecto`), [rutas/proyectos.ts](./src/rutas/proyectos.ts), migración [002](./src/db/migrations/002_proyectos.sql) | [hu-02.crear-proyecto.test.ts](./tests/hu-02.crear-proyecto.test.ts) |
| HU-03 | `hu-03-inyectar-piezas`, `ajuste-hu-03-codigos-pieza` | [inyectar-piezas](./openspec/specs/inyectar-piezas/spec.md) | `POST /proyectos/:codigo/inyectar-piezas` | [dominio/piezas.ts](./src/dominio/piezas.ts) (`inyectarPiezasDesdePlano`), [rutas/proyectos.ts](./src/rutas/proyectos.ts), [GeneradorPlanoSimulado.ts](./src/integraciones/GeneradorPlanoSimulado.ts), migración [003](./src/db/migrations/003_partes_casa_piezas.sql) | [hu-03.inyectar-piezas.test.ts](./tests/hu-03.inyectar-piezas.test.ts) |
| HU-04 | `hu-04-crear-torre` | [crear-torre](./openspec/specs/crear-torre/spec.md) | `GET /torres/nuevo`, `POST /torres` | [dominio/torres.ts](./src/dominio/torres.ts) (`crearTorre`), [rutas/torres.ts](./src/rutas/torres.ts), migración [004](./src/db/migrations/004_torres.sql) | [hu-04.crear-torre.test.ts](./tests/hu-04.crear-torre.test.ts); CA3 y CA4 en [hu-05.asignar-pieza-con-evidencia.test.ts](./tests/hu-05.asignar-pieza-con-evidencia.test.ts) |
| HU-05 | `hu-05-asignar-pieza-con-evidencia` | [asignar-pieza-con-evidencia](./openspec/specs/asignar-pieza-con-evidencia/spec.md) | `GET /piezas/asignar`, `POST /piezas/asignar`, `GET /torres/consultar/:id` | [dominio/asignaciones.ts](./src/dominio/asignaciones.ts) (`asignarPieza`, `consultarTorre`), [rutas/asignaciones.ts](./src/rutas/asignaciones.ts), [ServicioAlmacenamientoEvidenciasSimulado.ts](./src/integraciones/ServicioAlmacenamientoEvidenciasSimulado.ts), migración [005](./src/db/migrations/005_asignacion_piezas.sql) | [hu-05.asignar-pieza-con-evidencia.test.ts](./tests/hu-05.asignar-pieza-con-evidencia.test.ts) |
| HU-06 | `hu-06-consultar-piezas-pendientes`, `ajuste-hu-06-selectores-proyecto-partes`, `ajuste-hu-06-selector-partes-automatico` | [consulta-piezas-pendientes](./openspec/specs/consulta-piezas-pendientes/spec.md) | `GET /pendientes` | [dominio/pendientes.ts](./src/dominio/pendientes.ts) (`consultarPiezasPendientes`, `listarPartesPorProyecto`), [rutas/pendientes.ts](./src/rutas/pendientes.ts) | [hu-06.consultar-piezas-pendientes.test.ts](./tests/hu-06.consultar-piezas-pendientes.test.ts) |
| HU-07 a HU-11 | — | — | — | No implementadas | — |

Las vistas de cada ruta están en [`src/vistas/`](./src/vistas/) con el nombre de la operación (`proyecto-nuevo.ejs`, `torre-nuevo.ejs`, `asignacion-nueva.ejs`, `pendientes.ejs`, etc.).

### Escenario Gherkin → prueba automática

| Historia | Criterio | Escenario Gherkin | Prueba |
|----------|----------|-------------------|--------|
| HU-01 | CA1 | Acceso con credenciales válidas | `HU-01 · Acceso concedido al seleccionar un rol de demostración (adaptación de CA1)` |
| HU-01 | CA2 | Rechazo de credenciales inválidas | `HU-01 · No se concede acceso sin rol de demostración establecido (CA2 adaptado en demo)` |
| HU-01 | CA3 | Rechazo de una operación no autorizada para el rol | `HU-01 · Rechazo de una operación no autorizada para el rol (CA3)` |
| HU-02 | CA1 | Creación de un proyecto con código único | `HU-02 · Creación de un proyecto con código único (CA1)` |
| HU-02 | CA2 | Rechazo de un código de proyecto duplicado | `HU-02 · Rechazo de un código de proyecto duplicado (CA2)` |
| HU-02 | CA3 | Rechazo de la creación de una torre antes de inyectar las piezas | `HU-02 · Rechazo de la creación de una torre antes de inyectar las piezas (CA3)` y, desde la creación de torres, `HU-02 · Rechazo de la creación de una torre antes de inyectar las piezas` |
| HU-03 | CA1 | Inyección de piezas desde un archivo válido | `HU-03 · Inyección de piezas desde un archivo válido (simulado en la demo) — CA1` |
| HU-03 | CA2 | Rechazo de un archivo con formato inválido | `HU-03 · CA2 adaptado: no existe carga de archivo inválido en la demo` |
| HU-03 | CA2 | Rechazo de un archivo con filas incompletas | `HU-03 · CA2 adaptado: no se registran piezas parciales en la generación simulada` |
| HU-04 | CA1 | Creación de una torre para una parte de la casa | `HU-04 · Creación de una torre para una parte de la casa` |
| HU-04 | CA2 | Creación de una segunda torre para la misma parte | `HU-04 · Creación de una segunda torre para la misma parte` |
| HU-04 | CA3 | Rechazo de una pieza de otra parte de la casa | `HU-04 · Rechazo de una pieza de otra parte de la casa` |
| HU-04 | CA4 | Rechazo de una pieza nueva en una torre cerrada | `HU-04 · Rechazo de una pieza nueva en una torre cerrada` |
| HU-04 | — | Rechazo de una parte de la casa ajena al proyecto | `HU-04 · Rechazo de una parte de la casa ajena al proyecto` |
| HU-05 | CA1 | Asignación de una pieza pendiente | `HU-05 · Asignación de una pieza pendiente` |
| HU-05 | CA2 | Rechazo de una asignación sin evidencia | `HU-05 · Rechazo de una asignación sin evidencia` |
| HU-05 | CA3 | Reasignación confirmada a otra torre | `HU-05 · Reasignación confirmada a otra torre` |
| HU-05 | CA3 | Reasignación no confirmada | `HU-05 · Reasignación no confirmada` |
| HU-05 | CA4 | Rechazo por falla del servicio de almacenamiento de evidencias | `HU-05 · Rechazo por falla del servicio de almacenamiento de evidencias` |
| HU-05 | CA5 | Rechazo de la reasignación de una pieza enviada | `HU-05 · Rechazo de la reasignación de una pieza enviada` |
| HU-05 | CA6 | Consulta de las piezas de una torre | `HU-05 · Consulta de las piezas de una torre` |
| HU-06 | CA1 | Consulta de una parte de la casa con piezas pendientes | `HU-06 · Consulta de una parte de la casa con piezas pendientes — CA1` |
| HU-06 | CA2 | Consulta de una parte de la casa sin piezas pendientes | `HU-06 · Consulta de una parte de la casa sin piezas pendientes — CA2` |
| HU-06 | CA3 | Identificar el proyecto por cliente y código | `HU-06 · Identificar el proyecto por cliente y código — CA3` |
| HU-06 | CA4 | Ofrecer las partes del proyecto elegido (esquema con Techo, Muros exteriores, Muros interiores, Piso y Entrepiso) | `HU-06 · Ofrecer la parte «<parte>» del proyecto elegido — CA4` (una prueba por cada ejemplo del esquema) y `HU-06 · El selector de Parte se llena al elegir el Proyecto — CA4/CA5` |
| HU-06 | CA5 | Ofrecer únicamente las partes que tiene el proyecto | `HU-06 · Ofrecer únicamente las partes que tiene el proyecto — CA5` y `HU-06 · Cambiar de Proyecto descarta la Parte anterior — CA5` |
| HU-06 | CA6 | Proyecto sin piezas cargadas | `HU-06 · Proyecto sin piezas cargadas — CA6` y `HU-06 · Proyecto sin piezas cargadas tras elegirlo — CA6` |

Pruebas adicionales que no corresponden a un escenario Gherkin, sino a reglas de las especificaciones de OpenSpec: rechazo por rol no autorizado en HU-03, HU-04, HU-05 y HU-06 (aplicación de HU-01 CA3), cambio de rol de demostración (HU-01), límites y unicidad de los códigos de la inyección simulada (HU-03), numeración independiente entre proyectos (HU-04), listado de piezas y torres para asignar (HU-05) y selección incompleta y repoblado del selector de Parte (HU-06).

### Modelo de dominio → base de datos

| Clase del dominio | Tabla (migración) | Atributos ↔ columnas | Restricciones derivadas de las multiplicidades y reglas | Historia |
|-------------------|-------------------|----------------------|----------------------------------------------------------|----------|
| Proyecto | `proyectos` (002) | `codigo`, `cliente`, `metraje`, `estado` | `codigo` único; `estado` inicial «Sin piezas cargadas» | HU-02 |
| ParteCasa | `partes_casa` (003) | `nombre` (el atributo derivado `/completa` no se persiste) | Pertenece a un Proyecto (`proyecto_id`); `nombre` único dentro del proyecto | HU-03 |
| Pieza | `piezas` (003; `torre_id` en 005) | `codigo`, `estado` | Pertenece a una ParteCasa (`parte_casa_id`); `codigo` único dentro del proyecto; `estado` inicial «Pendiente»; a lo más una Torre (`torre_id` nulo = sin torre asignada) | HU-03, HU-05 |
| Torre | `torres` (004) | `codigo`, `numero`, `estado`, `fechaHoraEliminacion` ↔ `fecha_hora_eliminacion`, `eliminadaPor` ↔ `eliminada_por` | Asociada a una ParteCasa (`parte_casa_id`); `numero` y `codigo` únicos dentro del proyecto; `estado` inicial «Abierta» | HU-04 |
| Evidencia | `evidencias` (005) | `fotografia`, `fechaHoraCaptura` ↔ `fecha_hora_captura`, `responsable`, `vigente` | Respalda una Pieza (`pieza_id`); al reasignar, la evidencia anterior queda con `vigente` = 0 | HU-05 |
| GuiaDespacho | — | — | No implementada (HU-08) | — |

### Diagramas de estado → código

| Diagrama | Transición | Implementación | Prueba (válida / inválida) |
|----------|------------|----------------|----------------------------|
| EST-01 Pieza | `[*] → Pendiente` : inyectar piezas desde plano/archivo | `inyectarPiezasDesdePlano` ([dominio/piezas.ts](./src/dominio/piezas.ts)) | `HU-03 · Inyección de piezas desde un archivo válido (simulado en la demo) — CA1` / `HU-03 · Proyecto sin opción de inyección después de cargar las piezas` |
| EST-01 Pieza | `Pendiente → Listo` : asignar pieza a torre con evidencia [torre Abierta de la misma parte y evidencia almacenada] | `asignarPieza` ([dominio/asignaciones.ts](./src/dominio/asignaciones.ts)) | `HU-05 · Asignación de una pieza pendiente` / `HU-05 · Rechazo de una asignación sin evidencia`, `HU-04 · Rechazo de una pieza de otra parte de la casa`, `HU-04 · Rechazo de una pieza nueva en una torre cerrada`, `HU-05 · Rechazo por falla del servicio de almacenamiento de evidencias` |
| EST-01 Pieza | `Listo → Listo` : asignar pieza a torre con evidencia [reemplazo confirmado] | `asignarPieza` con confirmación | `HU-05 · Reasignación confirmada a otra torre` / `HU-05 · Reasignación no confirmada`, `HU-05 · Rechazo de la reasignación de una pieza enviada` |
| EST-01 Pieza | `Listo → Pendiente`, `Listo → Enviado` | No implementadas (HU-11 y HU-09) | — |
| EST-02 Torre | `[*] → Abierta` : crear torre [universo de piezas inyectado] / asignar numeración correlativa | `crearTorre` ([dominio/torres.ts](./src/dominio/torres.ts)) | `HU-04 · Creación de una torre para una parte de la casa` / `HU-02 · Rechazo de la creación de una torre antes de inyectar las piezas` |
| EST-02 Torre | `Abierta → Cerrada`, `Cerrada → Abierta`, `→ Eliminada`, `Cerrada → [*]` | No implementadas (HU-07, HU-10 y HU-09) | — |
| EST-03 GuiaDespacho | Todas | No implementadas (HU-08 y HU-09) | — |

### Observaciones de la implementación

- **HU-01 (adaptación en la demo):** por regla del taller no hay autenticación real. CA1 y CA2 se prueban con un selector de rol de demostración, por eso sus pruebas llevan «adaptación de CA1» y «CA2 adaptado en demo». El Servicio de autenticación de CU-01 y DSS-03 queda declarado como adaptador simulado.
- **HU-03 (simulada por indicación del profesor, 2026-11-18):** el plano/archivo se sustituye por `GeneradorPlanoSimulado`. CA2 (formato inválido y filas incompletas) no se puede producir en la demo y queda como desviación documentada en `.cin324/validaciones/VAL-HU-03-1.md`. El texto de RP-03, HU-03 y su Gherkin no se modificó.
- **HU-04 CA3 y CA4:** son variantes de rechazo de DSS-01 al asignar una pieza, como ya indica la observación sobre DSS-01. Por eso se implementan en `asignarPieza` y sus pruebas están en el archivo de HU-05, aunque conservan el prefijo `HU-04 · `.
- **HU-05 CA6 (agregado el 2026-11-22):** «Consulta de las piezas de una torre» es una lectura de apoyo dentro de CU-05; no tiene actividad TO-BE, caso de uso ni DSS propios.
- **HU-05 y RD-01:** la invalidación de guías Vigentes al reasignar una pieza se difiere a HU-08, porque GuiaDespacho aún no existe. El usuario, la fecha y la hora que exige RP-05 se guardan en Evidencia (`responsable`, `fecha_hora_captura`), como indica el modelo de dominio.
- **Datos preparados en las pruebas:** los estados «Enviado» de Pieza y «Cerrada» de Torre todavía no se alcanzan desde la aplicación (HU-09 y HU-07), por lo que las pruebas los preparan directamente en la base de datos.
- **Base de datos:** SQLite con el módulo integrado `node:sqlite` de Node.js 22.13 o superior; las migraciones numeradas de [`src/db/migrations/`](./src/db/migrations/) se aplican al iniciar la aplicación.

## Observaciones

- **Historias sin diagrama de secuencia (HU-02, HU-03, HU-04, HU-06, HU-07, HU-10, HU-11):** la rúbrica pide diagramas de secuencia de las historias que se integran con otro sistema. Estas historias se resuelven completamente dentro de SnapSip, sin sistemas externos.
- **Secuencias que aparecen en filas de otro caso de uso o historia:**
  - DSS-01 está asociado a CU-05 y HU-05. También aparece en RP-04, porque las reglas de pertenencia de torre de HU-04 (CA3 y CA4) son variantes de rechazo de DSS-01.
  - DSS-02 está asociado a CU-09 y HU-09, precedido por CU-08 y HU-08. También aparece en RP-08, porque la validación de completitud es una tarea de servicio dentro de CU-08 y se representa como la condición [alcance incompleto o con torres Abiertas] de la generación de la guía. También aparece en RP-12 y RD-01, por la variante [guía Invalidada (RD-01)].
  - RP-14 se asocia a DSS-02 y DSS-03, porque su comprobación funcional exige autenticar a un usuario de prueba (DSS-03) y generar una guía válida (DSS-02).
- **Mensajes de secuencia y eventos de estado:** cada evento lleva el nombre de su caso de uso en minúscula. Los mensajes `asignar pieza a torre con evidencia` (DSS-01), `generar guía de despacho` y `registrar envío con evidencia` (DSS-02) son también eventos de EST-01, EST-02 y EST-03. El mensaje `autenticarse` (DSS-03) no es un evento, porque no cambia el estado de ningún objeto del dominio.
- **Eventos de estado sin mensaje de secuencia:** los eventos `inyectar piezas desde plano/archivo`, `crear torre`, `cerrar torre manualmente`, `reabrir torre`, `eliminar torre vacía con código` y `desasignar pieza de una torre` no tienen un mensaje propio en DSS-01, DSS-02 ni DSS-03. Corresponden a historias que se resuelven dentro de SnapSip, sin sistemas externos (ver la primera observación). La tabla de [10-diagramas-secuencia.md](./10-diagramas-secuencia.md) indica el caso de uso de cada uno. `desasignar pieza de una torre` y `reabrir torre` aparecen en DSS-02 por su efecto sobre la guía: la variante [guía Invalidada (RD-01)].
- **Evento `reabrir torre`:** es el único evento que no lleva el nombre exacto de su caso de uso, porque es una variante de CU-07 Cerrar torre manualmente (HU-07 CA3 y CA4) y no un objetivo independiente del actor.
- **Invalidación de la guía (RD-01):** RD-01 cubre tres causas: desasignar una pieza incluida (RP-12), reasignarla a otra torre (RP-05) y reabrir una torre incluida (RP-07). Por eso RD-01 se traza a HU-05, HU-07 y HU-11, además de HU-08 y HU-09, que generan la guía y rechazan su envío. Aparece en EST-03, con transiciones de Vigente a Invalidada por los eventos `desasignar pieza de una torre`, `asignar pieza a torre con evidencia` (reasignación confirmada) y `reabrir torre`; en EST-01 (evidencia anterior sin vigencia) y en EST-02 (`reabrir torre`). Por eso RP-05 y RP-07 se trazan a EST-03 y a la clase GuiaDespacho.
- **RP-10 en EST-02:** al registrar el envío con evidencia, las torres Cerradas incluidas en la guía terminan su ciclo de vida (transición de Cerrada al estado final). Por eso RP-10 se traza a EST-02 y a la clase Torre.
- **Estado `Eliminada` de Torre (EST-02):** corresponde a la eliminación lógica de RP-11. La torre conserva su registro, con `fechaHoraEliminacion` y `eliminadaPor` según el modelo de dominio, y deja de ofrecerse para asignaciones. Por eso RP-11 se traza a EST-02 y a la clase Torre.
- **Requisitos sin diagrama de estado (RP-01, RP-02, RP-06, RP-08, RP-13, RP-14, RP-15a, RP-15b, RP-16):** ni la autenticación ni la consulta de piezas pendientes cambian el estado de un objeto del dominio, y los requisitos no funcionales no definen eventos. RP-02 y RP-08 afectan el estado de Proyecto y la completitud de ParteCasa, que el modelo de dominio describe como el atributo `estado` de Proyecto (Sin piezas cargadas, En preparación, Proyecto completo) y el atributo derivado `/completa` de ParteCasa. Esos estados no cuentan con un diagrama de estado propio: se fijan en HU-02 CA1, HU-03 CA1 y HU-08 CA1, CA3 y CA6.
- **Requisitos sin clases del dominio (RP-01, RP-14, RP-15a, RP-15b, RP-16):** se refieren al acceso de los usuarios y a atributos de calidad (disponibilidad y seguridad), no a conceptos de información del negocio. Los actores Operario de Bodega y Encargado de Despacho no se modelan como clases. Quién realiza cada acción se registra como dato: `responsable` en Evidencia y `eliminadaPor` en Torre.
- **Validación de completitud (RP-08) sin caso de uso propio:** «Validar completitud por Parte o Proyecto» es una tarea de servicio del TO-BE que ejecuta el sistema, no un actor, por lo que se trata dentro de HU-08 y CU-08. Sus criterios están en HU-08 (CA1, CA2, CA3 y CA7), y la reevaluación que exige RP-08 es HU-08 CA6. Por eso RP-08 y RP-09 se trazan a HU-08 y CU-08. La guía se genera por parte de la casa o por proyecto completo, nunca por una torre suelta, y la completitud se exige solo sobre el alcance solicitado (HU-08 CA5).
- **Evidencia fotográfica sin caso de uso propio:** adjuntar la evidencia es un paso obligatorio de CU-05 (HU-05 CA2) y de CU-09 (HU-09 CA2), no un objetivo independiente del actor. Por eso RP-05, RP-10 y RP-13 se trazan a la clase Evidencia sin un caso de uso adicional.
- **Requisitos transversales (RP-15a y RP-16):** aplican a todas las historias y casos de uso, según su definición en la Entrega 1. RP-15a aparece en los tres DSS porque credenciales, datos de proyecto y evidencias viajan cifrados. RP-16 se traza a DSS-03 porque SnapSip conserva el control de acceso según el rol del usuario autenticado.
- **Sistemas externos:** el Servicio de autenticación proviene de RP-15b, que prevé autenticación administrada, e interviene en CU-01. El Servicio de almacenamiento de evidencias proviene de RP-15a, que menciona el canal de almacenamiento de evidencias, e interviene en CU-05 y CU-09. RP-14 cuenta como indisponibilidad las fallas de ambos proveedores, y por eso DSS-01 y DSS-02 incluyen la variante [falla del servicio].
- **Diferencias con la Entrega 1 detectadas y resueltas:**
  - HU-05 CA3 permitía reasignar una pieza ya asignada, pero RP-05 solo mencionaba piezas Pendiente. Se amplió RP-05 con la reasignación confirmada y el rechazo de piezas Enviado. DSS-01 y EST-01 la incluyen dentro de CU-05, sin un caso de uso aparte.
  - HU-07 CA3 incluía la reapertura de una torre Cerrada, que RP-07 no mencionaba. Se amplió RP-07 con la reapertura, y RD-01 con la invalidación de la guía que provoca. EST-02 y EST-03 la incluyen como variante de CU-07.
  - El estado «En merma» y las notificaciones por mensajería y correo de la antigua HU-08 no se modelan, porque ningún requisito, estado de Pieza ni sistema externo los define. Se eliminaron de las historias y de los criterios de aceptación.
- **Requisitos de proyecto (RY-01, RY-02):** se refieren a la entrega, la documentación y la transferencia del software, no a su comportamiento. Por eso no tienen historia, caso de uso ni diagrama asociado.