import { DatabaseSync } from "node:sqlite";
import fs from "fs";
import path from "path";

let db: DatabaseSync | null = null;

export function obtenerRutaBd(): string {
  if (process.env.DB_PATH) return process.env.DB_PATH;
  return path.join(process.cwd(), "data", "app.db");
}

export function abrirBd(ruta?: string): DatabaseSync {
  if (db) return db;
  const rutaBd = ruta ?? obtenerRutaBd();
  fs.mkdirSync(path.dirname(rutaBd), { recursive: true });
  db = new DatabaseSync(rutaBd);
  db.exec("PRAGMA foreign_keys = ON");
  aplicarMigraciones(db);
  return db;
}

export function obtenerBd(): DatabaseSync {
  if (!db) return abrirBd();
  return db;
}

export function cerrarBd(): void {
  if (db) {
    db.close();
    db = null;
  }
}

export function aplicarMigraciones(base: DatabaseSync): void {
  base.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE,
      aplicada_en TEXT NOT NULL
    );
  `);
  const dirMigraciones = path.join(process.cwd(), "src", "db", "migrations");
  if (!fs.existsSync(dirMigraciones)) return;
  const archivos = fs
    .readdirSync(dirMigraciones)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  const aplicada = base.prepare("SELECT 1 FROM schema_migrations WHERE nombre = ?");
  const insertar = base.prepare(
    "INSERT INTO schema_migrations (nombre, aplicada_en) VALUES (?, datetime('now'))"
  );
  for (const nombre of archivos) {
    if (aplicada.get(nombre)) continue;
    // Las migraciones pueden reconstruir tablas padre. PRAGMA foreign_keys no se
    // puede cambiar dentro de una transacción, y DROP TABLE con claves foráneas
    // activas dispara ON DELETE CASCADE sobre las filas hijas (HU-12, migración 007).
    // Se desactiva antes de BEGIN y se reactiva tras COMMIT, validando integridad.
    base.exec("PRAGMA foreign_keys = OFF");
    const sql = fs.readFileSync(path.join(dirMigraciones, nombre), "utf8");
    base.exec("BEGIN");
    try {
      base.exec(sql);
      insertar.run(nombre);
      const problemas = base.prepare("PRAGMA foreign_key_check").all();
      if (problemas.length > 0) {
        throw new Error(`La migración ${nombre} dejó referencias de clave foránea inválidas.`);
      }
      base.exec("COMMIT");
    } catch (e) {
      base.exec("ROLLBACK");
      throw e;
    } finally {
      base.exec("PRAGMA foreign_keys = ON");
    }
  }
}

// Utilidad para pruebas: reiniciar BD en memoria o ruta temporal
export function reiniciarBdParaPruebas(ruta: string): DatabaseSync {
  cerrarBd();
  if (ruta !== ":memory:" && fs.existsSync(ruta)) fs.unlinkSync(ruta);
  db = new DatabaseSync(ruta);
  db.exec("PRAGMA foreign_keys = ON");
  aplicarMigraciones(db);
  return db;
}
