import { obtenerBd } from "../db/conexion";
import { ErrorAlmacenamientoEvidencias, EvidenciaAlmacenada } from "../integraciones/ServicioAlmacenamientoEvidencias";
import { servicioAlmacenamientoEvidencias } from "../integraciones";

// HU-05, CU-05, TO-BE Asignar pieza a torre con evidencia, RP-05, EST-01/EST-02, DSS-01.
// Mensajes literales del DSS-01 (diagramas/dss-01.puml:21-42) y de HU-04 CA3/CA4.
export const MENSAJE_SIN_EVIDENCIA = "se exige evidencia fotográfica";
export const MENSAJE_PIEZA_ENVIADA = "una pieza enviada no puede reasignarse";
export const MENSAJE_PARTE_AJENA = "la torre no corresponde a la parte de la pieza";
export const MENSAJE_TORRE_CERRADA = "se sugiere registrar otra torre para la parte";
export const MENSAJE_FALLO_EVIDENCIA = "la evidencia no pudo almacenarse";

export const ROL_OPERARIO = "Operario de Bodega";

export interface ProyectoParaAsignacion {
  id: number;
  codigo: string;
  cliente: string;
  estado: string;
}

// El listado muestra código, parte de la casa y estado (corrección del estudiante).
export interface PiezaListada {
  id: number;
  codigo: string;
  estado: string;
  parte_casa: string;
}

export interface PiezaParaSelector extends PiezaListada {
  torre_codigo: string | null;
}

export interface TorreListada {
  id: number;
  codigo: string;
  estado: string;
  parte_casa: string;
}

export interface PiezaDetalle extends PiezaListada {
  proyecto_id: number;
  parte_casa_id: number;
  torre_id: number | null;
}

export interface TorreDetalle extends TorreListada {
  proyecto_id: number;
  parte_casa_id: number;
}

export interface Evidencia {
  id: number;
  pieza_id: number;
  fotografia: string;
  fecha_hora_captura: string;
  responsable: string;
  vigente: number;
}

export interface PiezaEnTorre {
  codigo: string;
  estado: string;
}

export interface ConsultaTorre {
  torre: TorreDetalle;
  piezas: PiezaEnTorre[];
}

export type MotivoAsignacion =
  | "DATOS_INVALIDOS"
  | "PIEZA_INEXISTENTE"
  | "TORRE_INEXISTENTE"
  | "SIN_EVIDENCIA"
  | "PIEZA_ENVIADA"
  | "ESTADO_INVALIDO"
  | "PARTE_DISTINTA"
  | "TORRE_CERRADA"
  | "FALLO_EVIDENCIA";

export type ResultadoAsignacion =
  | {
      estado: "asignada";
      pieza: PiezaDetalle;
      torre: TorreDetalle;
      evidencia: Evidencia;
    }
  | {
      estado: "confirmar";
      pieza: PiezaDetalle;
      torreActual: TorreDetalle | null;
      torreDestino: TorreDetalle;
    }
  | { estado: "rechazada"; motivo: MotivoAsignacion; mensaje: string };

class ErrorAsignacion extends Error {
  constructor(public readonly motivo: MotivoAsignacion, mensaje: string) {
    super(mensaje);
  }
}

function aId(valor: unknown): number | undefined {
  // La ruta ya convierte a número; el dominio también admite el string del formulario.
  if (typeof valor === "number") {
    return Number.isInteger(valor) && valor > 0 ? valor : undefined;
  }
  const texto = typeof valor === "string" ? valor.trim() : "";
  if (!/^\d+$/.test(texto)) return undefined;
  const id = Number(texto);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

function esConfirmacion(valor: unknown): boolean {
  return valor === true || valor === 1 || valor === "1";
}

export function listarProyectosParaAsignacion(): ProyectoParaAsignacion[] {
  return obtenerBd()
    .prepare("SELECT id, codigo, cliente, estado FROM proyectos ORDER BY id")
    .all() as ProyectoParaAsignacion[];
}

// CA1 del requisito de listado: solo piezas «Pendiente» y sin torre asignada.
export function listarPiezasPendientes(proyectoId: number): PiezaListada[] {
  return obtenerBd()
    .prepare(
      "SELECT p.id, p.codigo, p.estado, pc.nombre AS parte_casa FROM piezas p " +
        "JOIN partes_casa pc ON pc.id = p.parte_casa_id " +
        "WHERE p.proyecto_id = ? AND p.estado = 'Pendiente' AND p.torre_id IS NULL ORDER BY p.id"
    )
    .all(proyectoId) as PiezaListada[];
}

// CA3 (reasignación): el selector también ofrece las piezas «Listo» y su torre actual.
export function listarPiezasParaSelector(proyectoId: number): PiezaParaSelector[] {
  return obtenerBd()
    .prepare(
      "SELECT p.id, p.codigo, p.estado, pc.nombre AS parte_casa, t.codigo AS torre_codigo " +
        "FROM piezas p JOIN partes_casa pc ON pc.id = p.parte_casa_id " +
        "LEFT JOIN torres t ON t.id = p.torre_id " +
        "WHERE p.proyecto_id = ? AND p.estado IN ('Pendiente', 'Listo') " +
        "ORDER BY p.estado DESC, p.id"
    )
    .all(proyectoId) as PiezaParaSelector[];
}

// El estudiante pidió **todas** las torres del proyecto, no solo las «Abierta».
export function listarTorresDelProyecto(proyectoId: number): TorreListada[] {
  return obtenerBd()
    .prepare(
      "SELECT t.id, t.codigo, t.estado, pc.nombre AS parte_casa FROM torres t " +
        "JOIN partes_casa pc ON pc.id = t.parte_casa_id " +
        "WHERE t.proyecto_id = ? ORDER BY t.numero"
    )
    .all(proyectoId) as TorreListada[];
}

function buscarPieza(id: number): PiezaDetalle | undefined {
  return obtenerBd()
    .prepare(
      "SELECT p.id, p.proyecto_id, p.parte_casa_id, p.codigo, p.estado, p.torre_id, " +
        "pc.nombre AS parte_casa FROM piezas p JOIN partes_casa pc ON pc.id = p.parte_casa_id " +
        "WHERE p.id = ?"
    )
    .get(id) as PiezaDetalle | undefined;
}

function buscarTorre(id: number | null): TorreDetalle | undefined {
  if (id === null) return undefined;
  return obtenerBd()
    .prepare(
      "SELECT t.id, t.proyecto_id, t.parte_casa_id, t.codigo, t.estado, t.numero, " +
        "pc.nombre AS parte_casa FROM torres t JOIN partes_casa pc ON pc.id = t.parte_casa_id " +
        "WHERE t.id = ?"
    )
    .get(id) as TorreDetalle | undefined;
}

// DSS-01: evidencia → estado Enviado → parte/proyecto → torre Abierta → Pendiente/Listo.
export function asignarPieza(
  piezaId: unknown,
  torreId: unknown,
  fotografia: unknown,
  confirmar: unknown,
  responsable: string = ROL_OPERARIO
): ResultadoAsignacion {
  const idPieza = aId(piezaId);
  const idTorre = aId(torreId);
  if (idPieza === undefined || idTorre === undefined) {
    return {
      estado: "rechazada",
      motivo: "DATOS_INVALIDOS",
      mensaje: "Seleccione una pieza y una torre válidas.",
    };
  }
  const foto = typeof fotografia === "string" ? fotografia.trim() : "";
  if (!foto) {
    return { estado: "rechazada", motivo: "SIN_EVIDENCIA", mensaje: MENSAJE_SIN_EVIDENCIA };
  }

  const db = obtenerBd();
  let terminada = false;
  db.exec("BEGIN");
  try {
    const pieza = buscarPieza(idPieza);
    if (!pieza) {
      throw new ErrorAsignacion("PIEZA_INEXISTENTE", "La pieza seleccionada no existe.");
    }
    if (pieza.estado === "Enviado") {
      throw new ErrorAsignacion("PIEZA_ENVIADA", MENSAJE_PIEZA_ENVIADA);
    }

    const torre = buscarTorre(idTorre);
    if (!torre) {
      throw new ErrorAsignacion("TORRE_INEXISTENTE", "La torre seleccionada no existe.");
    }
    if (torre.proyecto_id !== pieza.proyecto_id || torre.parte_casa_id !== pieza.parte_casa_id) {
      throw new ErrorAsignacion("PARTE_DISTINTA", MENSAJE_PARTE_AJENA);
    }
    if (torre.estado !== "Abierta") {
      throw new ErrorAsignacion("TORRE_CERRADA", MENSAJE_TORRE_CERRADA);
    }

    const reasignacion = pieza.estado === "Listo";
    if (reasignacion && !esConfirmacion(confirmar)) {
      // CA3 «Reasignación no confirmada»: no se escribe nada.
      db.exec("COMMIT");
      terminada = true;
      return {
        estado: "confirmar",
        pieza,
        torreActual: buscarTorre(pieza.torre_id) ?? null,
        torreDestino: torre,
      };
    }
    if (pieza.estado !== "Pendiente" && pieza.estado !== "Listo") {
      throw new ErrorAsignacion("ESTADO_INVALIDO", "La pieza no puede asignarse en su estado actual.");
    }

    // CA4: se valida todo antes de llamar al servicio; si falla, rollback sin cambiar la pieza.
    let almacenada: EvidenciaAlmacenada;
    try {
      almacenada = servicioAlmacenamientoEvidencias.almacenar(foto);
    } catch (error) {
      if (error instanceof ErrorAlmacenamientoEvidencias) {
        throw new ErrorAsignacion("FALLO_EVIDENCIA", MENSAJE_FALLO_EVIDENCIA);
      }
      throw error;
    }

    if (reasignacion) {
      db.prepare("UPDATE evidencias SET vigente = 0 WHERE pieza_id = ?").run(idPieza);
    }
    db.prepare(
      "INSERT INTO evidencias (pieza_id, fotografia, fecha_hora_captura, responsable, vigente) " +
        "VALUES (?, ?, ?, ?, 1)"
    ).run(idPieza, almacenada.referencia, almacenada.fechaHoraCaptura, responsable || ROL_OPERARIO);
    db.prepare("UPDATE piezas SET torre_id = ?, estado = 'Listo' WHERE id = ?").run(idTorre, idPieza);

    const evidencia = db
      .prepare(
        "SELECT id, pieza_id, fotografia, fecha_hora_captura, responsable, vigente " +
          "FROM evidencias WHERE pieza_id = ? ORDER BY id DESC LIMIT 1"
      )
      .get(idPieza) as Evidencia;

    db.exec("COMMIT");
    terminada = true;
    return {
      estado: "asignada",
      pieza: { ...pieza, estado: "Listo", torre_id: idTorre },
      torre,
      evidencia,
    };
  } catch (error) {
    if (!terminada) db.exec("ROLLBACK");
    if (error instanceof ErrorAsignacion) {
      return { estado: "rechazada", motivo: error.motivo, mensaje: error.message };
    }
    throw error;
  }
}

// CA6: lectura de apoyo dentro de CU-05, sin actividad TO-BE ni DSS propios.
export function consultarTorre(torreId: unknown): ConsultaTorre | undefined {
  const id = aId(torreId);
  if (id === undefined) return undefined;
  const torre = buscarTorre(id);
  if (!torre) return undefined;
  const piezas = obtenerBd()
    .prepare("SELECT codigo, estado FROM piezas WHERE torre_id = ? ORDER BY id")
    .all(id) as PiezaEnTorre[];
  return { torre, piezas };
}
