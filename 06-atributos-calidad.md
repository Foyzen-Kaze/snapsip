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

### 1. Capacidad de interacción (usabilidad)
- **Asociación directa:** Requisito **RP-13** y **HU-05** (*Asignar pieza a torre con evidencia*).
- **Métrica:** Tiempo de ejecución de la tarea principal y tasa de éxito sin asistencia en dispositivos móviles[cite: 6].
- **Cómo se mide:** En una prueba con cinco usuarios representativos del rol Operario de Bodega, cada uno debe realizar dos asignaciones de piezas diferentes desde un dispositivo móvil en terreno. Al menos nueve de las diez tareas deben completarse correctamente, sin ayuda del evaluador y en menos de 180 segundos cada una, validando la agilidad en la planta descrita en las iniciativas de rediseño[cite: 2, 3].

### 2. Fiabilidad
- **Asociación directa:** Requisito **RP-14** y flujos operativos críticos (**HU-01, HU-06, HU-08**)[cite: 3, 4].
- **Métrica:** Porcentaje de disponibilidad operativa del sistema durante la ventana de la fábrica[cite: 6].
- **Cómo se mide:** Se monitorea durante un piloto de veinte días hábiles la disponibilidad de los servicios de autenticación, consulta de piezas pendientes y generación de guías PDF, de lunes a viernes entre las 08:00 y las 18:00 (America/Santiago). La disponibilidad se calcula como $100 \times (\text{tiempo observado} - \text{tiempo de indisponibilidad}) / \text{tiempo observado}$, debiendo alcanzar al menos un **99,9%** para evitar paralizaciones en los despachos de la planta SIP[cite: 2, 3].

### 3. Adecuación funcional
- **Asociación directa:** Requisitos **RP-08, RP-09, RP-10** y reglas de control de completitud (**HU-08, HU-09**)[cite: 3, 4].
- **Métrica:** Porcentaje de efectividad en el bloqueo y validación de reglas de negocio para los despachos[cite: 6].
- **Cómo se mide:** Se ejecutan casos de prueba sobre solicitudes válidas e inválidas de generación de guías de despacho y registros de envío. El sistema debe garantizar un **100% de efectividad** al rechazar de forma estricta cualquier intento de generar guías o registrar envíos si existen piezas pendientes o torres abiertas en el alcance seleccionado, eliminando los sobrecostos por fletes incompletos[cite: 1, 2, 3].
