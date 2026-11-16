import { obtenerBd } from "../db/conexion";

// HU-02, CU-02, TO-BE Crear proyecto, RP-02
export interface Proyecto {
  id: number;
  codigo: string;
  cliente: string;
  metraje: string;
  estado: string;
}

export interface DatosCrearProyecto {
  codigo: string;
  cliente: string;
  metraje: string;
}

export type ResultadoCrearProyecto =
  | { ok: true; proyecto: Proyecto }
  | { ok: false; motivo: "DUPLICADO" | "OBLIGATORIOS"; mensaje: string };

function normalizar(valor: unknown): string {
  return typeof valor === "string" ? valor.trim() : "";
}

export function crearProyecto(datos: {
  codigo: unknown;
  cliente: unknown;
  metraje: unknown;
}): ResultadoCrearProyecto {
  const codigo = normalizar(datos.codigo);
  const cliente = normalizar(datos.cliente);
  const metraje = normalizar(datos.metraje);

  if (!codigo || !cliente || !metraje) {
    return {
      ok: false,
      motivo: "OBLIGATORIOS",
      mensaje: "Los campos cliente, código y metraje son obligatorios.",
    };
  }

  const db = obtenerBd();
  const existente = db
    .prepare("SELECT id, codigo, cliente, metraje, estado FROM proyectos WHERE codigo = ?")
    .get(codigo) as Proyecto | undefined;
  if (existente) {
    // CA2: conserva el proyecto existente sin modificaciones
    return {
      ok: false,
      motivo: "DUPLICADO",
      mensaje: "El código está duplicado.",
    };
  }

  try {
    const info = db
      .prepare(
        "INSERT INTO proyectos (codigo, cliente, metraje, estado) VALUES (?, ?, ?, ?)"
      )
      .run(codigo, cliente, metraje, "Sin piezas cargadas");
    const proyecto = db
      .prepare("SELECT id, codigo, cliente, metraje, estado FROM proyectos WHERE id = ?")
      .get(Number(info.lastInsertRowid)) as Proyecto;
    return { ok: true, proyecto };
  } catch (e: any) {
    // Defensa por restricción UNIQUE en BD
    if (e && (e.code === "SQLITE_CONSTRAINT_UNIQUE" || String(e.message).includes("UNIQUE"))) {
      return {
        ok: false,
        motivo: "DUPLICADO",
        mensaje: "El código está duplicado.",
      };
    }
    throw e;
  }
}

export function listarProyectos(): Proyecto[] {
  const db = obtenerBd();
  return db
    .prepare("SELECT id, codigo, cliente, metraje, estado FROM proyectos ORDER BY id DESC")
    .all() as Proyecto[];
}

export function obtenerProyectoPorCodigo(codigo: string): Proyecto | undefined {
  const db = obtenerBd();
  return db
    .prepare("SELECT id, codigo, cliente, metraje, estado FROM proyectos WHERE codigo = ?")
    .get(codigo) as Proyecto | undefined;
}