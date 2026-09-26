# Clasificación de requisitos

## Requisitos de producto

| ID | Requisito | Tipo (funcional/no funcional) | Actividad TO-BE asociada |
|----|-----------|--------------------------------|----------------------------|
| RP-01 | La plataforma debe tener un sistema de carpetas o pestañas para organizar los Proyectos, Tipos, Torres y Paneles[cite: 6]. | Funcional | Localizar panel mediante motor de búsqueda y jerarquía |
| RP-02 | La interfaz debe ser fácil de usar y mostrar de forma gráfica las torres y los paneles que tienen adentro[cite: 6]. | No funcional | Localizar panel mediante motor de búsqueda y jerarquía |
| RP-03 | Se debe poder buscar rápido y filtrar paneles específicos dentro de los proyectos[cite: 6]. | Funcional | Localizar panel mediante motor de búsqueda y jerarquía |
| RP-04 | La página debe pedir un login con credenciales para que cada operario inicie sesión[cite: 6]. | Funcional | Iniciar sesión con credenciales privadas |
| RP-05 | El sistema tiene que guardar automáticamente qué usuario hizo el checklist y la hora y fecha exacta[cite: 6]. | Funcional | Registrar auditoría (Usuario y Timestamp) |
| RP-06 | Se debe poder marcar una Torre como "Terminada" cuando el checklist esté listo, y lo mismo con el Proyecto completo[cite: 6]. | Funcional | Marcar como terminada y exportar Guía PDF |
| RP-07 | Se debe poder exportar un PDF (Guía de Despacho) con los paneles listos para que la bodega tenga un respaldo[cite: 6]. | Funcional | Marcar como terminada y exportar Guía PDF |
| RP-08 | Tienen que existir dos roles: Administrador (que crea y borra cosas) y Operario (que solo busca y marca el checklist)[cite: 6]. | Funcional | Iniciar sesión con credenciales privadas |
| RP-09 | La aplicación debe ser tipo web (PWA) para que se pueda usar desde el celular en la faena solo con internet[cite: 6]. | No funcional | Marcar panel y validar checklist de la torre |
| RP-10 | El servidor debe estar siempre arriba (alta disponibilidad) para que no se caiga en horario de trabajo[cite: 6]. | No funcional | (General de plataforma) |

## Requisitos de proyecto

| ID | Requisito |
|----|-----------|
| RY-01 | El proyecto se debe subir a las capas gratuitas de Vercel y Supabase para que el costo mensual sea $0 CLP[cite: 6]. |
| RY-02 | El equipo no dará soporte técnico ni mantenciones después de entregarle las claves de administración al cliente[cite: 6]. |

## Requisito derivado

**Requisito origen:** [RP-07] Se debe poder exportar un PDF (Guía de Despacho) con los paneles listos para que la bodega tenga un respaldo[cite: 6].

**Requisito derivado:** El botón para descargar la Guía PDF debe estar bloqueado hasta que el checklist de la torre esté al 100%.

**Justificación:** Como en nuestro proceso TO-BE agregamos una validación para evitar que falten piezas en los despachos, el sistema no puede dejarte sacar la guía oficial si la torre está incompleta. Esto fuerza al operario a tener todo listo antes de cargar el camión y evita el problema del AS-IS donde se enviaban proyectos a medias.
