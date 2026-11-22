import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import fs from "fs";
import path from "path";
import os from "os";
import { crearApp } from "../src/app";
import { reiniciarBdParaPruebas, cerrarBd, obtenerBd } from "../src/db/conexion";
import { ejecutarSeed } from "../src/db/seed";

const rutaBdPrueba = path.join(os.tmpdir(), `snapsip-hu06-test-${process.pid}.db`);

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

function insertarUniverso(codigoProyecto: string) {
  const db = obtenerBd();
  const proyectoId = Number(
    db
      .prepare(
        "INSERT INTO proyectos (codigo, cliente, metraje, estado) VALUES (?, ?, ?, 'En preparación')"
      )
      .run(codigoProyecto, `Cliente ${codigoProyecto}`, "120").lastInsertRowid
  );
  const crearParte = (nombre: string): number =>
    Number(
      db
        .prepare("INSERT INTO partes_casa (proyecto_id, nombre) VALUES (?, ?)")
        .run(proyectoId, nombre).lastInsertRowid
    );
  const insertarPieza = (parteCasaId: number, codigo: string, estado = "Pendiente") =>
    db
      .prepare(
        "INSERT INTO piezas (proyecto_id, parte_casa_id, codigo, estado) VALUES (?, ?, ?, ?)"
      )
      .run(proyectoId, parteCasaId, codigo, estado);
  return { proyectoId, crearParte, insertarPieza };
}

describe("HU-06 · Consultar piezas pendientes", () => {
  let app: ReturnType<typeof crearApp>;

  beforeEach(() => {
    app = preparar();
  });

  afterAll(() => {
    cerrarBd();
    if (fs.existsSync(rutaBdPrueba)) fs.unlinkSync(rutaBdPrueba);
  });

  it("HU-06 · Consulta de una parte de la casa con piezas pendientes — CA1", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const { proyectoId, crearParte, insertarPieza } = insertarUniverso("PEND-01");
    const techo = crearParte("Techo");
    const piso = crearParte("Piso");
    insertarPieza(techo, "A3");
    insertarPieza(techo, "B7");
    insertarPieza(piso, "C9");
    insertarPieza(techo, "D4", "Listo");

    const res = await agente.get("/pendientes").query({
      proyectoId: String(proyectoId),
      parteCasaId: String(techo),
    });

    expect(res.status).toBe(200);
    expect(res.text).toContain("Piezas pendientes de Techo");
    expect(res.text).toContain("A3");
    expect(res.text).toContain("B7");
    expect(res.text).toContain("sin torre asignada");
    expect(res.text).not.toContain("C9");
    expect(res.text).not.toContain("D4");
    expect(res.text).not.toContain("0 pendientes");
  });

  it("HU-06 · Consulta de una parte de la casa sin piezas pendientes — CA2", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const { proyectoId, crearParte, insertarPieza } = insertarUniverso("PEND-02");
    const piso = crearParte("Piso");
    insertarPieza(piso, "D4", "Listo");

    const res = await agente.get("/pendientes").query({
      proyectoId: String(proyectoId),
      parteCasaId: String(piso),
    });

    expect(res.status).toBe(200);
    expect(res.text).toContain("0 pendientes para Piso");
    expect(res.text).not.toContain("D4");
  });

  it("HU-06 · Sin Proyecto o ParteCasa elegidos se pide la selección", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const { proyectoId } = insertarUniverso("PEND-03");

    const sinNada = await agente.get("/pendientes");
    expect(sinNada.status).toBe(200);
    expect(sinNada.text).toContain("Seleccione un Proyecto y una Parte de la casa");
    expect(sinNada.text).not.toContain("0 pendientes");

    const soloProyecto = await agente.get("/pendientes").query({
      proyectoId: String(proyectoId),
    });
    expect(soloProyecto.status).toBe(200);
    expect(soloProyecto.text).toContain("Seleccione un Proyecto y una Parte de la casa");
    expect(soloProyecto.text).not.toContain("0 pendientes");
  });

  it("HU-06 · Rechazo por rol no autorizado sin revelar piezas (HU-01 CA3)", async () => {
    const { proyectoId, crearParte, insertarPieza } = insertarUniverso("PEND-04");
    const techo = crearParte("Techo");
    insertarPieza(techo, "A3");
    const agente = await agenteConRol(app, "Encargado de Despacho");

    const res = await agente.get("/pendientes").query({
      proyectoId: String(proyectoId),
      parteCasaId: String(techo),
    });

    expect(res.status).toBe(403);
    expect(res.text).toContain("no autoriza");
    expect(res.text).not.toContain("A3");
  });
});
