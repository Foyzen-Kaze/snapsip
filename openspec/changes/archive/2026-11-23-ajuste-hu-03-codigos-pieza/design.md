## Context

HU-03 quedó generada con el formato de código `<codigo del proyecto>-P001`, producido por `GeneradorPlanoSimulado.generar`. Al validar el sistema, el estudiante acordó cambiarlo (`.cin324/validaciones/VAL-HU-03-2.md`, ficha `.cin324/historias/HU-03.md:22,91,99` y supuesto `.cin324/proyecto.md:31`): cada `Pieza` debe llamarse con una letra A–Z y un número 1–25, al azar, sin repetir el código completo dentro del proyecto, permitiendo repeticiones entre proyectos. RP-03, HU-03 y el Gherkin no cambian. El stack y la integración simulada del plano/archivo (`GeneradorPlano` + `GeneradorPlanoSimulado`) se conservan.

Revisión adicional del estudiante: `src/db/migrations/003_partes_casa_piezas.sql:15` declara `UNIQUE (parte_casa_id, codigo)`, **no** `UNIQUE(codigo)` global; por eso un código repetido entre proyectos no falla hoy en la base de datos. Pero esa restricción sí permite repetir un mismo código en dos partes distintas **del mismo proyecto**, lo que incumple la regla acordada. Se refuerza a nivel de base de datos aprovechando que la migración 003 todavía no está archivada.

## Goals / Non-Goals

**Goals:**
- Generar códigos `A3`…`Z25` aleatorios y únicos por proyecto en el universo simulado de HU-03.
- Hacer cumplir esa unicidad también en SQLite mediante `UNIQUE (proyecto_id, codigo)` en la migración 003.
- Mantener los límites ya acordados (1–5 partes, hasta 100 piezas, menos partes que piezas, al menos una pieza por parte) y los estados «Pendiente» / «En preparación».
- Actualizar pruebas y README para que el formato nuevo quede verificable y documentado.

**Non-Goals:**
- Cambiar RP-03, el texto de HU-03, su Gherkin, los artefactos `02`–`12`, HU-02 ni HU-04…HU-11.
- Cambiar roles, botón, estados ni dependencias. La migración 003 se edita en sitio solo para añadir `proyecto_id` y la restricción por proyecto; no se crea la migración 004 ni cambia el modelo de dominio.
- Implementar CA2 (formato inválido / filas incompletas), que sigue como desviación documentada.

## Decisions

1. **Generar el código dentro del adaptador simulado**, no en la capa de dominio ni en la base de datos. La interfaz `GeneradorPlano` ya entrega `PiezaSimulada.codigo`, y el dominio inserta ese valor tal cual (`inyectarPiezasDesdePlano`); el formato es un dato del plano/archivo simulado. Alternativa descartada: derivar el código del `id` autoasignado en `piezas`, que rompería la trazabilidad con el generador y obligaría a reescribir el dominio y las pruebas de HU-03.
2. **Muestreo aleatorio sin reposición sobre 650 combinaciones** (26 letras × 25 números). Con el `rng` ya inyectable: para la pieza *i* se propone `indice = (Math.floor(rng() * 650) + i) % 650`; si el índice ya fue usado se avanza de uno en uno (módulo 650) hasta uno libre; luego `letra = String.fromCharCode(65 + Math.floor(indice / 25))` y `numero = (indice % 25) + 1`. Como hay como máximo 100 piezas y 650 combinaciones, siempre existe código libre. El término `+ i` evita un bucle infinito cuando las pruebas inyectan un `rng` constante. Alternativa descartada: reintentar con `rng()` hasta obtener un código nuevo (con un `rng` constante se repite el mismo valor para siempre).
3. **Unicidad por proyecto reforzada en la base de datos**, además de por construcción. La migración 003 (aún no archivada, se edita en sitio: no hay migración 004) añade `proyecto_id INTEGER NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE` a `piezas` y sustituye `UNIQUE (parte_casa_id, codigo)` por `UNIQUE (proyecto_id, codigo)`. `proyecto_id` materializa la relación ya existente `ParteCasa.proyecto_id` (`Proyecto` 1 – 0..* `ParteCasa`; `ParteCasa` 1 – 1..* `Pieza`), por lo que el modelo de dominio no cambia. `src/dominio/piezas.ts:112` pasa a insertar `proyecto_id` junto a `parte_casa_id` y `codigo`. Alternativas descartadas: `UNIQUE(codigo)` global, que prohibiría la repetición entre proyectos que el estudiante sí quiere; y mantener solo `UNIQUE (parte_casa_id, codigo)`, que permite duplicados entre partes del mismo proyecto. La prueba de repetibilidad entre proyectos inyecta un generador de prueba fijo que devuelve siempre el mismo `codigo`, sin depender del azar.
4. **Sin cambios en la transacción ni en los estados.** `inyectarPiezasDesdePlano` sigue insertando partes y piezas en una sola transición y llevando el proyecto a «En preparación»; el ajuste solo sustituye el valor de `codigo` que entrega el generador y añade la columna `proyecto_id` al insert.

## Risks / Trade-offs

- [Duplicados dentro de un mismo proyecto] → Mitigación: `UNIQUE (proyecto_id, codigo)` en la 003 + generación sin reposición + prueba de unicidad por proyecto.
- [La restricción global `UNIQUE(codigo)` rompería la repetibilidad entre proyectos] → Mitigación: se usa `UNIQUE (proyecto_id, codigo)` y se prueba con un generador fijo que fuerza el mismo `codigo` en dos proyectos.
- [Los códigos pierden el prefijo legible del proyecto] → Mitigación: es la decisión acordada; se explica en el README que la repetibilidad entre proyectos es intencionada.
- [Agotamiento del espacio de códigos] → Mitigación: 650 combinaciones disponibles frente a un máximo de 100 piezas por inyección.

## Migration Plan

Se edita en sitio la migración 003 (no archivada) para añadir `proyecto_id` y sustituir la restricción por `UNIQUE (proyecto_id, codigo)`; **no se crea la migración 004**. No hay datos definidos que convertir: las bases de prueba se reconstruyen y los datos de ejemplo se regeneran con `npm run db:seed`. Rollback: restaurar la 003 anterior y volver al cambio `hu-03-inyectar-piezas` y a su formato anterior si el estudiante lo solicita.

## Open Questions

Ninguna. La interpretación de «sin repetirse dentro del proyecto» (código completo, no letra ni número por separado) fue confirmada expresamente por el estudiante en `.cin324/validaciones/VAL-HU-03-2.md`.
