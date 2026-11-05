# Criterios de aceptación (Gherkin)

## HU-01 — Autenticación de usuarios

Historia: Como Operario de Bodega o Encargado de Despacho, quiero autenticarme con mis credenciales, para acceder únicamente a los proyectos y funciones que corresponden a mi rol.

```gherkin
Característica: Autenticación y acceso según rol

  Escenario: Acceso con credenciales válidas
    Dado que un usuario posee credenciales registradas y un rol asignado
    Cuando solicita acceso con su identificador y contraseña válidos
    Entonces el sistema autentica al usuario
    Y permite el acceso a los proyectos y funciones autorizados para su rol

  Escenario: Rechazo de credenciales inválidas
    Dado que una persona no posee una combinación válida de identificador y contraseña
    Cuando solicita acceso con esas credenciales
    Entonces el sistema rechaza la solicitud
    Y comunica que las credenciales son inválidas
    Y no concede acceso a las funciones protegidas

  Escenario: Rechazo de una operación no autorizada
    Dado que un usuario está autenticado
    Y su rol no autoriza una determinada operación
    Cuando solicita realizar esa operación
    Entonces el sistema rechaza la solicitud
    Y conserva los datos sin modificaciones
```

## HU-02 — Crear proyecto

Historia: Como Encargado de Despacho, quiero registrar un nuevo proyecto asociado a un cliente, para iniciar el control de todas las piezas que se esperan producir para esa casa.

```gherkin
Característica: Registro de proyectos

  Escenario: Registro de un proyecto con código único
    Dado que el encargado de despacho dispone del cliente y metraje del proyecto
    Y el código solicitado no pertenece a otro proyecto
    Cuando solicita registrar el proyecto con esos datos
    Entonces el sistema registra el proyecto asociado al cliente
    Y conserva el código y metraje indicados
    Y establece su estado en "Sin piezas cargadas"
    Y el proyecto queda sin partes ni piezas registradas

  Escenario: Rechazo de un código de proyecto duplicado
    Dado que existe un proyecto registrado con un determinado código
    Cuando el encargado de despacho solicita registrar otro proyecto con ese código
    Entonces el sistema rechaza la solicitud
    Y comunica que el código ya está registrado
    Y conserva el proyecto existente sin modificaciones
```

## HU-03 — Cargar universo de piezas desde archivo estructurado

Historia: Como Encargado de Despacho, quiero importar el universo completo de piezas de un proyecto desde un archivo estructurado, para que el sistema las registre automáticamente en estado Pendiente, organizadas por parte de la casa.

```gherkin
Característica: Importación del universo de piezas

  Escenario: Importación de un archivo válido
    Dado que un proyecto se encuentra en estado "Sin piezas cargadas"
    Y el archivo contiene piezas organizadas por parte de la casa
    Y cumple la plantilla de importación establecida
    Cuando el encargado de despacho solicita importar el archivo
    Entonces el sistema registra todas las piezas contenidas en el archivo
    Y asocia cada pieza al proyecto y a su parte correspondiente
    Y establece cada pieza en estado "Pendiente" y sin torre asignada
    Y cambia el proyecto a estado "En preparación"

  Escenario: Rechazo de un formato no admitido
    Dado que un proyecto se encuentra en estado "Sin piezas cargadas"
    Cuando el encargado de despacho solicita importar un archivo de formato no admitido
    Entonces el sistema rechaza la importación
    Y comunica que el formato no es válido
    Y no incorpora partes ni piezas del archivo
    Y mantiene el proyecto en estado "Sin piezas cargadas"

  Escenario: Rechazo de registros incompletos
    Dado que un proyecto se encuentra en estado "Sin piezas cargadas"
    Y el archivo contiene registros sin datos obligatorios
    Cuando el encargado de despacho solicita importar el archivo
    Entonces el sistema rechaza la importación completa
    Y identifica los registros y datos que requieren corrección
    Y no incorpora partes ni piezas del archivo
    Y mantiene el proyecto en estado "Sin piezas cargadas"
```

## HU-04 — Crear torre

Historia: Como Operario de Bodega, quiero registrar una torre asociada a un proyecto y a una parte de la casa, para documentar una agrupación física de piezas existente, exclusiva de ese cliente y esa parte.

```gherkin
Característica: Registro de torres

  Escenario: Creación de una torre
    Dado que el universo de piezas del proyecto ya fue cargado
    Y la parte seleccionada pertenece a ese proyecto
    Cuando el operario de bodega solicita crear una torre para esa parte
    Entonces el sistema registra una torre asociada exclusivamente a ese proyecto y esa parte
    Y le asigna la siguiente numeración correlativa dentro del proyecto
    Y establece su estado en "Abierta"
    Y la torre queda sin piezas asignadas

  Escenario: Creación de otra torre para la misma parte
    Dado que una parte de la casa tiene una torre registrada
    Y todavía existen piezas pendientes de esa parte
    Cuando el operario de bodega solicita crear otra torre para la misma parte
    Entonces el sistema registra una nueva torre en estado "Abierta"
    Y le asigna la siguiente numeración correlativa dentro del proyecto
    Y conserva las piezas y el estado de la torre anterior

  Escenario: Rechazo de creación sin universo de piezas
    Dado que un proyecto se encuentra en estado "Sin piezas cargadas"
    Cuando el operario de bodega solicita crear una torre en ese proyecto
    Entonces el sistema rechaza la solicitud
    Y comunica que primero debe cargarse el universo de piezas

  Escenario: Rechazo de una parte ajena al proyecto
    Dado que una parte de la casa no pertenece al proyecto seleccionado
    Cuando el operario de bodega solicita crear una torre con esa combinación
    Entonces el sistema rechaza la solicitud
    Y no registra la torre
```

## HU-05 — Asignar pieza a torre con evidencia

Historia: Como Operario de Bodega, quiero asignar una pieza pendiente a una torre junto con evidencia fotográfica, para dejar constancia de que la pieza existe y está ubicada correctamente.

```gherkin
Característica: Asignación de piezas con evidencia

  Escenario: Asignación de una pieza pendiente
    Dado que una pieza se encuentra en estado "Pendiente" y sin torre asignada
    Y la torre de destino está en estado "Abierta"
    Y la pieza y la torre pertenecen al mismo proyecto y parte de la casa
    Cuando el operario de bodega solicita asignar la pieza y adjunta evidencia fotográfica
    Entonces el sistema asocia la pieza a la torre
    Y cambia la pieza a estado "Listo"
    Y conserva la evidencia vinculada a la asignación
    Y registra el usuario y la fecha y hora de la operación

  Escenario: Rechazo de asignación sin evidencia
    Dado que una pieza se encuentra en estado "Pendiente" y sin torre asignada
    Y existe una torre abierta del mismo proyecto y parte
    Cuando el operario de bodega solicita asignar la pieza sin evidencia fotográfica
    Entonces el sistema rechaza la solicitud
    Y comunica que la evidencia es obligatoria
    Y mantiene la pieza en estado "Pendiente" y sin torre asignada

  Escenario: Rechazo de asignación a una torre cerrada
    Dado que una pieza se encuentra en estado "Pendiente"
    Y la torre de destino está en estado "Cerrada"
    Cuando el operario de bodega solicita asignar la pieza a esa torre
    Entonces el sistema rechaza la solicitud
    Y conserva la pieza y la torre sin modificaciones

  Escenario: Rechazo de asignación entre proyectos o partes diferentes
    Dado que una pieza y una torre pertenecen a proyectos o partes de la casa diferentes
    Cuando el operario de bodega solicita asignar la pieza a esa torre
    Entonces el sistema rechaza la solicitud
    Y comunica que la pieza y la torre deben pertenecer al mismo proyecto y parte
    Y conserva la asignación anterior de la pieza, si existe

  Escenario: Cancelación del cambio de torre
    Dado que una pieza se encuentra en estado "Listo" y asignada a una torre
    Cuando el operario de bodega solicita cambiarla a otra torre y cancela el reemplazo
    Entonces el sistema conserva la asignación y evidencia anteriores
    Y no asigna la pieza a la nueva torre

  Escenario: Cambio de torre confirmado con nueva evidencia
    Dado que una pieza se encuentra en estado "Listo" y asignada a una torre
    Y la nueva torre está "Abierta" y pertenece al mismo proyecto y parte
    Cuando el operario de bodega confirma el cambio de torre y adjunta nueva evidencia fotográfica
    Entonces el sistema sustituye la asociación anterior por la nueva
    Y mantiene la pieza en estado "Listo"
    Y conserva la evidencia anterior como histórica
    Y registra la nueva evidencia y el usuario y la fecha y hora del cambio
    Y el sistema invalida permanentemente las guías vigentes y todavía no enviadas que incluyan esta pieza

  Escenario: Rechazo del cambio de torre de una pieza enviada
    Dado que una pieza se encuentra en estado "Enviado"
    Cuando el operario de bodega solicita asignarla a otra torre
    Entonces el sistema rechaza la solicitud
    Y conserva la pieza sin modificaciones
```

## HU-06 — Consultar piezas pendientes

Historia: Como Operario de Bodega, quiero consultar las piezas pendientes de una parte de la casa, para ubicarlas físicamente y asignarlas a su torre correspondiente.

```gherkin
Característica: Consulta de piezas pendientes

  Escenario: Consulta con piezas pendientes
    Dado que una parte de la casa tiene piezas "Pendiente" sin torre asignada
    Y existen otras piezas en diferentes partes o estados
    Cuando el operario de bodega solicita las piezas pendientes de esa parte y proyecto
    Entonces el sistema presenta todas las piezas "Pendiente" sin torre asignada de esa selección
    Y excluye las piezas de otros proyectos, partes o estados

  Escenario: Consulta sin piezas pendientes
    Dado que una parte de la casa no tiene piezas "Pendiente" sin torre asignada
    Cuando el operario de bodega solicita las piezas pendientes de esa parte y proyecto
    Entonces el sistema devuelve un listado vacío
    Y comunica que existen cero piezas pendientes para esa selección
```

## HU-07 — Cierre manual de torre

Historia: Como Operario de Bodega, quiero cerrar manualmente una torre cuando termino de agrupar sus piezas, para impedir nuevas asignaciones sin depender de la completitud de la parte o del proyecto.

```gherkin
Característica: Cierre y reapertura de torres

  Escenario: Cierre de una torre con piezas
    Dado que una torre está en estado "Abierta"
    Y contiene al menos una pieza asignada
    Cuando el operario de bodega solicita cerrar la torre
    Entonces el sistema cambia su estado a "Cerrada"
    Y impide nuevas asignaciones a esa torre
    Y conserva las piezas que ya estaban asignadas

  Escenario: Cierre con piezas pendientes en la parte
    Dado que una torre abierta contiene al menos una pieza
    Y todavía existen piezas pendientes de la misma parte de la casa
    Cuando el operario de bodega solicita cerrar la torre
    Entonces el sistema cambia la torre a estado "Cerrada"
    Y mantiene pendientes las piezas que todavía no fueron asignadas
    Y permite continuar su preparación en otra torre abierta

  Escenario: Rechazo del cierre de una torre vacía
    Dado que una torre está en estado "Abierta"
    Y no contiene piezas asignadas
    Cuando el operario de bodega solicita cerrar la torre
    Entonces el sistema rechaza la solicitud
    Y mantiene la torre en estado "Abierta"
    Y comunica que no puede cerrarse una torre vacía

  Escenario: Reapertura de una torre antes del envío
    Dado que una torre está en estado "Cerrada"
    Y ninguna de sus piezas ha sido enviada
    Cuando el operario de bodega solicita reabrirla
    Entonces el sistema cambia su estado a "Abierta"
    Y permite nuevas asignaciones válidas
    Y el sistema invalida permanentemente las guías vigentes y todavía no enviadas que incluyan esta torre

  Escenario: Rechazo de reapertura de una torre con piezas enviadas
    Dado que una torre está en estado "Cerrada"
    Y contiene piezas en estado "Enviado"
    Cuando el operario de bodega solicita reabrirla
    Entonces el sistema rechaza la solicitud
    Y mantiene la torre en estado "Cerrada"
```

## HU-08 — Validar completitud por Parte o Proyecto

Historia: Como Encargado de Despacho, quiero conocer si todas las piezas de una parte de la casa o del proyecto están listas y recibir un aviso cuando el proyecto complete su preparación, para coordinar el despacho sujeto a la validación de sus condiciones.

```gherkin
Característica: Validación de completitud de piezas y notificaciones

  Escenario: Parte con todas sus piezas listas
    Dado que una parte de la casa contiene al menos una pieza
    Y todas sus piezas se encuentran en estado "Listo"
    Cuando el sistema evalúa la completitud de esa parte
    Entonces identifica la parte como "Completa"

  Escenario: Proyecto transita a completo con notificaciones exitosas
    Dado que un proyecto no se encuentra en estado "Proyecto completo"
    Y contiene al menos una pieza y todas sus piezas están en estado "Listo"
    Y el encargado de despacho tiene registrado su contacto de mensajería
    Y el cliente tiene registrado su correo electrónico
    Y los servicios de mensajería y correo aceptan los envíos
    Cuando el sistema evalúa la completitud del proyecto
    Entonces identifica el proyecto como "Proyecto completo"
    Y envía al encargado una notificación de preparación completa mediante mensajería
    Y envía al cliente un correo de preparación completa
    Y registra el resultado de cada envío por separado

  Escenario: Fallo del correo al completar el proyecto
    Dado que un proyecto no se encuentra en estado "Proyecto completo"
    Y contiene al menos una pieza y todas sus piezas están en estado "Listo"
    Y el encargado y el cliente tienen sus datos de contacto registrados
    Y el servicio de mensajería acepta la notificación al encargado
    Y el servicio de correo rechaza el envío al cliente
    Cuando el sistema evalúa la completitud del proyecto
    Entonces identifica el proyecto como "Proyecto completo"
    Y registra la notificación al encargado como enviada
    Y registra el fallo del correo al cliente
    Y el fallo no revierte la completitud ni impide por sí mismo continuar el proceso de despacho

  Escenario: Fallo de mensajería al completar el proyecto
    Dado que un proyecto no se encuentra en estado "Proyecto completo"
    Y contiene al menos una pieza y todas sus piezas están en estado "Listo"
    Y el encargado y el cliente tienen sus datos de contacto registrados
    Y el servicio de mensajería rechaza la notificación al encargado
    Y el servicio de correo acepta el envío al cliente
    Cuando el sistema evalúa la completitud del proyecto
    Entonces identifica el proyecto como "Proyecto completo"
    Y registra el fallo de la notificación al encargado
    Y registra el correo al cliente como enviado
    Y el fallo no revierte la completitud ni impide por sí mismo continuar el proceso de despacho

  Escenario: Reevaluación de un proyecto que permanece completo
    Dado que un proyecto ya se encuentra en estado "Proyecto completo"
    Y ya se procesaron las notificaciones correspondientes a esa transición
    Y todas sus piezas permanecen en estado "Listo"
    Cuando el sistema vuelve a evaluar su completitud
    Entonces mantiene el estado "Proyecto completo"
    Y no genera nuevos envíos de notificaciones por esa reevaluación

  Escenario: Alcance con piezas pendientes
    Dado que una parte de la casa o un proyecto contiene al menos una pieza "Pendiente"
    Cuando el sistema evalúa la completitud de ese alcance
    Entonces informa que el alcance no está completo
    Y comunica la cantidad de piezas pendientes

  Escenario: Alcance sin piezas
    Dado que una parte de la casa o un proyecto no contiene piezas
    Cuando el sistema evalúa la completitud de ese alcance
    Entonces no lo declara completo
    Y comunica que no existen piezas registradas para evaluar

  Escenario: Pérdida de completitud después de una desasignación
    Dado que una parte de la casa se encuentra identificada como "Completa"
    Cuando una de sus piezas vuelve a estado "Pendiente" por una desasignación
    Entonces el sistema deja de identificar esa parte como "Completa"
    Y deja de identificar el proyecto como "Proyecto completo" si tenía esa condición
```

## HU-09 — Generar guía de despacho

Historia: Como Encargado de Despacho, quiero generar la guía de despacho de una parte de la casa o de un proyecto completo, para utilizarla como documento de control al despachar.

```gherkin
Característica: Generación de guías de despacho

  Escenario: Generación para un alcance válido
    Dado que el alcance solicitado es una parte de la casa o un proyecto completo
    Y contiene al menos una pieza
    Y todas sus piezas están en estado "Listo"
    Y están asignadas a torres "Cerradas" del proyecto y parte correspondientes
    Cuando el encargado de despacho solicita generar la guía
    Entonces el sistema genera una guía descargable en PDF
    Y identifica el proyecto y el alcance solicitado
    Y incluye exactamente las piezas del alcance y sus torres, sin duplicados

  Escenario: Generación para una parte completa de un proyecto incompleto
    Dado que todas las piezas de una parte están "Listo" y en torres "Cerradas"
    Y otra parte del mismo proyecto contiene piezas "Pendiente"
    Cuando el encargado de despacho solicita generar la guía únicamente para la parte preparada
    Entonces el sistema genera la guía de esa parte
    Y excluye las piezas de las demás partes

  Escenario: Rechazo por piezas pendientes
    Dado que el alcance solicitado contiene al menos una pieza "Pendiente"
    Cuando el encargado de despacho solicita generar la guía
    Entonces el sistema rechaza la solicitud
    Y informa la cantidad de piezas pendientes
    Y no genera la guía

  Escenario: Rechazo por una torre abierta
    Dado que todas las piezas del alcance solicitado están "Listo"
    Y al menos una pertenece a una torre "Abierta"
    Cuando el encargado de despacho solicita generar la guía
    Entonces el sistema rechaza la solicitud
    Y identifica las torres que requieren cierre
    Y no genera la guía

  Escenario: Rechazo de un alcance sin piezas
    Dado que el alcance solicitado no contiene piezas
    Cuando el encargado de despacho solicita generar la guía
    Entonces el sistema rechaza la solicitud
    Y comunica que no existen piezas para incluir

  Escenario: Rechazo de inclusión de piezas enviadas
    Dado que el alcance solicitado contiene una pieza en estado "Enviado"
    Cuando el encargado de despacho solicita generar una nueva guía para ese alcance
    Entonces el sistema rechaza la solicitud
    Y comunica que el alcance incluye piezas ya enviadas
```

## HU-10 — Registrar envío con evidencia

Historia: Como Encargado de Despacho, quiero registrar el envío de una guía de despacho con evidencia fotográfica, para dejar constancia de que el despacho salió con las piezas correctas.

```gherkin
Característica: Registro de envíos

  Escenario: Registro de envío con guía vigente y evidencia
    Dado que existe una guía generada, vigente y sin envío registrado
    Y todas sus piezas continúan "Listo" en las torres "Cerradas" indicadas en la guía
    Cuando el encargado de despacho solicita registrar el envío y adjunta evidencia fotográfica
    Entonces el sistema registra el envío asociado a la guía
    Y cambia todas las piezas incluidas a estado "Enviado"
    Y conserva la evidencia del envío
    Y registra el usuario y la fecha y hora de la operación

  Escenario: Rechazo de envío sin evidencia
    Dado que existe una guía vigente y sin envío registrado
    Cuando el encargado de despacho solicita registrar el envío sin evidencia fotográfica
    Entonces el sistema rechaza la solicitud
    Y comunica que la evidencia es obligatoria
    Y no cambia el estado de las piezas

  Escenario: Rechazo de envío con guía invalidada
    Dado que una guía fue invalidada por modificaciones posteriores a su generación
    Cuando el encargado de despacho solicita registrar su envío
    Entonces el sistema rechaza la solicitud
    Y comunica que debe generarse una nueva guía cuando se cumplan las condiciones de despacho
    Y no cambia el estado de las piezas

  Escenario: Una guía invalidada no recupera su vigencia
    Dado que una guía fue invalidada por la reapertura de una torre incluida después de su generación
    Y la torre volvió a cerrarse
    Y las piezas incluidas están nuevamente en condiciones de despacho
    Cuando el encargado de despacho solicita registrar el envío con esa guía
    Entonces el sistema rechaza la solicitud
    Y mantiene la guía invalidada
    Y exige generar una nueva guía
    Y no cambia el estado de las piezas

  Escenario: Rechazo de un envío duplicado
    Dado que alguna pieza incluida en una guía ya se encuentra en estado "Enviado"
    Cuando el encargado de despacho solicita registrar un envío con esa guía
    Entonces el sistema rechaza la solicitud
    Y no registra un segundo envío para esa pieza
    Y conserva el registro del envío anterior
```

## HU-11 — Eliminar torre vacía con código

Historia: Como Operario de Bodega, quiero eliminar una torre vacía confirmando su código, para evitar eliminaciones accidentales mediante un método ágil desde el celular.

```gherkin
Característica: Eliminación de torres vacías

  Escenario: Eliminación confirmada de una torre vacía
    Dado que una torre no tiene piezas asignadas
    Y no ha sido eliminada
    Cuando el operario de bodega solicita eliminarla e indica su código exacto
    Entonces el sistema marca la torre como eliminada sin borrar su registro histórico
    Y deja de admitirla como destino de nuevas asignaciones
    Y registra el usuario y la fecha y hora de la eliminación

  Escenario: Rechazo por código incorrecto
    Dado que una torre no tiene piezas asignadas
    Cuando el operario de bodega solicita eliminarla e indica un código diferente
    Entonces el sistema rechaza la solicitud
    Y comunica que el código no coincide
    Y conserva la torre sin modificaciones

  Escenario: Rechazo de eliminación de una torre con piezas
    Dado que una torre contiene al menos una pieza asignada
    Cuando el operario de bodega solicita eliminarla e indica su código exacto
    Entonces el sistema rechaza la solicitud
    Y comunica que solo pueden eliminarse torres vacías
    Y conserva la torre y sus piezas sin modificaciones

  Escenario: Rechazo de eliminación de una torre cerrada sin vaciar
    Dado que una torre está en estado "Cerrada"
    Y contiene al menos una pieza asignada
    Cuando el operario de bodega solicita eliminarla e indica su código exacto
    Entonces el sistema rechaza la solicitud
    Y comunica que solo pueden eliminarse torres vacías
    Y conserva la torre sin modificaciones
```

## HU-12 — Desasignar pieza de una torre

Historia: Como Operario de Bodega, quiero desasignar una pieza que fue asignada por error, para corregir una marca equivocada sin dejar evidencia falsa en el sistema.

```gherkin
Característica: Desasignación de piezas

  Escenario: Desasignación de una pieza no enviada
    Dado que una pieza está en estado "Listo" y asignada a una torre
    Cuando el operario de bodega solicita desasignarla
    Entonces el sistema cambia la pieza a estado "Pendiente"
    Y retira su asociación vigente con la torre
    Y invalida la evidencia anterior como respaldo de la asignación actual
    Y conserva esa evidencia como parte del historial
    Y registra el usuario y la fecha y hora de la corrección
    Y el sistema invalida permanentemente las guías vigentes y todavía no enviadas que incluyan esta pieza

  Escenario: Rechazo de desasignación de una pieza enviada
    Dado que una pieza está en estado "Enviado"
    Cuando el operario de bodega solicita desasignarla
    Entonces el sistema rechaza la solicitud
    Y comunica que una pieza enviada no puede desasignarse
    Y conserva su estado, asociación y evidencias
```










