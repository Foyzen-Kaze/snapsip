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

function selectorDe(html: string, idSelect: string): string {
  const inicio = html.indexOf(`<select id="${idSelect}"`);
  const fin = html.indexOf("</select>", inicio);
  return inicio === -1 || fin === -1 ? "" : html.slice(inicio, fin + "</select>".length);
}

function opcionesDe(html: string, idSelect: string): string[] {
  return Array.from(
    selectorDe(html, idSelect).matchAll(/<option[^>]*>([^<]*)<\/option>/g),
    (m) => m[1].trim()
  );
}

function insertarUniverso(
  codigoProyecto: string,
  cliente = `Cliente ${codigoProyecto}`,
  estado = "En preparación"
) {
  const db = obtenerBd();
  const proyectoId = Number(
    db
      .prepare("INSERT INTO proyectos (codigo, cliente, metraje, estado) VALUES (?, ?, ?, ?)")
      .run(codigoProyecto, cliente, "120", estado).lastInsertRowid
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

  it("HU-06 · Identificar el proyecto por cliente y código — CA3", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    insertarUniverso("PEND-05", "Constructora Norte");
    insertarUniverso("PEND-06", "Inmobiliaria Sur");

    const res = await agente.get("/pendientes");

    expect(res.status).toBe(200);
    expect(opcionesDe(res.text, "proyectoId")).toEqual([
      "-- Seleccione un proyecto --",
      "Constructora Norte (PEND-05)",
      "Inmobiliaria Sur (PEND-06)",
    ]);
    expect(res.text).not.toContain(">PEND-05</option>");
  });

  it.each(["Techo", "Muros exteriores", "Muros interiores", "Piso", "Entrepiso"])(
    "HU-06 · Ofrecer la parte «%s» del proyecto elegido — CA4",
    async (parte) => {
      const agente = await agenteConRol(app, "Operario de Bodega");
      const { proyectoId, crearParte, insertarPieza } = insertarUniverso("PEND-CA4");
      insertarPieza(crearParte(parte), `P-${parte}`);

      const res = await agente.get("/pendientes").query({ proyectoId: String(proyectoId) });

      expect(res.status).toBe(200);
      expect(opcionesDe(res.text, "parteCasaId")).toContain(parte);
    }
  );

  it("HU-06 · Ofrecer únicamente las partes que tiene el proyecto — CA5", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const { proyectoId, crearParte, insertarPieza } = insertarUniverso("PEND-CA5");
    // El proyecto solo tiene estas tres ParteCasa, cada una con al menos una Pieza:
    // «Muros exteriores» y «Piso» no se crean (ParteCasa 1 – 1..* Pieza).
    for (const nombre of ["Muros interiores", "Techo", "Entrepiso"]) {
      insertarPieza(crearParte(nombre), `P-${nombre}`);
    }

    const res = await agente.get("/pendientes").query({ proyectoId: String(proyectoId) });

    expect(res.status).toBe(200);
    expect(opcionesDe(res.text, "parteCasaId")).toEqual([
      "-- Seleccione una parte --",
      "Muros interiores",
      "Techo",
      "Entrepiso",
    ]);
    expect(res.text).not.toContain("Muros exteriores");
    expect(res.text).not.toContain(">Piso</option>");
  });

  it("HU-06 · Proyecto sin piezas cargadas — CA6", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const { proyectoId } = insertarUniverso(
      "PEND-CA6",
      "Cliente Sin Piezas",
      "Sin piezas cargadas"
    );

    const res = await agente.get("/pendientes").query({ proyectoId: String(proyectoId) });

    expect(res.status).toBe(200);
    expect(res.text).toContain("El proyecto no tiene partes de la casa con piezas cargadas");
    expect(opcionesDe(res.text, "parteCasaId")).toEqual(["-- Seleccione una parte --"]);
    expect(res.text).not.toContain("Seleccione un Proyecto y una Parte");
    expect(res.text).not.toContain("0 pendientes");
  });

  it("HU-06 · El selector de Parte se repuebla al cambiar de Proyecto (verificación 2.4)", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const universoUno = insertarUniverso("PEND-CAMBIO-1");
    universoUno.insertarPieza(universoUno.crearParte("Techo"), "P1");
    const universoDos = insertarUniverso("PEND-CAMBIO-2");
    universoDos.insertarPieza(universoDos.crearParte("Entrepiso"), "P2");

    const primero = await agente
      .get("/pendientes")
      .query({ proyectoId: String(universoUno.proyectoId) });
    expect(opcionesDe(primero.text, "parteCasaId")).toEqual([
      "-- Seleccione una parte --",
      "Techo",
    ]);

    const segundo = await agente
      .get("/pendientes")
      .query({ proyectoId: String(universoDos.proyectoId) });
    expect(opcionesDe(segundo.text, "parteCasaId")).toEqual([
      "-- Seleccione una parte --",
      "Entrepiso",
    ]);
  });

  it("HU-06 · El selector de Parte se llena al elegir el Proyecto — CA4/CA5", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const universo = insertarUniverso("PEND-AUTO-1");
    universo.insertarPieza(universo.crearParte("Techo"), "P-TECHO");
    universo.insertarPieza(universo.crearParte("Entrepiso"), "P-ENTREPISO");
    const otro = insertarUniverso("PEND-AUTO-2");
    otro.insertarPieza(otro.crearParte("Piso"), "P-PISO");

    const inicial = await agente.get("/pendientes");
    expect(inicial.status).toBe(200);
    expect(inicial.text).toContain("addEventListener('change'");
    expect(inicial.text).toContain("proyecto.form.submit()");

    const res = await agente.get("/pendientes").query({ proyectoId: String(universo.proyectoId) });
    expect(res.status).toBe(200);
    expect(opcionesDe(res.text, "parteCasaId")).toEqual([
      "-- Seleccione una parte --",
      "Techo",
      "Entrepiso",
    ]);
  });

  it("HU-06 · Cambiar de Proyecto descarta la Parte anterior — CA5", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const universoUno = insertarUniverso("PEND-DESC-1");
    const parteUno = universoUno.crearParte("Techo");
    universoUno.insertarPieza(parteUno, "P1");
    const universoDos = insertarUniverso("PEND-DESC-2");
    universoDos.insertarPieza(universoDos.crearParte("Entrepiso"), "P2");

    const res = await agente.get("/pendientes").query({
      proyectoId: String(universoDos.proyectoId),
      parteCasaId: String(parteUno),
    });

    expect(res.status).toBe(200);
    expect(res.text).toContain("parte.value = ''");
    expect(opcionesDe(res.text, "parteCasaId")).toEqual([
      "-- Seleccione una parte --",
      "Entrepiso",
    ]);
    expect(selectorDe(res.text, "parteCasaId")).not.toContain("selected");
    expect(res.text).not.toContain("Piezas pendientes de");
  });

  it("HU-06 · Proyecto sin piezas cargadas tras elegirlo — CA6", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const { proyectoId } = insertarUniverso(
      "PEND-AUTO-SIN",
      "Cliente Auto Sin Piezas",
      "Sin piezas cargadas"
    );

    const res = await agente.get("/pendientes").query({ proyectoId: String(proyectoId) });

    expect(res.status).toBe(200);
    expect(res.text).toContain("addEventListener('change'");
    expect(res.text).toContain("El proyecto no tiene partes de la casa con piezas cargadas");
    expect(opcionesDe(res.text, "parteCasaId")).toEqual(["-- Seleccione una parte --"]);
    expect(res.text).not.toContain("Seleccione un Proyecto y una Parte");
    expect(res.text).not.toContain("0 pendientes");
  });
});
