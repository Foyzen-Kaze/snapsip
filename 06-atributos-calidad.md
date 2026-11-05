# Atributos de calidad (ISO/IEC 25010:2023)

## Priorización de los 9 atributos de primer nivel
1. Capacidad de interacción (usabilidad)
2. Fiabilidad
3. Adecuación funcional
4. Seguridad de la información
5. Eficiencia de desempeño
6. Mantenibilidad
7. Compatibilidad
8. Portabilidad
9. Flexibilidad

## Métricas de los 3 atributos más importantes

### Capacidad de interacción (usabilidad)
- **Métrica:** Tiempo de ejecución de la tarea principal y tasa de finalización sin asistencia.
- **Cómo se mide:** Se registra el tiempo que tarda un operario, desde la selección del proyecto, en localizar una pieza pendiente, asignarla a una torre abierta y adjuntar su evidencia fotográfica desde un dispositivo móvil. El criterio de aceptación es que al menos el 90 % de las tareas se complete correctamente en menos de 3 minutos (180 segundos), sin consultar manuales ni recibir asistencia de terceros.

### Fiabilidad
- **Métrica:** Porcentaje de disponibilidad durante el horario operativo de la fábrica.
- **Cómo se mide:** Se monitorea durante veinte días hábiles la disponibilidad de la autenticación, la consulta de piezas y la generación de guías PDF, de lunes a viernes entre las 08:00 y las 18:00, según la zona horaria de Santiago. La disponibilidad se calcula como el porcentaje del tiempo evaluado en que estas funciones operan correctamente. La meta es alcanzar al menos un 99,9 %, incluyendo las interrupciones de los proveedores en el cálculo, para reducir las detenciones del proceso de despacho.

### Adecuación funcional
- **Métrica:** Porcentaje de decisiones correctas en la validación de las condiciones de despacho.
- **Cómo se mide:** Se prueban solicitudes válidas e inválidas de generación de guías y se contrastan los resultados con los datos registrados. El sistema debe autorizar la generación únicamente cuando el alcance solicitado —una parte de la casa o el proyecto completo— contenga piezas y todas estén en estado «Listo», asignadas a torres «Cerradas». El criterio de aceptación es un 100 % de decisiones correctas en las pruebas: ninguna solicitud inválida autorizada y ninguna solicitud válida rechazada.