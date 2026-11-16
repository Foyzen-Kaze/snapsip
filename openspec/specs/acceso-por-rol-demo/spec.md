## Purpose
Definir el control de acceso de demostración por rol para SnapSip (HU-01, CU-01), permitiendo establecer un rol de demostración (*Operario de Bodega* / *Encargado de Despacho*) sin autenticación real, habilitar funciones según rol y rechazar operaciones no autorizadas sin modificar datos.

## Requirements

### Requirement: Acceso con rol de demostración (adaptación de CA1)
El sistema SHALL permitir establecer un rol de demostración (*Operario de Bodega* o *Encargado de Despacho*) sin autenticación real ni ingreso de credenciales, y SHALL conceder acceso habilitando únicamente las funciones/proyectos autorizados para el rol seleccionado.

#### Scenario: Acceso concedido al seleccionar un rol de demostración
- **DADO** que la aplicación ofrece los roles de demostración *Operario de Bodega* y *Encargado de Despacho*
- **CUANDO** el usuario solicita acceder seleccionando un rol de demostración válido
- **ENTONCES** el sistema concede el acceso
- **Y** habilita únicamente las funciones autorizadas para ese rol

### Requirement: Rechazo de credenciales inválidas (CA2, no aplicable en demo)
El sistema SHALL no conceder acceso a funciones protegidas sin un contexto de acceso válido. Bajo la Opción 2 (selector de rol de demostración, sin credenciales), el escenario de credenciales inválidas del Gherkin original no se ejerce mediante ingreso de contraseña.

#### Scenario: No se concede acceso sin rol de demostración establecido
- **DADO** que el usuario no ha establecido un rol de demostración
- **CUANDO** intenta acceder a una función protegida sin seleccionar un rol válido
- **ENTONCES** el sistema no concede acceso a las funciones protegidas
- **Y** solicita establecer un rol de demostración

### Requirement: Rechazo de operación no autorizada por rol (CA3)
El sistema SHALL rechazar toda operación protegida solicitada por un usuario cuyo rol de demostración no la autoriza, sin modificar los datos.

#### Scenario: Rechazo de una operación no autorizada para el rol
- **DADO** que un usuario tiene acceso con un rol de demostración
- **Y** su rol no autoriza una determinada operación protegida
- **CUANDO** solicita realizar esa operación
- **ENTONCES** el sistema rechaza la solicitud
- **Y** conserva los datos sin modificaciones

### Requirement: Cambio de rol de demostración
El sistema SHALL permitir cambiar el rol de demostración activo y SHALL actualizar las funciones habilitadas según el nuevo rol.

#### Scenario: Cambio de rol de demostración
- **DADO** que un usuario tiene acceso con un rol de demostración
- **CUANDO** selecciona un rol de demostración diferente
- **ENTONCES** el sistema actualiza el contexto de acceso al nuevo rol
- **Y** habilita únicamente las funciones autorizadas para el nuevo rol
