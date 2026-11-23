## 1. Datos y capa de dominio

- [x] 1.1 Ampliar `ProyectoParaSelector` con `cliente` y cambiar `listarProyectosParaConsulta()` a `SELECT id, codigo, cliente FROM proyectos` (CA3). La consulta incluye además `estado` para la tarea 1.3.
- [x] 1.2 Modificar `listarPartesPorProyecto()` para devolver solo las `ParteCasa` que tienen al menos una `Pieza` cargada, mediante `EXISTS` por `parte_casa_id` y `proyecto_id`, sin filtrar por `estado` (CA4, CA5).
- [x] 1.3 Leer `proyectos.estado` en la capa de dominio para detectar «Sin piezas cargadas», sin crear columnas ni tablas nuevas (CA6).

## 2. Ruta y vista

- [x] 2.1 Pintar cada opción del selector de Proyecto como `${cliente} (${codigo})` en `src/vistas/pendientes.ejs` (CA3).
- [x] 2.2 Calcular en `src/rutas/pendientes.ts` un indicador de proyecto sin piezas y, cuando esté activo, no consultar partes (CA6).
- [x] 2.3 Mostrar en la vista el aviso «El proyecto no tiene partes de la casa con piezas cargadas», conservando el mensaje de selección incompleta y el de «0 pendientes» (CA6).
- [x] 2.4 Comprobar que el selector de Parte se repuebla al reenviar el formulario con otro `proyectoId`, sin añadir JavaScript ni endpoints nuevos (prueba de repoblado añadida).

## 3. Pruebas (una por escenario Gherkin)

- [x] 3.1 Preparar datos de prueba: un proyecto sin piezas y otro cuyo universo sean solo tres `ParteCasa` —«Muros interiores», «Techo» y «Entrepiso»—, cada una con al menos una `Pieza`; no crear «Muros exteriores» ni «Piso» en ese proyecto, porque `ParteCasa` 1 – 1..* `Pieza` (`08-modelo-dominio.md:22`) (CA4-CA6).
- [x] 3.2 Prueba «HU-06 · Identificar el proyecto por cliente y código» (CA3).
- [x] 3.3 Prueba «HU-06 · Ofrecer las partes del proyecto elegido» con los cinco ejemplos del esquema (CA4).
- [x] 3.4 Prueba «HU-06 · Ofrecer únicamente las partes que tiene el proyecto» (CA5): verificar que «Muros exteriores» y «Piso» no aparecen porque no existen en ese proyecto, no porque sean partes sin piezas.
- [x] 3.5 Prueba «HU-06 · Proyecto sin piezas cargadas» (CA6).
- [x] 3.6 Ejecutar `npm test` y verificar que pasan las pruebas nuevas y las existentes de CA1 y CA2. Resultado: 4 archivos, 28 pruebas, todas pasan.

## 4. Cierre

- [x] 4.1 Revisar que no se crearon migraciones SQL ni cambios fuera de HU-06. `git status`: solo ficha HU-06, `.cin324/proyecto.md`, código/pruebas de HU-06 y el cambio OpenSpec; sin migraciones nuevas.
- [x] 4.2 Actualizar el README con cómo instalar, sembrar, ejecutar y probar, incluido el recorrido de CA3-CA6 en `/pendientes`.
