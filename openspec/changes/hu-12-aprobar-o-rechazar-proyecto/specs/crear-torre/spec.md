## MODIFIED Requirements

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
- **DADO** que un proyecto está en estado «Pendiente de aprobación», «Aprobado» o «Rechazado» sin piezas registradas
- **CUANDO** el operario de bodega solicita crear una torre en ese proyecto
- **ENTONCES** el sistema rechaza la solicitud con el mensaje «primero deben inyectarse las piezas del proyecto desde el archivo» (HU-02 CA3, `07-criterios-aceptacion.md:68`)
- **Y** no crea la torre
