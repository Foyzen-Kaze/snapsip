# Historias de usuario
 
## <a id="hu-01"></a>HU-01 — Monitoreo de proyectos y filtrado de piezas
**Como** Jefe de Operaciones,  
**quiero** visualizar y filtrar mis proyectos, torres y piezas asociadas en una plataforma centralizada,  
**para** gestionar eficientemente los pedidos, minimizar errores de búsqueda y tener visibilidad del inventario en tiempo real.

- **Actividad TO-BE asociada:** [ACT-TOBE-02](./02-rediseno-to-be.md#act-tobe-02) (Monitoreo y control de piezas del proyecto)
- **Requisitos vinculados:** [RP-01](./03-requisitos.md#rp-01), [RP-02](./03-requisitos.md#rp-02), [RP-03](./03-requisitos.md#rp-03)

**Criterios de aceptación:**
- **CA1:** El sistema debe mostrar tanto los proyectos como las piezas asociadas a cada uno.
- **CA2:** Al seleccionar un proyecto, el sistema debe desplegar el listado completo de piezas agrupadas por tipo y torre perteneciente.
- **CA3:** El sistema debe proveer filtros rápidos para buscar piezas específicas (por ejemplo, piezas tipo H o H1).

---

## <a id="hu-02"></a>HU-02 — Verificación de checklist y evidencia de torres
**Como** Operario de Bodega / Trabajador,  
**quiero** verificar el estado de los paneles y torres mediante un checklist digital y adjuntar respaldo fotográfico,  
**para** asegurar fehacientemente que ninguna pieza falte antes de pasar a la siguiente etapa de producción o despacho.

- **Actividad TO-BE asociada:** [ACT-TOBE-03](./02-rediseno-to-be.md#act-tobe-03) (Verificación y armado de torres en terreno)
- **Requisitos vinculados:** [RP-05](./03-requisitos.md#rp-05), [RP-06](./03-requisitos.md#rp-06), [RP-09](./03-requisitos.md#rp-09)

**Criterios de aceptación:**
- **CA1:** El checklist debe permitir marcar cada panel con dos estados claros: *Listo* o *No listo*.
- **CA2:** Toda acción sobre el checklist debe registrar automáticamente marca de fecha y hora junto con el usuario responsable.
- **CA3:** La interfaz debe presentar indicadores visuales nítidos del estado de avance de la torre y sus paneles.
- **CA4:** El sistema debe permitir capturar o adjuntar fotografías como respaldo de la torre inspeccionada.

---

## <a id="hu-03"></a>HU-03 — Autenticación y control de acceso por roles
**Como** Dueño de la empresa / Administrador,  
**quiero** contar con autenticación de usuarios diferenciando los roles de Administrador y Operario,  
**para** resguardar las operaciones críticas (crear, modificar o finalizar proyectos) y garantizar que cada usuario acceda solo a las vistas correspondientes.

- **Actividad TO-BE asociada:** [ACT-TOBE-01](./02-rediseno-to-be.md#act-tobe-01) (Inicio de sesión y autenticación de usuario)
- **Requisitos vinculados:** [RP-04](./03-requisitos.md#rp-04), [RP-08](./03-requisitos.md#rp-08)

**Criterios de aceptación:**
- **CA1:** El sistema debe solicitar inicio de sesión seguro mediante correo electrónico y contraseña.
- **CA2:** Solo los usuarios con rol de Administrador pueden registrar, editar usuarios y gestionar la creación/cierre de proyectos.
- **CA3:** El sistema debe restringir las vistas según el rol: los operarios acceden al checklist y búsqueda operativa de torres, mientras los administradores acceden a la gestión global.

---

## <a id="hu-04"></a>HU-04 — Emisión y validación de Guía de Despacho en PDF
**Como** Encargado de Despacho / Bodega,  
**quiero** generar y descargar una Guía de Despacho oficial en PDF solo cuando la torre esté validada al 100%,  
**para** contar con el respaldo formal de entrega y asegurar que ningún camión sea cargado con piezas pendientes.

- **Actividad TO-BE asociada:** [ACT-TOBE-04](./02-rediseno-to-be.md#act-tobe-04) (Despacho y generación de guía PDF)
- **Requisitos vinculados:** [RP-07](./03-requisitos.md#rp-07), [RP-11 (Derivado)](./03-requisitos.md#rp-11-der)

**Criterios de aceptación:**
- **CA1:** El botón de descarga o generación de la Guía PDF debe estar inhabilitado si el checklist de la torre no ha alcanzado el 100% de cumplimiento.
- **CA2:** El documento PDF generado debe detallar: identificación del proyecto, torre despachada, listado de paneles validados, timestamp y firma/nombre del usuario responsable.
- **CA3:** Si el usuario intenta forzar la descarga de una torre incompleta, el sistema debe emitir una advertencia visible indicando las piezas pendientes.

---

## Matriz de Trazabilidad Completa del Proyecto

A continuación se resume la cadena de trazabilidad bidireccional desde el proceso original hasta las historias de usuario:

| Actividad AS-IS | Actividad TO-BE | Requisitos de Producto | Historia de Usuario |
|:---|:---|:---|:---|
| [ACT-AS-01](./01-proceso-as-is.md#act-as-01) | [ACT-TOBE-01](./02-rediseno-to-be.md#act-tobe-01) | [RP-04](./03-requisitos.md#rp-04), [RP-08](./03-requisitos.md#rp-08) | [HU-03](#hu-03) |
| [ACT-AS-02](./01-proceso-as-is.md#act-as-02) | [ACT-TOBE-02](./02-rediseno-to-be.md#act-tobe-02) | [RP-01](./03-requisitos.md#rp-01), [RP-02](./03-requisitos.md#rp-02), [RP-03](./03-requisitos.md#rp-03) | [HU-01](#hu-01) |
| [ACT-AS-03](./01-proceso-as-is.md#act-as-03) | [ACT-TOBE-03](./02-rediseno-to-be.md#act-tobe-03) | [RP-05](./03-requisitos.md#rp-05), [RP-06](./03-requisitos.md#rp-06), [RP-09](./03-requisitos.md#rp-09) | [HU-02](#hu-02) |
| [ACT-AS-04](./01-proceso-as-is.md#act-as-04) | [ACT-TOBE-04](./02-rediseno-to-be.md#act-tobe-04) | [RP-07](./03-requisitos.md#rp-07), [RP-11 (Derivado)](./03-requisitos.md#rp-11-der) | [HU-04](#hu-04) |


  
