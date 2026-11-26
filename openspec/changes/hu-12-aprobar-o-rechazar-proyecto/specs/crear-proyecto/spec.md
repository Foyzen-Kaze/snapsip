## MODIFIED Requirements

### Requirement: Creación de un proyecto con código único (CA1)
El sistema SHALL permitir que el Encargado de Despacho registre un `Proyecto` indicando `cliente`, `codigo`, `metraje` y las cantidades previstas de las cinco `ParteCasa` (Piso, Muros exteriores, Muros interiores, Entrepiso y Techo) cuando el `codigo` no pertenece a otro proyecto y las cantidades son válidas. Al registrarlo, el sistema SHALL asociar el proyecto al cliente, conservar el `codigo` y el `metraje` indicados, establecer su `estado` en «Pendiente de aprobación», crear una `ParteCasa` por cada nombre con cantidad positiva guardando esa cantidad en `cantidad_prevista`, y dejar el proyecto sin `Pieza` registradas.

#### Scenario: Creación de un proyecto con código único
- **DADO** que el encargado de despacho dispone del cliente, el código, el metraje y las cantidades de las cinco partes de la casa
- **Y** el código no pertenece a otro proyecto
- **Y** las cantidades son enteros no negativos y el total está entre 1 y 100
- **CUANDO** solicita crear el proyecto con esos datos
- **ENTONCES** el sistema registra el proyecto asociado al cliente
- **Y** conserva el código y el metraje indicados
- **Y** establece su estado en «Pendiente de aprobación»
- **Y** crea las partes de la casa con cantidad positiva y registra su cantidad prevista
- **Y** el proyecto queda sin piezas registradas

### Requirement: Proyecto en estado "Pendiente de aprobación" antes de inyectar piezas (CA3)
El sistema SHALL mantener un `Proyecto` recién creado en `estado` «Pendiente de aprobación», con las `ParteCasa` definidas al crearlo y sin `Pieza` registradas, de modo que no se considere apto para la creación de torres hasta completar la carga del plano o archivo de piezas (condición que CU-04/HU-04 hará cumplir al solicitar crear una torre). Mientras no haya `Pieza` registradas, el rechazo de torre SHALL aplicarse también a los estados «Aprobado» y «Rechazado».

#### Scenario: Rechazo de la creación de una torre antes de inyectar las piezas
- **DADO** que un proyecto se encuentra en estado «Pendiente de aprobación», «Aprobado» o «Rechazado» con partes de la casa definidas y sin piezas
- **CUANDO** el operario de bodega solicita crear una torre en ese proyecto
- **ENTONCES** el sistema rechaza la solicitud
- **Y** comunica que primero deben inyectarse las piezas del proyecto desde el archivo
- **Y** no crea la torre
