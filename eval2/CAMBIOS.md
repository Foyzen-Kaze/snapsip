# Cambios — Evaluación 2

## Cambio solicitado
El cliente de SnapSip tuvo un accidente en bodega: una torre muy alta se vino abajo. Desde ahora cada torre tiene una capacidad máxima de piezas, que el operario de bodega define al registrar la torre (un número entre 1 y 30). Cuando una torre alcanza su capacidad, el sistema la cierra automáticamente y no admite más piezas. Si el operario intenta asignar una pieza a una torre que ya está llena, el sistema lo rechaza y le sugiere crear otra torre para esa parte. Además, al asignar una pieza, el sistema debe informar cuántos cupos le quedan a la torre.

## Cambios por artefacto

| Artefacto | Qué cambió (antes → después) | Por qué lo exige el cambio | Responsable |
|-----------|------------------------------|----------------------------|-------------|
| HU y Gherkin | | | Marengo |
| Modelo de dominio |antes sin capacidad ahora con capacidadMax como atributo de la clase torre | lo exige porque ahora tenemos una capacidad limitada de pizas por torres y si ya esta lleno no se le meten piezas | Sebastián |
| Casos de uso | antes cu-04 y cu-05 despues siguen los mismos cu-04 y cu05 s| se mantienen porque sigue usando mismos roles y mismo objetivo solo añade reglas y un dato que no afecta en este diagrama | Sebastián |
| Secuencia | diagrama de secuencia DSS-01 | porque afecta al flujo del sistema en la creación de torres | David |
| Estado | diagramas de estado EST-01 y EST-02 | porque la nueva restricción exige un limite en las piezas que pueden ser admitidas en la torre afectando el flujo de la creación de torres y la asignación de piezas a estas | David |
| Trazabilidad | | |Marengo |

## Dudas y supuestos
(Opcional, pero les sirve para la reflexión del jueves.)
