-- HU-12 / RP-17 / EST-04: ciclo de vida del Proyecto con aprobación previa.
-- Migración aditiva: no se reescribe 002_proyectos.sql, no se borra la base.
-- `conexion.ts` desactiva PRAGMA foreign_keys antes de BEGIN y lo reactiva tras
-- COMMIT; así DROP TABLE no dispara ON DELETE CASCADE sobre piezas/partes y se
-- comprueba PRAGMA foreign_key_check antes de confirmar.
CREATE TABLE proyectos_nueva (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT NOT NULL UNIQUE,
  cliente TEXT NOT NULL,
  metraje TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Pendiente de aprobación'
);

-- Conversión defensiva: solo se toca el estado eliminado «Sin piezas cargadas».
-- Con piezas registradas se interpreta que el proyecto ya fue aprobado (En preparación).
INSERT INTO proyectos_nueva (id, codigo, cliente, metraje, estado)
SELECT p.id,
       p.codigo,
       p.cliente,
       p.metraje,
       CASE
         WHEN p.estado = 'Sin piezas cargadas' THEN
           CASE WHEN EXISTS (SELECT 1 FROM piezas pieza WHERE pieza.proyecto_id = p.id)
                THEN 'En preparación'
                ELSE 'Pendiente de aprobación'
           END
         ELSE p.estado
       END
  FROM proyectos p;

DROP TABLE proyectos;
ALTER TABLE proyectos_nueva RENAME TO proyectos;
