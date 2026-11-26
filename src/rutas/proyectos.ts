import { Router } from "express";
import { requiereRol } from "../middleware/contextoAcceso";
import {
  crearProyecto,
  listarPartesDeProyecto,
  listarProyectos,
  PARTES_CASA,
} from "../dominio/proyectos";
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
      valores: {
        codigo: "",
        cliente: "",
        metraje: "",
        ...Object.fromEntries(PARTES_CASA.map((parte) => [parte.campo, "0"])),
      },
      partes: PARTES_CASA,
      error: null as string | null,
    });
  }
);

routerProyectos.post(
  "/proyectos",
  requiereRol(["Encargado de Despacho"]),
  (req, res) => {
    const valores: Record<string, string> = {
      codigo: typeof req.body?.codigo === "string" ? req.body.codigo : "",
      cliente: typeof req.body?.cliente === "string" ? req.body.cliente : "",
      metraje: typeof req.body?.metraje === "string" ? req.body.metraje : "",
    };
    for (const parte of PARTES_CASA) {
      valores[parte.campo] =
        typeof req.body?.[parte.campo] === "string" ? req.body[parte.campo] : "0";
    }
    const resultado = crearProyecto(valores);
    if (!resultado.ok) {
      return res.status(400).render("proyecto-nuevo", {
        titulo: "Crear proyecto",
        valores,
        partes: PARTES_CASA,
        error: resultado.mensaje,
      });
    }
    return res.status(201).render("proyecto-creado", {
      titulo: "Proyecto creado",
      proyecto: resultado.proyecto,
      partes: listarPartesDeProyecto(resultado.proyecto.codigo),
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
