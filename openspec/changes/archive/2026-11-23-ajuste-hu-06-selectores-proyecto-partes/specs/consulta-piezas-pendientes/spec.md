## ADDED Requirements

### Requirement: Identificación del Proyecto por cliente y código
El sistema SHALL ofrecer en el selector de Proyecto de la consulta de piezas pendientes cada `Proyecto` registrado identificado por su atributo `cliente` y por su atributo `codigo`.

#### Scenario: Identificar el proyecto por cliente y código
- **DADO** que existen proyectos registrados
- **CUANDO** el operario de bodega abre la consulta de piezas pendientes
- **ENTONCES** el sistema ofrece cada proyecto por su cliente y su código

### Requirement: Selector de ParteCasa según el Proyecto elegido
El sistema SHALL ofrecer en el selector de Parte de la casa únicamente las `ParteCasa` del `Proyecto` elegido que tienen al menos una `Pieza` cargada, y SHALL NOT ofrecer las `ParteCasa` que no tienen `Pieza` cargadas.

#### Scenario: Ofrecer las partes del proyecto elegido
- **DADO** que el proyecto elegido tiene piezas cargadas en la parte de la casa «<parte>»
- **Y** `<parte>` es Techo, Muros exteriores, Muros interiores, Piso o Entrepiso
- **CUANDO** el operario de bodega selecciona ese proyecto
- **ENTONCES** el sistema ofrece la parte de la casa «<parte>» para consultar

#### Scenario: Ofrecer únicamente las partes que tiene el proyecto
- **DADO** que el proyecto elegido tiene piezas cargadas solo en «Muros interiores», «Techo» y «Entrepiso»
- **CUANDO** el operario de bodega selecciona ese proyecto
- **ENTONCES** el sistema ofrece únicamente «Muros interiores», «Techo» y «Entrepiso»
- **Y** no ofrece «Muros exteriores» ni «Piso»

### Requirement: Aviso de Proyecto sin piezas cargadas
El sistema SHALL informar que el `Proyecto` no tiene partes de la casa con piezas cargadas cuando el `Proyecto` elegido tenga el atributo `estado` «Sin piezas cargadas», definido en el modelo de dominio.

#### Scenario: Proyecto sin piezas cargadas
- **DADO** que el proyecto elegido está en estado «Sin piezas cargadas»
- **CUANDO** el operario de bodega selecciona ese proyecto
- **ENTONCES** el sistema informa que el proyecto no tiene partes de la casa con piezas cargadas
