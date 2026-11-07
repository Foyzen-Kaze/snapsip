# Clasificación de requisitos

## Requisitos de producto

### Requisitos funcionales

| ID | Requisito | Tipo | Actividad TO-BE / Historia asociada |
| :--- | :--- | :--- | :--- |
| RP-01 | El sistema debe autenticar a los usuarios mediante un identificador y una contraseña registrados, rechazando el acceso cuando las credenciales sean inválidas. | Funcional | Iniciar sesión en el sistema — HU-01 |
| RP-02 | El sistema debe permitir al Encargado de Despacho registrar un proyecto indicando cliente, código único y metraje. El proyecto debe quedar en estado «Sin piezas cargadas», sin partes ni piezas registradas. Debe rechazarse un código de proyecto duplicado. | Funcional | Registrar nuevo proyecto — HU-02 |
| RP-03 | El sistema debe permitir al Encargado de Despacho importar el universo de piezas de un proyecto mediante un archivo estructurado conforme a la plantilla de importación definida. Una importación válida debe registrar las piezas en estado «Pendiente», organizadas por parte de la casa y sin torre asignada, y dejar el proyecto «En preparación». Una importación inválida debe rechazarse sin incorporar registros parciales. | Funcional | Cargar universo de piezas del proyecto — HU-03 |
| RP-04 | El sistema debe permitir al Operario de Bodega crear una torre en un proyecto cuyo universo de piezas ya haya sido cargado. Cada torre debe pertenecer a un único proyecto y a una única parte de la casa, comenzar en estado «Abierta» y recibir una numeración correlativa dentro del proyecto. | Funcional | Registrar nueva torre — HU-04 |
| RP-05 | El sistema debe permitir al Operario de Bodega asignar una pieza «Pendiente» a una torre «Abierta» del mismo proyecto y de la misma parte de la casa, únicamente cuando se adjunte evidencia fotográfica. La operación debe dejar la pieza «Listo» y registrar la evidencia, el usuario y la fecha y hora de asignación. | Funcional | Asignar pieza a torre — HU-05 |
| RP-06 | El sistema debe permitir al Operario de Bodega consultar las piezas «Pendiente» sin torre asignada de una parte de la casa dentro de un proyecto. Si no existen coincidencias, debe informar que no hay piezas pendientes para esa selección. | Funcional | Consultar estado de piezas — HU-06 |
| RP-07 | El sistema debe permitir al Operario de Bodega cerrar manualmente una torre «Abierta» que contenga al menos una pieza. La torre debe quedar «Cerrada» y rechazar nuevas asignaciones. El sistema debe rechazar el cierre de una torre vacía. | Funcional | Cerrar torre de piezas — HU-07 |
| RP-08 | El sistema debe determinar la completitud de una parte de la casa o de un proyecto comparando las piezas registradas con las piezas en estado «Listo». Solo debe declarar «Completa» la parte, o «Proyecto completo» el proyecto, cuando el universo correspondiente contenga al menos una pieza y todas estén «Listo». Debe reevaluar esta condición cuando cambie el estado de una pieza. | Funcional | Validar completitud de piezas, dentro de Generar guía de despacho — HU-08 |
| RP-09 | El sistema debe permitir al Encargado de Despacho generar y descargar una guía en PDF para una parte de la casa o un proyecto únicamente cuando todas las piezas del alcance solicitado estén «Listo» y pertenezcan a torres «Cerradas». El documento debe identificar el proyecto, el alcance, las piezas y las torres incluidas. Si no se cumplen las condiciones, debe rechazar la generación e informar los impedimentos. | Funcional | Generar guía de despacho — HU-08 |
| RP-10 | El sistema debe permitir al Encargado de Despacho registrar el envío correspondiente a una guía generada, vigente y aún no enviada, adjuntando evidencia fotográfica. La operación debe dejar las piezas incluidas en estado «Enviado» y registrar la guía, la evidencia, el usuario y la fecha y hora del envío. | Funcional | Registrar envío de despacho — HU-09 |
| RP-11 | El sistema debe permitir la eliminación lógica de una torre únicamente cuando esté vacía y el usuario ingrese su código exacto como confirmación. Debe conservar el registro de la torre y de su eliminación, incluyendo usuario y fecha y hora, y excluirla de las torres disponibles para asignación. | Funcional | Eliminar torre del sistema — HU-10 |
| RP-12 | El sistema debe permitir al Operario de Bodega desasignar una pieza «Listo» que todavía no haya sido enviada. La operación debe dejarla «Pendiente», retirar su asociación vigente con la torre e invalidar la evidencia como respaldo de la asignación actual, conservándola en el historial. | Funcional | Desasignar pieza — HU-11 |
| RP-16 | El sistema debe autorizar cada operación protegida según el rol del usuario autenticado y la matriz de permisos del proyecto. Debe rechazar las operaciones no autorizadas sin modificar los datos, incluso cuando se soliciten directamente al servidor. | Funcional | Controlar acceso por rol — HU-01; transversal a HU-02–HU-11 |


### Requisitos no funcionales

| ID | Requisito verificable | Tipo | Atributo de calidad | Actividad TO-BE / Historia asociada |
| :--- | :--- | :--- | :--- | :--- |
| RP-13 | En una prueba con cinco usuarios representativos del rol Operario de Bodega, cada uno debe realizar dos asignaciones de piezas diferentes. Al menos nueve de las diez tareas deben completarse correctamente, sin ayuda del evaluador y en menos de 180 segundos cada una. La medición comienza con el proyecto seleccionado y termina cuando el sistema confirma la asignación con evidencia almacenada. | No funcional | Usabilidad / Operabilidad; tiempo de tarea como medida de eficiencia de uso | Asignar pieza a torre — HU-05 |
| RP-14 | Durante un piloto de veinte días hábiles, el servicio debe alcanzar una disponibilidad observada de al menos 99,9 % dentro de la ventana de lunes a viernes, de 08:00 a 18:00, según la zona horaria America/Santiago. Se considera disponible cuando una comprobación funcional permite autenticar un usuario de prueba, consultar piezas y generar una guía válida sobre datos de prueba. Las fallas de proveedores que impidan completar estas operaciones cuentan como indisponibilidad. | No funcional | Fiabilidad / Disponibilidad | Iniciar sesión, consultar piezas y generar guía — HU-01, HU-06 y HU-08 |
| RP-15a | Todas las comunicaciones de la aplicación que transmitan credenciales, sesiones, datos de proyectos o evidencias deben utilizar HTTPS con TLS 1.2 o superior. Ninguna operación protegida debe aceptar estos datos mediante HTTP sin cifrar. | No funcional | Seguridad / Confidencialidad e integridad en tránsito | Transversal a HU-01–HU-11 |
| RP-15b | Las contraseñas deben almacenarse únicamente como hashes generados mediante Argon2id o bcrypt, con sal individual y parámetros de trabajo documentados. No deben almacenarse contraseñas en texto plano ni mediante cifrado reversible en bases de datos o registros de aplicación. Si se utiliza autenticación administrada, debe verificarse el mecanismo del proveedor. | No funcional | Seguridad / Confidencialidad | Iniciar sesión en el sistema — HU-01 |

#### Condiciones de verificación

| Requisito | Verificación y evidencia requerida |
| :--- | :--- |
| RP-13 | Registrar dispositivo, navegador, conexión, volumen de piezas, capacitación previa, resultado y duración de cada intento. La tarea comprende localizar digitalmente una pieza, elegir una torre válida, capturar o seleccionar la fotografía y cargarla. No comprende búsqueda física en la bodega ni la preparación de una torre completa. No se eliminan del resultado los intentos fallidos. |
| RP-14 | Documentar previamente la frecuencia y ubicación del monitoreo, el tiempo máximo de respuesta de cada comprobación y el criterio para delimitar una interrupción. Calcular disponibilidad como `100 × (tiempo observado de la ventana − tiempo de indisponibilidad) / tiempo observado de la ventana`. Registrar interrupciones y resultados de las comprobaciones, sin ocultar fallas de proveedores. |
| RP-15a | Revisar los canales usados por aplicación, autenticación y almacenamiento de evidencias. Comprobar rechazo de versiones TLS inferiores a 1.2 y ausencia de transmisión de datos protegidos mediante HTTP. |
| RP-15b | Revisar la configuración del mecanismo de autenticación, algoritmo, sal y parámetros de trabajo. Inspeccionar registros con cuentas de prueba para verificar que no se registren contraseñas. Si el almacenamiento es administrado, aportar evidencia documental y de configuración del proveedor. |


## Requisitos de proyecto

| ID | Requisito |
| :--- | :--- |
| RY-01 | El proyecto debe concluir con la entrega y aceptación del software correspondiente al alcance acordado, junto con la documentación de instalación o despliegue, configuración y uso, y la transferencia de los accesos administrativos necesarios al cliente. El soporte operativo, mantenimiento evolutivo y actualizaciones posteriores quedan fuera del alcance, salvo acuerdo adicional. |
| RY-02 | Antes de la aceptación final, el equipo debe entregar un procedimiento de administración de usuarios, resguardo de datos y eliminación lógica de torres, e identificar con el cliente a los responsables de esas actividades después de la entrega. |


## Requisito derivado

| Elemento | Especificación |
| :--- | :--- |
| ID | RD-01 |
| Requisitos de origen | RP-09 y RP-12 |
| Tipo | Funcional derivado |
| Requisito | Si una pieza incluida en una guía generada y todavía no enviada es desasignada, el sistema debe invalidar esa guía para el registro de envío. Debe exigir la generación de una nueva guía después de que vuelvan a cumplirse las condiciones de RP-09. |
| Justificación | Una guía puede haberse generado correctamente y quedar desactualizada después de una desasignación. Validar únicamente al generar el PDF permitiría registrar un envío utilizando una guía que ya no representa las piezas preparadas. |
| Historias asociadas | HU-08, HU-09 y HU-11 |
| Verificación | Generar una guía válida, desasignar una pieza incluida e intentar registrar su envío. El sistema debe rechazarlo e informar que la guía fue invalidada. |
