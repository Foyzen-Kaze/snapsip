# Historias de usuario

<a id="hu-01"></a>

## HU-01 — Autenticación de usuarios
Como Operario de Bodega o Encargado de Despacho, quiero autenticarme con mis credenciales, para acceder únicamente a los proyectos y funciones que corresponden a mi rol.
**Actividad TO-BE asociada:** Iniciar sesión en el sistema.
**Criterios de aceptación:**
* CA1: Dado que el usuario posee credenciales registradas en el sistema, cuando el usuario solicita el acceso con un identificador y una clave válidos, entonces el sistema concede el acceso y habilita las funciones correspondientes a su rol.
* CA2: Dado que el usuario posee credenciales registradas en el sistema, cuando el usuario solicita el acceso con una clave incorrecta, entonces el sistema rechaza la solicitud e informa que las credenciales son inválidas.

<a id="hu-02"></a>

## HU-02 — Crear proyecto
Como Encargado de Despacho, quiero registrar un nuevo proyecto asociado a un cliente, para iniciar el control de todas las piezas que se esperan producir para esa casa.
**Actividad TO-BE asociada:** Registrar nuevo proyecto.
**Criterios de aceptación:**
* CA1: Dado que el encargado de despacho necesita iniciar el control de un cliente nuevo, cuando solicita el registro de un proyecto con un cliente, un código y un metraje, entonces el sistema registra el proyecto en estado "Sin piezas cargadas" con cero partes y cero piezas.
* CA2: Dado que existe un proyecto registrado con un código específico, cuando el encargado de despacho solicita el registro de otro proyecto con ese mismo código, entonces el sistema rechaza la solicitud e informa que el código está duplicado.
* CA3: Dado que un proyecto se encuentra en estado "Sin piezas cargadas", cuando el operario de bodega solicita la creación de una torre en ese proyecto, entonces el sistema rechaza la solicitud e informa que primero debe completarse la carga del plano o archivo de piezas.

<a id="hu-03"></a>

## HU-03 — Inyectar piezas desde plano/archivo
Como Encargado de Despacho, quiero registrar el universo completo de piezas de un proyecto a partir del plano o archivo de piezas, para que el sistema las registre automáticamente en estado Pendiente, organizadas por parte de la casa.
**Actividad TO-BE asociada:** Cargar universo de piezas del proyecto.
**Criterios de aceptación:**
* CA1: Dado un proyecto en estado "Sin piezas cargadas", cuando el encargado de despacho solicita el registro de un archivo con las piezas organizadas por parte de la casa, entonces el sistema registra cada pieza en estado Pendiente sin torre asignada y el proyecto pasa a estado "En preparación".
* CA2: Dado un proyecto en estado "Sin piezas cargadas", cuando el encargado de despacho solicita el registro de un archivo con formato inválido o con filas incompletas, entonces el sistema rechaza la carga completa, señala las filas con error y no registra piezas parciales.

<a id="hu-04"></a>

## HU-04 — Crear torre
Como Operario de Bodega, quiero registrar una torre asociada a un proyecto y a una parte de la casa, para documentar una agrupación física de piezas existente, exclusiva de ese cliente y esa parte.
**Actividad TO-BE asociada:** Registrar nueva torre.
**Criterios de aceptación:**
* CA1: Dado que un proyecto se encuentra en estado "En preparación" o posterior, cuando el operario de bodega solicita el registro de una torre para una parte de la casa específica, entonces el sistema registra una torre asociada únicamente a ese cliente y a esa parte, con cero piezas y en estado Abierta.
* CA2: Dado que una parte de la casa posee piezas que exceden la capacidad física de una torre existente, cuando el operario de bodega solicita el registro de una segunda torre para esa misma parte, entonces el sistema registra la nueva torre con una numeración correlativa.
* CA3: Dado que una torre está asociada exclusivamente a una parte de la casa, cuando el operario de bodega solicita asignar a esa torre una pieza de una parte distinta, entonces el sistema rechaza la solicitud.
* CA4: Dado que una torre se encuentra en estado Cerrada, cuando el operario de bodega solicita asignar una pieza nueva a esa torre, entonces el sistema rechaza la solicitud y sugiere el registro de otra torre para esa parte.

<a id="hu-05"></a>

## HU-05 — Asignar pieza a torre con evidencia
Como Operario de Bodega, quiero asignar una pieza pendiente a una torre junto con evidencia fotográfica, para dejar constancia de que la pieza existe y está ubicada correctamente.
**Actividad TO-BE asociada:** Asignar pieza a torre.
**Criterios de aceptación:**
* CA1: Dado que una pieza se encuentra en estado Pendiente, cuando el operario de bodega solicita asignar la pieza a una torre Abierta y adjunta evidencia fotográfica, entonces el sistema cambia la pieza a estado Listo y registra el usuario, la fecha y la hora de la asignación.
* CA2: Dado que una pieza se encuentra en estado Pendiente, cuando el operario de bodega solicita marcar la pieza como Lista sin adjuntar evidencia fotográfica, entonces el sistema rechaza la solicitud y exige la evidencia antes de autorizar el cambio de estado.
* CA3: Dado que una pieza ya se encuentra asignada a una torre, cuando el operario de bodega solicita asignar esa misma pieza a una torre distinta, entonces el sistema solicita confirmación del reemplazo antes de ejecutar la reasignación.

<a id="hu-06"></a>

## HU-06 — Consultar piezas pendientes
Como Operario de Bodega, quiero consultar las piezas pendientes de una parte de la casa, para ubicarlas físicamente y asignarlas a su torre correspondiente.
**Actividad TO-BE asociada:** Consultar estado de piezas.
**Criterios de aceptación:**
* CA1: Dado que un proyecto cuenta con piezas en estado Pendiente, cuando el operario de bodega solicita el listado de piezas pendientes filtrado por una parte de la casa, entonces el sistema presenta únicamente las piezas de esa parte que aún no poseen torre asignada.
* CA2: Dado que una parte de la casa no posee piezas en estado Pendiente, cuando el operario de bodega solicita el listado de piezas pendientes de esa parte, entonces el sistema informa explícitamente "0 pendientes" para esa parte.

<a id="hu-07"></a>

## HU-07 — Cierre manual de torre
Como Operario de Bodega, quiero cerrar manualmente una torre cuando ya no admite más piezas, para dejar de recibir asignaciones en ella sin depender de un porcentaje que una torre, al no tener capacidad predefinida, nunca podría alcanzar.
**Actividad TO-BE asociada:** Cerrar torre de piezas.
**Criterios de aceptación:**
* CA1: Dado que una torre posee al menos una pieza asignada, cuando el operario de bodega solicita el cierre de la torre, entonces el sistema cambia la torre a estado Cerrada y deja de ofrecerla como destino para nuevas piezas.
* CA2: Dado que una torre no posee piezas asignadas, cuando el operario de bodega solicita el cierre de la torre, entonces el sistema rechaza la solicitud y sugiere la eliminación de la torre en su lugar.
* CA3: Dado que una torre se encuentra en estado Cerrada, cuando el operario de bodega solicita la reapertura de la torre, entonces el sistema cambia la torre a estado Abierta y vuelve a admitir piezas nuevas.

<a id="hu-08"></a>

## HU-08 — Generar guía de despacho
Como Encargado de Despacho, quiero generar la guía de despacho de una parte de la casa o de un proyecto completo solo cuando todas sus piezas estén Listo y sus torres Cerradas, para despachar únicamente con el 100% de las piezas del alcance y usar la guía como documento de control.
**Actividad TO-BE asociada:** Generar guía de despacho (incluye Validar completitud de piezas).
**Regla de alcance:** la guía se genera por parte de la casa (con todas sus torres) o por proyecto completo. No se genera por torre suelta. La completitud se exige solo sobre el alcance solicitado, por lo que se puede despachar una parte aunque el resto del proyecto aún no esté completo.
**Criterios de aceptación:**
* CA1: Dado que todas las piezas de una parte de la casa se encuentran en estado Listo y todas sus torres están Cerradas, cuando el encargado de despacho solicita la generación de la guía de esa parte, entonces el sistema marca la parte como Completa y genera la guía con el detalle de las piezas y las torres cerradas incluidas.
* CA2: Dado que una parte de la casa o un proyecto posee piezas en estado Pendiente, cuando el encargado de despacho solicita la generación de la guía para ese alcance, entonces el sistema rechaza la solicitud e informa la cantidad de piezas que faltan.
* CA3: Dado que todas las partes de la casa de un proyecto se encuentran Completas y todas sus torres están Cerradas, cuando el encargado de despacho solicita la generación de la guía del proyecto, entonces el sistema marca el proyecto como Proyecto completo y genera la guía con el detalle de todas las piezas y torres incluidas.
* CA4: Dado que todas las piezas del alcance solicitado se encuentran en estado Listo pero al menos una de sus torres está Abierta, cuando el encargado de despacho solicita la generación de la guía, entonces el sistema rechaza la solicitud e informa qué torres deben cerrarse.
* CA5: Dado que un proyecto tiene una parte de la casa Completa con sus torres Cerradas y otras partes con piezas Pendiente, cuando el encargado de despacho solicita la guía solo de la parte Completa, entonces el sistema genera la guía de esa parte sin exigir la completitud del resto del proyecto.
* CA6: Dado que una parte de la casa se encuentra Completa, cuando una de sus piezas vuelve a estado Pendiente, entonces el sistema deja de considerar Completa esa parte y, si el proyecto estaba como Proyecto completo, deja de considerarlo así.

<a id="hu-09"></a>

## HU-09 — Registrar envío con evidencia
Como Encargado de Despacho, quiero registrar el envío de una guía de despacho con evidencia fotográfica, para dejar constancia de que el despacho salió con las piezas correctas.
**Actividad TO-BE asociada:** Registrar envío de despacho.
**Criterios de aceptación:**
* CA1: Dado que una guía de despacho fue generada, cuando el encargado de despacho solicita registrar el envío y adjunta evidencia fotográfica, entonces el sistema cambia las piezas incluidas a estado Enviado y registra el usuario y la fecha del envío.
* CA2: Dado que una guía de despacho fue generada, cuando el encargado de despacho solicita registrar el envío sin adjuntar evidencia fotográfica, entonces el sistema rechaza la solicitud y exige la evidencia antes de completar el registro.

<a id="hu-10"></a>

## HU-10 — Eliminar torre vacía con código
Como Operario de Bodega, quiero eliminar una torre vacía confirmando su código, para evitar eliminaciones accidentales mediante un método ágil desde el celular.
**Actividad TO-BE asociada:** Eliminar torre del sistema.
**Criterios de aceptación:**
* CA1: Dado que una torre no posee piezas asignadas, cuando el operario de bodega solicita la eliminación de la torre e informa el código exacto de la torre como confirmación, entonces el sistema elimina la torre de forma lógica y deja de ofrecerla para la asignación de piezas.
* CA2: Dado que una torre no posee piezas asignadas, cuando el operario de bodega solicita la eliminación de la torre e informa un código distinto al de la torre, entonces el sistema rechaza la solicitud e informa que el código no coincide.
* CA3: Dado que una torre posee piezas asignadas, cuando el operario de bodega solicita la eliminación de la torre, entonces el sistema rechaza la solicitud y sugiere desasignar las piezas o cerrar la torre previamente.

<a id="hu-11"></a>

## HU-11 — Desasignar pieza de una torre
Como Operario de Bodega, quiero desasignar una pieza que fue asignada por error, para corregir una marca equivocada sin dejar evidencia falsa en el sistema.
**Actividad TO-BE asociada:** Desasignar pieza.
**Criterios de aceptación:**
* CA1: Dado que una pieza se encuentra en estado Listo dentro de una torre, cuando el operario de bodega solicita la desasignación de esa pieza, entonces el sistema devuelve la pieza a estado Pendiente sin torre asignada e invalida la evidencia de marca anterior.
* CA2: Dado que una pieza se encuentra en estado Enviado, cuando el operario de bodega solicita la desasignación de esa pieza, entonces el sistema rechaza la solicitud e informa que una pieza enviada no puede desasignarse directamente.
