import { Router } from "express";
import { requiereRol } from "../middleware/contextoAcceso";
import { crearProyecto, listarProyectos } from "../dominio/proyectos";

export const routerProyectos = Router();

// HU-02, CU-02, TO-BE Crear proyecto: acceso restringido a Encargado de Despacho
routerProyectos.get(
  "/proyectos",
  requiereRol(["Encargado de Despacho"]),
  (_req, res) => {
    const proyectos = listarProyectos();
    res.render("proyectos", {
      titulo: "Proyectos",
      proyectos,
    });
  }
);

routerProyectos.get(
  "/proyectos/nuevo",
  requiereRol(["Encargado de Despacho"]),
  (_req, res) => {
    res.render("proyecto-nuevo", {
      titulo: "Crear proyecto",
      valores: { codigo: "", cliente: "", metraje: "" },
      error: null as string | null,
    });
  }
);

routerProyectos.post(
  "/proyectos",
  requiereRol(["Encargado de Despacho"]),
  (req, res) => {
    const valores = {
      codigo: typeof req.body?.codigo === "string" ? req.body.codigo : "",
      cliente: typeof req.body?.cliente === "string" ? req.body.cliente : "",
      metraje: typeof req.body?.metraje === "string" ? req.body.metraje : "",
    };
    const resultado = crearProyecto(valores);
    if (!resultado.ok) {
      return res.status(400).render("proyecto-nuevo", {
        titulo: "Crear proyecto",
        valores,
        error: resultado.mensaje,
      });
    }
    return res.status(201).render("proyecto-creado", {
      titulo: "Proyecto creado",
      proyecto: resultado.proyecto,
    });
  }
);
