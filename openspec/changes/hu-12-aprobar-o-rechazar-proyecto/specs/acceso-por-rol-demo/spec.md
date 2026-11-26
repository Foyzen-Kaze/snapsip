## MODIFIED Requirements

### Requirement: Acceso con rol de demostración (adaptación de CA1)
El sistema SHALL permitir establecer un rol de demostración (*Operario de Bodega*, *Encargado de Despacho* o *Supervisor de Proyectos*) sin autenticación real ni ingreso de credenciales, y SHALL conceder acceso habilitando únicamente las funciones/proyectos autorizados para el rol seleccionado.

#### Scenario: Acceso concedido al seleccionar un rol de demostración
- **DADO** que la aplicación ofrece los roles de demostración *Operario de Bodega*, *Encargado de Despacho* y *Supervisor de Proyectos*
- **CUANDO** el usuario solicita acceder seleccionando un rol de demostración válido
- **ENTONCES** el sistema concede el acceso
- **Y** habilita únicamente las funciones autorizadas para ese rol

## ADDED Requirements

### Requirement: Función de aprobación de proyectos para el Supervisor de Proyectos
El sistema SHALL incluir la función «Aprobar o rechazar proyecto (HU-12)» entre las funciones habilitadas para el rol *Supervisor de Proyectos*, y SHALL NOT incluirla entre las funciones de los roles *Operario de Bodega* ni *Encargado de Despacho*.

#### Scenario: Funciones habilitadas para el Supervisor de Proyectos
- **DADO** que el usuario selecciona el rol de demostración *Supervisor de Proyectos*
- **CUANDO** el sistema muestra sus funciones habilitadas
- **ENTONCES** incluye «Aprobar o rechazar proyecto (HU-12)»
- **Y** no incluye las funciones restringidas a `Crear proyecto` (HU-02) ni a `Inyectar piezas desde plano/archivo` (HU-03)

#### Scenario: Otros roles no reciben la función de aprobación
- **DADO** que el usuario selecciona el rol de demostración *Operario de Bodega* o *Encargado de Despacho*
- **CUANDO** el sistema muestra sus funciones habilitadas
- **ENTONCES** no incluye «Aprobar o rechazar proyecto (HU-12)»
