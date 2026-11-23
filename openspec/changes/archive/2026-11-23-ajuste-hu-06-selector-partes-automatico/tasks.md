## 1. Vista: llenado automático del selector de Parte

- [x] 1.1 Añadir al final de `src/vistas/pendientes.ejs` un `<script>` que registre un manejador `change` en `#proyectoId`; al dispararse, asigna `''` a `#parteCasaId` y llama a `form.submit()` sobre el formulario del selector. Sin endpoints nuevos ni dependencias (CA4, CA5).
- [x] 1.2 Verificar que `#proyectoId` y `#parteCasaId` conservan sus `id`, que el selector de Parte mantiene `required` y que ambos siguen pintándose desde `proyectos` y `partes`. Sin cambios funcionales en `src/rutas/pendientes.ts` ni en `src/dominio/pendientes.ts`.

## 2. Pruebas (una por escenario Gherkin del nuevo requisito)

- [x] 2.1 Reutilizar los datos de prueba del cambio anterior: proyecto con piezas en varias `ParteCasa` y proyecto en estado «Sin piezas cargadas»; no crear `ParteCasa` sin `Pieza` (`08-modelo-dominio.md:22`).
- [x] 2.2 Prueba «El selector de Parte se llena al elegir el Proyecto»: comprobar que el HTML de `/pendientes` incluye el manejador `change` sobre `#proyectoId` y que la petición `?proyectoId=<id>` —equivalente a la que dispara el manejador— devuelve en el selector solo las `ParteCasa` con piezas de ese proyecto (CA4, CA5).
- [x] 2.3 Prueba «Cambiar de Proyecto descarta la Parte anterior»: comprobar que el manejador limpia `#parteCasaId` antes de enviar y que `?proyectoId=<otro>&parteCasaId=<viejo>` no deja seleccionada una Parte ajena al proyecto (CA5).
- [x] 2.4 Prueba «Proyecto sin piezas cargadas tras elegirlo»: comprobar que `?proyectoId=<sin-piezas>` muestra «El proyecto no tiene partes de la casa con piezas cargadas.», el selector de Parte queda sin opciones y no aparecen los mensajes de selección incompleta ni de «0 pendientes» (CA6).
- [x] 2.5 Ejecutar `npm test` y verificar que pasan las pruebas nuevas y las 28 existentes (CA1, CA2, CA3-CA6, selección incompleta y rechazo por rol). Resultado: 4 archivos, 31 pruebas, todas pasan.

## 3. Cierre

- [x] 3.1 Revisar que no se crearon migraciones SQL, endpoints ni cambios fuera de HU-06; `git status` solo con la vista, las pruebas y los artefactos del cambio.
- [x] 3.2 Actualizar el README con el recorrido de `/pendientes`: al elegir un Proyecto el selector de Parte se llena solo, sin pulsar «Consultar».
