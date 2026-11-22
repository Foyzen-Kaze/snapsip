-- HU-03, CU-03, TO-BE Inyectar piezas desde plano/archivo, RP-03
-- Modelo de dominio: Proyecto 1 - 0..* ParteCasa; ParteCasa 1 - 1..* Pieza (composición).
CREATE TABLE IF NOT EXISTS partes_casa (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  proyecto_id INTEGER NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  UNIQUE (proyecto_id, nombre)
);

CREATE TABLE IF NOT EXISTS piezas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  proyecto_id INTEGER NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
  parte_casa_id INTEGER NOT NULL REFERENCES partes_casa(id) ON DELETE CASCADE,
  codigo TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Pendiente',
  UNIQUE (proyecto_id, codigo)
);
