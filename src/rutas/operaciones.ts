import { Router } from "express";
import { requiereRol } from "../middleware/contextoAcceso";

export const routerOperaciones = Router();

// HU-01 CA3: operación protegida de ejemplo (placeholder) - solo Encargado de Despacho
// Al ejecutarse correctamente modifica un contador de ejemplo; si se rechaza, no se modifica.
routerOperaciones.get(
  "/operaciones/despacho/ejemplo",
  requiereRol(["Encargado de Despacho"]),
  (req, res) => {
    req.app.locals.contadorOperacionesProtegidas =
      (req.app.locals.contadorOperacionesProtegidas || 0) + 1;
    res.render("operacion-ejemplo", {
      titulo: "Operación protegida de ejemplo",
      mensaje:
        "Operación protegida ejecutada correctamente (Encargado de Despacho).",
      contador: req.app.locals.contadorOperacionesProtegidas,
    });
  }
);
