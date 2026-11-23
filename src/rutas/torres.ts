import { Router } from "express";
import { requiereRol } from "../middleware/contextoAcceso";
import {
  crearTorre,
  listarPartesDelProyecto,
  listarProyectosParaTorre,
} from "../dominio/torres";

export const routerTorres = Router();

function aId(valor: unknown): number | undefined {
  const texto = typeof valor === "string" ? valor.trim() : "";
  if (!/^\d+$/.test(texto)) return undefined;
  const id = Number(texto);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

// HU-04, CU-04, TO-BE Crear torre: ruta propia del Operario (no /proyectos, que es del Encargado).
routerTorres.get(
  "/torres/nuevo",
  requiereRol(["Operario de Bodega"]),
  (req, res) => {
    const proyectos = listarProyectosParaTorre();
    const proyectoId = aId(req.query.proyectoId);
    const partes = proyectoId !== undefined ? listarPartesDelProyecto(proyectoId) : [];
    const parteCasaId = aId(req.query.parteCasaId);
    const parteElegida = partes.find((parte) => parte.id === parteCasaId);

    return res.render("torre-nuevo", {
      titulo: "Crear torre",
      proyectos,
      partes,
      proyectoId: proyectoId ?? null,
      parteCasaId: parteElegida?.id ?? null,
      error: null as string | null,
    });
  }
);

routerTorres.post(
  "/torres",
  requiereRol(["Operario de Bodega"]),
  (req, res) => {
    const resultado = crearTorre(req.body?.proyectoId, req.body?.parteCasaId);
    if (!resultado.ok) {
      const proyectos = listarProyectosParaTorre();
      const proyectoId = aId(req.body?.proyectoId);
      const partes = proyectoId !== undefined ? listarPartesDelProyecto(proyectoId) : [];
      return res.status(400).render("torre-nuevo", {
        titulo: "Crear torre",
        proyectos,
        partes,
        proyectoId: proyectoId ?? null,
        parteCasaId: aId(req.body?.parteCasaId) ?? null,
        error: resultado.mensaje,
      });
    }

    return res.status(201).render("torre-creada", {
      titulo: "Torre creada",
      torre: resultado.torre,
      proyecto: resultado.proyecto,
      parte: resultado.parte,
    });
  }
);
