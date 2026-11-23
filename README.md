# SnapSip

Aplicación web sencilla del proyecto **SnapSip** (CIN 324 — Ingeniería de Requisitos), generada historia por historia a partir de la documentación del repositorio.

## Estado actual
- **HU-01 — Autenticación de usuarios** implementada (cambio OpenSpec archivado: `hu-01-autenticacion-usuarios`).
- **HU-02 — Crear proyecto** implementada (cambio OpenSpec: `hu-02-crear-proyecto`).
- **HU-03 — Inyectar piezas desde plano/archivo** implementada (cambio OpenSpec: `hu-03-inyectar-piezas`). Ajuste de formato de códigos completado, pendiente de archivo: `ajuste-hu-03-codigos-pieza` (`.cin324/validaciones/VAL-HU-03-2.md`). El plano/archivo se **simula en la demo** con un botón (indicación del profesor de 2026-11-18, registrada como supuesto en `.cin324/proyecto.md`): no se carga ningún archivo real. **CA2** (formato inválido / filas incompletas) no se representa, igual que CA2 de HU-01; ver `.cin324/validaciones/VAL-HU-03-1.md`.
- **HU-06 — Consultar piezas pendientes** implementada (cambio OpenSpec: `hu-06-consultar-piezas-pendientes`; ajustes: `ajuste-hu-06-selectores-proyecto-partes` y `ajuste-hu-06-selector-partes-automatico`), solo para *Operario de Bodega*. Filtra por `Pieza.estado = "Pendiente"` sin crear tabla `Torre` ni columna `torre_id`. El selector de Proyecto identifica cada proyecto por cliente y código; al elegirlo, el selector de Parte se llena **automáticamente** con las partes de ese proyecto que tienen piezas cargadas, sin pulsar «Consultar». Los proyectos «Sin piezas cargadas» muestran un aviso.
- Acceso mediante **selector de rol de demostración** (*Operario de Bodega* / *Encargado de Despacho*), **sin autenticación real** ni credenciales (regla del taller). El **Servicio de autenticación** documentado (CU-01/DSS-03) se considera **simulado/omitido** en el flujo principal de esta demo (adaptador declarado en `src/integraciones/`).
- Base de datos: **SQLite** (`data/app.db` por defecto), migraciones SQL numeradas en `src/db/migrations/` (registro en `schema_migrations`).

## Requisitos
- Node.js 20+ (probado con versiones recientes)
- npm

## Instalación
```bash
npm install
```

## Preparar / cargar datos de ejemplo
Las migraciones se aplican automáticamente al iniciar la aplicación. Para cargar los datos de ejemplo (roles de demostración, HU-01) de forma explícita:
```bash
npm run db:seed
```

## Ejecutar la aplicación
```bash
npm run dev
```
Luego abre: **http://localhost:3000**

- Selecciona o cambia el **rol de demostración** en la pantalla principal.
- **HU-01 (CA3, ejemplo protegido):** `/operaciones/despacho/ejemplo` (solo *Encargado de Despacho*).
- **HU-02 (Crear proyecto, CU-02, solo *Encargado de Despacho*):** `/proyectos/nuevo` (formulario) y `/proyectos` (listado de proyectos registrados). El proyecto se registra con `cliente`, `codigo` y `metraje`, en estado **"Sin piezas cargadas"**, sin partes de la casa ni piezas.
- **HU-03 (Inyectar piezas, CU-03, solo *Encargado de Despacho*):** en `/proyectos`, un proyecto en **"Sin piezas cargadas"** muestra el botón **«Inyectar piezas desde plano/archivo»**. Al pulsarlo se generan al azar entre 1 y 5 partes y hasta 100 piezas (menos partes que piezas, al menos una pieza por parte), quedan en **"Pendiente"** y sin torre, y el proyecto pasa a **"En preparación"**. La pantalla muestra cuántas partes y piezas se crearon. Cada pieza recibe un código con una letra de la A a la Z y un número del 1 al 25 (p. ej. `A3`, `I5`), elegidos al azar; el código completo no se repite dentro del proyecto —también lo refuerza `UNIQUE (proyecto_id, codigo)` en la migración 003—, pero proyectos distintos pueden compartir códigos. La inyección **no** ocurre al crear el proyecto.
- **HU-06 (Consultar piezas pendientes, CU-06, solo *Operario de Bodega*):** `/pendientes`. Elija un **Proyecto** —mostrado como `cliente (codigo)`—. En cuanto lo selecciona, **el selector de Parte de la casa se llena solo**, con las partes de ese proyecto que tienen piezas cargadas (CA4/CA5): no hace falta pulsar «Consultar» ni tocar la URL. Cambiar de Proyecto descarta la Parte antes elegida. Después elija una **Parte de la casa** y pulse «Consultar». Cada proyecto se identifica por su cliente y su código (CA3); si el proyecto está en estado **"Sin piezas cargadas"**, el selector queda vacío y se informa que no tiene partes con piezas cargadas (CA6). La pantalla muestra solo los códigos de piezas en estado **"Pendiente"** (sin torre asignada) de esa parte; excluye otras partes y otros estados. Si la parte elegida no tiene pendientes, muestra **«0 pendientes para <parte>»**. Si falta proyecto o parte, pide la selección y **no** muestra ese mensaje. El enlace aparece en el inicio solo para el Operario; `/proyectos` sigue siendo solo del Encargado.

> **Integración simulada:** el plano/archivo se sustituye por `GeneradorPlanoSimulado` (`src/integraciones/`); no hay carga de archivo, lectura de plantilla ni validación de formato. Para probar distintos resultados, vuelve a crear otro proyecto: cada inyección usa números aleatorios.

## Correr las pruebas
```bash
npm test
```
Las pruebas usan una base SQLite temporal y cubren los escenarios definidos para:
- **HU-01:** acceso por rol, rechazo sin rol, rechazo por rol no autorizado sin modificar datos, y cambio de rol.
- **HU-02:** creación de proyecto con código único (CA1), rechazo por código duplicado conservando el existente (CA2) y condición de proyecto en "Sin piezas cargadas" sin partes/piezas (CA3; la interacción de rechazo al crear torre se implementará en HU-04).
- **HU-03:** inyección simulada y conteos (CA1), límites de la generación aleatoria, formato y unicidad de códigos, repetibilidad forzada entre proyectos con generador fijo y rechazo de duplicados dentro de un proyecto, rechazo por rol no autorizado (HU-01 CA3), ocultación del botón después de inyectar, y los dos escenarios de CA2 adaptados a la demo como **desviación documentada**.
- **HU-06:** identificación del proyecto por cliente y código (CA3), oferta de las partes del proyecto elegido con los cinco ejemplos del esquema (CA4), selector limitado a las partes que existen en ese proyecto (CA5), aviso de proyecto sin piezas (CA6), listado filtrado por parte y estado (CA1), mensaje «0 pendientes» para una parte elegida (CA2), petición de selección cuando falta proyecto o parte, llenado automático del selector de Parte al elegir Proyecto, descarte de la Parte anterior al cambiar de Proyecto y rechazo por rol no autorizado sin revelar piezas. 31 pruebas en total.

## Estructura relevante
- `src/app.ts` — crea la app Express (sin escuchar)
- `src/server.ts` — arranque del servidor
- `src/db/` — conexión, migraciones (`migrations/`) y seed
- `src/dominio/` — lógica de dominio (`proyectos.ts`, HU-02; `piezas.ts`, HU-03; `pendientes.ts`, HU-06, solo lectura)
- `src/integraciones/` — interfaces y adaptadores simulados (`ServicioAutenticacionSimulado`, `GeneradorPlanoSimulado`)
- `src/rutas/`, `src/vistas/`, `src/middleware/`, `src/acceso/` — rutas, vistas, autorización y acceso por rol (`pendientes.ts` y `pendientes.ejs` corresponden a HU-06)
- `tests/` — pruebas automatizadas por escenario (`HU-01 · ...`, `HU-02 · ...`, `HU-03 · ...`, `HU-06 · ...`)
- `openspec/` — cambios y especificaciones OpenSpec

## Notas de trazabilidad
- HU-01 / CU-01 / Actividad TO-BE: *Autenticación de usuarios* (DSS-03 como referencia, adaptado a selector de rol de demostración).
- HU-02 / CU-02 / Actividad TO-BE: *Crear proyecto* (RP-02). Sin diagrama de secuencia ni de estado propio de Proyecto; CA3 deja la condición para HU-04.
- HU-03 / CU-03 / Actividad TO-BE: *Inyectar piezas desde plano/archivo* (RP-03, EST-01 de Pieza). Sin DSS propio: flujo reconstruido desde el Gherkin. Migración 003 (`partes_casa`, `piezas`) para uso de HU-04; `piezas.proyecto_id` y `UNIQUE (proyecto_id, codigo)` refuerzan el código único por proyecto (`.cin324/validaciones/VAL-HU-03-2.md`); no se crea tabla de `Torre`.
- HU-06 / CU-06 / Actividad TO-BE: *Consultar piezas pendientes* (RP-06, EST-01 solo como origen del estado «Pendiente»). Sin DSS propio: flujo reconstruido desde el Gherkin y la ficha `.cin324/historias/HU-06.md`. No se crea `Torre` ni `torre_id`: «sin torre asignada» se expresa con `Pieza.estado = "Pendiente"`. Los datos con otros estados se preparan en BD desde las pruebas porque HU-05 aún no asigna piezas; el estado «Sin piezas cargadas» es un atributo de `Proyecto` del modelo de dominio, no un estado de EST-01.
- No se implementan requisitos no funcionales (RP-13, RP-14, RP-15a, RP-15b) ni autenticación real. CA2 de HU-01 no es aplicable literalmente en esta demo; ver `.cin324/historias/HU-01.md`, `.cin324/historias/HU-02.md` y los artefactos en `openspec/`.
