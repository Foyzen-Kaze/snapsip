# Trazabilidad

Esta matriz enlaza cada requisito de la [Entrega 1](./03-requisitos.md) con su [historia de usuario](./04-historias-usuario.md), su [caso de uso](./09-casos-de-uso.md), su [diagrama de secuencia](./10-diagramas-secuencia.md), su [diagrama de estado](./11-diagramas-estado.md) y las clases del [modelo de dominio](./08-modelo-dominio.md) que intervienen.

Identificadores de los diagramas:

- **Secuencia:** DSS-01 Asignar pieza a torre · DSS-02 Generar guía y registrar envío · DSS-03 Iniciar sesión
- **Estado:** EST-01 Pieza · EST-02 Torre · EST-03 GuiaDespacho

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
| RP-10 | HU-09 | CU-09 | DSS-02 | EST-01, EST-03 | GuiaDespacho, Pieza, Evidencia |
| RP-11 | HU-10 | CU-10 | — | EST-02 | Torre |
| RP-12 | HU-11 | CU-11 | DSS-02 | EST-01, EST-03 | Pieza, Torre, Evidencia, GuiaDespacho |
| RP-13 | HU-05 | CU-05 | DSS-01 | — | Pieza, Torre, Evidencia |
| RP-14 | HU-01, HU-06, HU-08 | CU-01, CU-06, CU-08 | DSS-02, DSS-03 | — | — |
| RP-15a | HU-01 a HU-11 | CU-01 a CU-11 | DSS-01, DSS-02, DSS-03 | — | — |
| RP-15b | HU-01 | CU-01 | DSS-03 | — | — |
| RP-16 | HU-01 a HU-11 | CU-01 a CU-11 | DSS-03 | — | — |
| RD-01 | HU-08, HU-09, HU-11 | CU-08, CU-09, CU-11 | DSS-02 | EST-01, EST-02, EST-03 | GuiaDespacho, Pieza, Torre |

## Correspondencia con el TO-BE de la Entrega 1

La actividad TO-BE se toma del campo «Actividad TO-BE asociada» de cada historia en [04-historias-usuario.md](./04-historias-usuario.md). El caso de uso lleva el nombre que tiene en [09-casos-de-uso.md](./09-casos-de-uso.md).

| Historia | Caso de uso | Actividad TO-BE asociada |
|----------|-------------|---------------------------|
| HU-01 | CU-01 Iniciar sesión | Iniciar sesión en el sistema |
| HU-02 | CU-02 Registrar proyecto | Registrar nuevo proyecto |
| HU-03 | CU-03 Cargar universo de piezas | Cargar universo de piezas del proyecto |
| HU-04 | CU-04 Registrar torre | Registrar nueva torre |
| HU-05 | CU-05 Asignar pieza a torre | Asignar pieza a torre |
| HU-06 | CU-06 Consultar piezas pendientes | Consultar estado de piezas |
| HU-07 | CU-07 Cerrar torre | Cerrar torre de piezas |
| HU-08 | CU-08 Generar guía de despacho | Generar guía de despacho (incluye Validar completitud de piezas) |
| HU-09 | CU-09 Registrar envío | Registrar envío de despacho |
| HU-10 | CU-10 Eliminar torre vacía | Eliminar torre del sistema |
| HU-11 | CU-11 Desasignar pieza | Desasignar pieza |

## Observaciones

- **Historias sin diagrama de secuencia (HU-02, HU-03, HU-04, HU-06, HU-07, HU-10, HU-11):** la rúbrica pide diagramas de secuencia de las historias que se integran con otro sistema. Estas historias se resuelven completamente dentro de SnapSip, sin sistemas externos.
- **Secuencias que aparecen en filas de otro caso de uso o historia:**
  - DSS-01 está asociado a CU-05 y HU-05. También aparece en RP-04, porque las reglas de pertenencia de torre de HU-04 (CA3 y CA4) son variantes de rechazo de DSS-01.
  - DSS-02 está asociado a CU-08, CU-09, HU-08 y HU-09. También aparece en RP-08, porque la validación de completitud no es un caso de uso propio, sino una regla de CU-08, y se representa como la condición [alcance incompleto o con torres Abiertas] de la generación de la guía. También aparece en RP-12, por la variante [guía Invalidada por desasignación (RD-01)].
  - RP-14 se asocia a DSS-02 y DSS-03, porque su comprobación funcional exige autenticar a un usuario de prueba (DSS-03) y generar una guía válida (DSS-02).
- **Eventos de estado sin mensaje de secuencia:** los eventos `importar archivo de piezas`, `crear torre`, `cerrar torre`, `reabrir torre`, `eliminar torre` y `desasignar pieza` no tienen un mensaje propio en DSS-01, DSS-02 ni DSS-03. Corresponden a historias que se resuelven dentro de SnapSip, sin sistemas externos (ver la primera observación). La excepción parcial es `desasignar pieza`, que en DSS-02 aparece por su efecto sobre la guía. Los eventos `asignar pieza a torre`, `generar guía de despacho` y `registrar envío` sí coinciden con los mensajes de DSS-01 y DSS-02, según la tabla de correspondencia de [10-diagramas-secuencia.md](./10-diagramas-secuencia.md).
- **Invalidación de la guía por reapertura de torre (regla derivada):** RD-01 solo define la invalidación por desasignación de una pieza. La reapertura de una torre incluida invalida la guía Vigente, porque deja de cumplirse la condición de RP-09 (torres Cerradas). Se deriva de RP-09 y RD-01. Aparece en EST-03, que tiene transiciones de Vigente a Invalidada por los eventos `desasignar pieza` y `reabrir torre`, y en EST-02 (evento `reabrir torre`). Por eso RP-07 se traza a EST-03 y a la clase GuiaDespacho, y RD-01 se traza a EST-02.
- **Invalidación de la guía por reasignación (RP-05):** reasignar una pieza implica desasignarla de su torre anterior, por lo que RD-01 la cubre. Aparece en la transición de EST-01 de `Listo` a `Listo` por el evento `asignar pieza a torre` y en EST-03. Por eso RP-05 se traza a EST-03 y a la clase GuiaDespacho.
- **Estado `Eliminada` de Torre (EST-02):** corresponde a la eliminación lógica de RP-11. La torre conserva su registro, con `fechaHoraEliminacion` y `eliminadaPor` según el modelo de dominio, y deja de ofrecerse para asignaciones. Es un estado terminal. Por eso RP-11 se traza a EST-02 y a la clase Torre.
- **Requisitos sin diagrama de estado (RP-01, RP-02, RP-06, RP-08, RP-13, RP-14, RP-15a, RP-15b, RP-16):** ni la autenticación ni la consulta de piezas pendientes cambian el estado de un objeto del dominio, y los requisitos no funcionales no definen eventos. RP-02 y RP-08 afectan el estado de Proyecto y la completitud de ParteCasa, que el modelo de dominio describe como el atributo `estado` de Proyecto (Sin piezas cargadas, En preparación, Proyecto completo) y el atributo derivado `/completa` de ParteCasa. Esos estados no cuentan con un diagrama de estado propio: se fijan en HU-02 CA1, HU-03 CA1 y HU-08 CA1 y CA3.
- **Requisitos sin clases del dominio (RP-01, RP-14, RP-15a, RP-15b, RP-16):** se refieren al acceso de los usuarios y a atributos de calidad (disponibilidad y seguridad), no a conceptos de información del negocio. Los actores Operario de Bodega y Encargado de Despacho no se modelan como clases. Quién realiza cada acción se registra como dato: `responsable` en Evidencia y `eliminadaPor` en Torre.
- **Validación de completitud (RP-08) sin caso de uso propio:** la historia «Validar completitud por Parte o Proyecto» se fusionó en HU-08 Generar guía de despacho, porque no tenía valor independiente y la ejecuta el sistema, no un actor. Sus criterios pasaron a HU-08 (CA1 a CA3), y la reevaluación que exige RP-08 es HU-08 CA6. Por eso RP-08 y RP-09 se trazan a HU-08 y CU-08. La guía se genera por parte de la casa o por proyecto completo, nunca por una torre suelta, y la completitud se exige solo sobre el alcance solicitado (HU-08 CA5).
- **Evidencia fotográfica sin caso de uso propio:** adjuntar la evidencia es un paso obligatorio de CU-05 (HU-05 CA2) y de CU-09 (HU-09 CA2), no un objetivo independiente del actor. Por eso RP-05, RP-10 y RP-13 se trazan a la clase Evidencia sin un caso de uso adicional.
- **Requisitos transversales (RP-15a y RP-16):** aplican a todas las historias y casos de uso, según su definición en la Entrega 1. RP-15a abarca CU-05 y CU-09 porque la evidencia fotográfica viaja al servicio de almacenamiento y debe ir cifrada. RP-16 se traza a DSS-03 porque SnapSip conserva el control de acceso según el rol del usuario autenticado.
- **Sistemas externos:** el Servicio de autenticación proviene de RP-15b, que prevé autenticación administrada. El Servicio de almacenamiento de evidencias proviene de RP-15a, que menciona el canal de almacenamiento de evidencias, e interviene en CU-05 y CU-09, donde se adjunta la evidencia. RP-14 cuenta como indisponibilidad las fallas de ambos proveedores, y por eso DSS-01 incluye la variante [falla del servicio].
- **Diferencias con la Entrega 1 detectadas y resueltas:**
  - HU-05 CA3 permite reasignar una pieza ya asignada, aunque RP-05 solo menciona piezas Pendiente. DSS-01 y EST-01 incluyen la reasignación con confirmación, siguiendo la historia. Se resuelve dentro de CU-05, sin un caso de uso aparte.
  - HU-07 CA3 incluye la reapertura de una torre Cerrada, que RP-07 no menciona. EST-02 la incluye y se traza a RP-07 / HU-07.
  - El estado «En merma» y las notificaciones por mensajería y correo de la antigua HU-08 no se modelan, porque ningún requisito, estado de Pieza ni sistema externo los define. Se eliminaron de las historias y de los criterios de aceptación.
- **Requisitos de proyecto (RY-01, RY-02):** se refieren a la entrega, la documentación y la transferencia del software, no a su comportamiento. Por eso no tienen historia, caso de uso ni diagrama asociado.