-- OBS-1 / HU-02 / RP-02, HU-03 / RP-03: cantidad prevista de piezas por parte de la casa.
-- Migración aditiva: conserva las filas y datos existentes; no borra ni reinicia la base.
ALTER TABLE partes_casa ADD COLUMN cantidad_prevista INTEGER NOT NULL DEFAULT 0;

-- Backfill: las partes ya inyectadas conservan el número real de piezas que tienen.
UPDATE partes_casa
   SET cantidad_prevista = (SELECT COUNT(*) FROM piezas WHERE piezas.parte_casa_id = partes_casa.id)
 WHERE cantidad_prevista = 0;
