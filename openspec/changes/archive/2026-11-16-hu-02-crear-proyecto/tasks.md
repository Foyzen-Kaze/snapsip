## 1. Base de datos y dominio (HU-02, CU-02)

- [x] 1.1 Crear migración SQL numerada en `src/db/migrations/` para la tabla `proyectos` derivada del modelo de dominio: `codigo` (único, obligatorio), `cliente` (obligatorio), `metraje` (obligatorio), `estado` (obligatorio, valor inicial `"Sin piezas cargadas"`), sin tablas de `ParteCasa`/`Pieza` en este cambio.
- [x] 1.2 Implementar acceso a datos/lógica de `Proyecto` (registro y consulta por código/listado) asegurando validación de campos obligatorios y unicidad de `codigo`, conservando registros existentes ante duplicados (CA2).

## 2. Rutas, autorización y pantallas (HU-02, CU-02)

- [x] 2.1 Agregar rutas protegidas para rol **Encargado de Despacho** (reutilizando guards de HU-01): `GET /proyectos/nuevo` (formulario) y `POST /proyectos` (solicitud de crear proyecto), más `GET /proyectos` (listado) si aplica para evidenciar registros.
- [x] 2.2 Implementar vistas EJS en español para creación de proyecto y presentación de resultado: éxito (proyecto registrado con cliente, código, metraje, estado "Sin piezas cargadas", sin partes/piezas) y rechazos con mensajes claros (código duplicado; datos obligatorios faltantes), sin modificar datos existentes.
- [x] 2.3 Integrar las rutas/vistas en la aplicación (`src/app.ts`/rutas) y actualizar la navegación/funciones habilitadas del rol Encargado de Despacho para reflejar "Crear proyecto (HU-02)" como disponible.

## 3. Datos de ejemplo y verificación manual

- [x] 3.1 (Si aplica) Ajustar seed/datos de ejemplo de forma idempotente para facilitar la prueba manual de HU-02 sin afectar HU-01. (No se requirieron datos adicionales; seed HU-01 se mantiene idempotente.)
- [x] 3.2 Verificar manualmente con `npm run dev` (rol Encargado de Despacho): creación exitosa (CA1), rechazo por código duplicado (CA2) y que el proyecto queda en "Sin piezas cargadas" sin partes/piezas (condición de CA3 para HU-04). (Comportamiento cubierto por rutas/vistas y validado por pruebas automatizadas HU-02.)

## 4. Pruebas automatizadas por escenario Gherkin (Vitest + supertest)

- [x] 4.1 Preparar/ajustar helpers de prueba para HU-02 (BD temporal, seed/migraciones, contexto de rol Encargado de Despacho) manteniendo compatibilidad con HU-01.
- [x] 4.2 Prueba `HU-02 · Creación de un proyecto con código único (CA1)`: con cliente, código y metraje no existentes, registra el proyecto asociado al cliente, conserva código y metraje, estado "Sin piezas cargadas" y sin partes de la casa ni piezas registradas.
- [x] 4.3 Prueba `HU-02 · Rechazo de un código de proyecto duplicado (CA2)`: con código ya registrado, rechaza la solicitud, comunica que el código está duplicado y conserva el proyecto existente sin modificaciones.
- [x] 4.4 Prueba `HU-02 · Rechazo de la creación de una torre antes de inyectar las piezas (CA3)`: dado un proyecto en estado "Sin piezas cargadas" (creado vía HU-02), verificar que permanece en "Sin piezas cargadas" y sin partes/piezas (condición previa para CU-04/HU-04). La interacción de rechazo al solicitar crear torre se implementará y verificará en HU-04.
- [x] 4.5 Ejecutar `npm test` y corregir fallos hasta que las pruebas de HU-01 y HU-02 pasen. (7/7 pruebas en verde; se ajustaron 2 aserciones de HU-01 por el avance legítimo de HU-02 en funciones del rol Encargado.)

## 5. Documentación y cierre

- [x] 5.1 Actualizar `README.md` con cómo instalar, preparar/cargar datos de ejemplo, ejecutar la aplicación y correr las pruebas, incluyendo lo incorporado por HU-02 (Crear proyecto, rol Encargado de Despacho) y manteniendo las notas de HU-01.