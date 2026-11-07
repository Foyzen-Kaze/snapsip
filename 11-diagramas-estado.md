# Diagramas de estado

Este documento presenta los **Diagramas de Estado** del sistema **SnapSip** bajo el estándar **UML 2.0**, modelando el ciclo de vida de las clases del modelo de dominio que presentan transiciones de estado significativas.

Los nombres de los estados corresponden estrictamente a **situaciones o condiciones del negocio** (no a acciones) y coinciden con los atributos `estado` del [modelo de dominio](./08-modelo-dominio.md). Los eventos coinciden con los mensajes de los [diagramas de secuencia de sistema](./10-diagramas-secuencia.md) y con las operaciones de los [casos de uso](./09-casos-de-uso.md).

---

## EST-01 — Ciclo de vida de Pieza

- **Clase del dominio:** [Pieza](./08-modelo-dominio.md) (atributo `estado`)
- **Diagramas de secuencia relacionados:** [DSS-01](./10-diagramas-secuencia.md) y [DSS-02](./10-diagramas-secuencia.md)
- **Casos de uso e historias relacionadas:** [CU-03](./09-casos-de-uso.md) ([HU-03](./04-historias-usuario.md#hu-03)), [CU-05](./09-casos-de-uso.md) ([HU-05](./04-historias-usuario.md#hu-05)), [CU-09](./09-casos-de-uso.md) ([HU-09](./04-historias-usuario.md#hu-09)) y [CU-11](./09-casos-de-uso.md) ([HU-11](./04-historias-usuario.md#hu-11))

![EST-01](./diagramas/est-01.png)

Archivo fuente: [`./diagramas/est-01.puml`](./diagramas/est-01.puml)

### Descripción de los estados
- **`Pendiente`:** La pieza está registrada en el universo del proyecto y asociada a su parte de la casa, pero no tiene torre asignada ni una evidencia vigente que respalde su ubicación. También vuelve a este estado cuando se la desasigna.
- **`Listo`:** La pieza está asignada a una torre de su misma parte, respaldada por una evidencia fotográfica vigente y con el usuario, la fecha y la hora de la asignación.
- **`Enviado`:** La pieza salió de la bodega en el camión, respaldada por una guía de despacho Vigente con el envío registrado. Es un estado terminal: no admite desasignación ni cambio de torre.

### Tabla de transiciones — Pieza
| Estado origen | Evento | Guarda | Acción | Estado destino |
|---|---|---|---|---|
| `[*]` | cargar universo de piezas | archivo válido con filas completas | registrar la pieza en su parte de la casa, sin torre asignada | `Pendiente` |
| `Pendiente` | asignar pieza a torre | torre Abierta de la misma parte y evidencia fotográfica adjunta | asociar la pieza a la torre, almacenar la evidencia y registrar usuario, fecha y hora | `Listo` |
| `Listo` | asignar pieza a torre | otra torre Abierta de la misma parte, reemplazo confirmado y nueva evidencia adjunta | sustituir la torre, conservar la evidencia anterior como historial e invalidar las guías vigentes no enviadas que incluyan la pieza (RD-01) | `Listo` |
| `Listo` | desasignar pieza | — | retirar la asociación con la torre, invalidar la evidencia de la asignación actual (se conserva como historial) e invalidar las guías vigentes no enviadas que incluyan la pieza (RD-01) | `Pendiente` |
| `Listo` | registrar envío | guía Vigente que incluye la pieza y evidencia fotográfica del camión adjunta | registrar el usuario y la fecha y hora del envío | `Enviado` |
| `Enviado` | — | — | — | `[*]` |

---

## EST-02 — Ciclo de vida de Torre

- **Clase del dominio:** [Torre](./08-modelo-dominio.md) (atributo `estado`)
- **Diagramas de secuencia relacionados:** [DSS-01](./10-diagramas-secuencia.md) y [DSS-02](./10-diagramas-secuencia.md)
- **Casos de uso e historias relacionadas:** [CU-04](./09-casos-de-uso.md) ([HU-04](./04-historias-usuario.md#hu-04)), [CU-07](./09-casos-de-uso.md) ([HU-07](./04-historias-usuario.md#hu-07)) y [CU-10](./09-casos-de-uso.md) ([HU-10](./04-historias-usuario.md#hu-10))

![EST-02](./diagramas/est-02.png)

Archivo fuente: [`./diagramas/est-02.puml`](./diagramas/est-02.puml)

### Descripción de los estados
- **`Abierta`:** La torre fue registrada para una parte específica de la casa y está disponible para recibir asignaciones de piezas de esa parte.
- **`Cerrada`:** El operario cerró manualmente la torre porque ya no admite más piezas. No admite nuevas asignaciones y es condición para generar una guía de despacho que la incluya. Cuando sus piezas se envían, la torre permanece `Cerrada` y ya no puede reabrirse.
- **`Eliminada`:** La torre vacía fue eliminada de forma lógica. Conserva su registro, con el usuario, la fecha y la hora de la eliminación (`eliminadaPor` y `fechaHoraEliminacion` en el modelo de dominio), y deja de ofrecerse para asignar piezas. Es un estado terminal.

### Tabla de transiciones — Torre
| Estado origen | Evento | Guarda | Acción | Estado destino |
|---|---|---|---|---|
| `[*]` | registrar torre | universo de piezas cargado y parte de la casa del proyecto | asignar numeración correlativa dentro del proyecto; la torre queda sin piezas | `Abierta` |
| `Abierta` | cerrar torre | contiene al menos una pieza asignada | dejar de admitir nuevas asignaciones | `Cerrada` |
| `Cerrada` | reabrir torre | ninguna de sus piezas fue enviada | volver a admitir piezas e invalidar las guías vigentes no enviadas que incluyan la torre (RD-01) | `Abierta` |
| `Abierta` | eliminar torre | torre sin piezas y código de confirmación exacto | eliminar de forma lógica, registrando usuario, fecha y hora | `Eliminada` |
| `Cerrada` | eliminar torre | torre sin piezas (vaciada por desasignación) y código de confirmación exacto | eliminar de forma lógica, registrando usuario, fecha y hora | `Eliminada` |
| `Eliminada` | — | — | — | `[*]` |

---

## EST-03 — Ciclo de vida de GuiaDespacho

- **Clase del dominio:** [GuiaDespacho](./08-modelo-dominio.md) (atributo `estado`)
- **Diagramas de secuencia relacionados:** [DSS-02](./10-diagramas-secuencia.md)
- **Casos de uso e historias relacionadas:** [CU-08](./09-casos-de-uso.md) ([HU-08](./04-historias-usuario.md#hu-08)), [CU-09](./09-casos-de-uso.md) ([HU-09](./04-historias-usuario.md#hu-09)), [CU-05](./09-casos-de-uso.md) ([HU-05](./04-historias-usuario.md#hu-05)), [CU-07](./09-casos-de-uso.md) ([HU-07](./04-historias-usuario.md#hu-07)) y [CU-11](./09-casos-de-uso.md) ([HU-11](./04-historias-usuario.md#hu-11))

![EST-03](./diagramas/est-03.png)

Archivo fuente: [`./diagramas/est-03.puml`](./diagramas/est-03.puml)

### Descripción de los estados
- **`Vigente`:** La guía fue emitida en PDF después de validar que todas las piezas del alcance solicitado (una parte de la casa o el proyecto completo) están `Listo` y en torres `Cerradas`. Es apta para autorizar la carga del camión en bodega.
- **`Invalidada`:** La guía perdió su validez porque, después de emitirse, se desasignó una pieza incluida (HU-11), se reasignó una pieza incluida a otra torre (HU-05 CA3) o se reabrió una torre incluida (HU-07 CA3), lo que rompe la regla de integridad RD-01. Es un estado terminal: no admite registro de envío ni recupera la vigencia, aunque vuelvan a cumplirse las condiciones, y debe generarse una guía nueva (HU-08).
- **`Enviada`:** El envío fue registrado con la fotografía del camión cargado y las piezas incluidas pasaron a `Enviado`. Es un estado terminal.

### Tabla de transiciones — GuiaDespacho
| Estado origen | Evento | Guarda | Acción | Estado destino |
|---|---|---|---|---|
| `[*]` | generar guía de despacho | todas las piezas del alcance (parte de la casa o proyecto) están Listo y sus torres Cerradas | emitir la guía en PDF con número correlativo y detalle de piezas y torres | `Vigente` |
| `Vigente` | desasignar pieza | la pieza está incluida en la guía | invalidar la guía y exigir una guía nueva (RD-01) | `Invalidada` |
| `Vigente` | asignar pieza a torre | reasignación de una pieza incluida en la guía | invalidar la guía y exigir una guía nueva (RD-01) | `Invalidada` |
| `Vigente` | reabrir torre | la torre está incluida en la guía | invalidar la guía y exigir una guía nueva (RD-01) | `Invalidada` |
| `Vigente` | registrar envío | evidencia fotográfica del camión adjunta | registrar el usuario y la fecha y hora del envío; las piezas incluidas pasan a Enviado | `Enviada` |
| `Invalidada` | — | — | — | `[*]` |
| `Enviada` | — | — | — | `[*]` |
