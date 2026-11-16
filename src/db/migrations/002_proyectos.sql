-- HU-02: entidad Proyecto (modelo de dominio). Estado inicial: "Sin piezas cargadas".
CREATE TABLE IF NOT EXISTS proyectos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT NOT NULL UNIQUE,
  cliente TEXT NOT NULL,
  metraje TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Sin piezas cargadas'
);
