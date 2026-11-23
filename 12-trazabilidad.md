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

Pruebas adicionales que no corresponden a un escenario Gherkin, sino a reglas de las especificaciones de OpenSpec: rechazo por rol no autorizado en HU-03, HU-04, HU-05 y HU-06 (aplicación de HU-01 CA3), cambio de rol de demostración (HU-01), límites y unicidad de