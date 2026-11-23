## ADDED Requirements

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
