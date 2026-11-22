import { Router } from "express";
import { requiereRol } from "../middleware/contextoAcceso";
import {
  consultarPiezasPendientes,
  listarPartesPorProyecto,
  listarProyectosParaConsulta,
} from "../dominio/pendientes";

export const routerPendientes = Router();

function aId(valor: unknown): number | undefined {
  const texto = typeof valor === "string" ? valor.trim() : "";
  if (!/^\d+$/.test(texto)) return undefined;
  const id = Number(texto);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

// HU-06, CU-06, TO-BE Consultar piezas pendientes
routerPendientes.get(
  "/pendientes",
  requiereRol(["Operario de Bodega"]),
  (req, res) => {
    const proyectos = listarProyectosParaConsulta();
    const proyectoId = aId(req.query.proyectoId);
    const parteCasaId = aId(req.query.parteCasaId);
    const partes = proyectoId !== undefined ? listarPartesPorProyecto(proyectoId) : [];
    const parteElegida = partes.find((parte) => parte.id === parteCasaId);
    const haySeleccion = parteElegida !== undefined;
    const piezas = haySeleccion ? consultarPiezasPendientes(proyectoId!, parteCasaId!) : [];

    return res.render("pendientes", {
      titulo: "Consultar piezas pendientes",
      proyectos,
      partes,
      proyectoId: proyectoId ?? null,
      parteCasaId: parteCasaId ?? null,
      parteElegida: parteElegida ?? null,
      haySeleccion,
      piezas,
    });
  }
);
