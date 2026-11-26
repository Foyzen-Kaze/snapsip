## Purpose
Definir el registro de torres de SnapSip (HU-04, CU-04, RP-04, EST-02), permitiendo al Operario de Bodega crear una `Torre` asociada a un `Proyecto` y una `ParteCasa`, con numeración correlativa por proyecto, estado inicial «Abierta» y sin piezas asignadas.

## Requirements

### Requirement: Registro de una torre para una parte del proyecto
El sistema SHALL registrar una `Torre` asociada únicamente al `Proyecto` y a la `ParteCasa` elegidos, con `estado` «Abierta» y cero `Pieza` asignadas, cuando el `Proyecto` esté en «En preparación» o «Proyecto completo» y la `ParteCasa` pertenezca a ese `Proyecto`. El `codigo` de la `Torre` SHALL generarse como `TOR-<codigo del Proyecto>-<numero>`.

#### Scenario: Creación de una torre para una parte de la casa
- **DADO** que un proyecto está en estado «En preparación»
- **Y** la parte de la casa seleccionada pertenece a ese proyecto
- **CUANDO** el operario de bodega solicita crear una torre para esa parte
- **ENTONCES** el sistema registra una torre asociada únicamente a ese proyecto y a esa parte
- **Y** le asigna la siguiente numeración correlativa dentro del proyecto
- **Y** establece su estado en «Abierta»
- **Y** la torre queda sin piezas asignadas
- **Y** muestra el código generado `TOR-<codigo del Proyecto>-<numero>`

#### Scenario: Rechazo de un proyecto sin universo de piezas cargado
- **DADO** que un proyecto está en estado «Pendiente de aprobación», «Aprobado» o «Rechazado»
- **CUANDO** el operario de bodega solicita crear una torre en ese proyecto
- **ENTONCES** el sistema rechaza la solicitud con el mensaje «primero deben inyectarse las piezas del proyecto desde el archivo» (HU-02 CA3, `07-criterios-aceptacion.md:68`)
- **Y** no crea la torre

### Requirement: Numeración correlativa por proyecto y conservación de torres anteriores
El sistema SHALL asignar a cada nueva `Torre` el siguiente `numero` correlativo dentro del `Proyecto`, con independencia de la `ParteCasa`, y SHALL conservar el registro, el estado y las `Pieza` de las torres ya creadas.

#### Scenario: Creación de una segunda torre para la misma parte
- **DADO** que una parte de la casa tiene una torre creada
- **Y** sus piezas exceden la capacidad física de esa torre
- **CUANDO** el operario de bodega solicita crear otra torre para la misma parte
- **ENTONCES** el sistema registra una nueva torre en estado «Abierta»
- **Y** le asigna la siguiente numeración correlativa dentro del proyecto
- **Y** conserva las piezas y el estado de la torre anterior

#### Scenario: Numeración independiente entre proyectos
- **DADO** que dos proyectos tienen al menos una parte de la casa con piezas
- **CUANDO** el operario de bodega crea una torre en cada proyecto
- **ENTONCES** cada torre recibe el número 1 dentro de su propio proyecto

### Requirement: Rechazo de combinaciones inválidas de Proyecto y ParteCasa
El sistema SHALL rechazar la creación de una `Torre` cuando la `ParteCasa` elegida no pertenezca al `Proyecto` seleccionado, y SHALL NOT crear la torre.

#### Scenario: Rechazo de una parte de la casa ajena al proyecto
- **DADO** que una parte de la casa no pertenece al proyecto seleccionado
- **CUANDO** el operario de bodega solicita crear una torre con esa combinación
- **ENTONCES** el sistema rechaza la solicitud con el mensaje «La parte de la casa no pertenece al proyecto seleccionado.»
- **Y** no crea la torre

### Requirement: Restricción de acceso a la creación de torres
El sistema SHALL permitir crear torres únicamente al Operario de Bodega, y SHALL rechazar la solicitud de cualquier otro rol sin revelar datos de proyectos ni torres.

#### Scenario: Rechazo por rol no autorizado
- **DADO** que el encargado de despacho tiene acceso a la aplicación
- **CUANDO** solicita crear una torre
- **ENTONCES** el sistema rechaza el acceso
- **Y** no crea la torre ni revela datos de proyectos o torres
