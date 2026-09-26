# Atributos de calidad (ISO 25010)

## Priorización de los 9 atributos de primer nivel

1. Usabilidad (Capacidad de Interacción)
2. Fiabilidad
3. Adecuación Funcional
4. Seguridad
5. Eficiencia de Desempeño
6. Compatibilidad
7. Portabilidad
8. Mantenibilidad
9. Flexibilidad

## Métricas

### Usabilidad
- **Métrica:** Tiempo promedio en completar una tarea.
- **Cómo se mide:** Se cronometra cuánto se demora un operario desde que busca la torre hasta que marca el último panel del checklist. El objetivo es que la interfaz sea tan intuitiva que este proceso tome menos de 3 minutos por torre, disminuyendo la fricción en terreno.

### Fiabilidad
- **Métrica:** Porcentaje de disponibilidad del sistema (Uptime).
- **Medicion:** Via herramientas de monitoreo en el servidor. El sistema debe garantizar un 99.9% de disponibilidad durante el horario laboral de la faena, asegurando que los operarios no se queden atascados sin poder despachar.

### Adecuación Funcional
- **Métrica:** Tasa de exactitud en los despachos.
- **Cómo se mide:** Se calcula dividiendo la cantidad de camiones despachados con el 100% de los paneles correctos sobre el total de despachos realizados en el mes. Gracias a la validación del sistema, esta métrica debe ser del 100%, cumpliendo con la regla de negocio de no permitir envíos incompletos.
