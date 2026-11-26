cambio pedido
se agrega nuevo rol llamado supervisor de proyectos 
cuando se crea un proyecto queda pendiente de aprobacion y el supervisor decide si lo aprueba o lo rechaza solo un proyecto aprobado puede pasar a la carga de piezas.


**Historia de usuario y criterios de aceptacion**

- Se unificó el nombre del rol «Supervisor de Proyectos» en HU-01 y HU-12 y en sus criterios de aceptación. [Historias de usuario](./04-historias-usuario.md) · [Criterios de aceptación](./07-criterios-aceptacion.md)

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
