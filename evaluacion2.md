# Diego Marengo:
Cómo se añade un nuevo rol, lo primero que cambian son las HU:
1) La historia de usuario 1 de autenticación de usuario deberia modificarse ya que se añade un nuevo rol de supervisor. Y ademas deberia agregarse un nuevo CA y hacer el gherkin asociado a ese CA.
2) Hay que añadir a la HU 2 de crear proyecto un nuevo CA que hable sobre el apruebo o rechazo del supervisor con respecto al proyecto en sí, y hacerlo en el gherkin también. 
2) Deberia crearse una nueva HU, con sus respectivos criterios de aceptacion a fin de que el supervisor apruebe o rechace proyectos.
Como se la HU1 se modifica y se crea una nueva historia, el gherkin (criterios de aceptación) debe modificarse para ajustarlo al nuevo requerimiento, ademas de crear CA nuevos para la nueva HU. 


# Sebastian Fredy:
1) Modelo de dominio: lo que se va a cambiar como ahora proyecto debe poder aprobarse vamos a tener que modificar la clase proyecto al atributo estado ya cumple con mostrar los estados podriamos añadirle en estado uno que podria ser esperando Aprobacion
2) Lo que no va a cambiar aunque haya un nuevo rol este no es un concepto de negocio asi que no se metera en el modelo de dominio
3) Casos de uso: como se añade un nuevo rol supervisor de proyectos va a ser un usuario de nuestro sistema asi que entra en el diagrama de casos de uso como actor y se le añade un caso de uso  de lo que esta pidiendo el cambio de poder aprobar  o rechazar un nuevo proyecto asi que habra un nuevo caso de uso para hacer esto que lo hara el rol supervisor de proyectos


# David Nuñez: 
1) Diagrama de secuencia: se cambia el diagramas de secuencia DSS-03 el nuevo usuario Supervisor de proyecto cambia el flujo del diagrama en DSS-03 se debe agregar el nuevo usuario al momento de autenticarse.
2) Cambio en diagrama de estado: se cambia el diagrama de estado EST-03 al momento de generar la guia de despacho el proyecto necesariamente debe estar aprobado



