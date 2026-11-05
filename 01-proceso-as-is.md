# Proceso de negocio — AS-IS

**Macro-proceso y proceso específico**
Logística → Almacenamiento y Despacho de Paneles SIP

### Objetivo de negocio del proceso
Organizar las torres de paneles en la bodega, trasladar los proyectos a la zona de carga y despachar los camiones correctamente, gestionando sobre la marcha las incidencias por piezas faltantes o mal marcadas.

### Participantes y sus objetivos

| Participante | Objetivo en el proceso |
| :--- | :--- |
| **Operario de bodega** | Trasladar las torres a la zona de carga y realizar búsquedas de emergencia en la bodega cuando se detectan piezas faltantes o mal marcadas durante la carga. |
| **Encargado de despacho** | Revisar visualmente las piezas mientras se carga el camión, registrar las piezas no encontradas para envíos posteriores (sobrecostos) y generar el respaldo manual del despacho. |

### Diagrama AS-IS

![Diagrama AS-IS](./proceso-as-is.png)

Archivo fuente: [`./diagramas/panelessip.bpmn`](./diagramas/panelessip.bpmn)

### Problemas identificados

* **Cuello de botella en la validación:** La revisión de las piezas se realiza de forma visual y manual *durante* la carga del camión. Cualquier discrepancia detiene inmediatamente el flujo de despacho.
* **Tiempos muertos por logística inversa:** Si el encargado detecta que falta una pieza o está mal marcada, el operario debe realizar una "búsqueda frenética" desarmando otras pilas en la bodega, pausando el trabajo del equipo.
* **Pérdidas económicas (Sobrecostos por flete):** Si la pieza no se encuentra a tiempo tras la búsqueda, el camión se despacha incompleto. Esto obliga a la fábrica a asumir el costo de un flete adicional para enviar la pieza faltante posteriormente.
* **Trazabilidad deficiente:** El respaldo de lo que se despachó se genera de forma manual (fotos o papeles) al final del proceso. Esto dificulta la defensa de la fábrica cuando los clientes reclaman erroneamente que no recibieron piezas que sí fueron cargadas.
