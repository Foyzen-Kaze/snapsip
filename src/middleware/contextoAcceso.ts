import { Request, Response, NextFunction } from "express";
import { esRolValido, RolDemo, funcionesPorRol, ROLES_DEMO } from "../acceso/roles";

declare module "express-serve-static-core" {
  interface Locals {
    rolActual?: RolDemo;
    funcionesHabilitadas: string[];
    rolesDemo: readonly string[];
  }
}

function leerCookie(req: Request, nombre: string): string | undefined {
  const header = req.headers.cookie;
  if (!header) return undefined;
  const partes = header.split(";").map((p) => p.trim());
  for (const p of partes) {
    const idx = p.indexOf("=");
    if (idx === -1) continue;
    const k = p.slice(0, idx).trim();
    if (k === nombre) return decodeURIComponent(p.slice(idx + 1));
  }
  return undefined;
}

// HU-01: contexto de acceso por rol de demostración (selector, sin autenticación real)
export function contextoAcceso(req: Request, res: Response, next: NextFunction) {
  const rol = leerCookie(req, "rol_demo");
  res.locals.rolesDemo = ROLES_DEMO;
  if (esRolValido(rol)) {
    res.locals.rolActual = rol;
    res.locals.funcionesHabilitadas = funcionesPorRol(rol);
  } else {
    res.locals.rolActual = undefined;
    res.locals.funcionesHabilitadas = [];
  }
  next();
}

export function establecerRol(res: Response, rol: RolDemo) {
  res.setHeader(
    "Set-Cookie",
    `rol_demo=${encodeURIComponent(rol)}; Path=/; HttpOnly; SameSite=Lax`
  );
}

export function requiereRol(rolesPermitidos: RolDemo[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const rol = res.locals.rolActual;
    if (!rol) {
      return res.status(401).render("acceso-requerido", {
        mensaje: "Debe establecer un rol de demostración para acceder a funciones protegidas.",
        titulo: "Acceso requerido",
      });
    }
    if (!rolesPermitidos.includes(rol)) {
      // HU-01 CA3: rechazar sin modificar datos
      return res.status(403).render("acceso-denegado", {
        mensaje:
          "Su rol no autoriza esta operación protegida. La solicitud fue rechazada y no se modificaron datos.",
        titulo: "Acceso denegado",
      });
    }
    next();
  };
}
