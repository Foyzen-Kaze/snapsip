## Purpose
Definir la consulta de piezas pendientes de SnapSip (HU-06, CU-06, RP-06, EST-01), permitiendo al Operario de Bodega consultar, para un `Proyecto` y una `ParteCasa` elegidos, el `codigo` de las `Pieza` en estado «Pendiente» y sin torre asignada, con comunicación explícita de «0 pendientes» cuando no las haya.

## Requirements

### Requirement: Validación de la selección de Proyecto y ParteCasa
El sistema SHALL pedir que se elijan un `Proyecto` y una `ParteCasa` antes de consultar, y SHALL NOT mostrar resultados ni el mensaje «0 pendientes» mientras falte alguna selección.

#### Scenario: Consulta sin Proyecto o ParteCasa elegidos
- **DADO** que el Operario de Bodega tiene acceso a la consulta de piezas pendientes
- **Y** no ha elegido un `Proyecto` o una `ParteCasa`
- **CUANDO** solicita consultar las piezas pendientes
- **ENTONCES** el sistema pide elegir el `Proyecto` y la `ParteCasa` que faltan
- **Y** no muestra piezas ni comunica «0 pendientes»

### Requirement: Listado de piezas pendientes de la ParteCasa elegida
El sistema SHALL presentar únicamente el `codigo` de las `Pieza` con `estado` «Pendiente» pertenecientes a la `ParteCasa` elegida del `Proyecto` elegido, y SHALL excluir las piezas de otras `ParteCasa` y las que tengan un `estado` distinto de «Pendiente».

#### Scenario: Consulta de una parte de la casa con piezas pendientes
- **DADO** que una parte de la casa tiene piezas en estado «Pendiente» y sin torre asignada
- **Y** el proyecto tiene piezas de otras partes y en otros estados
- **CUANDO** el operario de bodega solicita consultar las piezas pendientes de esa parte de la casa
- **ENTONCES** el sistema presenta todas las piezas «Pendiente» sin torre asignada de esa parte
- **Y** excluye las piezas de otras partes y las que no están «Pendiente»

### Requirement: Comunicación explícita de ausencia de piezas pendientes
El sistema SHALL comunicar explícitamente «0 pendientes» para la `ParteCasa` elegida cuando no existan `Pieza` con `estado` «Pendiente» en ella.

#### Scenario: Consulta de una parte de la casa sin piezas pendientes
- **DADO** que una parte de la casa no tiene piezas en estado «Pendiente»
- **CUANDO** el operario de bodega solicita consultar las piezas pendientes de esa parte de la casa
- **ENTONCES** el sistema no presenta piezas
- **Y** comunica explícitamente que hay «0 pendientes» para esa parte

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

#### Scenario: Proyecto sin piezas cargadas tras elegirlo
- **DADO** que el operario selecciona un `Proyecto` en estado «Sin piezas cargadas»
- **CUANDO** el sistema actualiza el selector de Parte automáticamente
- **ENTONCES** el selector de Parte queda sin opciones
- **Y** el sistema informa que el proyecto no tiene partes de la casa con piezas cargadas
