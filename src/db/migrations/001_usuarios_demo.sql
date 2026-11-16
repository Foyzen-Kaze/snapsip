-- HU-01: datos de apoyo para selector de rol de demostración (no entidad del dominio SnapSip)
CREATE TABLE IF NOT EXISTS usuarios_demo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rol TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL
);
