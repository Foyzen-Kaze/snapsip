import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import fs from "fs";
import path from "path";
import os from "os";
import { crearApp } from "../src/app";
import { reiniciarBdParaPruebas, cerrarBd, obtenerBd } from "../src/db/conexion";
import { ejecutarSeed } from "../src/db/seed";
import { VARIABLE_FALLO_EVIDENCIA } from "../src/integraciones";

const rutaBdPrueba = path.join(os.tmpdir(), `snapsip-hu05-test-${process.pid}.db`);

function preparar() {
  process.env.DB_PATH = rutaBdPrueba;
  delete process.env[VARIABLE_FALLO_EVIDENCIA];
  reiniciarBdParaPruebas(rutaBdPrueba);
  ejecutarSeed();
  return crearApp();
}

async function agenteConRol(app: ReturnType<typeof crearApp>, rol: string) {
  const agente = request.agent(app);
  await agente.post("/acceso/rol").type("form").send({ rol });
  return agente;
}

function filas(sql: string, ...args: unknown[]): any[] {
  return obtenerBd().prepare(sql).all(...args) as any[];
}

function fila(sql: string, ...args: unknown[]): any {
  return obtenerBd().prepare(sql).get(...args) as any;
}

// 3.1 Datos de ejemplo; el estado «Enviado» se inserta directamente (HU-09 no implementada).
function insertarUniverso(codigo: string) {
  const db = obtenerBd();
  const proyectoId = Number(
    db
      .prepare(
        "INSERT INTO proyectos (codigo, cliente, metraje, estado) VALUES (?, ?, ?, 'En preparación')"
      )
      .run(codigo, `Cliente ${codigo}`, "120").lastInsertRowid
  );

  function crearParte(nombre: string): number {
    return Number(
      db.prepare("INSERT INTO partes_casa (proyecto_id, nombre) VALUES (?, ?)").run(proyectoId, nombre)
        .lastInsertRowid
    );
  }

  function crearPieza(parteCasaId: number, codigoPieza: string, estado = "Pendiente"): number {
    return Number(
      db
        .prepare(
          "INSERT INTO piezas (proyecto_id, parte_casa_id, codigo, estado) VALUES (?, ?, ?, ?)"
        )
        .run(proyectoId, parteCasaId, codigoPieza, estado).lastInsertRowid
    );
  }

  function crearTorre(parteCasaId: number, estado = "Abierta"): number {
    const numero = Number(
      (db
        .prepare("SELECT COALESCE(MAX(numero), 0) + 1 AS n FROM torres WHERE proyecto_id = ?")
        .get(proyectoId) as any).n
    );
    return Number(
      db
        .prepare(
          "INSERT INTO torres (proyecto_id, parte_casa_id, codigo, numero, estado) VALUES (?, ?, ?, ?, ?)"
        )
        .run(proyectoId, parteCasaId, `TOR-${codigo}-${numero}`, numero, estado).lastInsertRowid
    );
  }

  return { proyectoId, crearParte, crearPieza, crearTorre };
}

describe("HU-05 · Asignar pieza a torre con evidencia", () => {
  let app: ReturnType<typeof crearApp>;

  beforeEach(() => {
    app = preparar();
  });

  afterAll(() => {
    delete process.env[VARIABLE_FALLO_EVIDENCIA];
    cerrarBd();
    if (fs.existsSync(rutaBdPrueba)) fs.unlinkSync(rutaBdPrueba);
  });

  it("HU-05 · Listado de piezas pendientes y torres del proyecto con código, parte y estado", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const universo = insertarUniverso("LISTADO-01");
    const techo = universo.crearParte("Techo");
    const piso = universo.crearParte("Piso");
    universo.crearPieza(techo, "A1");
    universo.crearPieza(piso, "B1");
    universo.crearTorre(techo, "Abierta");
    universo.crearTorre(techo, "Cerrada");
    universo.crearTorre(piso, "Abierta");

    const res = await agente.get("/piezas/asignar").query({ proyectoId: String(universo.proyectoId) });

    expect(res.status).toBe(200);
    expect(res.text).toContain("A1");
    expect(res.text).toContain("B1");
    expect(res.text).toContain("Techo");
    expect(res.text).toContain("Piso");
    expect(res.text).toContain("Pendiente");
    expect(res.text).toContain("TOR-LISTADO-01-1");
    expect(res.text).toContain("TOR-LISTADO-01-2");
    expect(res.text).toContain("TOR-LISTADO-01-3");
    expect(res.text).toContain("Abierta");
    expect(res.text).toContain("Cerrada");
    expect(res.text.match(/name="fotografia"/g) ?? []).toHaveLength(3);
    expect(res.text).not.toContain("checked");
  });

  it("HU-05 · Asignación de una pieza pendiente", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const universo = insertarUniverso("ASIGNAR-01");
    const techo = universo.crearParte("Techo");
    const piezaId = universo.crearPieza(techo, "A1");
    const torreId = universo.crearTorre(techo);

    const res = await agente.post("/piezas/asignar").type("form").send({
      proyectoId: String(universo.proyectoId),
      piezaId: String(piezaId),
      torreId: String(torreId),
      fotografia: "foto-1",
    });

    expect(res.status).toBe(201);
    expect(res.text).toContain("TOR-ASIGNAR-01-1");
    expect(res.text).toContain("Listo");
    expect(res.text).toContain("demo/foto-1.jpg");
    expect(res.text).toContain("Operario de Bodega");
    const pieza = fila("SELECT * FROM piezas WHERE id = ?", piezaId);
    expect(pieza.estado).toBe("Listo");
    expect(pieza.torre_id).toBe(torreId);
    const evidencia = fila("SELECT * FROM evidencias WHERE pieza_id = ?", piezaId);
    expect(evidencia.fotografia).toBe("demo/foto-1.jpg");
    expect(evidencia.responsable).toBe("Operario de Bodega");
    expect(evidencia.fecha_hora_captura).toBeTruthy();
    expect(evidencia.vigente).toBe(1);
  });

  it("HU-05 · Rechazo de una asignación sin evidencia", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const universo = insertarUniverso("SIN-FOTO");
    const techo = universo.crearParte("Techo");
    const piezaId = universo.crearPieza(techo, "A1");
    const torreId = universo.crearTorre(techo);

    const res = await agente.post("/piezas/asignar").type("form").send({
      proyectoId: String(universo.proyectoId),
      piezaId: String(piezaId),
      torreId: String(torreId),
    });

    expect(res.status).toBe(400);
    expect(res.text).toContain("se exige evidencia fotográfica");
    expect(res.text.match(/name="fotografia"/g) ?? []).toHaveLength(3);
    expect(res.text).not.toContain("checked");
    expect(fila("SELECT * FROM piezas WHERE id = ?", piezaId).estado).toBe("Pendiente");
    expect(fila("SELECT * FROM piezas WHERE id = ?", piezaId).torre_id).toBeNull();
    expect(filas("SELECT * FROM evidencias")).toHaveLength(0);
  });

  it("HU-04 · Rechazo de una pieza de otra parte de la casa", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const universo = insertarUniverso("OTRA-PARTE");
    const techo = universo.crearParte("Techo");
    const piso = universo.crearParte("Piso");
    const piezaId = universo.crearPieza(techo, "A1");
    const torreId = universo.crearTorre(piso);

    const res = await agente.post("/piezas/asignar").type("form").send({
      proyectoId: String(universo.proyectoId),
      piezaId: String(piezaId),
      torreId: String(torreId),
      fotografia: "foto-1",
    });

    expect(res.status).toBe(400);
    expect(res.text).toContain("la torre no corresponde a la parte de la pieza");
    expect(fila("SELECT * FROM piezas WHERE id = ?", piezaId).estado).toBe("Pendiente");
    expect(fila("SELECT * FROM piezas WHERE id = ?", piezaId).torre_id).toBeNull();
    expect(filas("SELECT * FROM evidencias")).toHaveLength(0);
  });

  it("HU-04 · Rechazo de una pieza nueva en una torre cerrada", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const universo = insertarUniverso("TORRE-CERRADA");
    const techo = universo.crearParte("Techo");
    const piezaId = universo.crearPieza(techo, "A1");
    const torreId = universo.crearTorre(techo, "Cerrada");

    const res = await agente.post("/piezas/asignar").type("form").send({
      proyectoId: String(universo.proyectoId),
      piezaId: String(piezaId),
      torreId: String(torreId),
      fotografia: "foto-1",
    });

    expect(res.status).toBe(400);
    expect(res.text).toContain("se sugiere registrar otra torre para la parte");
    expect(fila("SELECT * FROM piezas WHERE id = ?", piezaId).estado).toBe("Pendiente");
    expect(fila("SELECT * FROM piezas WHERE id = ?", piezaId).torre_id).toBeNull();
    expect(fila("SELECT * FROM torres WHERE id = ?", torreId).estado).toBe("Cerrada");
    expect(filas("SELECT * FROM evidencias")).toHaveLength(0);
  });

  it("HU-05 · Rechazo de la reasignación de una pieza enviada", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const universo = insertarUniverso("ENVIADA-01");
    const techo = universo.crearParte("Techo");
    const piezaId = universo.crearPieza(techo, "A1", "Enviado");
    const torreId = universo.crearTorre(techo);

    const res = await agente.post("/piezas/asignar").type("form").send({
      proyectoId: String(universo.proyectoId),
      piezaId: String(piezaId),
      torreId: String(torreId),
      fotografia: "foto-1",
    });

    expect(res.status).toBe(400);
    expect(res.text).toContain("una pieza enviada no puede reasignarse");
    const pieza = fila("SELECT * FROM piezas WHERE id = ?", piezaId);
    expect(pieza.estado).toBe("Enviado");
    expect(pieza.torre_id).toBeNull();
    expect(filas("SELECT * FROM evidencias")).toHaveLength(0);
  });

  it("HU-05 · Rechazo por falla del servicio de almacenamiento de evidencias", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const universo = insertarUniverso("FALLO-EVID");
    const techo = universo.crearParte("Techo");
    const piezaId = universo.crearPieza(techo, "A1");
    const torreId = universo.crearTorre(techo);
    process.env[VARIABLE_FALLO_EVIDENCIA] = "1";

    try {
      const res = await agente.post("/piezas/asignar").type("form").send({
        proyectoId: String(universo.proyectoId),
        piezaId: String(piezaId),
        torreId: String(torreId),
        fotografia: "foto-1",
      });

      expect(res.status).toBe(400);
      expect(res.text).toContain("la evidencia no pudo almacenarse");
      expect(fila("SELECT * FROM piezas WHERE id = ?", piezaId).estado).toBe("Pendiente");
      expect(fila("SELECT * FROM piezas WHERE id = ?", piezaId).torre_id).toBeNull();
      expect(filas("SELECT * FROM evidencias")).toHaveLength(0);
    } finally {
      delete process.env[VARIABLE_FALLO_EVIDENCIA];
    }
  });

  it("HU-05 · Reasignación confirmada a otra torre", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const universo = insertarUniverso("REASIG-01");
    const techo = universo.crearParte("Techo");
    const piezaId = universo.crearPieza(techo, "A1");
    const torreUno = universo.crearTorre(techo);
    const torreDos = universo.crearTorre(techo);
    const datos = (torreId: number, opcion: string, confirmar?: string) => ({
      proyectoId: String(universo.proyectoId),
      piezaId: String(piezaId),
      torreId: String(torreId),
      fotografia: opcion,
      ...(confirmar ? { confirmar } : {}),
    });

    expect((await agente.post("/piezas/asignar").type("form").send(datos(torreUno, "foto-1"))).status).toBe(201);
    const res = await agente
      .post("/piezas/asignar")
      .type("form")
      .send(datos(torreDos, "foto-2", "1"));

    expect(res.status).toBe(201);
    expect(res.text).toContain("TOR-REASIG-01-2");
    const pieza = fila("SELECT * FROM piezas WHERE id = ?", piezaId);
    expect(pieza.estado).toBe("Listo");
    expect(pieza.torre_id).toBe(torreDos);
    const evidencias = filas("SELECT * FROM evidencias WHERE pieza_id = ? ORDER BY id", piezaId);
    expect(evidencias).toHaveLength(2);
    expect(evidencias.map((e) => e.vigente)).toEqual([0, 1]);
    expect(evidencias.map((e) => e.fotografia)).toEqual(["demo/foto-1.jpg", "demo/foto-2.jpg"]);
    expect(filas("SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE '%guia%'")).toHaveLength(0);
  });

  it("HU-05 · Reasignación no confirmada", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const universo = insertarUniverso("REASIG-02");
    const techo = universo.crearParte("Techo");
    const piezaId = universo.crearPieza(techo, "A1");
    const torreUno = universo.crearTorre(techo);
    const torreDos = universo.crearTorre(techo);
    const comunes = {
      proyectoId: String(universo.proyectoId),
      piezaId: String(piezaId),
      fotografia: "foto-2",
    };

    expect(
      (
        await agente
          .post("/piezas/asignar")
          .type("form")
          .send({ ...comunes, torreId: String(torreUno) })
      ).status
    ).toBe(201);
    const res = await agente
      .post("/piezas/asignar")
      .type("form")
      .send({ ...comunes, torreId: String(torreDos) });

    expect(res.status).toBe(200);
    expect(res.text).toContain("Confirmar reasignación");
    expect(res.text).toContain("TOR-REASIG-02-1");
    expect(res.text).toContain("TOR-REASIG-02-2");
    expect(fila("SELECT * FROM piezas WHERE id = ?", piezaId).torre_id).toBe(torreUno);
    const evidencias = filas("SELECT * FROM evidencias WHERE pieza_id = ?", piezaId);
    expect(evidencias).toHaveLength(1);
    expect(evidencias[0].vigente).toBe(1);
    expect(evidencias[0].fotografia).toBe("demo/foto-2.jpg");
  });

  it("HU-05 · Consulta de las piezas de una torre", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const universo = insertarUniverso("CONSULTA-01");
    const techo = universo.crearParte("Techo");
    const piezaId = universo.crearPieza(techo, "A1");
    universo.crearPieza(techo, "A2");
    const torreId = universo.crearTorre(techo);

    await agente.post("/piezas/asignar").type("form").send({
      proyectoId: String(universo.proyectoId),
      piezaId: String(piezaId),
      torreId: String(torreId),
      fotografia: "foto-1",
    });
    const res = await agente.get(`/torres/consultar/${torreId}`);

    expect(res.status).toBe(200);
    expect(res.text).toContain("TOR-CONSULTA-01-1");
    expect(res.text).toContain("Techo");
    expect(res.text).toContain("A1");
    expect(res.text).toContain("Listo");
    expect(res.text).not.toContain(">A2<");
    expect(fila("SELECT * FROM piezas WHERE codigo = 'A2'").estado).toBe("Pendiente");
    expect(filas("SELECT * FROM evidencias")).toHaveLength(1);
  });

  it("HU-05 · Rechazo por rol no autorizado", async () => {
    const universo = insertarUniverso("CONFIDENCIAL");
    const techo = universo.crearParte("Techo");
    const piezaId = universo.crearPieza(techo, "A1");
    const torreId = universo.crearTorre(techo);
    const encargado = await agenteConRol(app, "Encargado de Despacho");

    const listado = await encargado.get("/piezas/asignar");
    const consulta = await encargado.get(`/torres/consultar/${torreId}`);
    const asignacion = await encargado.post("/piezas/asignar").type("form").send({
      proyectoId: String(universo.proyectoId),
      piezaId: String(piezaId),
      torreId: String(torreId),
      fotografia: "foto-1",
    });

    expect(listado.status).toBe(403);
    expect(consulta.status).toBe(403);
    expect(asignacion.status).toBe(403);
    for (const res of [listado, consulta, asignacion]) {
      expect(res.text).toContain("no autoriza");
      expect(res.text).not.toContain("CONFIDENCIAL");
      expect(res.text).not.toContain("TOR-");
      expect(res.text).not.toContain("demo/foto");
    }
    expect(fila("SELECT * FROM piezas WHERE id = ?", piezaId).estado).toBe("Pendiente");
    expect(filas("SELECT * FROM evidencias")).toHaveLength(0);
  });
});
