import { abrirBd, cerrarBd } from "./conexion";

// HU-01: seed idempotente de roles de demostración
export function ejecutarSeed(): void {
  const db = abrirBd();
  const insertar = db.prepare(
    "INSERT OR IGNORE INTO usuarios_demo (rol, nombre) VALUES (?, ?)"
  );
  db.exec("BEGIN");
  try {
    insertar.run("Operario de Bodega", "Operario de Bodega (demo)");
    insertar.run("Encargado de Despacho", "Encargado de Despacho (demo)");
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}

if (require.main === module) {
  ejecutarSeed();
  console.log("Seed HU-01 aplicado: roles de demostración disponibles.");
  cerrarBd();
}
