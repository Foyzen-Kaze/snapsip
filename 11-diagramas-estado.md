# Diagramas de estado

Este documento presenta los diagramas de estado de **SnapSip** en notación UML 2.0. Modelan el ciclo de vida de las cuatro clases del [modelo de dominio](./08-modelo-dominio.md) cuyo atributo `estado` controla el despacho: Pieza, Torre, GuiaDespacho y Proyecto. En el ciclo del Proyecto (EST-04) se aplica la decisión acordada el 2026-11-26: se elimina el estado «Sin piezas cargadas» y el proyecto nace «Pendiente de aprobación» (HU-02 CA1), de modo que solo puede inyectar piezas después de ser aprobado por el Supervisor de Proyectos (HU-03 CA1 y CA4).

Convenciones:

- Los estados son situaciones del negocio, con los mismos nombres que los valores del atributo `estado` en el modelo de dominio.
- Cada transición se rotula `evento [guarda] / acción`. Cada evento es el nombre del caso de uso que lo origina, en minúscula, y coincide con el mensaje del [diagrama de secuencia](./10-diagramas-secuencia.md) cuando ese caso de uso tiene uno. La única excepción es `reabrir torre`, una variante de CU-07 Cerrar torre manualmente (HU-07 CA3).
- Una transición hacia el estado final sin evento es una transición de finalización: el objeto ya no admite más cambios y su ciclo de vida termina.

---

## EST-01 — Ciclo de vida de Pieza

- Clase del dominio: [Pieza](./08-modelo-dominio.md)
- Diagramas de secuencia relacionados: [DSS-01](./10-diagramas-secuencia.md) (asignar pieza a torre con evidencia) y [DSS-02](./10-diagramas-secuencia.md) (registrar envío con evidencia)
- Casos de uso e historias de origen: [CU-03 Inyectar piezas desde plano/archivo](./09-casos-de-uso.md) / [HU-03](./04-historias-usuario.md#hu-03), [CU-05 Asignar pieza a torre con evidencia](./09-casos-de-uso.md) / [HU-05](./04-historias-usuario.md#hu-05), [CU-09 Registrar envío con evidencia](./09-casos-de-uso.md) / [HU-09](./04-historias-usuario.md#hu-09) y [CU-11 Desasignar pieza de una torre](./09-casos-de-uso.md) / [HU-11](./04-historias-usuario.md#hu-11)
- Requisitos: RP-03, RP-05, RP-10, RP-12, RD-01

![EST-01](./diagramas/est-01.png)

Archivo fuente: [`./diagramas/est-01.puml`](./diagramas/est-01.puml)

### Estados

- **Pendiente:** la pieza está registrada en su parte de la casa y no tiene torre asignada (HU-03 CA1).
- **Listo:** la pieza está asignada a una torre de su misma parte y cuenta con evidencia fotográfica vigente (HU-05 CA1).
- **Enviado:** la pieza salió de la bodega en un envío registrado (HU-09 CA1). No admite reasignación ni desasignación (HU-05 CA5, HU-11 CA2).

### Tabla de transiciones

| Estado origen | Evento | Guarda | Acción | Estado destino |
|---------------|--------|--------|--------|----------------|
| Inicial | inyectar piezas desde plano/archivo | archivo válido | — | Pendiente |
| Pendiente | asignar pieza a torre con evidencia | torre Abierta de la misma parte y evidencia almacenada | registrar evidencia, usuario, fecha y hora | Listo |
| Listo | asignar pieza a torre con evidencia | otra torre Abierta de la misma parte, reemplazo confirmado y evidencia almacenada | invalidar evidencia anterior y guías Vigentes que incluyen la pieza | Listo |
| Listo | desasignar pieza de una torre | — | invalidar evidencia y guías Vigentes que incluyen la pieza | Pendiente |
| Listo | registrar envío con evidencia | guía Vigente que incluye la pieza y evidencia almacenada | — | Enviado |
| Enviado | — (finalización) | — | — | Final |

---

## EST-02 — Ciclo de vida de Torre

- Clase del dominio: [Torre](./08-modelo-dominio.md)
- Diagramas de secuencia relacionados: [DSS-02](./10-diagramas-secuencia.md) (registrar envío con evidencia). En [DSS-01](./10-diagramas-secuencia.md), el estado de la torre aparece como condición de la asignación.
- Casos de uso e historias de origen: [CU-04 Crear torre](./09-casos-de-uso.md) / [HU-04](./04-historias-usuario.md#hu-04), [CU-07 Cerrar torre manualmente](./09-casos-de-uso.md) / [HU-07](./04-historias-usuario.md#hu-07), [CU-09 Registrar envío con evidencia](./09-casos-de-uso.md) / [HU-09](./04-historias-usuario.md#hu-09) y [CU-10 Eliminar torre vacía con código](./09-casos-de-uso.md) / [HU-10](./04-historias-usuario.md#hu-10)
- Requisitos: RP-04, RP-07, RP-10, RP-11, RD-01

![EST-02](./diagramas/est-02.png)

Archivo fuente: [`./diagramas/est-02.puml`](./diagramas/est-02.puml)

### Estados

- **Abierta:** la torre admite piezas de su parte de la casa (HU-04 CA1).
- **Cerrada:** la torre no admite piezas nuevas (HU-07 CA1). Es condición para incluirla en una guía de despacho (RP-09).
- **Eliminada:** la torre vacía fue dada de baja con su código de confirmación. Conserva su registro, con el usuario, la fecha y la hora de la eliminación, y deja de ofrecerse para asignaciones (HU-10 CA1).

El envío no crea un estado nuevo: al registrarse el envío de la guía que la incluye, la torre conserva su registro como Cerrada y su ciclo de vida termina. Desde ese momento no puede reabrirse (HU-07 CA4) ni eliminarse, porque contiene piezas enviadas (HU-10 CA3).

### Tabla de transiciones

| Estado origen | Evento | Guarda | Acción | Estado destino |
|---------------|--------|--------|--------|----------------|
| Inicial | crear torre | universo de piezas inyectado | asignar numeración correlativa | Abierta |
| Abierta | cerrar torre manualmente | al menos una pieza asignada | — | Cerrada |
| Cerrada | reabrir torre | ninguna pieza Enviado | invalidar guías Vigentes que incluyen la torre | Abierta |
| Abierta | eliminar torre vacía con código | torre vacía y código coincide | registrar usuario, fecha y hora | Eliminada |
| Cerrada | eliminar torre vacía con código | torre vacía y código coincide | registrar usuario, fecha y hora | Eliminada |
| Cerrada | registrar envío con evidencia | guía Vigente que incluye la torre y evidencia almacenada | — | Final |
| Eliminada | — (finalización) | — | — | Final |

Una torre Cerrada puede quedar vacía si todas sus piezas se desasignan (HU-11 CA1). HU-10 CA1 solo exige que la torre esté vacía y que el código coincida, por lo que `eliminar torre vacía con código` parte tanto de Abierta como de Cerrada.

---

## EST-03 — Ciclo de vida de GuiaDespacho

- Clase del dominio: [GuiaDespacho](./08-modelo-dominio.md)
- Diagramas de secuencia relacionados: [DSS-02](./10-diagramas-secuencia.md) (generar guía de despacho y registrar envío con evidencia) y [DSS-01](./10-diagramas-secuencia.md) (asignar pieza a torre con evidencia, en su variante de reasignación)
- Casos de uso e historias de origen: [CU-05 Asignar pieza a torre con evidencia](./09-casos-de-uso.md) / [HU-05](./04-historias-usuario.md#hu-05), [CU-07 Cerrar torre manualmente](./09-casos-de-uso.md) / [HU-07](./04-historias-usuario.md#hu-07), [CU-08 Generar guía de despacho](./09-casos-de-uso.md) / [HU-08](./04-historias-usuario.md#hu-08), [CU-09 Registrar envío con evidencia](./09-casos-de-uso.md) / [HU-09](./04-historias-usuario.md#hu-09) y [CU-11 Desasignar pieza de una torre](./09-casos-de-uso.md) / [HU-11](./04-historias-usuario.md#hu-11)
- Requisitos: RP-05, RP-07, RP-09, RP-10, RP-12, RD-01

![EST-03](./diagramas/est-03.png)

Archivo fuente: [`./diagramas/est-03.puml`](./diagramas/est-03.puml)

### Estados

- **Vigente:** la guía fue generada para un proyecto aprobado por el Supervisor de Proyectos, con un alcance completo y sus torres Cerradas, y todavía no tiene envío registrado (HU-08 CA1 y CA3). La aprobación es una condición ya registrada: sigue cumpliéndose aunque el proyecto haya pasado a «En preparación» o «Proyecto completo».
- **Invalidada:** después de su generación cambió una pieza o una torre incluida, por lo que la guía ya no representa lo preparado (RD-01). No admite envío ni recupera su vigencia; debe generarse una guía nueva (HU-09 CA3 y CA4).
- **Enviada:** el envío fue registrado con la evidencia fotográfica del camión cargado (HU-09 CA1).

### Tabla de transiciones

| Estado origen | Evento | Guarda | Acción | Estado destino |
|---------------|--------|--------|--------|----------------|
| Inicial | generar guía de despacho | alcance completo, torres Cerradas y proyecto aprobado por el Supervisor de Proyectos | — | Vigente |
| Vigente | desasignar pieza de una torre | pieza incluida en la guía | — | Invalidada |
| Vigente | asignar pieza a torre con evidencia | pieza incluida en la guía y reemplazo confirmado | — | Invalidada |
| Vigente | reabrir torre | torre incluida en la guía | — | Invalidada |
| Vigente | registrar envío con evidencia | evidencia almacenada | cambiar piezas a Enviado y registrar usuario, fecha y hora | Enviada |
| Invalidada | — (finalización) | — | — | Final |
| Enviada | — (finalización) | — | — | Final |

«Alcance completo» significa que el alcance solicitado (una parte de la casa o el proyecto) contiene al menos una pieza y todas están en estado Listo (RP-08). Adicionalmente, se exige que el proyecto haya sido aprobado por el Supervisor de Proyectos. La aprobación queda registrada en el evento `aprobar proyecto` de EST-04 y se conserva en los estados posteriores («En preparación» y «Proyecto completo»): no se exige que el estado actual sea «Aprobado», porque inmediatamente después de inyectar las piezas el proyecto ya está «En preparación» (HU-03 CA1). Las tres transiciones de Vigente a Invalidada corresponden a HU-11 CA1 (desasignación), HU-05 CA3 (reasignación) y HU-07 CA3 (reapertura).

---

## EST-04 — Ciclo de vida de Proyecto

- Clase del dominio: [Proyecto](./08-modelo-dominio.md)
- Diagramas de secuencia relacionados: ninguno. Aprobar y rechazar son operaciones internas sin sistemas externos, por lo que no tienen DSS propio; la inyección de piezas tampoco integra otro sistema. La aprobación por el Supervisor de Proyectos aparece como condición en [DSS-02](./10-diagramas-secuencia.md) y en la guarda de EST-03.
- Casos de uso e historias de origen: [CU-02 Crear proyecto](./09-casos-de-uso.md) / [HU-02](./04-historias-usuario.md#hu-02), [CU-03 Inyectar piezas desde plano/archivo](./09-casos-de-uso.md) / [HU-03](./04-historias-usuario.md#hu-03), [CU-08 Generar guía de despacho](./09-casos-de-uso.md) / [HU-08](./04-historias-usuario.md#hu-08) y CU-12 (nombre pendiente de alinear, ver I-4) / [HU-12 Aprobar o rechazar proyecto](./04-historias-usuario.md#hu-12).
- Requisitos: RP-02, RP-03, RP-08, RP-09. La aprobación y el rechazo todavía no tienen un requisito funcional propio (ver I-6).

![EST-04](./diagramas/est-04.png)

Archivo fuente: [`./diagramas/est-04.puml`](./diagramas/est-04.puml)

### Estados

- **Pendiente de aprobación:** el proyecto fue registrado por el Encargado de Despacho con sus partes de la casa y su cantidad prevista, y con cero piezas. Es el estado inicial (HU-02 CA1).
- **Aprobado:** el Supervisor de Proyectos aprobó el proyecto, que queda habilitado para la inyección de piezas (HU-12 CA1).
- **Rechazado:** el Supervisor de Proyectos rechazó el proyecto; no se pueden inyectar piezas en él (HU-12 CA2). Es terminal porque HU-12 CA3 solo permite aprobar o rechazar desde «Pendiente de aprobación».
- **En preparación:** se inyectó el universo completo de piezas y ya pueden crearse torres para sus partes (HU-03 CA1, HU-04 CA1).
- **Proyecto completo:** todas las piezas del proyecto están Listo y todas sus torres Cerradas, por lo que puede generarse la guía de despacho por proyecto completo (HU-08 CA3; RP-08). No es terminal: si una pieza vuelve a Pendiente, el proyecto deja de considerarse completo (HU-08 CA6).

### Tabla de transiciones

| Estado origen | Evento | Guarda | Acción | Estado destino |
|---------------|--------|--------|--------|----------------|
| Inicial | crear proyecto | datos válidos y código único | crear las partes con cantidad prevista y cero piezas | Pendiente de aprobación |
| Pendiente de aprobación | aprobar proyecto | rol Supervisor de Proyectos | habilitar la inyección de piezas | Aprobado |
| Pendiente de aprobación | rechazar proyecto | rol Supervisor de Proyectos | — | Rechazado |
| Aprobado | inyectar piezas desde plano/archivo | archivo válido | crear las piezas en Pendiente y ocultar el botón de inyección | En preparación |
| Aprobado | inyectar piezas desde plano/archivo | archivo inválido o filas incompletas | rechazar la carga sin registrar piezas parciales | Aprobado |
| En preparación | generar guía de despacho | alcance proyecto y todas las piezas Listo | marcar el proyecto como Proyecto completo | Proyecto completo |
| Proyecto completo | desasignar pieza de una torre | una pieza vuelve a Pendiente | — | En preparación |
| Rechazado | — (finalización) | — | — | Final |

No se representan como transiciones los rechazos que conservan el estado: inyectar piezas desde «Pendiente de aprobación» o «Rechazado» (HU-03 CA4), aprobar o rechazar un proyecto que no está «Pendiente de aprobación» (HU-12 CA3) y generar una guía con impedimentos (HU-08 CA2 y CA4).

**Aprobación frente a estado actual:** «Aprobado» es el estado inmediatamente posterior a la aprobación, pero la aprobación misma queda registrada como una condición del proyecto. Por eso, cuando la inyección lleva el proyecto a «En preparación» o la completitud lo lleva a «Proyecto completo», el proyecto sigue estando aprobado y puede generarse la guía (EST-03). La guarda de EST-03 no exige que el estado actual sea «Aprobado».

**Pendiente de otros artefactos:** el [modelo de dominio](./08-modelo-dominio.md) todavía enumera «Sin piezas cargadas» y `esperandoAprobacion` y no reconoce «Aprobado» ni «Rechazado» (I-2 e I-5), y la [trazabilidad](./12-trazabilidad.md) sigue afirmando que Proyecto no tiene diagrama de estado (I-7). EST-04 usa los nombres de estado vigentes en las historias y en el Gherkin.
