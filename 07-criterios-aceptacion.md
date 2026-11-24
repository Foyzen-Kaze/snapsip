# Criterios de aceptación (Gherkin)

Los escenarios siguen la numeración de [04-historias-usuario.md](./04-historias-usuario.md) (HU-01 a HU-11). Cada «Característica» lleva el título de su historia, y cada paso «Cuando» usa el verbo de su [caso de uso](./09-casos-de-uso.md). Los escenarios usan los términos del [modelo de dominio](./08-modelo-dominio.md) y los estados de los [diagramas de estado](./11-diagramas-estado.md).

Cada escenario lleva un comentario (`# CA…`) con el criterio de aceptación de la historia que especifica. Todos los criterios de las once historias tienen al menos un escenario. Un escenario marcado como «derivado» proviene directamente de un requisito de [03-requisitos.md](./03-requisitos.md).

## HU-01 — Autenticación de usuarios

Historia: Como Operario de Bodega o Encargado de Despacho, quiero autenticarme con mis credenciales, para acceder únicamente a los proyectos y funciones que corresponden a mi rol.

```gherkin
Característica: Autenticación de usuarios

  # CA1
  Escenario: Acceso con credenciales válidas
    Dado que un usuario posee credenciales registradas y un rol asignado
    Cuando solicita autenticarse con su identificador y su contraseña válidos
    Entonces el sistema concede el acceso
    Y habilita únicamente los proyectos y funciones autorizados para su rol

  # CA2
  Escenario: Rechazo de credenciales inválidas
    Dado que un usuario posee credenciales registradas
    Cuando solicita autenticarse con su identificador y una contraseña incorrecta
    Entonces el sistema rechaza la solicitud
    Y comunica que las credenciales son inválidas
    Y no concede acceso a las funciones protegidas

  # CA3
  Escenario: Rechazo de una operación no autorizada para el rol
    Dado que un usuario está autenticado
    Y su rol no autoriza una determinada operación protegida
    Cuando solicita realizar esa operación
    Entonces el sistema rechaza la solicitud
    Y conserva los datos sin modificaciones
```

## HU-02 — Crear proyecto

Historia: Como Encargado de Despacho, quiero registrar un nuevo proyecto asociado a un cliente, para iniciar el control de todas las piezas que se esperan producir para esa casa.

```gherkin
Característica: Crear proyecto

  # CA1
  Escenario: Creación de un proyecto con código único
    Dado que el encargado de despacho dispone del cliente, el código y el metraje del proyecto
    Y el código no pertenece a otro proyecto
    Cuando solicita crear el proyecto con esos datos
    Entonces el sistema registra el proyecto asociado al cliente
    Y conserva el código y el metraje indicados
    Y establece su estado en "Sin piezas cargadas"
    Y el proyecto queda sin partes de la casa ni piezas registradas

  # CA2
  Escenario: Rechazo de un código de proyecto duplicado
    Dado que existe un proyecto registrado con un determinado código
    Cuando el encargado de despacho solicita crear otro proyecto con ese mismo código
    Entonces el sistema rechaza la solicitud
    Y comunica que el código está duplicado
    Y conserva el proyecto existente sin modificaciones

  # CA3
  Escenario: Rechazo de la creación de una torre antes de inyectar las piezas
    Dado que un proyecto se encuentra en estado "Sin piezas cargadas"
    Cuando el operario de bodega solicita crear una torre en ese proyecto
    Entonces el sistema rechaza la solicitud
    Y comunica que primero deben inyectarse las piezas del proyecto desde el archivo
    Y no crea la torre
  # CA4
  Escenario: Espera de aprobación del supervisor
    Dado que un proyecto se encuentra bien constituido
    Cuando termine el proyecto
    Entonces el sistema lo deja en estado pendiente
    Y comunica directamente con el supervisor a la espera de aprobación
```

## HU-03 — Inyectar piezas desde plano/archivo

Historia: Como Encargado de Despacho, quiero registrar el universo completo de piezas de un proyecto a partir del plano o archivo de piezas, para que el sistema las registre automáticamente en estado Pendiente, organizadas por parte de la casa.

```gherkin
Característica: Inyectar piezas desde plano/archivo

  # CA1
  Escenario: Inyección de piezas desde un archivo válido
    Dado que un proyecto se encuentra en estado "Sin piezas cargadas"
    Y el archivo de piezas cumple la plantilla definida
    Y contiene las piezas organizadas por parte de la casa
    Cuando el encargado de despacho solicita inyectar las piezas desde ese archivo
    Entonces el sistema registra todas las piezas contenidas en el archivo
    Y asocia cada pieza a su parte de la casa dentro del proyecto
    Y establece cada pieza en estado "Pendiente" y sin torre asignada
    Y cambia el proyecto a estado "En preparación"

  # CA2
  Escenario: Rechazo de un archivo con formato inválido
    Dado que un proyecto se encuentra en estado "Sin piezas cargadas"
    Cuando el encargado de despacho solicita inyectar las piezas desde un archivo que no cumple la plantilla definida
    Entonces el sistema rechaza la carga completa
    Y comunica que el formato no es válido
    Y no registra partes de la casa ni piezas
    Y mantiene el proyecto en estado "Sin piezas cargadas"

  # CA2
  Escenario: Rechazo de un archivo con filas incompletas
    Dado que un proyecto se encuentra en estado "Sin piezas cargadas"
    Y el archivo de piezas contiene filas sin datos obligatorios
    Cuando el encargado de despacho solicita inyectar las piezas desde ese archivo
    Entonces el sistema rechaza la carga completa
    Y señala las filas con error
    Y no registra piezas parciales
    Y mantiene el proyecto en estado "Sin piezas cargadas"
```

## HU-04 — Crear torre

Historia: Como Operario de Bodega, quiero registrar una torre asociada a un proyecto y a una parte de la casa, para documentar una agrupación física de piezas existente, exclusiva de ese cliente y esa parte.

```gherkin
Característica: Crear torre

  # CA1
  Escenario: Creación de una torre para una parte de la casa
    Dado que un proyecto se encuentra en estado "En preparación"
    Y la parte de la casa seleccionada pertenece a ese proyecto
    Cuando el operario de bodega solicita crear una torre para esa parte
    Entonces el sistema registra una torre asociada únicamente a ese proyecto y a esa parte
    Y le asigna la siguiente numeración correlativa dentro del proyecto
    Y establece su estado en "Abierta"
    Y la torre queda sin piezas asignadas

  # CA2
  Escenario: Creación de una segunda torre para la misma parte
    Dado que una parte de la casa tiene una torre creada
    Y sus piezas exceden la capacidad física de esa torre
    Cuando el operario de bodega solicita crear otra torre para la misma parte
    Entonces el sistema registra una nueva torre en estado "Abierta"
    Y le asigna la siguiente numeración correlativa dentro del proyecto
    Y conserva las piezas y el estado de la torre anterior

  # CA3
  Escenario: Rechazo de una pieza de otra parte de la casa
    Dado que una torre está asociada a una parte de la casa
    Y una pieza "Pendiente" pertenece a una parte distinta
    Cuando el operario de bodega solicita asignar esa pieza a la torre
    Entonces el sistema rechaza la solicitud
    Y comunica que la torre no corresponde a la parte de la pieza
    Y mantiene la pieza en estado "Pendiente" y sin torre asignada

  # CA4
  Escenario: Rechazo de una pieza nueva en una torre cerrada
    Dado que una torre se encuentra en estado "Cerrada"
    Y una pieza "Pendiente" pertenece a la misma parte de la casa
    Cuando el operario de bodega solicita asignar esa pieza a la torre
    Entonces el sistema rechaza la solicitud
    Y sugiere registrar otra torre para esa parte de la casa
    Y conserva la pieza y la torre sin modificaciones

  # Derivado de RP-04
  Escenario: Rechazo de una parte de la casa ajena al proyecto
    Dado que una parte de la casa no pertenece al proyecto seleccionado
    Cuando el operario de bodega solicita crear una torre con esa combinación
    Entonces el sistema rechaza la solicitud
    Y no crea la torre
```

## HU-05 — Asignar pieza a torre con evidencia

Historia: Como Operario de Bodega, quiero asignar una pieza pendiente a una torre junto con evidencia fotográfica, para dejar constancia de que la pieza existe y está ubicada correctamente.

```gherkin
Característica: Asignar pieza a torre con evidencia

  # CA1
  Escenario: Asignación de una pieza pendiente
    Dado que una pieza se encuentra en estado "Pendiente" y sin torre asignada
    Y la torre de destino está en estado "Abierta"
    Y la pieza y la torre pertenecen al mismo proyecto y a la misma parte de la casa
    Cuando el operario de bodega solicita asignar la pieza a la torre y adjunta evidencia fotográfica
    Entonces el sistema asocia la pieza a la torre
    Y cambia la pieza a estado "Listo"
    Y conserva la evidencia como respaldo de la asignación
    Y registra el usuario, la fecha y la hora de la asignación

  # CA2
  Escenario: Rechazo de una asignación sin evidencia
    Dado que una pieza se encuentra en estado "Pendiente" y sin torre asignada
    Y existe una torre "Abierta" del mismo proyecto y de la misma parte de la casa
    Cuando el operario de bodega solicita asignar la pieza a la torre sin adjuntar evidencia fotográfica
    Entonces el sistema rechaza la solicitud
    Y exige la evidencia fotográfica
    Y mantiene la pieza en estado "Pendiente" y sin torre asignada

  # CA3
  Escenario: Reasignación confirmada a otra torre
    Dado que una pieza se encuentra en estado "Listo" y asignada a una torre
    Y otra torre está "Abierta" y pertenece al mismo proyecto y a la misma parte de la casa
    Cuando el operario de bodega solicita asignar la pieza a la otra torre, adjunta nueva evidencia fotográfica y confirma el reemplazo
    Entonces el sistema asocia la pieza a la nueva torre
    Y mantiene la pieza en estado "Listo"
    Y conserva la evidencia anterior en el historial, sin vigencia como respaldo
    Y registra la nueva evidencia con el usuario, la fecha y la hora
    Y cambia a "Invalidada" toda guía de despacho "Vigente" y todavía no enviada que incluya esa pieza

  # CA3
  Escenario: Reasignación no confirmada
    Dado que una pieza se encuentra en estado "Listo" y asignada a una torre
    Cuando el operario de bodega solicita asignar la pieza a otra torre y no confirma el reemplazo
    Entonces el sistema conserva la asignación y la evidencia anteriores
    Y no modifica ninguna guía de despacho

  # CA4
  Escenario: Rechazo por falla del servicio de almacenamiento de evidencias
    Dado que una pieza se encuentra en estado "Pendiente" y sin torre asignada
    Y la torre de destino está "Abierta" y pertenece al mismo proyecto y a la misma parte de la casa
    Y el servicio de almacenamiento de evidencias no acepta la fotografía
    Cuando el operario de bodega solicita asignar la pieza a la torre y adjunta evidencia fotográfica
    Entonces el sistema rechaza la asignación
    Y comunica que la evidencia no pudo almacenarse
    Y mantiene la pieza en estado "Pendiente" y sin torre asignada

  # CA5
  Escenario: Rechazo de la reasignación de una pieza enviada
    Dado que una pieza se encuentra en estado "Enviado"
    Cuando el operario de bodega solicita asignarla a otra torre
    Entonces el sistema rechaza la solicitud
    Y conserva la pieza sin modificaciones

  # CA6
  Escenario: Consulta de las piezas de una torre
    Dado que una torre tiene piezas asignadas
    Cuando el operario de bodega consulta esa torre
    Entonces el sistema presenta las piezas que contiene, con su código y su estado
```

## HU-06 — Consultar piezas pendientes

Historia: Como Operario de Bodega, quiero consultar las piezas pendientes de una parte de la casa, para ubicarlas físicamente y asignarlas a su torre correspondiente.

```gherkin
Característica: Consultar piezas pendientes

  # CA1
  Escenario: Consulta de una parte de la casa con piezas pendientes
    Dado que una parte de la casa tiene piezas en estado "Pendiente" y sin torre asignada
    Y el proyecto tiene piezas de otras partes y en otros estados
    Cuando el operario de bodega solicita consultar las piezas pendientes de esa parte de la casa
    Entonces el sistema presenta todas las piezas "Pendiente" sin torre asignada de esa parte
    Y excluye las piezas de otras partes y las que no están "Pendiente"

  # CA2
  Escenario: Consulta de una parte de la casa sin piezas pendientes
    Dado que una parte de la casa no tiene piezas en estado "Pendiente"
    Cuando el operario de bodega solicita consultar las piezas pendientes de esa parte de la casa
    Entonces el sistema no presenta piezas
    Y comunica explícitamente que hay "0 pendientes" para esa parte

  # CA3
  Escenario: Identificar el proyecto por cliente y código
    Dado que existen proyectos registrados
    Cuando el operario de bodega abre la consulta de piezas pendientes
    Entonces el sistema ofrece cada proyecto identificado por su cliente y su código

  # CA4
  Esquema del escenario: Ofrecer las partes del proyecto elegido
    Dado que el proyecto elegido tiene piezas cargadas en la parte de la casa "<parte>"
    Cuando el operario de bodega selecciona ese proyecto
    Entonces el sistema ofrece la parte de la casa "<parte>" para consultar

    Ejemplos:
      | parte            |
      | Techo            |
      | Muros exteriores |
      | Muros interiores |
      | Piso             |
      | Entrepiso        |

  # CA5
  Escenario: Ofrecer únicamente las partes que tiene el proyecto
    Dado que el proyecto elegido tiene piezas cargadas solo en "Muros interiores", "Techo" y "Entrepiso"
    Cuando el operario de bodega selecciona ese proyecto
    Entonces el sistema ofrece únicamente "Muros interiores", "Techo" y "Entrepiso"
    Y no ofrece "Muros exteriores" ni "Piso"

  # CA6
  Escenario: Proyecto sin piezas cargadas
    Dado que el proyecto elegido está en estado "Sin piezas cargadas"
    Cuando el operario de bodega selecciona ese proyecto
    Entonces el sistema informa que el proyecto no tiene partes de la casa con piezas cargadas
```

## HU-07 — Cierre manual de torre

Historia: Como Operario de Bodega, quiero cerrar manualmente una torre cuando ya no admite más piezas, para dejar de recibir asignaciones en ella sin depender de un porcentaje que una torre, al no tener capacidad predefinida, nunca podría alcanzar.

```gherkin
Característica: Cierre manual de torre

  # CA1
  Escenario: Cierre de una torre con piezas
    Dado que una torre está en estado "Abierta"
    Y contiene al menos una pieza asignada
    Y todavía existen piezas "Pendiente" de la misma parte de la casa
    Cuando el operario de bodega solicita cerrar manualmente la torre
    Entonces el sistema cambia la torre a estado "Cerrada"
    Y deja de admitirla como destino de nuevas piezas
    Y conserva las piezas que ya estaban asignadas a la torre
    Y mantiene "Pendiente" las piezas de la parte que aún no fueron asignadas

  # CA2
  Escenario: Rechazo del cierre de una torre vacía
    Dado que una torre está en estado "Abierta"
    Y no contiene piezas asignadas
    Cuando el operario de bodega solicita cerrar manualmente la torre
    Entonces el sistema rechaza la solicitud
    Y mantiene la torre en estado "Abierta"
    Y sugiere eliminar la torre en su lugar

  # CA3
  Escenario: Reapertura de una torre antes del envío
    Dado que una torre está en estado "Cerrada"
    Y ninguna de sus piezas está en estado "Enviado"
    Cuando el operario de bodega solicita reabrir la torre
    Entonces el sistema cambia la torre a estado "Abierta"
    Y vuelve a admitirla como destino de nuevas piezas
    Y cambia a "Invalidada" toda guía de despacho "Vigente" y todavía no enviada que incluya esa torre

  # CA4
  Escenario: Rechazo de la reapertura de una torre con piezas enviadas
    Dado que una torre está en estado "Cerrada"
    Y contiene piezas en estado "Enviado"
    Cuando el operario de bodega solicita reabrir la torre
    Entonces el sistema rechaza la solicitud
    Y mantiene la torre en estado "Cerrada"
```

## HU-08 — Generar guía de despacho

Historia: Como Encargado de Despacho, quiero generar la guía de despacho de una parte de la casa o de un proyecto completo solo cuando todas sus piezas estén Listo y sus torres Cerradas, para despachar únicamente con el 100% de las piezas del alcance y usar la guía como documento de control.

La validación de completitud (RP-08) se ejecuta dentro de esta historia. El alcance de una guía es una parte de la casa, con todas sus torres, o el proyecto completo; no se genera por torre suelta.

```gherkin
Característica: Generar guía de despacho

  # CA1
  Escenario: Generación de la guía de una parte de la casa completa
    Dado que una parte de la casa contiene al menos una pieza
    Y todas sus piezas están en estado "Listo"
    Y todas sus torres están en estado "Cerrada"
    Cuando el encargado de despacho solicita generar la guía de despacho de esa parte
    Entonces el sistema marca la parte de la casa como "Completa"
    Y genera la guía de despacho en PDF, en estado "Vigente"
    Y la guía detalla el proyecto, el alcance, las piezas y las torres cerradas incluidas

  # CA3
  Escenario: Generación de la guía del proyecto completo
    Dado que todas las partes de la casa de un proyecto están "Completa"
    Y todas las torres del proyecto están en estado "Cerrada"
    Cuando el encargado de despacho solicita generar la guía de despacho del proyecto
    Entonces el sistema cambia el proyecto a estado "Proyecto completo"
    Y genera la guía de despacho en PDF, en estado "Vigente"
    Y la guía detalla todas las piezas y torres del proyecto

  # CA5
  Escenario: Generación de la guía de una parte completa en un proyecto incompleto
    Dado que todas las piezas de una parte de la casa están "Listo" y sus torres "Cerrada"
    Y otra parte del mismo proyecto contiene piezas "Pendiente"
    Cuando el encargado de despacho solicita generar la guía de despacho solo de la parte completa
    Entonces el sistema genera la guía de esa parte en estado "Vigente"
    Y la guía excluye las piezas de las demás partes
    Y el sistema no exige la completitud del resto del proyecto

  # CA2
  Escenario: Rechazo por piezas pendientes
    Dado que el alcance solicitado contiene al menos una pieza en estado "Pendiente"
    Cuando el encargado de despacho solicita generar la guía de despacho de ese alcance
    Entonces el sistema rechaza la solicitud
    Y comunica la cantidad de piezas que faltan
    Y no genera la guía

  # CA4
  Escenario: Rechazo por torres abiertas
    Dado que todas las piezas del alcance solicitado están en estado "Listo"
    Y al menos una de sus torres está en estado "Abierta"
    Cuando el encargado de despacho solicita generar la guía de despacho de ese alcance
    Entonces el sistema rechaza la solicitud
    Y señala las torres que deben cerrarse
    Y no genera la guía

  # CA7
  Escenario: Rechazo de un alcance sin piezas
    Dado que el alcance solicitado no contiene piezas registradas
    Cuando el encargado de despacho solicita generar la guía de despacho de ese alcance
    Entonces el sistema rechaza la solicitud
    Y no considera completo ese alcance
    Y comunica que no existen piezas para incluir

  # CA8
  Escenario: Rechazo de un alcance con piezas ya enviadas
    Dado que el alcance solicitado contiene una pieza en estado "Enviado"
    Cuando el encargado de despacho solicita generar una nueva guía de despacho de ese alcance
    Entonces el sistema rechaza la solicitud
    Y comunica que el alcance incluye piezas ya enviadas

  # CA6
  Escenario: Pérdida de la completitud por una pieza que vuelve a pendiente
    Dado que una parte de la casa está "Completa"
    Y su proyecto está en estado "Proyecto completo"
    Cuando el operario de bodega desasigna una pieza de esa parte de su torre y la pieza vuelve a estado "Pendiente"
    Entonces el sistema deja de considerar "Completa" esa parte de la casa
    Y deja de considerar el proyecto como "Proyecto completo"
```

## HU-09 — Registrar envío con evidencia

Historia: Como Encargado de Despacho, quiero registrar el envío de una guía de despacho con evidencia fotográfica, para dejar constancia de que el despacho salió con las piezas correctas.

```gherkin
Característica: Registrar envío con evidencia

  # CA1
  Escenario: Registro del envío de una guía vigente con evidencia
    Dado que una guía de despacho está en estado "Vigente" y sin envío registrado
    Cuando el encargado de despacho solicita registrar el envío de esa guía y adjunta evidencia fotográfica
    Entonces el sistema cambia la guía a estado "Enviada"
    Y cambia todas las piezas incluidas en la guía a estado "Enviado"
    Y conserva la evidencia como respaldo del envío
    Y registra el usuario, la fecha y la hora del envío

  # CA2
  Escenario: Rechazo de un envío sin evidencia
    Dado que una guía de despacho está en estado "Vigente" y sin envío registrado
    Cuando el encargado de despacho solicita registrar el envío de esa guía sin adjuntar evidencia fotográfica
    Entonces el sistema rechaza la solicitud
    Y exige la evidencia fotográfica
    Y mantiene la guía en estado "Vigente"
    Y no cambia el estado de las piezas

  # CA3
  Escenario: Rechazo del envío de una guía invalidada
    Dado que una guía de despacho está en estado "Invalidada"
    Cuando el encargado de despacho solicita registrar el envío de esa guía
    Entonces el sistema rechaza la solicitud
    Y comunica que la guía fue invalidada y que debe generarse una nueva
    Y no cambia el estado de las piezas

  # CA4
  Escenario: Una guía invalidada no recupera su vigencia
    Dado que una guía de despacho fue "Invalidada"
    Y las condiciones de despacho de su alcance volvieron a cumplirse
    Cuando el encargado de despacho solicita registrar el envío con esa misma guía
    Entonces el sistema rechaza la solicitud
    Y mantiene la guía en estado "Invalidada"
    Y no cambia el estado de las piezas

  # CA5
  Escenario: Rechazo de un envío duplicado
    Dado que alguna pieza incluida en una guía de despacho ya está en estado "Enviado"
    Cuando el encargado de despacho solicita registrar un envío con esa guía
    Entonces el sistema rechaza la solicitud
    Y conserva el registro del envío anterior

  # CA6
  Escenario: Rechazo por falla del servicio de almacenamiento de evidencias
    Dado que una guía de despacho está en estado "Vigente" y sin envío registrado
    Y el servicio de almacenamiento de evidencias no acepta la fotografía del camión cargado
    Cuando el encargado de despacho solicita registrar el envío de esa guía y adjunta evidencia fotográfica
    Entonces el sistema rechaza la solicitud
    Y comunica que la evidencia no pudo almacenarse
    Y mantiene la guía en estado "Vigente"
    Y no cambia el estado de las piezas
```

## HU-10 — Eliminar torre vacía con código

Historia: Como Operario de Bodega, quiero eliminar una torre vacía confirmando su código, para evitar eliminaciones accidentales mediante un método ágil desde el celular.

```gherkin
Característica: Eliminar torre vacía con código

  # CA1
  Escenario: Eliminación confirmada de una torre vacía
    Dado que una torre no tiene piezas asignadas
    Cuando el operario de bodega solicita eliminar la torre e indica el código exacto de la torre como confirmación
    Entonces el sistema cambia la torre a estado "Eliminada"
    Y conserva su registro con el usuario, la fecha y la hora de la eliminación
    Y deja de admitirla como destino de nuevas piezas

  # CA2
  Escenario: Rechazo por código de confirmación incorrecto
    Dado que una torre no tiene piezas asignadas
    Cuando el operario de bodega solicita eliminar la torre e indica un código distinto al de la torre
    Entonces el sistema rechaza la solicitud
    Y comunica que el código no coincide
    Y conserva la torre sin modificaciones

  # CA3
  Escenario: Rechazo de la eliminación de una torre abierta con piezas
    Dado que una torre está en estado "Abierta"
    Y contiene al menos una pieza asignada
    Cuando el operario de bodega solicita eliminar la torre e indica su código exacto
    Entonces el sistema rechaza la solicitud
    Y sugiere desasignar las piezas previamente
    Y conserva la torre y sus piezas sin modificaciones

  # CA3
  Escenario: Rechazo de la eliminación de una torre cerrada con piezas
    Dado que una torre está en estado "Cerrada"
    Y contiene al menos una pieza asignada
    Cuando el operario de bodega solicita eliminar la torre e indica su código exacto
    Entonces el sistema rechaza la solicitud
    Y sugiere desasignar las piezas previamente
    Y conserva la torre y sus piezas sin modificaciones
```

## HU-11 — Desasignar pieza de una torre

Historia: Como Operario de Bodega, quiero desasignar una pieza que fue asignada por error, para corregir una marca equivocada sin dejar evidencia falsa en el sistema.

```gherkin
Característica: Desasignar pieza de una torre

  # CA1
  Escenario: Desasignación de una pieza que no ha sido enviada
    Dado que una pieza está en estado "Listo" y asignada a una torre
    Cuando el operario de bodega solicita desasignar esa pieza
    Entonces el sistema cambia la pieza a estado "Pendiente" y sin torre asignada
    Y deja sin vigencia la evidencia como respaldo de la asignación
    Y conserva esa evidencia en el historial
    Y cambia a "Invalidada" toda guía de despacho "Vigente" y todavía no enviada que incluya esa pieza

  # CA2
  Escenario: Rechazo de la desasignación de una pieza enviada
    Dado que una pieza está en estado "Enviado"
    Cuando el operario de bodega solicita desasignar esa pieza
    Entonces el sistema rechaza la solicitud
    Y comunica que una pieza enviada no puede desasignarse
    Y conserva la pieza, su torre y sus evidencias sin modificaciones
```
## HU-12 - Crear o Rechazar Proyecto
Cómo Supervisor de Proyecto, quiero aprobar o rechazar un proyecto que se encuentre en estado "pendiente de aprobación"
```gherkin
Caracteristica: Aprobar o Rechazar un proyecto
  # CA1
  Escenario: Apruebo un Proyecto
    Dado que un proyecto generado por el Encargado de Despacho
    Y que este bien constituido
    Cuando cómo Supervisor contacto al Cliente proponiendole el Proyecto y da visto bueno
    Entonces permito que el sistema Apruebe la Creación del Proyecto
    Y se comunica con el Encargado de Despacho, permitiendo que el proyecto avance.
  # CA2
  Escenario: Rechazo un Proyecto
    Dado que un proyecto generado por el Encargo de Despecho
    Y que este bien constituido
    Cuando cómo Supervisor contacto al Cliente proponiendole el Proyecto y no da visto bueno
    Entonces permito que el sistema Rechace la Creación del Proyecto
    Y se comunica con el Encargado de Despacho, no permitiendo seguir con el proyecto.     
```    