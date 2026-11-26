import { obtenerBd } from "../db/conexion";
import { ESTADOS_PROYECTO } from "./proyectos";

// HU-04, CU-04, TO-BE Crear torre, RP-04, EST-02
export const ESTADOS_PROYECTO_CON_PIEZAS = [
  ESTADOS_PROYECTO.EN_PREPARACION,
  ESTADOS_PROYECTO.COMPLETO,
];
export const MENSAJE_PROYECTO_SIN_PIEZAS =
  "primero deben inyectarse las piezas del proyecto desde el archivo";
export const MENSAJE_PARTE_AJENA =
  "La parte de la casa no pertenece al proyecto seleccionado.";

export interface ProyectoParaTorre {
  id: number;
  codigo: string;
  cliente: string;
  estado: string;
}

export interface ParteCasaParaTorre {
  id: number;
  proyecto_id: number;
  nombre: string;
}

export interface Torre {
  id: number;
  proyecto_id: number;
  parte_casa_id: number;
  codigo: string;
  numero: number;
  estado: string;
  fecha_hora_eliminacion: string | null;
  eliminada_por: string | null;
}

export type MotivoCrearTorre =
  | "DATOS_INVALIDOS"
  | "PROYECTO_INEXISTENTE"
  | "PROYECTO_SIN_PIEZAS"
  | "PARTE_AJENA";

export type ResultadoCrearTorre =
  | { ok: true; torre: Torre; proyecto: ProyectoParaTorre; parte: ParteCasaParaTorre }
  | { ok: false; motivo: MotivoCrearTorre; mensaje: string };

class ErrorCrearTorre extends Error {
  constructor(public readonly motivo: MotivoCrearTorre, mensaje: string) {
    super(mensaje);
  }
}

function aId(valor: unknown): number | undefined {
  const texto = typeof valor === "string" ? valor.trim() : "";
  if (!/^\d+$/.test(texto)) return undefined;
  const id = Number(texto);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

// CA1: solo se ofrecen proyectos con universo de piezas inyectado (guarda de EST-02).
export function listarProyectosParaTorre(): ProyectoParaTorre[] {
  return obtenerBd()
    .prepare(
      "SELECT id, codigo, cliente, estado FROM proyectos WHERE estado IN ('En preparación', 'Proyecto completo') ORDER BY id"
    )
    .all() as ProyectoParaTorre[];
}

// CA4/CA5 de HU-06: una ParteCasa solo existe con al menos una Pieza (modelo de dominio).
export function listarPartesDelProyecto(proyectoId: number): ParteCasaParaTorre[] {
  return obtenerBd()
    .prepare(
      "SELECT pc.id, pc.proyecto_id, pc.nombre FROM partes_casa pc WHERE pc.proyecto_id = ? AND EXISTS (SELECT 1 FROM piezas p WHERE p.parte_casa_id = pc.id AND p.proyecto_id = pc.proyecto_id) ORDER BY pc.id"
    )
    .all(proyectoId) as ParteCasaParaTorre[];
}

// CA1/CA2, EST-02: Inicial → crear torre → Abierta, con numeración correlativa por proyecto.
export function crearTorre(proyectoId: unknown, parteCasaId: unknown): ResultadoCrearTorre {
  const idProyecto = aId(proyectoId);
  const idParte = aId(parteCasaId);
  if (idProyecto === undefined || idParte === undefined) {
    return {
      ok: false,
      motivo: "DATOS_INVALIDOS",
      mensaje: "Seleccione un Proyecto y una Parte de la casa válidos.",
    };
  }

  const db = obtenerBd();
  let confirmada = false;
  db.exec("BEGIN");
  try {
    const proyecto = db
      .prepare("SELECT id, codigo, cliente, estado FROM proyectos WHERE id = ?")
      .get(idProyecto) as ProyectoParaTorre | undefined;
    if (!proyecto) {
      throw new ErrorCrearTorre("PROYECTO_INEXISTENTE", "El proyecto seleccionado no existe.");
    }
    if (!ESTADOS_PROYECTO_CON_PIEZAS.includes(proyecto.estado)) {
      throw new ErrorCrearTorre("PROYECTO_SIN_PIEZAS", MENSAJE_PROYECTO_SIN_PIEZAS);
    }

    const parte = db
      .prepare("SELECT id, proyecto_id, nombre FROM partes_casa WHERE id = ?")
      .get(idParte) as ParteCasaParaTorre | undefined;
    if (!parte || parte.proyecto_id !== idProyecto) {
      throw new ErrorCrearTorre("PARTE_AJENA", MENSAJE_PARTE_AJENA);
    }

    const { numero } = db
      .prepare("SELECT COALESCE(MAX(numero), 0) + 1 AS numero FROM torres WHERE proyecto_id = ?")
      .get(idProyecto) as { numero: number };
    const codigo = `TOR-${proyecto.codigo}-${numero}`;
    const info = db
      .prepare(
        "INSERT INTO torres (proyecto_id, parte_casa_id, codigo, numero, estado) VALUES (?, ?, ?, ?, 'Abierta')"
      )
      .run(idProyecto, idParte, codigo, numero);
    const torre = db
      .prepare(
        "SELECT id, proyecto_id, parte_casa_id, codigo, numero, estado, fecha_hora_eliminacion, eliminada_por FROM torres WHERE id = ?"
      )
      .get(Number(info.lastInsertRowid)) as Torre;

    db.exec("COMMIT");
    confirmada = true;
    return { ok: true, torre, proyecto, parte };
  } catch (error) {
    if (!confirmada) db.exec("ROLLBACK");
    if (error instanceof ErrorCrearTorre) {
      return { ok: false, motivo: error.motivo, mensaje: error.message };
    }
    throw error;
  }
}
