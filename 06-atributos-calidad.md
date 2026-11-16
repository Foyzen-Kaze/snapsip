# Atributos de calidad (ISO/IEC 25010:2023)

## Priorización de los 9 atributos de primer nivel
1. Capacidad de interacción (antes, usabilidad)
2. Fiabilidad
3. Adecuación funcional
4. Seguridad
5. Eficiencia de desempeño
6. Mantenibilidad
7. Compatibilidad
8. Flexibilidad (antes, portabilidad)
9. Protección (safety)

## Métricas de los 3 atributos más importantes

### 1. Capacidad de interacción (antes, usabilidad)
- **Asociación directa:** Requisito **RP-13** y **HU-05** (*Asignar pieza a torre con evidencia*).
- **Métrica:** Tasa de éxito sin asistencia y tiempo de ejecución de la asignación de una pieza a una torre con evidencia.
- **Cómo se mide:** En una prueba con cinco usuarios representativos del rol Operario de Bodega, cada uno debe realizar dos asignaciones de piezas diferentes. Al menos nueve de las diez tareas deben completarse correctamente, sin ayuda del evaluador y en menos de 180 segundos cada una. La medición comienza con el proyecto seleccionado y termina cuando el sistema confirma la asignación con evidencia almacenada.

### 2. Fiabilidad
- **Asociación directa:** Requisito **RP-14** y las historias **HU-01** (*Autenticación de usuarios*), **HU-06** (*Consultar piezas pendientes*) y **HU-08** (*Generar guía de despacho*).
- **Métrica:** Porcentaje de disponibilidad observada del sistema durante la ventana de operación de la fábrica.
- **Cómo se mide:** Durante un piloto de veinte días hábiles, de lunes a viernes entre las 08:00 y las 18:00 (America/Santiago), una comprobación funcional periódica autentica un usuario de prueba, consulta piezas pendientes y genera una guía válida sobre datos de prueba. La disponibilidad se calcula como `100 × (tiempo observado − tiempo de indisponibilidad) / tiempo observado` y debe alcanzar al menos un **99,9 %**. Las fallas de proveedores cuentan como indisponibilidad.

### 3. Adecuación funcional
- **Asociación directa:** Requisitos **RP-08**, **RP-09**, **RP-10** y **RD-01**, e historias **HU-08** (*Generar guía de despacho*) y **HU-09** (*Registrar envío con evidencia*).
- **Métrica:** Porcentaje de solicitudes inválidas de despacho que el sistema rechaza correctamente.
- **Cómo se mide:** Se ejecutan casos de prueba con solicitudes válidas e inválidas. Son inválidas la generación de una guía cuyo alcance tiene piezas Pendiente o torres Abiertas (RP-08, RP-09) y el registro de un envío sin evidencia o con una guía Invalidada (RP-10, RD-01). El sistema debe rechazar el **100 %** de las solicitudes inválidas y aceptar el 100 % de las válidas, lo que elimina los despachos incompletos y sus sobrecostos por flete.
