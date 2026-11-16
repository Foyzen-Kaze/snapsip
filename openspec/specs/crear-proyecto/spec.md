## Purpose
Definir el registro de proyectos de SnapSip (HU-02, CU-02, RP-02), permitiendo al Encargado de Despacho crear un `Proyecto` con cliente, código y metraje, con código único y estado inicial "Sin piezas cargadas" sin partes ni piezas.

## Requirements

### Requirement: Creación de un proyecto con código único (CA1)
El sistema SHALL permitir que el Encargado de Despacho registre un `Proyecto` indicando `cliente`, `codigo` y `metraje` cuando el `codigo` no pertenece a otro proyecto. Al registrarlo, el sistema SHALL asociar el proyecto al cliente, conservar el `codigo` y el `metraje` indicados, establecer su `estado` en "Sin piezas cargadas" y dejar el proyecto sin `ParteCasa` ni `Pieza` registradas.

#### Scenario: Creación de un proyecto con código único
- **DADO** que el encargado de despacho dispone del cliente, el código y el metraje del proyecto
- **Y** el código no pertenece a otro proyecto
- **CUANDO** solicita crear el proyecto con esos datos
- **ENTONCES** el sistema registra el proyecto asociado al cliente
- **Y** conserva el código y el metraje indicados
- **Y** establece su estado en "Sin piezas cargadas"
- **Y** el proyecto queda sin partes de la casa ni piezas registradas

### Requirement: Rechazo de un código de proyecto duplicado (CA2)
El sistema SHALL rechazar la solicitud de crear un `Proyecto` cuando el `codigo` indicado ya pertenece a un proyecto registrado, SHALL comunicar que el código está duplicado y SHALL conservar el proyecto existente sin modificaciones.

#### Scenario: Rechazo de un código de proyecto duplicado
- **DADO** que existe un proyecto registrado con un determinado código
- **CUANDO** el encargado de despacho solicita crear otro proyecto con ese mismo código
- **ENTONCES** el sistema rechaza la solicitud
- **Y** comunica que el código está duplicado
- **Y** conserva el proyecto existente sin modificaciones

### Requirement: Proyecto en estado "Sin piezas cargadas" antes de inyectar piezas (CA3)
El sistema SHALL mantener un `Proyecto` recién creado en `estado` "Sin piezas cargadas" y sin partes de la casa ni piezas registradas, de modo que no se considere apto para la creación de torres hasta completar la carga del plano o archivo de piezas (condición que CU-04/HU-04 hará cumplir al solicitar crear una torre).

#### Scenario: Rechazo de la creación de una torre antes de inyectar las piezas
- **DADO** que un proyecto se encuentra en estado "Sin piezas cargadas"
- **CUANDO** el operario de bodega solicita crear una torre en ese proyecto
- **ENTONCES** el sistema rechaza la solicitud
- **Y** comunica que primero deben inyectarse las piezas del proyecto desde el archivo
- **Y** no crea la torre
