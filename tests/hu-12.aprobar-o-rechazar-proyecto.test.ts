import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import fs from "fs";
import path from "path";
import os from "os";
import { crearApp } from "../src/app";
import { reiniciarBdParaPruebas, cerrarBd, obtenerBd } from "../src/db/conexion";
import { ejecutarSeed } from "../src/db/seed";

const rutaBdPrueba = path.join(os.tmpdir(), `snapsip-hu12-test-${process.pid}.db`);
const CANTIDADES_VALIDAS = {
  piso: "2",
  muros_exteriores: "3",
  muros_interiores: "1",
  entrepiso: "0",
  techo: "4",
};

function preparar() {
  process.env.DB_PATH = rutaBdPrueba;
  reiniciarBdParaPruebas(rutaBdPrueba);
  ejecutarSeed();
  return crearApp();
}

async function agenteConRol(app: ReturnType<typeof crearApp>, rol: string) {
  const agente = request.agent(app);
  await agente.post("/acceso/rol").type("form").send({ rol });
  return agente;
}

function fila(sql: string, ...args: unknown[]): any {
  return obtenerBd().prepare(sql).get(...args) as any;
}

function filas(sql: string, ...args: unknown[]): any[] {
  return obtenerBd().prepare(sql).all(...args) as any[];
}

async function crearProyectoPendiente(
  agente: ReturnType<typeof request.agent>,
  codigo: string
) {
  const res = await agente.post("/proyectos").type("form").send({
    cliente: `Cliente ${codigo}`,
    codigo,
    metraje: "120",
    ...CANTIDADES_VALIDAS,
  });
  expect(res.status).toBe(201);
  return fila("SELECT id, estado FROM proyectos WHERE codigo = ?", codigo);
}

describe("HU-12 · Aprobar o rechazar proyecto", () => {
  let app: ReturnType<typeof crearApp>;

  beforeEach(() => {
    app = preparar();
  });

  afterAll(() => {
    cerrarBd();
    if (fs.existsSync(rutaBdPrueba)) fs.unlinkSync(rutaBdPrueba);
  });

  it("HU-02 · Un proyecto recién creado queda «Pendiente de aprobación»", async () => {
    const agente = await agenteConRol(app, "Encargado de Despacho");
    const proyecto = await crearProyectoPendiente(agente, "HU12-PENDIENTE");

    expect(proyecto.estado).toBe("Pendiente de aprobación");
    expect(filas("SELECT * FROM piezas WHERE proyecto_id = ?", proyecto.id)).toHaveLength(0);
  });

  it("HU-12 · CA1: el Supervisor aprueba un proyecto pendiente y queda «Aprobado»", async () => {
    const encargado = await agenteConRol(app, "Encargado de Despacho");
    const proyecto = await crearProyectoPendiente(encargado, "HU12-APROBADO");
    const supervisor = await agenteConRol(app, "Supervisor de Proyectos");

    const listado = await supervisor.get("/aprobaciones");
    expect(listado.status).toBe(200);
    expect(listado.text).toContain("HU12-APROBADO");
    expect(listado.text).toContain('action="/aprobaciones/' + proyecto.id + '/aprobar"');

    const res = await supervisor
      .post(`/aprobaciones/${proyecto.id}/aprobar`)
      .type("form");

    expect(res.status).toBe(200);
    expect(res.text).toContain("fue aprobado");
    expect(fila("SELECT estado FROM proyectos WHERE id = ?", proyecto.id).estado).toBe("Aprobado");
    expect(filas("SELECT * FROM piezas WHERE proyecto_id = ?", proyecto.id)).toHaveLength(0);
  });

  it("HU-12 · CA2: el Supervisor rechaza un proyecto pendiente y queda «Rechazado»", async () => {
    const encargado = await agenteConRol(app, "Encargado de Despacho");
    const proyecto = await crearProyectoPendiente(encargado, "HU12-RECHAZADO");
    const supervisor = await agenteConRol(app, "Supervisor de Proyectos");

    const listado = await supervisor.get("/aprobaciones");
    expect(listado.text).toContain('action="/aprobaciones/' + proyecto.id + '/rechazar"');

    const res = await supervisor
      .post(`/aprobaciones/${proyecto.id}/rechazar`)
      .type("form");

    expect(res.status).toBe(200);
    expect(res.text).toContain("fue rechazado");
    expect(fila("SELECT estado FROM proyectos WHERE id = ?", proyecto.id).estado).toBe("Rechazado");
    expect(filas("SELECT * FROM piezas WHERE proyecto_id = ?", proyecto.id)).toHaveLength(0);
  });

  it("HU-12 · CA3: aprobar o rechazar un proyecto ya aprobado conserva el estado y los datos", async () => {
    const encargado = await agenteConRol(app, "Encargado de Despacho");
    const proyecto = await crearProyectoPendiente(encargado, "HU12-YA-APROBADO");
    const supervisor = await agenteConRol(app, "Supervisor de Proyectos");
    await supervisor.post(`/aprobaciones/${proyecto.id}/aprobar`).type("form");

    const antes = fila("SELECT * FROM proyectos WHERE id = ?", proyecto.id);
    const resRechazar = await supervisor
      .post(`/aprobaciones/${proyecto.id}/rechazar`)
      .type("form");
    const despuesRechazo = fila("SELECT * FROM proyectos WHERE id = ?", proyecto.id);
    const resAprobar = await supervisor
      .post(`/aprobaciones/${proyecto.id}/aprobar`)
      .type("form");
    const despuesAprobacion = fila("SELECT * FROM proyectos WHERE id = ?", proyecto.id);

    expect(resRechazar.status).toBe(400);
    expect(resAprobar.status).toBe(400);
    expect(resRechazar.text).toContain("No se modificaron datos");
    expect(despuesRechazo).toEqual(antes);
    expect(despuesAprobacion).toEqual(antes);
    expect(despuesAprobacion.estado).toBe("Aprobado");
  });

  it("HU-12 · CA3: approve/rechazo sobre un proyecto rechazado conserva el estado y los datos", async () => {
    const encargado = await agenteConRol(app, "Encargado de Despacho");
    const proyecto = await crearProyectoPendiente(encargado, "HU12-YA-RECHAZADO");
    const supervisor = await agenteConRol(app, "Supervisor de Proyectos");
    await supervisor.post(`/aprobaciones/${proyecto.id}/rechazar`).type("form");

    const antes = fila("SELECT * FROM proyectos WHERE id = ?", proyecto.id);
    const resAprobar = await supervisor
      .post(`/aprobaciones/${proyecto.id}/aprobar`)
      .type("form");
    const despues = fila("SELECT * FROM proyectos WHERE id = ?", proyecto.id);

    expect(resAprobar.status).toBe(400);
    expect(resAprobar.text).toContain("No se modificaron datos");
    expect(despues).toEqual(antes);
    expect(despues.estado).toBe("Rechazado");
  });

  it("HU-12 · CA4: un proyecto inexistente no se modifica", async () => {
    const supervisor = await agenteConRol(app, "Supervisor de Proyectos");
    const totalAntes = filas("SELECT * FROM proyectos").length;

    const res = await supervisor.post("/aprobaciones/999999/aprobar").type("form");

    expect(res.status).toBe(404);
    expect(res.text).toContain("No existe el proyecto solicitado");
    expect(filas("SELECT * FROM proyectos")).toHaveLength(totalAntes);
  });

  it("HU-12 · CA4: un rol distinto del Supervisor no puede decidir", async () => {
    const encargado = await agenteConRol(app, "Encargado de Despacho");
    const operario = await agenteConRol(app, "Operario de Bodega");
    const proyecto = await crearProyectoPendiente(encargado, "HU12-SIN-PERMISO");

    for (const agente of [encargado, operario]) {
      const listado = await agente.get("/aprobaciones");
      expect(listado.status).toBe(403);
      const res = await agente
        .post(`/aprobaciones/${proyecto.id}/aprobar`)
        .type("form");
      expect(res.status).toBe(403);
    }
    expect(fila("SELECT estado FROM proyectos WHERE id = ?", proyecto.id).estado).toBe(
      "Pendiente de aprobación"
    );
  });

  it("HU-12 · CA4: sin rol de demostración no se concede acceso a /aprobaciones", async () => {
    const res = await request(app).get("/aprobaciones");

    expect(res.status).toBe(401);
    expect(filas("SELECT * FROM proyectos")).toHaveLength(0);
  });

  it("HU-12 · CA1: el Encargado no tiene acceso a /aprobaciones", async () => {
    const agente = await agenteConRol(app, "Encargado de Despacho");

    const res = await agente.get("/aprobaciones");

    expect(res.status).toBe(403);
  });
});
