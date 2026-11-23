## MODIFIED Requirements

### Requirement: Generación aleatoria acotada del universo simulado
El sistema SHALL generar entre 1 y 5 `ParteCasa` y hasta 100 `Pieza` por inyección, con un número de `ParteCasa` estrictamente menor que el de `Pieza` y al menos una `Pieza` en cada `ParteCasa`. El sistema SHALL elegir el `nombre` de cada `ParteCasa` sin repetir de la lista Techo, Muros exteriores, Muros interiores, Piso y Entrepiso, y SHALL asignar a cada `Pieza` un `codigo` compuesto por una letra de la A a la Z y un número del 1 al 25 (p. ej. `A3`, `I5`), elegidos al azar. El sistema SHALL garantizar que el `codigo` completo no se repita dentro del `Proyecto`; la letra y el número por separado SHALL poder repetirse siempre que el par sea distinto, y SHALL permitir que un mismo `codigo` aparezca en proyectos distintos. El atributo derivado `/completa` de `ParteCasa` SHALL NOT persistirse, y esta historia SHALL NOT crear la tabla `Torre`.

#### Scenario: Universo simulado generado dentro de los límites acordados
- **DADO** que un proyecto se encuentra en estado "Sin piezas cargadas"
- **CUANDO** el encargado de despacho solicita la inyección simulada
- **ENTONCES** se crean entre 1 y 5 partes de la casa y hasta 100 piezas
- **Y** el número de partes es menor que el número de piezas
- **Y** cada parte tiene al menos una pieza
- **Y** los nombres de las partes son distintos y pertenecen a la lista acordada
- **Y** cada pieza tiene un código con formato letra A–Z y número 1–25 (p. ej. `A3`, `I5`)
- **Y** no se repite el código completo dentro del proyecto

#### Scenario: Códigos repetibles en proyectos distintos
- **DADO** que dos proyectos distintos se encuentran en estado "Sin piezas cargadas"
- **CUANDO** el encargado de despacho inyecta piezas en ambos proyectos
- **ENTONCES** los códigos pueden repetirse entre ambos proyectos
- **Y** dentro de cada proyecto el código completo sigue siendo único
