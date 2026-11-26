## Purpose
Definir el registro de proyectos de SnapSip (HU-02, CU-02, RP-02), permitiendo al Encargado de Despacho crear un `Proyecto` con cliente, código, metraje y las cantidades previstas de las cinco partes de la casa, con código único y estado inicial "Pendiente de aprobación", con las partes definidas y sin piezas.

## Requirements

### Requirement: Creación de un proyecto con código único (CA1)
El sistema SHALL permitir que el Encargado de Despacho registre un `Proyecto` indicando `cliente`, `codigo`, `metraje` y las cantidades previstas de las cinco `ParteCasa` (Piso, Muros exteriores, Muros interiores, Entrepiso y Techo) cuando el `codigo` no pertenece a otro proyecto y las cantidades son válidas. Al registrarlo, el sistema SHALL asociar el proyecto al cliente, conservar el `codigo` y el `metraje` indicados, establecer su `estado` en "Pendiente de aprobación", crear una `ParteCasa` por cada nombre con cantidad positiva guardando esa cantidad en `cantidad_prevista`, y dejar el proyecto sin `Pieza` registradas.

#### Scenario: Creación de un proyecto con código único
- **DADO** que el encargado de despacho dispone del cliente, el código, el metraje y las cantidades de las cinco partes de la casa
- **Y** el código no pertenece a otro proyecto
- **Y** las cantidades son enteros no negativos y el total está entre 1 y 100
- **CUANDO** solicita crear el proyecto con esos datos
- **ENTONCES** el sistema registra el proyecto asociado al cliente
- **Y** conserva el código y el metraje indicados
- **Y** establece su estado en "Pendiente de aprobación"
- **Y** crea las partes de la casa con cantidad positiva y registra su cantidad prevista
- **Y** el proyecto queda sin piezas registradas

### Requirement: Rechazo de un código de proyecto duplicado (CA2)
El sistema SHALL rechazar la solicitud de crear un `Proyecto` cuando el `codigo` indicado ya pertenece a un proyecto registrado, SHALL comunicar que el código está duplicado y SHALL conservar el proyecto existente sin modificaciones.

#### Scenario: Rechazo de un código de proyecto duplicado
- **DADO** que existe un proyecto registrado con un determinado código
- **CUANDO** el encargado de despacho solicita crear otro proyecto con ese mismo código
- **ENTONCES** el sistema rechaza la solicitud
- **Y** comunica que el código está duplicado
- **Y** conserva el proyecto existente sin modificaciones

### Requirement: Proyecto en estado "Pendiente de aprobación" antes de inyectar piezas (CA3)
El sistema SHALL mantener un `Proyecto` recién creado en `estado` "Pendiente de aprobación", con las `ParteCasa` definidas al crearlo y sin `Pieza` registradas, de modo que no se considere apto para la creación de torres hasta completar la carga del plano o archivo de piezas (condición que CU-04/HU-04 hará cumplir al solicitar crear una torre).

#### Scenario: Rechazo de la creación de una torre antes de inyectar las piezas
- **DADO** que un proyecto se encuentra en estado "Pendiente de aprobación" con partes de la casa definidas y sin piezas
- **CUANDO** el operario de bodega solicita crear una torre en ese proyecto
- **ENTONCES** el sistema rechaza la solicitud
- **Y** comunica que primero deben inyectarse las piezas del proyecto desde el archivo
- **Y** no crea la torre

### Requirement: Validación de las cantidades de las partes (HU-02 CA4)
El sistema SHALL rechazar el registro de un `Proyecto` cuando alguna cantidad de parte no sea un entero no negativo o cuando el total de las cinco cantidades esté fuera del rango 1–100, SHALL comunicar «Las cantidades de las partes deben ser enteros no negativos y el total debe estar entre 1 y 100.» y SHALL NOT registrar el proyecto ni sus partes.

#### Scenario: Rechazo por cantidades inválidas
- **DADO** que el encargado de despacho dispone del cliente, el código y el metraje del proyecto
- **Y** una cantidad de parte no es un entero no negativo o el total de las cinco cantidades está fuera del rango 1–100
- **CUANDO** solicita crear el proyecto con esos datos
- **ENTONCES** el sistema rechaza la solicitud
- **Y** comunica que las cantidades deben ser enteros no negativos y el total entre 1 y 100
- **Y** no registra el proyecto ni sus partes de la casa
