# Atributos de calidad (ISO 25010)

## Priorización de los 9 atributos de primer nivel

1. Usabilidad
2. Fiabilidad
3. Adecuación funcional
4. Seguridad
5. Eficiencia de desempeño
6. Compatibilidad
7. Portabilidad
8. Mantenibilidad
9. Flexibilidad

## Métricas de los 3 atributos mas relevantes

### Usabilidad
**Métrica:** Tiempo de ejecución de tarea y tasa de finalización sin asistencia.

**Cómo se mide:** Se mide el tiempo que le toma a un operario en terreno buscar una torre en el sistema y completar el checklist desde el celular. Al ser un ambiente de fábrica, la interfaz tiene que ir al grano sin flujos enredados. El objetivo es que la tarea completa tome menos de 3 minutos y que el trabajador no necesite leer un manual ni pedir ayuda para entender la pantalla. Esto se evaluará observando a los usuarios durante la etapa de marcha blanca.

### Fiabilidad
**Métrica:** Porcentaje de disponibilidad (Uptime) en horario operativo.

**Cómo se mide:** Se calcula revisando los dashboards de monitoreo de los servidores en la nube. La meta es mantener un 99.9% de uptime durante los turnos de trabajo. Este atributo es crítico, ya que si la plataforma se cae, el sistema no puede emitir el PDF de despacho, lo que detiene físicamente la salida de los camiones y genera un cuello de botella en la logística.

### Adecuación funcional
**Métrica:** Tasa de exactitud en la validación de la regla de negocio principal.

**Cómo se mide:** Se revisa la proporción entre los PDFs de despacho generados y las torres que efectivamente tenían su checklist marcado al 100%. El sistema tiene la responsabilidad de bloquear el botón de exportación si falta aunque sea un panel. Esta métrica se mide contrastando las guías generadas con los logs de auditoría en la base de datos. El nivel de aceptación esperado es del 100% (cero tolerancia a falsos positivos que permitan despachos incompletos).
