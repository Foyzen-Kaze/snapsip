# Proceso de negocio — AS-IS
 
## Macro-proceso y proceso específico
Logística y Producción → Almacenamiento y Despacho de Piezas
 
## Objetivo de negocio del proceso
Producir, organizar en bodega y cargar correctamente las piezas solicitadas en los camiones para su despacho.
 
## Participantes y sus objetivos
| Participante | Objetivo en el proceso |
|---------------|------------------------|
| Área de Corte | Cortar las piezas según los planos y agruparlas en las torres contenedoras. |
| Bodega (Montacargas) | Almacenar las torres apiladas y localizar las piezas exactas cuando se requieren. |
| Despacho | Solicitar las piezas necesarias y cargar el camión para completar el envío. |
 
## Diagrama AS-IS
![Proceso AS-IS](diagramas/As_is_1.png)
 
Archivo fuente: [`./diagramas/as-is.bpmn`](diagramas/As_is_1.xml)

 
## Problemas identificados
- La búsqueda de piezas es manual y exhaustiva (torre por torre), lo que impide al operario de bodega localizar el material rápidamente y retrasa todo el proceso.
- Pérdida significativa de tiempo productivo y aumento del gasto logístico al mantener los camiones en espera durante las búsquedas.

## Actividades relevantes del proceso AS-IS (Elementos Trazables)

### <a id="act-as-01"></a>ACT-AS-01 — Acceso físico sin control de identidad ni registro
El personal y los operarios ingresan y operan en faena/bodega sin autenticación digital ni diferenciación de roles o permisos.

### <a id="act-as-02"></a>ACT-AS-02 — Buscar pieza requerida con montacargas
El operario de montacargas recibe el requerimiento de despacho y recorre físicamente los pasillos de bodega buscando a ciegas la torre contenedora correspondiente.

### <a id="act-as-03"></a>ACT-AS-03 — Búsqueda exhaustiva torre por torre
Cuando no se localiza la pieza de inmediato, el operario debe inspeccionar manualmente cada torre contenedora, generando retrasos críticos y tiempos muertos en los camiones de despacho.

### <a id="act-as-04"></a>ACT-AS-04 — Carga de camión y despacho manual sin registro digital
El despacho y la carga del camión se realizan sin una guía de despacho digital ni validación previa de contenido completo, lo que genera riesgo de envíos incompletos.

