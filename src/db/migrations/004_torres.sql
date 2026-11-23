-- HU-04, CU-04, TO-BE Crear torre, RP-04, EST-02
-- Modelo de dominio: ParteCasa 1 - 0..* Torre; Torre 0..1 - 0..* Pieza (aún sin asignación: HU-05).
-- La numeración es correlativa dentro del Proyecto, no por ParteCasa (CA1/CA2, RP-04).
CREATE TABLE IF NOT EXISTS torres (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  proyecto_id INTEGER NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
  parte_casa_id INTEGER NOT NULL REFERENCES partes_casa(id) ON DELETE CASCADE,
  codigo TEXT NOT NULL,
  numero INTEGER NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Abierta',
  fecha_hora_eliminacion TEXT,
  eliminada_por TEXT,
  UNIQUE (proyecto_id, numero),
  UNIQUE (proyecto_id, codigo)
);
