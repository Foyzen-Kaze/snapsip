## 1. Datos y capa de dominio

- [x] 1.1 Crear `src/db/migrations/004_torres.sql` con la tabla `torres` (id, proyecto_id, parte_casa_id, codigo, numero, estado por defecto «Abierta», fecha_hora_eliminacion, eliminada_por), `NOT NULL` donde corresponda, FKs en cascada desde `proyectos` y `partes_casa`, y `UNIQUE (proyecto_id, numero)` y `UNIQUE (proyecto_id, codigo)`. Sin tocar 001-003 ni agregar `torre_id` a `piezas`.
- [x] 1.2 Crear `src/dominio/torres.ts` con `listarProyectosParaTorre()` (solo «En preparación» o «Proyecto completo») y `listarPartesDelProyecto(proyectoId)` para poblar el formulario (CA1).
- [x] 1.3 Implementar `crearTorre(proyectoId, parteCasaId)` en `src/dominio/torres.ts`: validar la guarda de EST-02 y que la parte pertenezca al proyecto; calcular `numero = COALESCE(MAX(numero),0)+1` en transacción; generar `codigo = TOR-<codigoProyecto>-<numero>`; insertar con `estado = 'Abierta'` y cero piezas. Devolver la torre creada o un error con los mensajes del spec (CA1, CA2, RP-04).

## 2. Rutas, vistas y navegación

- [x] 2.1 Crear `src/rutas/torres.ts` con `GET /torres/nuevo` y `POST /torres`, ambos protegidos por `requiereRol(["Operario de Bodega"])`. El GET repuebla las partes desde `?proyectoId=`; el POST valida en dominio y vuelve a renderizar el formulario con `400` y el mensaje de error si falla.
- [x] 2.2 Crear `src/vistas/torre-nuevo.ejs` con los selectores de Proyecto (`cliente (codigo)`) y Parte, el manejador `change` que limpia la Parte y reenvía el GET al cambiar de Proyecto (patrón de HU-06), y el bloque de error.
- [x] 2.3 Crear `src/vistas/torre-creada.ejs` con la confirmación: proyecto, parte, número, código generado, estado «Abierta» y «sin piezas asignadas».
- [x] 2.4 Registrar `routerTorres` en `src/app.ts` y añadir el enlace «HU-04: Crear torre» en `src/vistas/inicio.ejs` solo para el Operario de Bodega.

## 3. Pruebas (una por escenario Gherkin cubierto)

- [x] 3.1 Preparar datos de ejemplo en las pruebas: proyecto «En preparación», proyecto «Sin piezas cargadas», partes con piezas, y un proyecto ajeno con su propia parte. Sin `ParteCasa` sin `Pieza` (`08-modelo-dominio.md:22`).
- [x] 3.2 Prueba «HU-04 · Creación de una torre para una parte de la casa» (CA1): verificar persistencia con proyecto/parte correctos, `numero = 1`, `estado = 'Abierta'`, cero piezas y código `TOR-<codigoProyecto>-1` visible.
- [x] 3.3 Prueba «HU-02 · Rechazo de la creación de una torre antes de inyectar las piezas» (guarda de EST-02, HU-02 CA3): verificar el mensaje «primero deben inyectarse las piezas del proyecto desde el archivo» y que no se crea la torre.
- [x] 3.4 Prueba «HU-04 · Creación de una segunda torre para la misma parte» (CA2): verificar `numero = 2`, que la torre anterior conserva su estado y que las piezas siguen sin asignar.
- [x] 3.5 Prueba «HU-04 · Numeración independiente entre proyectos»: cada proyecto arranca en `numero = 1` aunque tengan torres la misma parte.
- [x] 3.6 Prueba «HU-04 · Rechazo de una parte de la casa ajena al proyecto» (derivado de RP-04): verificar el mensaje y que no se crea la torre.
- [x] 3.7 Prueba «HU-04 · Rechazo por rol no autorizado» (HU-01 CA3): el Encargado recibe 403, no se crea la torre y no se revelan datos.
- [x] 3.8 Ejecutar `npm test` y verificar que pasan las pruebas nuevas y las 31 existentes (HU-01, HU-02, HU-03, HU-06). Sin CA3/CA4 de HU-04 (diferidos a HU-05). Resultado: 5 archivos, 37 pruebas en verde. Se ajustó un assertion obsoleto de HU-03: la tabla `torres` ya existe por la migración 004, así que ahora se comprueba que HU-03 no inserte filas en ella.

## 4. Cierre

- [x] 4.1 Revisar que no se modificaron los artefactos del curso ni migraciones anteriores; `git status` solo con la ficha HU-04, `.cin324/proyecto.md`, código/pruebas de HU-04 y el cambio OpenSpec. Comprobado: sin artefactos del curso ni migraciones 001-003 tocadas; el único ajuste fuera de HU-04 es un assertion de HU-03 que daba por inexistente la tabla `torres` (tarea 3.8).
- [x] 4.2 Actualizar el README con cómo instalar, sembrar, ejecutar y probar, incluido el recorrido de creación de torres y la nota de que CA3/CA4 se implementarán en HU-05.
