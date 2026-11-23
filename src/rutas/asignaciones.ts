import { Response, Router } from "express";
import { requiereRol } from "../middleware/contextoAcceso";
import { FOTOS_DEMO } from "../integraciones";
import {
  asignarPieza,
  consultarTorre,
  listarPiezasParaSelector,
  listarPiezasPendientes,
  listarProyectosParaAsignacion,
  listarTorresDelProyecto,
  ROL_OPERARIO,
} from "../dominio/asignaciones";

export const routerAsignaciones = Router();

function aId(valor: unknown): number | undefined {
  const texto = typeof valor === "string" ? valor.trim() : "";
  if (!/^\d+$/.test(texto)) return undefined;
  const id = Number(texto);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

interface OpcionesListado {
  proyectoId: number | null;
  piezaId: number | null;
  torreId: number | null;
  error: string | null;
}

function renderListado(res: Response, opciones: OpcionesListado, status = 200) {
  const { proyectoId } = opciones;
  return res.status(status).render("asignacion-nueva", {
    titulo: "Asignar pieza a torre",
    proyectos: listarProyectosParaAsignacion(),
    proyectoId,
    piezas: proyectoId !== null ? listarPiezasPendientes(proyectoId) : [],
    piezasSelector: proyectoId !== null ? listarPiezasParaSelector(proyectoId) : [],
    torres: proyectoId !== null ? listarTorresDelProyecto(proyectoId) : [],
    fotos: FOTOS_DEMO,
    piezaId: opciones.piezaId,
    torreId: opciones.torreId,
    error: opciones.error,
  });
}

// HU-05, CU-05, TO-BE Asignar pieza a torre con evidencia: ruta propia del Operario.
routerAsignaciones.get(
  "/piezas/asignar",
  requiereRol([ROL_OPERARIO]),
  (req, res) => {
    return renderListado(res, {
      proyectoId: aId(req.query.proyectoId) ?? null,
      piezaId: null,
      torreId: null,
      error: null,
    });
  }
);

routerAsignaciones.post(
  "/piezas/asignar",
  requiereRol([ROL_OPERARIO]),
  (req, res) => {
    const proyectoId = aId(req.body?.proyectoId) ?? null;
    const piezaId = aId(req.body?.piezaId) ?? null;
    const torreId = aId(req.body?.torreId) ?? null;
    const resultado = asignarPieza(
      piezaId,
      torreId,
      req.body?.fotografia,
      req.body?.confirmar,
      res.locals.rolActual ?? ROL_OPERARIO
    );

    if (resultado.estado === "confirmar") {
      return res.status(200).render("asignacion-confirmar", {
        titulo: "Confirmar reasignación",
        pieza: resultado.pieza,
        torreActual: resultado.torreActual,
        torreDestino: resultado.torreDestino,
        proyectoId,
        fotografia: req.body?.fotografia ?? "",
      });
    }

    if (resultado.estado === "rechazada") {
      return renderListado(
        res,
        { proyectoId, piezaId, torreId, error: resultado.mensaje },
        400
      );
    }

    return res.status(201).render("asignacion-creada", {
      titulo: "Pieza asignada",
      pieza: resultado.pieza,
      torre: resultado.torre,
      evidencia: resultado.evidencia,
    });
  }
);

// CA6: consulta de las piezas de una torre, sin colisionar con /torres/nuevo (HU-04).
routerAsignaciones.get(
  "/torres/consultar/:id",
  requiereRol([ROL_OPERARIO]),
  (req, res) => {
    const consulta = consultarTorre(req.params.id);
    if (!consulta) {
      return res.status(404).render("torre-consultar", {
        titulo: "Consultar torre",
        consulta: null,
        error: "La torre solicitada no existe.",
      });
    }
    return res.status(200).render("torre-consultar", {
      titulo: "Consultar torre",
      consulta,
      error: null,
    });
  }
);
