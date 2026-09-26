# Clasificación de requisitos

## Requisitos de producto

| ID | Requisito | Tipo (funcional/no funcional) | Actividad TO-BE asociada |
|----|-----------|--------------------------------|----------------------------|
| RP-01 | La plataforma debe tener un sistema de carpetas o pestañas para organizar los Proyectos, Tipos, Torres y Paneles. | Funcional | Localizar panel mediante motor de búsqueda y jerarquía |
| RP-02 | La interfaz debe ser fácil de usar y mostrar de forma gráfica las torres y los paneles que tienen adentro. | No funcional | Localizar panel mediante motor de búsqueda y jerarquía |
| RP-03 | Se debe poder buscar rápido y filtrar paneles específicos dentro de los proyectos. | Funcional | Localizar panel mediante motor de búsqueda y jerarquía |
| RP-04 | La página debe pedir un login con credenciales para que cada operario inicie sesión. | Funcional | Iniciar sesión con credenciales privadas |
| RP-05 | El sistema tiene que guardar automáticamente qué usuario hizo el checklist y la hora y fecha exacta. | Funcional | Registrar auditoría (Usuario y Timestamp) |
| RP-06 | Se debe poder marcar una Torre como "Terminada" cuando el checklist esté listo, y lo mismo con el Proyecto completo. | Funcional | Marcar como terminada y exportar Guía PDF |
| RP-07 | Se debe poder exportar un PDF (Guía de Despacho) con los paneles listos para que la bodega tenga un respaldo. | Funcional | Marcar como terminada y exportar Guía PDF |
| RP-08 | Tienen que existir dos roles: Administrador (que crea y borra) y Operario (que solo busca y marca el checklist). | Funcional | Iniciar sesión con credenciales privadas |
| RP-09 | La aplicación debe ser tipo web para que se pueda usar desde el celular en la faena solo con internet. | No funcional | Marcar panel y validar checklist de la torre |
| RP-10 | El servidor debe estar siempre arriba (alta disponibilidad) para que no se caiga en horario de trabajo. | No funcional | (General de plataforma) |

## Requisitos de proyecto

| ID | Requisito |
|----|-----------|
| RY-01 | El proyecto se debe subir a las capas gratuitas de Vercel y Supabase para que el costo mensual sea $0 CLP. |
| RY-02 | El equipo no dará soporte técnico ni mantenciones después de entregarle las claves de administración al cliente. |

## Requisito derivado

**Requisito origen:** [RP-07] Se debe poder exportar un PDF denominado "Guía de Despacho" con los paneles listos para que la bodega tenga un respaldo.

**Requisito derivado:** El botón para descargar la Guía PDF debe estar bloqueado hasta que el checklist de la torre esté al 100%.

**Justificación:** Como en el proceso TO-BE se agrego una validación para evitar que falten piezas en los despachos, el sistema no puede dejar sacar la guía oficial si la torre está incompleta. Esto fuerza al operario a tener todo completo antes de cargar el camión.
