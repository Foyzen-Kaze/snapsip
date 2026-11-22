import { obtenerBd } from "../db/conexion";

// HU-02, CU-02, TO-BE Crear proyecto, RP-02
export interface Proyecto {
  id: number;
  codigo: string;
  cliente: string;
  metraje: string;
  estado: string;
}

export interface ProyectoConConteo extends Proyecto {
  partes: number;
  piezas: number;
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

function existeTabla(nombre: string): boolean {
  const db = obtenerBd();
  return Boolean(
    db
      .prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?")
      .get(nombre)
  );
}

export function listarProyectos(): ProyectoConConteo[] {
  const db = obtenerBd();
  const proyectos = db
    .prepare("SELECT id, codigo, cliente, metraje, estado FROM proyectos ORDER BY id DESC")
    .all() as Proyecto[];

  if (!existeTabla("partes_casa") || !existeTabla("piezas")) {
    return proyectos.map((proyecto) => ({ ...proyecto, partes: 0, piezas: 0 }));
  }

  const conteos = db
    .prepare(
      "SELECT pc.proyecto_id AS proyectoId, COUNT(DISTINCT pc.id) AS partes, COUNT(p.id) AS piezas FROM partes_casa pc LEFT JOIN piezas p ON p.parte_casa_id = pc.id GROUP BY pc.proyecto_id"
    )
    .all() as { proyectoId: number; partes: number; piezas: number }[];
  const porProyecto = new Map(conteos.map((conteo) => [conteo.proyectoId, conteo]));

  return proyectos.map((proyecto) => {
    const conteo = porProyecto.get(proyecto.id);
    return {
      ...proyecto,
      partes: conteo?.partes ?? 0,
      piezas: conteo?.piezas ?? 0,
    };
  });
}

export function obtenerProyectoPorCodigo(codigo: string): Proyecto | undefined {
  const db = obtenerBd();
  return db
    .prepare("SELECT id, codigo, cliente, metraje, estado FROM proyectos WHERE codigo = ?")
    .get(codigo) as Proyecto | undefined;
}