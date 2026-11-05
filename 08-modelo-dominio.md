# Modelo de dominio

## Diagrama
![Modelo de dominio](./diagramas/modelo-dominio.png)

Archivo fuente: [`./diagramas/modelo-dominio.puml`](diagramas/casos-de-uso.puml)

## Descripción de las clases
| Clase | Qué representa en el negocio | Atributos |
|-------|------------------------------|-----------|
| Proyecto | Casa encargada por un cliente, cuyo despacho de paneles SIP se controla. | codigo, cliente, metraje, estado (Sin piezas cargadas, En preparación, Proyecto completo) |
| ParteCasa | Sección de la casa (por ejemplo, el techo) que organiza los paneles del plano. | nombre, /completa (derivado: tiene al menos una pieza y todas están Listo) |
| Pieza | Panel SIP del universo de piezas del proyecto. | codigo, estado (Pendiente, Listo, Enviado) |
| Torre | Pila física de paneles en la bodega, exclusiva de una parte de la casa. | codigo, numero (correlativo dentro del proyecto), estado (Abierta, Cerrada, Eliminada), fechaHoraEliminacion, eliminadaPor |
| GuiaDespacho | Documento de control de lo que se despacha para una parte de la casa o para el proyecto completo. | numero, alcance (Parte de la casa o Proyecto), estado (Vigente, Invalidada, Enviada), fechaHoraEmision, fechaHoraEnvio |
| Evidencia | Fotografía que respalda la ubicación de un panel en su torre o la salida del camión cargado. | fotografia, fechaHoraCaptura, responsable, vigente |

## Asociaciones
| Asociación | Clases | Multiplicidades | Justificación |
|------------|--------|-----------------|----------------|
| se divide en (composición) | Proyecto – ParteCasa | 1 a 0..* | Una parte de la casa solo existe dentro de su proyecto. El proyecto se crea sin partes y las recibe al cargar el universo de piezas (RP-02, RP-03). |
| se compone de (composición) | ParteCasa – Pieza | 1 a 1..* | Cada panel se carga dentro de una parte de la casa y pertenece a ella toda su vida. Una parte existe porque el archivo de piezas le trae al menos un panel (RP-03). |
| se almacena en | ParteCasa – Torre | 1 a 0..* | Cada torre pertenece a una única parte de la casa. Una parte puede ocupar varias torres, con numeración correlativa (RP-04, HU-04 CA2). |
| agrupa (agregación) | Torre – Pieza | 0..1 a 0..* | Un panel está en una sola torre a la vez, y un panel Pendiente no está en ninguna. La torre puede estar vacía (RP-05, RP-11, RP-12). |
| se despacha con | Proyecto – GuiaDespacho | 1 a 0..* | Toda guía identifica a su proyecto. Un proyecto puede tener varias guías: una por cada parte despachada o una nueva tras una invalidación (RP-09, RD-01). |
| incluye (agregación) | GuiaDespacho – Pieza | 0..* a 1..* | Una guía detalla al menos un panel. Un panel puede figurar en una guía Invalidada y en la que la reemplaza (RP-09, RD-01). |
| respalda la ubicación de (composición) | Evidencia – Pieza | 0..* a 0..1 | No hay asignación a torre sin evidencia fotográfica. Al desasignar, la evidencia queda con vigente = falso y se conserva como historial, por lo que un panel puede tener varias (RP-05, RP-12). |
| respalda el envío de (composición) | Evidencia – GuiaDespacho | 0..1 a 0..1 | No hay envío sin la fotografía del camión cargado. La guía no tiene evidencia hasta que se registra el envío, y tiene a lo más una porque una guía no se envía dos veces (RP-10). |

## Decisiones de modelado
- **Roles:** Operario de Bodega y Encargado de Despacho son los actores que operan el sistema, no conceptos de información del negocio, por lo que no se modelan como clases. Quién realiza cada acción queda registrado como dato: `responsable` en Evidencia y `eliminadaPor` en Torre (RP-05, RP-10, RP-11).
- **Composición:** se usa cuando la parte no existe sin el todo y pertenece a un solo todo durante su vida: la parte de la casa dentro de su proyecto, el panel dentro de su parte, y la fotografía dentro del panel o de la guía que respalda. Si se elimina el todo, sus partes también desaparecen.
- **Agregación:** se usa en las agrupaciones temporales en que el panel sobrevive al agrupador. La torre agrupa paneles físicamente, pero el panel existe antes de entrar a ella, puede salir (desasignar) y pasar a otra (reasignar). La guía agrupa paneles documentalmente; si se invalida, los paneles siguen existiendo y se incluyen en una guía nueva.
- **Cliente como atributo:** el cliente es un dato del proyecto (RP-02) y no tiene un ciclo de vida propio en SnapSip, por lo que se modela como el atributo `cliente` de Proyecto.
- **Sin clases intermedias:** la asignación de un panel a una torre se expresa con la agregación *agrupa* y con el estado de la Pieza (Pendiente o Listo). El envío se expresa con el estado Enviada de la GuiaDespacho, su `fechaHoraEnvio` y su evidencia.
- **Restricción {xor} de Evidencia:** cada evidencia respalda la ubicación de un panel o el envío de una guía, nunca ambos. Por eso los dos extremos compuestos tienen multiplicidad 0..1, y la restricción se indica con una nota en el diagrama.
- **Restricción Torre – Pieza:** una torre solo agrupa paneles de su misma parte de la casa (RP-05, HU-04 CA3). La multiplicidad no alcanza a expresarlo, por lo que se indica con una nota en el diagrama.
- **Relaciones derivadas:** el proyecto de una torre se obtiene a través de su parte de la casa, y las torres de una guía se obtienen a través de sus paneles. Por eso no se dibujan como asociaciones directas.
- **Herencia:** no se usó, porque ningún concepto del dominio es una especialización de otro.
