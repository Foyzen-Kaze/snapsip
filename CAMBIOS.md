cambio pedido
se agrega nuevo rol llamado supervisor de proyectos 
cuando se crea un proyecto queda pendiente de aprobacion y el supervisor decide si lo aprueba o lo rechaza solo un proyecto aprobado puede pasar a la carga de piezas.


**Historia de usuario y criterios de aceptacion**

1. Historias de usuario (04-historias-usuario.md)
Responsable: Diego Marengo

- HU-01: Se agrego el rol Supervisor de Proyecto junto a Operario de Bodega y Encargado de Despacho.
- HU-02:
  - CA1: Se cambio el estado inicial de Sin piezas cargadas a Pendiente de aprobacion y se agregaron las cantidades previstas por parte de la casa (Piso / Muros exteriores / Muros interiores / Entrepiso / Techo).
  - CA3: Se actualizo el rechazo al crear torres para proyectos en Pendiente de aprobacion o Aprobado o Rechazado con partes definidas y sin piezas cargadas.
  - CA4: Se dejo la validacion de cantidades de partes (enteros no negativos y total entre 1 y 100).
  - CA5: Se dejo el criterio para mostrar cada proyecto con su estado actual.
- HU-03:
  - CA1 y CA2: Se cambio Sin piezas cargadas por Aprobado como requisito para inyectar piezas y se dejo que si el archivo es invalido o tiene filas incompletas el proyecto sigue en Aprobado.
  - CA3: Se separo en otro criterio el rechazo al reintentar inyectar piezas cuando el proyecto ya esta En preparacion.
  - CA4: Se agrego el rechazo de inyeccion cuando el proyecto esta en Pendiente de aprobacion o Rechazado.
- HU-06:
  - CA6: Se cambio Sin piezas cargadas por Pendiente de aprobacion o Aprobado o Rechazado para proyectos sin piezas cargadas.
- HU-12:
  - Se reescribio entera como Aprobar o rechazar proyecto para el rol Supervisor de Proyecto ligada a la actividad TO-BE Crear proyecto porque no se toco el diagrama TO-BE base.
  - Quedo con 4 criterios: CA1 (aprobar pasa a Aprobado) / CA2 (rechazar pasa a Rechazado) / CA3 (rechazo si el proyecto no esta en Pendiente de aprobacion) y CA4 (rechazo si lo pide un rol distinto a Supervisor de Proyecto).

2. Criterios de aceptacion Gherkin (07-criterios-aceptacion.md)
Responsable: Diego Marengo

- Se actualizo el encabezado del archivo con las 12 historias (HU-01 a HU-12).
- HU-01 / HU-02 y HU-06: Se ajusto el rol y los estados con los cambios de 04-historias-usuario.md y se saco el estado Sin piezas cargadas.
- HU-03: Se dejo 1 a 1 con 04-historias-usuario.md (4 escenarios para CA1 a CA4). Se cambio Sin piezas cargadas por Aprobado. Se junto formato invalido y filas incompletas en CA2. Se separo el reintento en CA3 y se agrego el rechazo en Pendiente de aprobacion o Rechazado en CA4. Se arreglo el cierre del bloque Gherkin.
- HU-12: Se sacaron los pasos fuera del sistema (como contactar al cliente) y se hicieron 4 escenarios verificables (CA1 a CA4) que cubren aprobacion / rechazo / intento en proyecto no pendiente e intento por rol no autorizado.


**Modelo De dominio**
Se añadio nuevos valores al atributo estado:
-pendiente de Aprobacion
-aprobado
-rechazado

y se elimino el atribto anterior que fue confundido por un estado 
esperandoAprobacion


**Casos de uso**
se añadio un nuevo rol supervisor de proyectos 
se añaio un nuevo caso de uso cu-12 "aprobar o rechazar proyecto"
se le añadio login al supervisor de proyectos 


**Diagramas de estado**

- Se agregó EST-04 con el ciclo de vida del proyecto y su tabla de transiciones. El proyecto nace «Pendiente de aprobación» y el Supervisor de Proyectos puede aprobarlo o rechazarlo. La carga válida de piezas pasa un proyecto «Aprobado» a «En preparación». «Rechazado» es terminal y «Proyecto completo» puede volver a «En preparación» si una pieza vuelve a «Pendiente». [EST-04](./11-diagramas-estado.md#est-04--ciclo-de-vida-de-proyecto)
- Se actualizó EST-03 para exigir la aprobación previa del Supervisor de Proyectos al generar la guía de despacho, junto con un alcance completo y torres cerradas. La aprobación sigue siendo válida en «En preparación» y «Proyecto completo». [EST-03](./11-diagramas-estado.md#est-03--ciclo-de-vida-de-guiadespacho)

**Diagramas de secuencia**

- Se agregó a DSS-02 el escenario que rechaza la generación de la guía si el proyecto está «Pendiente de aprobación» o «Rechazado». [DSS-02](./10-diagramas-secuencia.md#dss-02--generar-guía-de-despacho-y-registrar-envío-con-evidencia)
- Se unificó el nombre «Supervisor de Proyectos» en DSS-03 y se aclaró que el flujo verifica las credenciales. Los permisos se comprueban cuando el usuario solicita una operación protegida. [DSS-03](./10-diagramas-secuencia.md#dss-03--autenticarse)
- Se actualizó la tabla de correspondencia para vincular EST-04 con la creación del proyecto (CU-02), la inyección de piezas (CU-03) y la aprobación o el rechazo (CU-12 y HU-12). [Tabla de correspondencia](./10-diagramas-secuencia.md#correspondencia-entre-mensajes-y-eventos-de-estado)

**Revisión de consistencia**

- Se registraron las discrepancias detectadas entre los diagramas y los demás artefactos, junto con las decisiones sobre el ciclo del proyecto. [Inconsistencias](./Inconsistencias.md)
