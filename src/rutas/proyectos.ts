import { Router } from "express";
import { requiereRol } from "../middleware/contextoAcceso";
import { crearProyecto, listarProyectos } from "../dominio/proyectos";
import { inyectarPiezasDesdePlano } from "../dominio/piezas";

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

// HU-03, CU-03, TO-BE Inyectar piezas desde plano/archivo: acción simulada del Encargado de Despacho
routerProyectos.post(
  "/proyectos/:codigo/inyectar-piezas",
  requiereRol(["Encargado de Despacho"]),
  (req, res) => {
    const codigo = String(req.params.codigo);
    const resultado = inyectarPiezasDesdePlano(codigo);
    if (!resultado.ok) {
      return res.status(400).render("inyeccion-resultado", {
        titulo: "No se pudo inyectar piezas",
        universo: null,
        error: resultado.mensaje,
      });
    }
    return res.status(201).render("inyeccion-resultado", {
      titulo: "Piezas inyectadas",
      universo: resultado.universo,
      error: null as string | null,
    });
  }
);
