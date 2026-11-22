import { obtenerBd } from "../db/conexion";
import { generadorPlano } from "../integraciones";
import { Proyecto } from "./proyectos";

// HU-03, CU-03, TO-BE Inyectar piezas desde plano/archivo, RP-03, EST-01
export interface ParteCasa {
  id: number;
  proyecto_id: number;
  nombre: string;
}

export interface Pieza {
  id: number;
  parte_casa_id: number;
  codigo: string;
  estado: string;
}

export interface ParteCasaConPiezas extends ParteCasa {
  piezas: Pieza[];
}

export interface UniversoPiezas {
  proyecto: Proyecto;
  partes: ParteCasaConPiezas[];
  totalPartes: number;
  totalPiezas: number;
}

export type ResultadoInyeccion =
  | { ok: true; universo: UniversoPiezas }
  | {
      ok: false;
      motivo: "NO_ENCONTRADO" | "ESTADO_INVALIDO" | "YA_INYECTADO";
      mensaje: string;
    };

function buscarProyecto(codigoProyecto: string): Proyecto | undefined {
  return obtenerBd()
    .prepare("SELECT id, codigo, cliente, metraje, estado FROM proyectos WHERE codigo = ?")
    .get(codigoProyecto) as Proyecto | undefined;
}

export function obtenerUniverso(codigoProyecto: string): UniversoPiezas | undefined {
  const db = obtenerBd();
  const proyecto = buscarProyecto(codigoProyecto);
  if (!proyecto) return undefined;

  const partes = db
    .prepare("SELECT id, proyecto_id, nombre FROM partes_casa WHERE proyecto_id = ? ORDER BY id")
    .all(proyecto.id) as ParteCasa[];
  const piezas = db
    .prepare(
      "SELECT p.id, p.parte_casa_id, p.codigo, p.estado FROM piezas p JOIN partes_casa pc ON pc.id = p.parte_casa_id WHERE pc.proyecto_id = ? ORDER BY p.id"
    )
    .all(proyecto.id) as Pieza[];

  const porParte = new Map<number, Pieza[]>();
  for (const pieza of piezas) {
    const lista = porParte.get(pieza.parte_casa_id) ?? [];
    lista.push(pieza);
    porParte.set(pieza.parte_casa_id, lista);
  }

  return {
    proyecto,
    partes: partes.map((parte) => ({ ...parte, piezas: porParte.get(parte.id) ?? [] })),
    totalPartes: partes.length,
    totalPiezas: piezas.length,
  };
}

export function inyectarPiezasDesdePlano(codigoProyecto: string): ResultadoInyeccion {
  const db = obtenerBd();
  const proyecto = buscarProyecto(codigoProyecto);
  if (!proyecto) {
    return {
      ok: false,
      motivo: "NO_ENCONTRADO",
      mensaje: `No existe un proyecto con código '${codigoProyecto}'.`,
    };
  }

  const conteo = db
    .prepare(
      "SELECT COUNT(*) AS total FROM piezas p JOIN partes_casa pc ON pc.id = p.parte_casa_id WHERE pc.proyecto_id = ?"
    )
    .get(proyecto.id) as { total: number };

  if (conteo.total > 0) {
    return {
      ok: false,
      motivo: "YA_INYECTADO",
      mensaje: "El proyecto ya tiene piezas inyectadas; no se modificaron datos.",
    };
  }
  if (proyecto.estado !== "Sin piezas cargadas") {
    return {
      ok: false,
      motivo: "ESTADO_INVALIDO",
      mensaje: `El proyecto está en estado '${proyecto.estado}'; se requiere 'Sin piezas cargadas'.`,
    };
  }

  const universoSimulado = generadorPlano.generar(proyecto.codigo);
  db.exec("BEGIN");
  try {
    const insertarParte = db.prepare(
      "INSERT INTO partes_casa (proyecto_id, nombre) VALUES (?, ?)"
    );
    const insertarPieza = db.prepare(
      "INSERT INTO piezas (proyecto_id, parte_casa_id, codigo, estado) VALUES (?, ?, ?, 'Pendiente')"
    );
    for (const parte of universoSimulado.partes) {
      const info = insertarParte.run(proyecto.id, parte.nombre);
      const parteId = Number(info.lastInsertRowid);
      for (const pieza of parte.piezas) {
        insertarPieza.run(proyecto.id, parteId, pieza.codigo);
      }
    }
    // HU-03 CA1, EST-01: Proyecto «Sin piezas cargadas» → «En preparación».
    db.prepare("UPDATE proyectos SET estado = 'En preparación' WHERE id = ?").run(proyecto.id);
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }

  return { ok: true, universo: obtenerUniverso(proyecto.codigo)! };
}
