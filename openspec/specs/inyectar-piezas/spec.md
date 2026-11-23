## Purpose
Definir la inyección simulada del universo de piezas de SnapSip (HU-03, CU-03, RP-03, EST-01), permitiendo al Encargado de Despacho registrar las `ParteCasa` y `Pieza` de un `Proyecto` en estado "Sin piezas cargadas" a partir de un plano/archivo simulado en la demo, con generación aleatoria acotada y las desviaciones documentadas de CA2.

## Requirements

### Requirement: Inyección simulada del universo de piezas (HU-03 CA1)
El sistema SHALL permitir que el Encargado de Despacho registre el universo completo de piezas de un `Proyecto` en estado "Sin piezas cargadas" pulsando el botón «Inyectar piezas desde plano/archivo», sin cargar ningún archivo real. El sistema SHALL registrar cada `Pieza` en estado "Pendiente", sin torre asignada y asociada a su `ParteCasa` dentro del `Proyecto`, SHALL cambiar el `Proyecto` a estado "En preparación" y SHALL comunicar cuántas `ParteCasa` y `Pieza` se crearon.

#### Scenario: Inyección de piezas desde un archivo válido (simulado en la demo)
- **DADO** que un proyecto se encuentra en estado "Sin piezas cargadas"
- **Y** el plano/archivo simulado cumple la plantilla definida (generación válida por construcción)
- **Y** contiene las piezas organizadas por parte de la casa
- **CUANDO** el encargado de despacho solicita inyectar las piezas pulsando «Inyectar piezas desde plano/archivo»
- **ENTONCES** el sistema registra todas las piezas del universo simulado
- **Y** asocia cada pieza a su parte de la casa dentro del proyecto
- **Y** establece cada pieza en estado "Pendiente" y sin torre asignada
- **Y** cambia el proyecto a estado "En preparación"
- **Y** comunica cuántas partes de la casa y cuántas piezas se crearon

### Requirement: Generación aleatoria acotada del universo simulado
El sistema SHALL generar entre 1 y 5 `ParteCasa` y hasta 100 `Pieza` por inyección, con un número de `ParteCasa` estrictamente menor que el de `Pieza` y al menos una `Pieza` en cada `ParteCasa`. El sistema SHALL elegir el `nombre` de cada `ParteCasa` sin repetir de la lista Techo, Muros exteriores, Muros interiores, Piso y Entrepiso, y SHALL asignar a cada `Pieza` un `codigo` compuesto por una letra de la A a la Z y un número del 1 al 25 (p. ej. `A3`, `I5`), elegidos al azar. El sistema SHALL garantizar que el `codigo` completo no se repita dentro del `Proyecto`; la letra y el número por separado SHALL poder repetirse siempre que el par sea distinto, y SHALL permitir que un mismo `codigo` aparezca en proyectos distintos. El atributo derivado `/completa` de `ParteCasa` SHALL NOT persistirse, y esta historia SHALL NOT crear la tabla `Torre`.

#### Scenario: Universo simulado generado dentro de los límites acordados
- **DADO** que un proyecto se encuentra en estado "Sin piezas cargadas"
- **CUANDO** el encargado de despacho solicita la inyección simulada
- **ENTONCES** se crean entre 1 y 5 partes de la casa y hasta 100 piezas
- **Y** el número de partes es menor que el número de piezas
- **Y** cada parte tiene al menos una pieza
- **Y** los nombres de las partes son distintos y pertenecen a la lista acordada
- **Y** cada pieza tiene un código con formato letra A–Z y número 1–25 (p. ej. `A3`, `I5`)
- **Y** no se repite el código completo dentro del proyecto

#### Scenario: Códigos repetibles en proyectos distintos
- **DADO** que dos proyectos distintos se encuentran en estado "Sin piezas cargadas"
- **CUANDO** el encargado de despacho inyecta piezas en ambos proyectos
- **ENTONCES** los códigos pueden repetirse entre ambos proyectos
- **Y** dentro de cada proyecto el código completo sigue siendo único

### Requirement: Rechazo de la inyección por rol no autorizado (HU-01 CA3)
El sistema SHALL rechazar sin modificar datos toda solicitud de inyección realizada por un usuario cuyo rol de demostración no sea *Encargado de Despacho*, y SHALL NOT mostrar el botón «Inyectar piezas desde plano/archivo» a ese rol.

#### Scenario: Rechazo de un intento de inyección por otro rol
- **DADO** que un usuario tiene el rol de demostración *Operario de Bodega*
- **Y** existe un proyecto en estado "Sin piezas cargadas"
- **CUANDO** intenta inyectar piezas en ese proyecto
- **ENTONCES** el sistema rechaza la solicitud
- **Y** no crea partes de la casa ni piezas
- **Y** conserva el proyecto en estado "Sin piezas cargadas"

### Requirement: Inyección únicamente desde "Sin piezas cargadas"
El sistema SHALL mostrar el botón «Inyectar piezas desde plano/archivo» solo cuando el `Proyecto` está en estado "Sin piezas cargadas" y no tiene `ParteCasa` ni `Pieza` registradas, y SHALL NOT modificar los datos si el proyecto está en otro estado o ya fue inyectado.

#### Scenario: Proyecto sin opción de inyección después de cargar las piezas
- **DADO** que un proyecto ya pasó a estado "En preparación" y tiene piezas registradas
- **CUANDO** el encargado de despacho abre ese proyecto
- **ENTONCES** el sistema no muestra el botón «Inyectar piezas desde plano/archivo»
- **Y** no crea nuevas partes de la casa ni piezas

### Requirement: Carga con formato inválido (CA2, desviación documentada)
El sistema documentado SHALL rechazar la carga completa, SHALL comunicar que el formato no es válido y SHALL NOT registrar `ParteCasa` ni `Pieza` cuando el archivo no cumple la plantilla definida. En la demo no existe carga de archivo real: el `GeneradorPlanoSimulado` entrega siempre datos válidos, por lo que este escenario del Gherkin original no se implementa ni se prueba y queda registrado como desviación en `.cin324/validaciones/VAL-HU-03-1.md`, igual que CA2 de HU-01.

#### Scenario: No se registra una carga con formato inválido en la demo
- **DADO** que un proyecto se encuentra en estado "Sin piezas cargadas"
- **CUANDO** el encargado de despacho solicita inyectar piezas sin aportar un archivo (única operación disponible en la demo)
- **ENTONCES** el sistema no registra ninguna carga inválida
- **Y** no registra partes de la casa ni piezas antes de la generación simulada válida

### Requirement: Carga con filas incompletas (CA2, desviación documentada)
El sistema documentado SHALL rechazar la carga completa, SHALL señalar las filas con error y SHALL NOT registrar piezas parciales cuando faltan datos obligatorios. En la demo el generador simulado produce toda `Pieza` con `codigo`, `estado` "Pendiente" y su `ParteCasa`, y cada `ParteCasa` con al menos una `Pieza`, de modo que el escenario original del Gherkin no se implementa ni se prueba y queda como desviación documentada.

#### Scenario: No se registran piezas parciales en la generación simulada
- **DADO** que un proyecto se encuentra en estado "Sin piezas cargadas"
- **CUANDO** el encargado de despacho solicita la inyección simulada
- **ENTONCES** el sistema no registra piezas incompletas
- **Y** cada parte de la casa creada contiene al menos una pieza con código y estado "Pendiente"
