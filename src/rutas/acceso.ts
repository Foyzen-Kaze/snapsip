import { Router } from "express";
import { esRolValido, ROLES_DEMO } from "../acceso/roles";
import { establecerRol } from "../middleware/contextoAcceso";

export const routerAcceso = Router();

// HU-01: selector de rol de demostración (GET /)
routerAcceso.get("/", (_req, res) => {
  res.render("inicio", {
    titulo: "SnapSip - Acceso",
  });
});

// HU-01: establecer/cambiar rol de demostración
routerAcceso.post("/acceso/rol", (req, res) => {
  const rol = typeof req.body?.rol === "string" ? req.body.rol : undefined;
  if (!esRolValido(rol)) {
    return res.status(400).render("inicio", {
      titulo: "SnapSip - Acceso",
      error: "Seleccione un rol de demostración válido.",
    });
  }
  establecerRol(res, rol);
  res.redirect("/");
});
