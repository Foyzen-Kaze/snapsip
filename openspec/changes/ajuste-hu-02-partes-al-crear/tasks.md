## 1. Artefactos del curso y estado

- [x] 1.1 Actualizar `03-requisitos.md` (RP-02 y RP-03) con las cantidades al crear y la inyección desde las partes guardadas.
- [x] 1.2 Actualizar `04-historias-usuario.md` (HU-02 CA1/CA3 y nuevo CA4; HU-03 CA1) y `.cin324/historias/HU-02.md` / `HU-03.md` con la decisión aprobada.
- [x] 1.3 Actualizar `07-criterios-aceptacion.md` (escenarios de HU-02 y HU-03) con los cinco campos, el total 1–100, las cantidades exactas y el rechazo de reintentos.
- [x] 1.4 Actualizar `08-modelo-dominio.md` y `diagramas/modelo-de-dominio.puml` con `ParteCasa.cantidadPrevista` y la multiplicidad `Proyecto 1 – 1..* ParteCasa` al crear.
- [x] 1.5 Actualizar `09-casos-de-uso.md`, `10-diagramas-secuencia.md`, `11-diagramas-estado.md`, `12-trazabilidad.md` y sus fuentes `.puml` afectadas.
- [x] 1.6 Registrar la decisión y el cambio en `.cin324/proyecto.md`.

## 2. Datos

- [x] 2.1 Crear `src/db/migrations/006_cantidad_prevista_partes.sql`: columna aditiva `cantidad_prevista` y backfill desde el número de piezas existentes, sin borrar ni reiniciar la base.
- [x] 2.2 Verificar que la migración 006 se registra en `schema_migrations` y que las migraciones 001–005 no se modifican.

## 3. Lógica de creación (HU-02)

- [x] 3.1 Ampliar `crearProyecto` para validar cinco cantidades enteras no negativas con total 1–100 y devolver `PARTES_INVALIDAS` con el mensaje acordado.
- [x] 3.2 Crear proyecto y `ParteCasa` con `cantidad_prevista` en una sola transacción, conservando el rechazo por código duplicado y el estado «Sin piezas cargadas» sin piezas.
- [x] 3.3 Actualizar `src/rutas/proyectos.ts` para leer los cinco campos y mostrar el error de validación.

## 4. Lógica de inyección (HU-03)

- [x] 4.1 Cambiar `GeneradorPlano.generar` para recibir las partes guardadas con su cantidad y devolver códigos aleatorios únicos por parte.
- [x] 4.2 Adaptar `GeneradorPlanoSimulado` para generar solo códigos (A1…Z25, sin reposición, `rng` inyectable) a partir de las cantidades recibidas.
- [x] 4.3 Reescribir `inyectarPiezasDesdePlano` para usar las partes existentes, insertar las piezas exactas en una transacción, actualizar el estado a «En preparación» y rechazar reintentos sin modificar datos.

## 5. Pantallas

- [x] 5.1 Actualizar `proyecto-nuevo.ejs` con los cinco campos de cantidad y `proyecto-creado.ejs` con el listado de partes creadas y cero piezas.
- [x] 5.2 Ajustar `proyectos.ejs` para ofrecer un único botón de inyección cuando haya estado «Sin piezas cargadas» y cero piezas, y ocultarlo después de inyectar.
- [x] 5.3 Ajustar `inyeccion-resultado.ejs` para mostrar las cantidades exactas por parte.

## 6. Pruebas

- [x] 6.1 Actualizar `tests/hu-02.crear-proyecto.test.ts`: creación con cantidades, rechazo por total/cantidad inválida, duplicado, y proyecto con partes pero sin piezas.
- [x] 6.2 Actualizar `tests/hu-03.inyectar-piezas.test.ts`: cantidades exactas, códigos únicos, un solo botón, ocultamiento tras inyectar, rechazo de reintento y rechazo por rol sin crear piezas.
- [x] 6.3 Ejecutar `npm test` y corregir hasta que la suite pase, usando solo bases temporales.

## 7. Cierre

- [x] 7.1 Actualizar el `README.md` con el nuevo formulario, el botón único, el rechazo de reintentos y cómo ejecutar las pruebas.
- [x] 7.2 Verificar `git status --short --branch` y `git diff` finales; dejar los cambios sin commit ni push.
