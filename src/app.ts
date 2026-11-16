import express from "express";
import path from "path";
import { contextoAcceso } from "./middleware/contextoAcceso";
import { routerAcceso } from "./rutas/acceso";
import { routerOperaciones } from "./rutas/operaciones";

// HU-01, CU-01, TO-BE Autenticación de usuarios: app web con selector de rol de demostración
export function crearApp() {
  const app = express();
  app.locals.contadorOperacionesProtegidas = 0;

  app.set("view engine", "ejs");
  app.set("views", path.join(process.cwd(), "src", "vistas"));

  app.use(express.urlencoded({ extended: false }));
  app.use(contextoAcceso);

  app.use(routerAcceso);
  app.use(routerOperaciones);

  return app;
}

export const app = crearApp();
