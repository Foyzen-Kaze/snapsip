import { obtenerBd } from "../db/conexion";

// HU-06, CU-06, TO-BE Consultar piezas pendientes
export interface ProyectoParaSelector {
  id: number;
  codigo: string;
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
    .prepare("SELECT id, codigo FROM proyectos ORDER BY id")
    .all() as ProyectoParaSelector[];
}

export function listarPartesPorProyecto(proyectoId: number): ParteCasaParaSelector[] {
  return obtenerBd()
    .prepare("SELECT id, proyecto_id, nombre FROM partes_casa WHERE proyecto_id = ? ORDER BY id")
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
