import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import fs from "fs";
import path from "path";
import os from "os";
import { crearApp } from "../src/app";
import { reiniciarBdParaPruebas, cerrarBd, obtenerBd } from "../src/db/conexion";
import { ejecutarSeed } from "../src/db/seed";

const rutaBdPrueba = path.join(os.tmpdir(), `snapsip-hu02-test-${process.pid}.db`);

function preparar() {
  process.env.DB_PATH = rutaBdPrueba;
  reiniciarBdParaPruebas(rutaBdPrueba);
  ejecutarSeed();
  return crearApp();
}

async function agenteEncargado(app: ReturnType<typeof crearApp>) {
  const agente = request.agent(app);
  await agente.post("/acceso/rol").type("form").send({ rol: "Encargado de Despacho" });
  return agente;
}

describe("HU-02 · Crear proyecto", () => {
  beforeEach(() => {
    preparar();
  });

  afterAll(() => {
    cerrarBd();
    if (fs.existsSync(rutaBdPrueba)) fs.unlinkSync(rutaBdPrueba);
  });

  it("HU-02 · Creación de un proyecto con código único (CA1)", async () => {
    // DADO que el encargado de despacho dispone del cliente, el código y el metraje del proyecto
    // Y el código no pertenece a otro proyecto
    const app = preparar();
    const agente = await agenteEncargado(app);

    // CUANDO solicita crear el proyecto con esos datos
    const res = await agente.post("/proyectos").type("form").send({
      cliente: "Cliente A",
      codigo: "CASA-001",
      metraje: "120",
    });

    // ENTONCES el sistema registra el proyecto asociado al cliente
    expect(res.status).toBe(201);
    expect(res.text).toContain("Cliente A");
    expect(res.text).toContain("CASA-001");
    expect(res.text).toContain("120");
    // Y conserva el código y el metraje indicados / establece su estado en "Sin piezas cargadas"
    expect(res.text).toContain("Sin piezas cargadas");
    // Y el proyecto queda sin partes de la casa ni piezas registradas
    expect(res.text).toContain("sin partes registradas");
    expect(res.text).toContain("sin piezas registradas");

    const fila = obtenerBd()
      .prepare("SELECT cliente, codigo, metraje, estado FROM proyectos WHERE codigo = ?")
      .get("CASA-001") as any;
    expect(fila).toBeTruthy();
    expect(fila.cliente).toBe("Cliente A");
    expect(fila.metraje).toBe("120");
    expect(fila.estado).toBe("Sin piezas cargadas");
  });

  it("HU-02 · Rechazo de un código de proyecto duplicado (CA2)", async () => {
    // DADO que existe un proyecto registrado con un determinado código
    const app = preparar();
    const agente = await agenteEncargado(app);
    await agente.post("/proyectos").type("form").send({
      cliente: "Cliente Original",
      codigo: "DUP-01",
      metraje: "100",
    });

    // CUANDO el encargado de despacho solicita crear otro proyecto con ese mismo código
    const res = await agente.post("/proyectos").type("form").send({
      cliente: "Otro Cliente",
      codigo: "DUP-01",
      metraje: "200",
    });

    // ENTONCES el sistema rechaza la solicitud y comunica que el código está duplicado
    expect(res.status).toBe(400);
    expect(res.text).toContain("código está duplicado");
    // Y conserva el proyecto existente sin modificaciones
    const filas = obtenerBd()
      .prepare("SELECT cliente, codigo, metraje, estado FROM proyectos WHERE codigo = ?")
      .all("DUP-01") as any[];
    expect(filas.length).toBe(1);
    expect(filas[0].cliente).toBe("Cliente Original");
    expect(filas[0].metraje).toBe("100");
  });

  it("HU-02 · Rechazo de la creación de una torre antes de inyectar las piezas (CA3)", async () => {
    // DADO que un proyecto se encuentra en estado "Sin piezas cargadas" (creado vía HU-02)
    const app = preparar();
    const agente = await agenteEncargado(app);
    await agente.post("/proyectos").type("form").send({
      cliente: "Cliente Torre",
      codigo: "TORRE-CA3",
      metraje: "80",
    });

    // CUANDO el operario de bodega solicita crear una torre en ese proyecto (interacción de CU-04/HU-04)
    // ENTONCES (alcance HU-02): el proyecto permanece en estado "Sin piezas cargadas" y sin partes/piezas registradas,
    // condición previa que HU-04 utilizará para rechazar la creación de torres e informar que primero deben inyectarse las piezas.
    // La verificación de la operación de rechazo de torre se implementará en HU-04.
    const proyecto = obtenerBd()
      .prepare("SELECT codigo, estado FROM proyectos WHERE codigo = ?")
      .get("TORRE-CA3") as any;
    expect(proyecto).toBeTruthy();
    expect(proyecto.estado).toBe("Sin piezas cargadas");

    // Sin partes de la casa ni piezas registradas (HU-02 no crea tablas de ParteCasa/Pieza; el proyecto no tiene partes/piezas)
    const tablas = obtenerBd()
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('partes_casa','piezas')"
      )
      .all() as any[];
    expect(tablas.length).toBe(0);

    // Evidencia adicional en UI: listado muestra 0 partes y 0 piezas
    const listado = await agente.get("/proyectos");
    expect(listado.status).toBe(200);
    expect(listado.text).toContain("TORRE-CA3");
    expect(listado.text).toContain("Sin piezas cargadas");
  });
});
