import { obtenerBd } from "../db/conexion";

// HU-06, CU-06, TO-BE Consultar piezas pendientes
export const ESTADO_SIN_PIEZAS_CARGADAS = "Sin piezas cargadas";

export interface ProyectoParaSelector {
  id: number;
  codigo: string;
  cliente: string;
  estado: string;
}

export interface ParteCasaParaSelector {
  id: number;
  proyecto_id: number;
  nombre: string;
}

export interface PiezaPendiente {
  codigo: string;
  estado: string;
}

export function listarProyectosParaConsulta(): ProyectoParaSelector[] {
  return obtenerBd()
    .prepare("SELECT id, codigo, cliente, estado FROM proyectos ORDER BY id")
    .all() as ProyectoParaSelector[];
}

// HU-06 CA6: el estado «Sin piezas cargadas» es un atributo de Proyecto (modelo de dominio), no de EST-01.
export function proyectoEstaSinPiezas(
  proyecto: ProyectoParaSelector | undefined
): boolean {
  return proyecto?.estado === ESTADO_SIN_PIEZAS_CARGADAS;
}

export function listarPartesPorProyecto(proyectoId: number): ParteCasaParaSelector[] {
  // HU-06 CA4/CA5: solo partes con piezas cargadas, sin filtrar por estado de la pieza (CA2).
  return obtenerBd()
    .prepare(
      "SELECT pc.id, pc.proyecto_id, pc.nombre FROM partes_casa pc WHERE pc.proyecto_id = ? AND EXISTS (SELECT 1 FROM piezas p WHERE p.parte_casa_id = pc.id AND p.proyecto_id = pc.proyecto_id) ORDER BY pc.id"
    )
    .all(proyectoId) as ParteCasaParaSelector[];
}

export function consultarPiezasPendientes(
  proyectoId: number,
  parteCasaId: number
): PiezaPendiente[] {
  const db = obtenerBd();
  const parte = db
    .prepare("SELECT id FROM partes_casa WHERE id = ? AND proyecto_id = ?")
    .get(parteCasaId, proyectoId) as { id: number } | undefined;
  if (!parte) return [];

  return db
    .prepare(
      "SELECT p.codigo, p.estado FROM piezas p JOIN partes_casa pc ON pc.id = p.parte_casa_id WHERE pc.proyecto_id = ? AND pc.id = ? AND p.estado = 'Pendiente' ORDER BY p.id"
    )
    .all(proyectoId, parteCasaId) as PiezaPendiente[];
}
