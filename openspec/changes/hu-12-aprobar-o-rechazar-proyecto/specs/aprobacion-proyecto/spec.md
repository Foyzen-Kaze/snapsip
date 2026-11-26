## ADDED Requirements

### Requirement: Aprobación de un proyecto pendiente (HU-12 CA1)
El sistema SHALL permitir que el Supervisor de Proyectos solicite `aprobar proyecto` sobre un `Proyecto` en estado «Pendiente de aprobación» y SHALL cambiar su `estado` a «Aprobado». El sistema SHALL habilitar ese `Proyecto` para la inyección de piezas de HU-03 y SHALL NOT crear ningún campo ni indicador adicional de aprobación.

#### Scenario: Aprobación de un proyecto pendiente
- **DADO** que un proyecto se encuentra en estado «Pendiente de aprobación»
- **Y** el usuario autenticado tiene el rol de demostración *Supervisor de Proyectos*
- **CUANDO** el supervisor solicita aprobar el proyecto
- **ENTONCES** el sistema cambia el proyecto a estado «Aprobado»
- **Y** habilita el proyecto para la inyección de piezas
- **Y** no agrega ningún campo de aprobación al proyecto

### Requirement: Rechazo de un proyecto pendiente (HU-12 CA2)
El sistema SHALL permitir que el Supervisor de Proyectos solicite `rechazar proyecto` sobre un `Proyecto` en estado «Pendiente de aprobación» y SHALL cambiar su `estado` a «Rechazado». El sistema SHALL NOT permitir la inyección de piezas en ese proyecto.

#### Scenario: Rechazo de un proyecto pendiente
- **DADO** que un proyecto se encuentra en estado «Pendiente de aprobación»
- **Y** el usuario autenticado tiene el rol de demostración *Supervisor de Proyectos*
- **CUANDO** el supervisor solicita rechazar el proyecto
- **ENTONCES** el sistema cambia el proyecto a estado «Rechazado»
- **Y** no permite inyectar piezas en el proyecto

### Requirement: Rechazo de aprobación o rechazo sobre un proyecto no pendiente (HU-12 CA3)
El sistema SHALL rechazar toda solicitud de `aprobar proyecto` o `rechazar proyecto` cuando el `Proyecto` no esté en estado «Pendiente de aprobación», y SHALL conservar el estado y los datos del proyecto sin modificaciones. La misma regla SHALL aplicarse a «Aprobado», «Rechazado», «En preparación» y «Proyecto completo».

#### Scenario: Rechazo de aprobación o rechazo sobre un proyecto que no está pendiente
- **DADO** que un proyecto se encuentra en estado «Aprobado», «Rechazado» o «En preparación»
- **Y** el usuario autenticado tiene el rol de demostración *Supervisor de Proyectos*
- **CUANDO** el supervisor solicita aprobar o rechazar el proyecto
- **ENTONCES** el sistema rechaza la solicitud
- **Y** mantiene el estado actual del proyecto sin modificaciones

### Requirement: Rechazo de aprobación o rechazo por un rol no autorizado (HU-12 CA4)
El sistema SHALL rechazar sin modificar datos toda solicitud de `aprobar proyecto` o `rechazar proyecto` realizada por un usuario cuyo rol de demostración no sea *Supervisor de Proyectos*, incluso cuando la solicitud se envíe directamente al servidor.

#### Scenario: Rechazo de aprobación o rechazo por un rol no autorizado
- **DADO** que un proyecto se encuentra en estado «Pendiente de aprobación»
- **Y** el usuario autenticado posee un rol distinto a *Supervisor de Proyectos*
- **CUANDO** solicita aprobar o rechazar el proyecto
- **ENTONCES** el sistema rechaza la solicitud
- **Y** mantiene el proyecto en estado «Pendiente de aprobación»

### Requirement: Aprobación representada por el ciclo de estados de Proyecto
El sistema SHALL considerar que un `Proyecto` en estado «Aprobado», «En preparación» o «Proyecto completo» ya fue aprobado por el Supervisor de Proyectos, sin necesidad de un atributo separado ni de una nueva consulta.

#### Scenario: Estados posteriores implican aprobación
- **DADO** que un proyecto fue aprobado y está en estado «Aprobado»
- **CUANDO** el encargado de despacho inyecta las piezas y el proyecto pasa a «En preparación»
- **ENTONCES** el proyecto sigue implicando que fue aprobado por el Supervisor de Proyectos
- **Y** el sistema no expone ningún campo ni indicador adicional de aprobación
