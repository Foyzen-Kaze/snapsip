-- HU-05, CU-05, DSS-01, RP-05, EST-01: asignar pieza a torre con evidencia.
-- Modelo de dominio: Torre 0..1 - 0..* Pieza (el panel sobrevive a la torre); Evidencia 0..* - 0..1 Pieza.
-- No se agregan asignada_por ni fecha_hora_asignacion a piezas: usuario, fecha y hora viven en evidencias.
ALTER TABLE piezas
  ADD COLUMN torre_id INTEGER REFERENCES torres(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS evidencias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pieza_id INTEGER NOT NULL REFERENCES piezas(id) ON DELETE CASCADE,
  fotografia TEXT NOT NULL,
  fecha_hora_captura TEXT NOT NULL,
  responsable TEXT NOT NULL,
  vigente INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_evidencias_pieza_vigente ON evidencias(pieza_id, vigente);
