import { Response, Router } from "express";
import { requiereRol } from "../middleware/contextoAcceso";
import {
  aprobarProyecto,
  listarProyectos,
  rechazarProyecto,
  ResultadoDecisionProyecto,
} from "../dominio/proyectos";

// HU-12, CU-12, RP-17, EST-04: el Supervisor de Proyectos decide sobre los
// proyectos en «Pendiente de aprobación». /proyectos sigue siendo solo del Encargado.
export const routerAprobaciones = Router();

const ROL_SUPERVISOR = ["Supervisor de Proyectos"] as const;

function contexto() {
  return { titulo: "Aprobar o rechazar proyectos", proyectos: listarProyectos() };
}

function responder(
  res: Response,
  resultado: ResultadoDecisionProyecto,
  accion: "aprobado" | "rechazado"
) {
  if (resultado.ok) {
    return res.status(200).render("aprobaciones", {
      ...contexto(),
      mensaje: `El proyecto «${resultado.proyecto.codigo}» fue ${accion}. Estado actual: «${resultado.proyecto.estado}».`,
    });
  }
  const estado = resultado.motivo === "ESTADO_INVALIDO" ? 400 : 404;
  return res.status(estado).render("aprobaciones", {
    ...contexto(),
    error: resultado.mensaje,
  });
}

routerAprobaciones.get(
  "/aprobaciones",
  requiereRol([...ROL_SUPERVISOR]),
  (_req, res) => {
    res.render("aprobaciones", contexto());
  }
);

routerAprobaciones.post(
  "/aprobaciones/:id/aprobar",
  requiereRol([...ROL_SUPERVISOR]),
  (req, res) => {
    responder(res, aprobarProyecto(req.params.id), "aprobado");
  }
);

routerAprobaciones.post(
  "/aprobaciones/:id/rechazar",
  requiereRol([...ROL_SUPERVISOR]),
  (req, res) => {
    responder(res, rechazarProyecto(req.params.id), "rechazado");
  }
);
