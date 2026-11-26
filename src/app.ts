import express from "express";
import path from "path";
import { contextoAcceso } from "./middleware/contextoAcceso";
import { routerAcceso } from "./rutas/acceso";
import { routerOperaciones } from "./rutas/operaciones";
import { routerProyectos } from "./rutas/proyectos";
import { routerPendientes } from "./rutas/pendientes";
import { routerTorres } from "./rutas/torres";
import { routerAsignaciones } from "./rutas/asignaciones";
import { routerAprobaciones } from "./rutas/aprobaciones";

// HU-01, CU-01, TO-BE Autenticación de usuarios: app web con selector de rol de demostración
// HU-02, CU-02, TO-BE Crear proyecto: registro de proyectos (Encargado de Despacho)
export function crearApp() {
  const app = express();
  app.locals.contadorOperacionesProtegidas = 0;

  app.set("view engine", "ejs");
  app.set("views", path.join(process.cwd(), "src", "vistas"));

  app.use(express.urlencoded({ extended: false }));
  app.use(contextoAcceso);

  app.use(routerAcceso);
  app.use(routerOperaciones);
  app.use(routerProyectos);
  // HU-06, CU-06, TO-BE Consultar piezas pendientes
  app.use(routerPendientes);
  // HU-04, CU-04, TO-BE Crear torre
  app.use(routerTorres);
  // HU-05, CU-05, TO-BE Asignar pieza a torre con evidencia
  app.use(routerAsignaciones);
  // HU-12, CU-12, TO-BE Crear proyecto: aprobación/rechazo por el Supervisor
  app.use(routerAprobaciones);

  return app;
}

export const app = crearApp();
