## MODIFIED Requirements

### Requirement: Aviso de Proyecto sin piezas
El sistema SHALL informar que el `Proyecto` no tiene partes de la casa con piezas cargadas cuando el `Proyecto` elegido tenga el atributo `estado` «Pendiente de aprobación» o «Rechazado», definido en el modelo de dominio y en EST-04.

#### Scenario: Proyecto sin piezas
- **DADO** que el proyecto elegido está en estado «Pendiente de aprobación» o «Rechazado»
- **CUANDO** el operario de bodega selecciona ese proyecto
- **ENTONCES** el sistema informa que el proyecto no tiene partes de la casa con piezas cargadas

### Requirement: Llenado automático del selector de Parte al elegir Proyecto
El sistema SHALL poblar automáticamente el selector de Parte de la casa con las `ParteCasa` del `Proyecto` elegido que tienen al menos una `Pieza` cargada en el instante en que el operario cambia la selección de Proyecto, sin que el operario pulse «Consultar» ni modifique la URL.

#### Scenario: El selector de Parte se llena al elegir el Proyecto
- **DADO** que el operario de bodega tiene abierta la consulta de piezas pendientes
- **CUANDO** el operario selecciona un `Proyecto` en el selector de Proyecto
- **ENTONCES** el sistema ofrece de inmediato, en el selector de Parte de la casa, las `ParteCasa` de ese `Proyecto` que tienen `Pieza` cargada
- **Y** el operario puede elegir una Parte sin pulsar «Consultar» ni editar la URL

#### Scenario: Cambiar de Proyecto descarta la Parte anterior
- **DADO** que el operario había elegido una `ParteCasa` de un `Proyecto`
- **CUANDO** el operario selecciona otro `Proyecto`
- **ENTONCES** el sistema descarta la `ParteCasa` elegida antes
- **Y** ofrece únicamente las `ParteCasa` del nuevo `Proyecto` que tienen `Pieza` cargada

#### Scenario: Proyecto sin piezas tras elegirlo
- **DADO** que el operario selecciona un `Proyecto` en estado «Pendiente de aprobación» o «Rechazado»
- **CUANDO** el sistema actualiza el selector de Parte automáticamente
- **ENTONCES** el selector de Parte queda sin opciones
- **Y** el sistema informa que el proyecto no tiene partes de la casa con piezas cargadas
