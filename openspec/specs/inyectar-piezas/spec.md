## Purpose
Definir la inyección simulada del universo de piezas de SnapSip (HU-03, CU-03, RP-03, EST-01), permitiendo al Encargado de Despacho crear las `Pieza` de un `Proyecto` en estado "Sin piezas cargadas" a partir de las `ParteCasa` definidas al crearlo y de un plano/archivo simulado en la demo, con códigos aleatorios únicos por proyecto y las desviaciones documentadas de CA2.

## Requirements

### Requirement: Inyección simulada del universo de piezas (HU-03 CA1)
El sistema SHALL permitir que el Encargado de Despacho registre el universo completo de piezas de un `Proyecto` en estado "Sin piezas cargadas" pulsando el único botón «Inyectar piezas desde plano/archivo» disponible para ese proyecto, sin cargar ningún archivo real. El sistema SHALL usar las `ParteCasa` ya registradas al crear el proyecto y SHALL crear en una sola carga exactamente `cantidad_prevista` `Pieza` por cada parte con cantidad positiva. Cada `Pieza` SHALL quedar en estado "Pendiente", sin torre asignada y asociada a su `ParteCasa` existente; el `Proyecto` SHALL pasar a estado "En preparación"; el botón SHALL dejar de mostrarse; y el sistema SHALL comunicar cuántas `ParteCasa` y `Pieza` se crearon.

#### Scenario: Inyección de piezas desde un archivo válido (simulado en la demo)
- **DADO** que un proyecto se encuentra en estado "Sin piezas cargadas" y tiene partes de la casa con cantidades previstas positivas
- **Y** el plano/archivo simulado contiene las piezas organizadas por esas partes
- **CUANDO** el encargado de despacho solicita inyectar las piezas pulsando «Inyectar piezas desde plano/archivo»
- **ENTONCES** el sistema crea exactamente la cantidad prevista de piezas para cada parte
- **Y** asocia cada pieza a su parte de la casa ya registrada dentro del proyecto
- **Y** establece cada pieza en estado "Pendiente" y sin torre asignada
- **Y** cambia el proyecto a estado "En preparación"
- **Y** oculta el botón «Inyectar piezas desde plano/archivo» para ese proyecto
- **Y** comunica cuántas partes de la casa y cuántas piezas se crearon

### Requirement: Generación aleatoria acotada del universo simulado
El sistema SHALL generar las `Pieza` a partir de las `ParteCasa` registradas al crear el `Proyecto`, con un total entre 1 y 100 piezas y al menos una pieza en cada parte con cantidad positiva. El sistema SHALL asignar a cada `Pieza` un `codigo` compuesto por una letra de la A a la Z y un número del 1 al 25 (p. ej. `A3`, `I5`), elegidos al azar. El sistema SHALL garantizar que el `codigo` completo no se repita dentro del `Proyecto`; la letra y el número por separado SHALL poder repetirse siempre que el par sea distinto, y SHALL permitir que un mismo `codigo` aparezca en proyectos distintos. El atributo derivado `/completa` de `ParteCasa` SHALL NOT persistirse, y esta historia SHALL NOT crear la tabla `Torre`.

#### Scenario: Universo simulado generado con las cantidades previstas
- **DADO** que un proyecto se encuentra en estado "Sin piezas cargadas" con partes de la casa definidas al crearlo
- **CUANDO** el encargado de despacho solicita la inyección simulada
- **ENTONCES** cada parte recibe exactamente su cantidad prevista de piezas
- **Y** el total de piezas está entre 1 y 100
- **Y** cada pieza tiene un código con formato letra A–Z y número 1–25 (p. ej. `A3`, `I5`)
- **Y** no se repite el código completo dentro del proyecto
- **Y** no se crean partes de la casa nuevas

#### Scenario: Códigos repetibles en proyectos distintos
- **DADO** que dos proyectos distintos se encuentran en estado "Sin piezas cargadas" con partes definidas
- **CUANDO** el encargado de despacho inyecta piezas en ambos proyectos
- **ENTONCES** los códigos pueden repetirse entre ambos proyectos
- **Y** dentro de cada proyecto el código completo sigue siendo único

### Requirement: Rechazo de la inyección por rol no autorizado (HU-01 CA3)
El sistema SHALL rechazar sin modificar datos toda solicitud de inyección realizada por un usuario cuyo rol de demostración no sea *Encargado de Despacho*, y SHALL NOT mostrar el botón «Inyectar piezas desde plano/archivo» a ese rol.

#### Scenario: Rechazo de un intento de inyección por otro rol
- **DADO** que un usuario tiene el rol de demostración *Operario de Bodega*
- **Y** existe un proyecto en estado "Sin piezas cargadas" con partes definidas y sin piezas
- **CUANDO** intenta inyectar piezas en ese proyecto
- **ENTONCES** el sistema rechaza la solicitud
- **Y** no crea piezas ni modifica las partes de la casa definidas
- **Y** conserva el proyecto en estado "Sin piezas cargadas"

### Requirement: Inyección únicamente desde "Sin piezas cargadas"
El sistema SHALL mostrar el botón «Inyectar piezas desde plano/archivo» solo cuando el `Proyecto` está en estado "Sin piezas cargadas", tiene partes de la casa definidas y no tiene `Pieza` registradas, y SHALL NOT modificar los datos si el proyecto está en otro estado o ya fue inyectado. Los reintentos SHALL rechazarse con el mensaje «El proyecto ya tiene piezas inyectadas; no se modificaron datos.»

#### Scenario: Proyecto sin opción de inyección después de cargar las piezas
- **DADO** que un proyecto ya pasó a estado "En preparación" y tiene piezas registradas
- **CUANDO** el encargado de despacho abre ese proyecto
- **ENTONCES** el sistema no muestra el botón «Inyectar piezas desde plano/archivo»
- **Y** no crea nuevas piezas ni modifica las partes de la casa

#### Scenario: Rechazo de un reintento de inyección
- **DADO** que un proyecto ya fue inyectado y está en estado "En preparación"
- **CUANDO** el encargado de despacho solicita inyectar piezas de nuevo
- **ENTONCES** el sistema rechaza la solicitud
- **Y** comunica que el proyecto ya tiene piezas inyectadas
- **Y** no modifica piezas ni partes de la casa

### Requirement: Carga con formato inválido (CA2, desviación documentada)
El sistema documentado SHALL rechazar la carga completa, SHALL comunicar que el formato no es válido y SHALL NOT registrar `Pieza` cuando el archivo no cumple la plantilla definida. En la demo no existe carga de archivo real: el `GeneradorPlanoSimulado` entrega siempre datos válidos a partir de las partes definidas al crear el proyecto, por lo que este escenario del Gherkin original no se implementa ni se prueba y queda registrado como desviación en `.cin324/validaciones/VAL-HU-03-1.md`, igual que CA2 de HU-01.

#### Scenario: No se registra una carga con formato inválido en la demo
- **DADO** que un proyecto se encuentra en estado "Sin piezas cargadas" con partes definidas
- **CUANDO** el encargado de despacho solicita inyectar piezas sin aportar un archivo (única operación disponible en la demo)
- **ENTONCES** el sistema no registra ninguna carga inválida
- **Y** no registra piezas antes de la generación simulada válida

### Requirement: Carga con filas incompletas (CA2, desviación documentada)
El sistema documentado SHALL rechazar la carga completa, SHALL señalar las filas con error y SHALL NOT registrar piezas parciales cuando faltan datos obligatorios. En la demo el generador simulado produce toda `Pieza` con `codigo`, `estado` "Pendiente" y su `ParteCasa`, y cada parte con cantidad positiva recibe exactamente esa cantidad, de modo que el escenario original del Gherkin no se implementa ni se prueba y queda como desviación documentada.

#### Scenario: No se registran piezas parciales en la generación simulada
- **DADO** que un proyecto se encuentra en estado "Sin piezas cargadas" con partes definidas
- **CUANDO** el encargado de despacho solicita la inyección simulada
- **ENTONCES** el sistema no registra piezas incompletas
- **Y** cada pieza tiene código y estado "Pendiente"
- **Y** cada parte con cantidad positiva recibe exactamente esa cantidad de piezas
