# Inconsistencias del cambio «Supervisor de Proyectos»

Este documento recoge las inconsistencias detectadas al revisar el repositorio después de incorporar el nuevo requisito: *«Debe poder crearse un proyecto que quede pendiente de aprobación por parte de un nuevo tipo de usuario, el Supervisor de proyectos, quien puede aprobarlo o rechazarlo»*.

**Nombre canónico acordado el 2026-11-26:** «Supervisor de Proyectos» (plural, con mayúscula inicial en «Proyectos»). Se usa en todos los artefactos y diagramas a partir de ahora.

**Corte de revisión:** 2026-11-26 ~17:40 (rama `prueba`). Durante la revisión los compañeros hicieron commits (`7ad6bbb`, `d43f72b`), por lo que los números de línea pueden haber cambiado ligeramente. Volver a verificar antes de aplicar cualquier corrección.

**Responsable de la revisión:** encargado de diagramas de secuencia y estado.

---

## 1. Lo que ya está correcto en los diagramas de secuencia y estado

| Artefacto | Estado | Evidencia |
|---|---|---|
| DSS-03 — Autenticarse | Correcto | `diagramas/dss-03.puml:17` incluye al Supervisor como actor; `10-diagramas-secuencia.md:79` lo describe. No se agrega un DSS para la aprobación porque es una operación interna sin sistema externo (`evaluacion2.md:19`). |
| EST-03 — GuiaDespacho | Correcto en su intención | `diagramas/est-03.puml:13` y `11-diagramas-estado.md:91,99,107` exigen «Proyecto Aprobado» para emitir la guía. |

---

## 2. Inconsistencias en los artefactos propios (diagramas)

### I-1. Falta el diagrama de estado de `Proyecto` (EST-04)

- **Ubicación:** `11-diagramas-estado.md:3` solo modela Pieza, Torre y GuiaDespacho. `12-trazabilidad.md:159` afirma explícitamente que RP-02 no tiene diagrama de estado propio.
- **Conflicto:** HU-02 CA1 (`04-historias-usuario.md:19`), HU-03 CA1-CA4 (`:31-34`) y HU-12 CA1-CA4 (`:138-141`) ya manejan los estados «Pendiente de aprobación», «Aprobado», «Rechazado» y «En preparación», con los eventos `aprobar proyecto` y `rechazar proyecto`. Esos cambios de estado no tienen representación gráfica.
- **Propuesta:** crear `diagramas/est-04.puml`, su PNG y la sección EST-04 en `11-diagramas-estado.md`, una vez resuelta la decisión de la sección 4.
- **Resuelta (2026-11-26):** se creó `diagramas/est-04.puml` y su PNG, y se agregó la sección EST-04 a `11-diagramas-estado.md` con el ciclo decidido en la sección 4. No aparece «Sin piezas cargadas».

### I-2. La guarda de EST-03 depende de un estado no definido en el modelo de dominio

- **Ubicación:** `11-diagramas-estado.md:99` y `diagramas/est-03.puml:13` exigen `Proyecto Aprobado`.
- **Conflicto:** `08-modelo-dominio.md:11` enumera `Sin piezas cargadas, En preparación, Proyecto completo, esperandoAprobacion`; no incluye «Aprobado» ni «Rechazado».
- **Propuesta:** alinear el modelo de dominio (I-5) y mantener la guarda de EST-03 tal cual.
- **Estado (2026-11-26):** la guarda se conserva porque el ciclo nuevo incluye «Aprobado» como estado. Sigue pendiente que Sebastian actualice `08-modelo-dominio.md` y su `.puml`: los diagramas ya usan el ciclo nuevo, pero el modelo de dominio todavía no lo reconoce.

### I-3. Nombre del rol inconsistente dentro de los propios diagramas

- **Ubicación original:** `diagramas/dss-03.puml:17` decía «Supervisor de proyecto» (singular); `10-diagramas-secuencia.md:79` decía «Supervisor de proyectos»; `09-casos-de-uso.md:30` decía «Supervisor de Proyectos»; `04-historias-usuario.md:135` decía «Supervisor de Proyecto».
- **Decisión:** nombre canónico «Supervisor de Proyectos», aplicado a todos los artefactos.
- **Resuelta (2026-11-26):** se unificó el nombre en `04-historias-usuario.md` (HU-01 y HU-12), `07-criterios-aceptacion.md` (HU-01 y HU-12), `09-casos-de-uso.md` (CU-12), `10-diagramas-secuencia.md:79`, `11-diagramas-estado.md:91,107` y `diagramas/dss-03.puml:17`. Se regeneró `diagramas/dss-03.png` desde el `.puml`. `diagramas/casos-de-uso.puml:10` ya usaba el nombre canónico. `evaluacion2.md` se conserva sin cambios por ser el registro de la consigna original.

---

## 3. Inconsistencias en artefactos de otros compañeros que impactan los diagramas

### I-4. Casos de uso desactualizados (Sebastian)

- `09-casos-de-uso.md:19`: CU-01 «Autenticarse» solo lista a Operario de Bodega y Encargado de Despacho, aunque HU-01 (`04-historias-usuario.md:6`) y DSS-03 incluyen al Supervisor.
- `09-casos-de-uso.md:30`: CU-12 se llama «Crear o Rechazar Proyecto», pero HU-12 ya se renombró a «Aprobar o rechazar proyecto» (`04-historias-usuario.md:134`). El nombre del caso de uso debe seguir al de la historia.
- El nombre del actor ya quedó alineado a «Supervisor de Proyectos» en `09-casos-de-uso.md:30` y `diagramas/casos-de-uso.puml:10`; siguen pendientes los dos puntos anteriores (CU-01 y el nombre de CU-12).

### I-5. Modelo de dominio mal estructurado (Sebastian)

- `08-modelo-dominio.md:11`: la lista de estados mezcla `esperandoAprobacion` (camelCase, sin espacio) con nombres en español y no incluye «Aprobado» ni «Rechazado».
- `diagramas/modelo-de-dominio.puml:24-30`: `esperandoAprobacion` aparece como **atributo aparte** de `estado`, cuando en realidad es un valor de `estado`.
- **Propuesta (decisión adoptada):** dejar un solo atributo `estado` con los valores **Pendiente de aprobación, Aprobado, Rechazado, En preparación y Proyecto completo**. «Sin piezas cargadas» se elimina; `esperandoAprobacion` deja de ser un atributo separado y pasa a ser el valor «Pendiente de aprobación».

### I-6. Requisitos funcionales sin actualizar (Diego)

- `03-requisitos.md:10` (RP-02): sigue indicando «dejar el proyecto en estado *Sin piezas cargadas*», mientras HU-02 CA1 (`04:19`) ya dice «Pendiente de aprobación».
- `03-requisitos.md:11` (RP-03): no exige que el proyecto esté «Aprobado» para inyectar piezas, como sí lo exigen HU-03 CA1 y CA4.
- No existe un requisito funcional nuevo para aprobar/rechazar el proyecto (sería RP-17) asociado a HU-12/CU-12.
- RP-16 (`03-requisitos.md:21`) no nombra al Supervisor entre los roles cuya autorización se controla.

### I-7. Trazabilidad, TO-BE y especificaciones (equipo)

- `12-trazabilidad.md`: no registra HU-12 ni CU-12; en `:117` mantiene el estado inicial «Sin piezas cargadas»; en `:159` afirma que Proyecto no tiene diagrama de estado.
- `02-rediseno-to-be.md:41`: la actividad «Crear proyecto» no incorpora la aprobación/rechazo del Supervisor. HU-12 (`04:136`) sigue asociada a la actividad «Crear proyecto».
- Fichas `.cin324/historias/HU-02.md` y `HU-03.md`, specs de `openspec/specs/crear-proyecto/spec.md` e `inyectar-piezas/spec.md`, y `README.md:40-41`: conservan el ciclo antiguo «Sin piezas cargadas → En preparación». Hay que decidir si se actualizan solo los artefactos de requisitos o también el código/specs ya implementados.
- **Decisión (2026-11-26):** se elimina el ciclo antiguo y se conserva el nuevo. Por el alcance acordado con el encargado de diagramas, en este cambio **solo se aplicó a los diagramas**; los artefactos anteriores siguen pendientes de sus responsables.

---

## 4. Decisión adoptada sobre el ciclo de `Proyecto` (2026-11-26)

El grupo decidió **eliminar el ciclo antiguo y quedarse con el ciclo nuevo**:

```text
Pendiente de aprobación ──aprobar proyecto──▶ Aprobado ──inyectar piezas──▶ En preparación ──▶ Proyecto completo
Pendiente de aprobación ──rechazar proyecto─▶ Rechazado   (terminal)
```

Decisiones derivadas:

- «Sin piezas cargadas» **deja de ser un estado**. El proyecto nace «Pendiente de aprobación» (HU-02 CA1) y solo puede inyectar piezas cuando está «Aprobado» (HU-03 CA1 y CA4). Tener cero piezas pasa a ser una condición, no un estado.
- «Rechazado» es **terminal**: HU-12 CA3 solo permite aprobar/rechazar desde «Pendiente de aprobación».
- EST-03 **conserva** la exigencia de aprobación para emitir la guía, pero reformulada como «el proyecto **ha sido** aprobado por el Supervisor de Proyectos», no como «el estado actual es Aprobado» (ver I-11). DSS-02 incorporó el escenario de rechazo acorde.
- «Proyecto completo» no es terminal: si una pieza vuelve a Pendiente, el proyecto deja de considerarse completo (HU-08 CA6).

**Alcance aplicado en este cambio:** solo los artefactos propios del encargado de diagramas (`10-diagramas-secuencia.md`, `11-diagramas-estado.md` y sus `.puml`/PNG). Quedan pendientes de Diego y Sebastian el modelo de dominio, los requisitos, la trazabilidad, el TO-BE, las fichas, los specs de OpenSpec, el README y, si se decide, el código y los tests.

---

## 5. Inconsistencias adicionales en los diagramas de secuencia

Además de I-3 (nombre del rol en DSS-03) e I-4 (CU-01 no incluye al Supervisor), la revisión específica de los DSS arrojó lo siguiente.

### I-8. DSS-02 no refleja la guarda «Proyecto Aprobado» que EST-03 sí exige

- **Ubicación:** `diagramas/dss-02.puml:22-25` y `10-diagramas-secuencia.md:57-59`. El `alt` de generación de la guía solo tiene dos escenarios: «alcance incompleto o con torres Abiertas» y «alcance completo y torres Cerradas».
- **Conflicto:** `11-diagramas-estado.md:99` y `diagramas/est-03.puml:13` exigen además «Proyecto Aprobado», pero HU-08 CA1 y CA3 (`04-historias-usuario.md:91,93`) y RP-09 (`03-requisitos.md:17`) no mencionan esa condición. EST-03 quedó más restrictiva que la historia, el requisito y el DSS.
- **Propuesta:** decidir entre:
  - (a) agregar un tercer escenario de rechazo en DSS-02 («proyecto Pendiente de aprobación o Rechazado»), su CA en HU-08 y el texto en RP-09; o
  - (b) quitar la guarda «Proyecto Aprobado» de EST-03, con lo que se pierde el efecto del cambio solicitado en los diagramas.
- **Resuelta en los diagramas (2026-11-26):** al adoptarse el ciclo nuevo se mantuvo la exigencia de aprobación de EST-03 y se agregó el escenario (a) a `diagramas/dss-02.puml` y a `10-diagramas-secuencia.md`; se regeneró `diagramas/dss-02.png`. La redacción definitiva de la guarda se ajustó en I-11. **Sigue pendiente de Diego** agregar el criterio en HU-08 CA1/CA3 y el texto en RP-09 para que la historia y el requisito no queden menos restrictivos que el diagrama.

### I-9. DSS-03 enuncia control de acceso por rol que el diagrama no representa

- **Ubicación:** `10-diagramas-secuencia.md:79` afirma «SnapSip conserva el control de acceso según el rol del usuario (RP-16)», pero el `alt` de `diagramas/dss-03.puml:23-29` solo cubre credenciales válidas e inválidas.
- **Conflicto:** HU-01 CA3 (`04-historias-usuario.md:11`) y HU-12 CA4 (`04-historias-usuario.md:141`) exigen rechazar la operación cuando el rol no está autorizado. Con el Supervisor aparece un tercer rol con permisos propios (aprobar/rechazar), por lo que la omisión es más visible.
- **Propuesta:** agregar un tercer escenario al `alt` de verificación, o matizar el texto de `10-diagramas-secuencia.md:79` para que no prometa algo que el diagrama no muestra. Nota: `evaluacion2.md:19` pide solo incorporar al Supervisor como actor autenticable, no un DSS de aprobación; esto es una decisión de alcance a confirmar.
- **Resuelta (2026-11-26):** se matizó el texto de `10-diagramas-secuencia.md:79` y se agregó una nota en «Variantes representadas»: el `alt` solo verifica credenciales y el rechazo por rol (HU-01 CA3, HU-12 CA4) ocurre al solicitar una operación protegida, no durante la autenticación, por lo que no se modela como rama alternativa. Se respeta así el alcance de `evaluacion2.md:19` y no se introducen escenarios falsos en el diagrama.

### I-10. La tabla de correspondencia quedará desactualizada al crear EST-04

- **Ubicación:** `10-diagramas-secuencia.md:104-113` lista los eventos de estado que no tienen DSS propio.
- **Situación:** hoy no es una contradicción porque no existe EST-04, pero al crearlo habrá que agregar `aprobar proyecto` y `rechazar proyecto` (CU-12/HU-12). Además, `inyectar piezas desde plano/archivo` (`:108`) deberá apuntar también a EST-04, porque HU-03 CA1 (`04:31`) cambia el estado del Proyecto a «En preparación».
- **Propuesta:** actualizar la tabla en el mismo cambio en que se agregue EST-04.
- **Resuelta (2026-11-26):** al crear EST-04 se agregaron las filas de `crear proyecto` (CU-02), `aprobar proyecto` y `rechazar proyecto` (CU-12 / HU-12), y `inyectar piezas desde plano/archivo` ahora apunta también a EST-04 (Proyecto).

### I-11. La guarda «Proyecto Aprobado» bloqueaba la guía justo después de inyectar las piezas

- **Ubicación:** `diagramas/est-03.puml:13`, `11-diagramas-estado.md:99` y `diagramas/dss-02.puml:22-25` (redacción anterior).
- **Conflicto:** EST-04 lleva el proyecto de «Aprobado» a «En preparación» en cuanto se inyectan las piezas (HU-03 CA1). Si EST-03 y DSS-02 exigen que el **estado actual** sea «Aprobado», no se podría generar ninguna guía: en el momento en que hay piezas Listo y torres Cerradas el proyecto ya está «En preparación» o «Proyecto completo».
- **Resuelta (2026-11-26):** la guarda se reformuló como una condición acumulada: **«proyecto aprobado por el Supervisor de Proyectos»**, que sigue cumpliéndose en «En preparación» y «Proyecto completo». Se actualizaron `est-03.puml`, `dss-02.puml`, sus PNG y el texto de `10-diagramas-secuencia.md` y `11-diagramas-estado.md`, donde se explicita que no se exige que el estado actual sea «Aprobado».
- **Pendiente de Diego:** HU-08 CA1/CA3 y RP-09 deben incorporar la condición con esta misma redacción, no como «estado Aprobado».
