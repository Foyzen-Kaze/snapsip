# Clasificación de requisitos

## Requisitos de producto

| ID | Requisito | Tipo (funcional/no funcional) | Actividad TO-BE asociada |
|:---|:---|:---|:---|
| <a id="rp-01"></a>**RP-01** | La plataforma debe tener un sistema de carpetas o pestañas para organizar los Proyectos, Tipos, Torres y Paneles. | Funcional | [ACT-TOBE-02](./02-rediseno-to-be.md#act-tobe-02) (Monitoreo y control de piezas del proyecto) |
| <a id="rp-02"></a>**RP-02** | La interfaz debe ser fácil de usar y mostrar de forma gráfica las torres y los paneles que tienen adentro. | No funcional | [ACT-TOBE-02](./02-rediseno-to-be.md#act-tobe-02) (Monitoreo y control de piezas del proyecto) |
| <a id="rp-03"></a>**RP-03** | Se debe poder buscar rápido y filtrar paneles específicos dentro de los proyectos. | Funcional | [ACT-TOBE-02](./02-rediseno-to-be.md#act-tobe-02) (Monitoreo y control de piezas del proyecto) |
| <a id="rp-04"></a>**RP-04** | La página debe pedir un login con credenciales para que cada operario inicie sesión. | Funcional | [ACT-TOBE-01](./02-rediseno-to-be.md#act-tobe-01) (Inicio de sesión y autenticación de usuario) |
| <a id="rp-05"></a>**RP-05** | El sistema tiene que guardar automáticamente qué usuario hizo el checklist y la hora y fecha exacta. | Funcional | [ACT-TOBE-03](./02-rediseno-to-be.md#act-tobe-03) (Verificación y armado de torres en terreno) |
| <a id="rp-06"></a>**RP-06** | Se debe poder marcar una Torre como "Terminada" cuando el checklist esté listo, y lo mismo con el Proyecto completo. | Funcional | [ACT-TOBE-03](./02-rediseno-to-be.md#act-tobe-03) (Verificación y armado de torres en terreno) |
| <a id="rp-07"></a>**RP-07** | Se debe poder exportar un PDF (Guía de Despacho) con los paneles listos para que la bodega tenga un respaldo. | Funcional | [ACT-TOBE-04](./02-rediseno-to-be.md#act-tobe-04) (Despacho y generación de guía PDF) |
| <a id="rp-08"></a>**RP-08** | Tienen que existir dos roles: Administrador (que crea y borra) y Operario (que solo busca y marca el checklist). | Funcional | [ACT-TOBE-01](./02-rediseno-to-be.md#act-tobe-01) (Inicio de sesión y autenticación de usuario) |
| <a id="rp-09"></a>**RP-09** | La aplicación debe ser tipo web para que se pueda usar desde el celular en la faena solo con internet. | No funcional | [ACT-TOBE-03](./02-rediseno-to-be.md#act-tobe-03) (Verificación y armado de torres en terreno) |
| <a id="rp-10"></a>**RP-10** | El servidor debe estar siempre arriba (alta disponibilidad) para que no se caiga en horario de trabajo. | No funcional | Transversal a la plataforma ([ACT-TOBE-01](./02-rediseno-to-be.md#act-tobe-01) a [ACT-TOBE-04](./02-rediseno-to-be.md#act-tobe-04)) |

## Requisitos de proyecto

| ID | Requisito |
|----|-----------|
| **RY-01** | El proyecto debe ser empaquetado y ejecutado localmente mediante contenedor Docker para su despliegue y evaluación, eliminando la necesidad de servidores en la nube. |
| **RY-02** | El alcance del proyecto finaliza con la entrega del producto funcional. No se contempla soporte técnico, mantenimiento evolutivo ni actualizaciones posteriores a la entrega de los contenedores. El equipo no dará soporte técnico ni mantenciones después de entregarle las claves de administración al cliente. |

## Requisito derivado

- **ID:** <a id="rp-11-der"></a>**RP-11 (Derivado)**
- **Requisito origen:** [RP-07](#rp-07) — *Se debe poder exportar un PDF denominado "Guía de Despacho" con los paneles listos para que la bodega tenga un respaldo.*
- **Actividad TO-BE asociada:** [ACT-TOBE-04](./02-rediseno-to-be.md#act-tobe-04) (Despacho y generación de guía PDF)
- **Historia de usuario asociada:** [HU-04](./04-historias-usuario.md#hu-04)
- **Requisito derivado:** El botón para descargar la Guía PDF debe estar bloqueado y deshabilitado hasta que el checklist de la torre se encuentre verificado al 100%.
- **Justificación:** Como en el proceso TO-BE se agregó validación para evitar que falten piezas en los despachos, el sistema no puede permitir emitir la guía oficial si la torre está incompleta. Esto asegura que el operario complete la verificación antes de cargar el camión.

