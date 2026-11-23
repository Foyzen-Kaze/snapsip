## Purpose
Definir la asignación de piezas a torres con evidencia de SnapSip (HU-05, CU-05, RP-05, EST-01, EST-02, DSS-01), permitiendo al Operario de Bodega asignar una `Pieza` «Pendiente» a una `Torre` «Abierta» del mismo proyecto y parte con evidencia fotográfica, reasignar piezas «Listo» con confirmación y consultar las piezas de una torre. Incluye los rechazos HU-04 CA3/CA4 y el servicio de evidencias simulado con tres fotos de demostración.

## Requirements

### Requirement: Listado de piezas pendientes y torres del proyecto
El sistema SHALL mostrar al Operario de Bodega las `Pieza` en estado «Pendiente» y **todas** las `Torre` del `Proyecto`, con `codigo`, parte de la casa y `estado` de cada una, para permitir elegir una asignación.

#### Scenario: Listado para asignación
- **DADO** que un proyecto tiene piezas «Pendiente» y torres «Abierta» y «Cerrada»
- **CUANDO** el operario de bodega abre la asignación de piezas
- **ENTONCES** el sistema presenta las piezas «Pendiente» y todas las torres del proyecto
- **Y** muestra para cada una su código, su parte de la casa y su estado

### Requirement: Asignación de una pieza pendiente con evidencia
El sistema SHALL asociar una `Pieza` «Pendiente» a una `Torre` «Abierta» del mismo `Proyecto` y de la misma `ParteCasa` cuando se adjunte evidencia fotográfica, dejando la pieza en estado «Listo» y creando una `Evidencia` vigente con `responsable` y `fechaHoraCaptura` (RP-05, EST-01).

#### Scenario: Asignación de una pieza pendiente
- **DADO** que una pieza se encuentra en estado «Pendiente» y sin torre asignada
- **Y** la torre de destino está «Abierta» y pertenece al mismo proyecto y a la misma parte de la casa
- **CUANDO** el operario de bodega solicita asignar la pieza a la torre y adjunta evidencia fotográfica
- **ENTONCES** el sistema asocia la pieza a la torre
- **Y** cambia la pieza a estado «Listo»
- **Y** conserva la evidencia como respaldo de la asignación
- **Y** registra el usuario, la fecha y la hora de la asignación en la `Evidencia`

### Requirement: Rechazo de una asignación sin evidencia
El sistema SHALL rechazar la asignación y SHALL exigir evidencia fotográfica cuando no se haya seleccionado ninguna de las fotos de demostración, sin modificar la pieza.

#### Scenario: Rechazo de una asignación sin evidencia
- **DADO** que una pieza se encuentra en estado «Pendiente» y sin torre asignada
- **Y** existe una torre «Abierta» del mismo proyecto y de la misma parte de la casa
- **CUANDO** el operario de bodega solicita asignar la pieza a la torre sin adjuntar evidencia fotográfica
- **ENTONCES** el sistema rechaza la solicitud con el mensaje «se exige evidencia fotográfica»
- **Y** mantiene la pieza en estado «Pendiente» y sin torre asignada

### Requirement: Rechazo de asignaciones inválidas
El sistema SHALL rechazar sin modificar la pieza ni la torre cuando la torre pertenezca a otra parte de la casa, cuando la torre esté «Cerrada», cuando la pieza esté «Enviado» o cuando el servicio de almacenamiento de evidencias no acepte la fotografía.

#### Scenario: Rechazo de una pieza de otra parte de la casa
- **DADO** que una torre está asociada a una parte de la casa
- **Y** una pieza «Pendiente» pertenece a una parte distinta
- **CUANDO** el operario de bodega solicita asignar esa pieza a la torre
- **ENTONCES** el sistema rechaza la solicitud con el mensaje «la torre no corresponde a la parte de la pieza»
- **Y** mantiene la pieza en estado «Pendiente» y sin torre asignada

#### Scenario: Rechazo de una pieza nueva en una torre cerrada
- **DADO** que una torre se encuentra en estado «Cerrada»
- **Y** una pieza «Pendiente» pertenece a la misma parte de la casa
- **CUANDO** el operario de bodega solicita asignar esa pieza a la torre
- **ENTONCES** el sistema rechaza la solicitud y sugiere «se sugiere registrar otra torre para la parte»
- **Y** conserva la pieza y la torre sin modificaciones

#### Scenario: Rechazo de la reasignación de una pieza enviada
- **DADO** que una pieza se encuentra en estado «Enviado»
- **CUANDO** el operario de bodega solicita asignarla a otra torre
- **ENTONCES** el sistema rechaza la solicitud con el mensaje «una pieza enviada no puede reasignarse»
- **Y** conserva la pieza sin modificaciones

#### Scenario: Rechazo por falla del servicio de almacenamiento de evidencias
- **DADO** que una pieza se encuentra «Pendiente» y sin torre asignada
- **Y** la torre de destino está «Abierta» y pertenece al mismo proyecto y a la misma parte de la casa
- **Y** el servicio de almacenamiento de evidencias no acepta la fotografía
- **CUANDO** el operario de bodega solicita asignar la pieza a la torre y adjunta evidencia fotográfica
- **ENTONCES** el sistema rechaza la asignación con el mensaje «la evidencia no pudo almacenarse»
- **Y** mantiene la pieza en estado «Pendiente» y sin torre asignada

### Requirement: Reasignación confirmada de una pieza lista
El sistema SHALL solicitar confirmación antes de cambiar una pieza «Listo» de torre. Con confirmación y nueva evidencia SHALL mantener la pieza «Listo» en la nueva torre y SHALL conservar la evidencia anterior en el historial con `vigente = false`. Sin confirmación SHALL conservar la asignación y la evidencia anteriores.

#### Scenario: Reasignación confirmada a otra torre
- **DADO** que una pieza se encuentra «Listo» y asignada a una torre
- **Y** otra torre está «Abierta» y pertenece al mismo proyecto y a la misma parte de la casa
- **CUANDO** el operario de bodega solicita asignar la pieza a la otra torre, adjunta nueva evidencia fotográfica y confirma el reemplazo
- **ENTONCES** el sistema asocia la pieza a la nueva torre
- **Y** mantiene la pieza en estado «Listo»
- **Y** conserva la evidencia anterior en el historial, sin vigencia como respaldo
- **Y** registra la nueva evidencia con el usuario, la fecha y la hora

#### Scenario: Reasignación no confirmada
- **DADO** que una pieza se encuentra «Listo» y asignada a una torre
- **CUANDO** el operario de bodega solicita asignar la pieza a otra torre y no confirma el reemplazo
- **ENTONCES** el sistema conserva la asignación y la evidencia anteriores
- **Y** no modifica ninguna guía de despacho

### Requirement: Consulta de las piezas de una torre
El sistema SHALL presentar al Operario de Bodega las `Pieza` contenidas en una `Torre`, con su `codigo` y su `estado`, cuando consulte esa torre.

#### Scenario: Consulta de las piezas de una torre
- **DADO** que una torre tiene piezas asignadas
- **CUANDO** el operario de bodega consulta esa torre
- **ENTONCES** el sistema presenta las piezas que contiene
- **Y** muestra el código y el estado de cada pieza

### Requirement: Restricción de acceso a la asignación y consulta
El sistema SHALL permitir asignar piezas y consultar torres únicamente al Operario de Bodega, rechazando a cualquier otro rol sin revelar datos de piezas, torres ni evidencias.

#### Scenario: Rechazo por rol no autorizado
- **DADO** que el encargado de despacho tiene acceso a la aplicación
- **CUANDO** solicita asignar una pieza o consultar una torre
- **ENTONCES** el sistema rechaza el acceso
- **Y** no modifica datos ni revela información de piezas, torres o evidencias
