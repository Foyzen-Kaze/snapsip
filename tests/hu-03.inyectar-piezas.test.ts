import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import fs from "fs";
import path from "path";
import os from "os";
import { crearApp } from "../src/app";
import { reiniciarBdParaPruebas, cerrarBd, obtenerBd } from "../src/db/conexion";
import { ejecutarSeed } from "../src/db/seed";
import { generadorPlano, GeneradorPlanoSimulado } from "../src/integraciones";

const rutaBdPrueba = path.join(os.tmpdir(), `snapsip-hu03-test-${process.pid}.db`);
const generarOriginal = generadorPlano.generar;

function preparar(rng: () => number = () => 0.01) {
  process.env.DB_PATH = rutaBdPrueba;
  reiniciarBdParaPruebas(rutaBdPrueba);
  ejecutarSeed();
  generadorPlano.generar = (codigo) => new GeneradorPlanoSimulado(rng).generar(codigo);
  return crearApp();
}

async function agenteConRol(app: ReturnType<typeof crearApp>, rol: string) {
  const agente = request.agent(app);
  await agente.post("/acceso/rol").type("form").send({ rol });
  return agente;
}

function agenteEncargado(app: ReturnType<typeof crearApp>) {
  return agenteConRol(app, "Encargado de Despacho");
}

async function crearProyecto(
  agente: ReturnType<typeof request.agent>,
  codigo: string
): Promise<void> {
  await agente.post("/proyectos").type("form").send({
    cliente: `Cliente ${codigo}`,
    codigo,
    metraje: "120",
  });
}

function filas(sql: string, ...args: unknown[]): any[] {
  return obtenerBd().prepare(sql).all(...args) as any[];
}

function fila(sql: string, ...args: unknown[]): any {
  return obtenerBd().prepare(sql).get(...args) as any;
}

describe("HU-03 · Inyectar piezas desde plano/archivo", () => {
  beforeEach(() => {
    preparar();
  });

  afterAll(() => {
    generadorPlano.generar = generarOriginal;
    cerrarBd();
    if (fs.existsSync(rutaBdPrueba)) fs.unlinkSync(rutaBdPrueba);
  });

  it("HU-03 · Inyección de piezas desde un archivo válido (simulado en la demo) — CA1", async () => {
    const app = preparar();
    const agente = await agenteEncargado(app);
    await crearProyecto(agente, "CASA-001");

    const res = await agente.post("/proyectos/CASA-001/inyectar-piezas").type("form");

    expect(res.status).toBe(201);
    expect(res.text).toContain("Piezas inyectadas");
    expect(res.text).toContain("Se crearon");
    expect(res.text).toContain("Pendiente");
    expect(res.text).toContain("sin torre asignada");
    expect(res.text).toContain("En preparación");
    expect(res.text).toContain("plano/archivo está simulado");

    const proyecto = fila("SELECT estado FROM proyectos WHERE codigo = ?", "CASA-001");
    expect(proyecto.estado).toBe("En preparación");
    const piezas = filas(
      "SELECT p.codigo, p.estado, pc.nombre AS parte FROM piezas p JOIN partes_casa pc ON pc.id = p.parte_casa_id WHERE pc.proyecto_id = (SELECT id FROM proyectos WHERE codigo = ?)",
      "CASA-001"
    );
    expect(piezas.length).toBeGreaterThan(0);
    expect(piezas.every((p) => p.estado === "Pendiente")).toBe(true);
    expect(piezas.every((p) => p.parte.length > 0)).toBe(true);
    expect(piezas.every((p) => /^[A-Z]([1-9]|1[0-9]|2[0-5])$/.test(p.codigo))).toBe(true);
    const codigos = piezas.map((p) => p.codigo);
    expect(new Set(codigos).size).toBe(codigos.length);
    const columnas = filas("PRAGMA table_info(piezas)").map((c) => c.name);
    expect(columnas).toContain("proyecto_id");
    expect(columnas).toContain("estado");
    expect(columnas).not.toContain("torre_id");
    expect(filas("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'torres'")).toHaveLength(0);
  });

  it("HU-03 · Universo simulado generado dentro de los límites acordados", async () => {
    const valoresRng = [0, 0.2, 0.5, 0.999999];
    for (const [i, valor] of valoresRng.entries()) {
      const app = preparar(() => valor);
      const agente = await agenteEncargado(app);
      const codigo = `LIM-${i}`;
      await crearProyecto(agente, codigo);
      await agente.post(`/proyectos/${codigo}/inyectar-piezas`).type("form");

      const partes = filas(
        "SELECT id, nombre FROM partes_casa WHERE proyecto_id = (SELECT id FROM proyectos WHERE codigo = ?)",
        codigo
      );
      const piezas = filas(
        "SELECT p.id, p.codigo, p.parte_casa_id FROM piezas p JOIN partes_casa pc ON pc.id = p.parte_casa_id WHERE pc.proyecto_id = (SELECT id FROM proyectos WHERE codigo = ?)",
        codigo
      );
      expect(partes.length).toBeGreaterThanOrEqual(1);
      expect(partes.length).toBeLessThanOrEqual(5);
      expect(piezas.length).toBeLessThanOrEqual(100);
      expect(partes.length).toBeLessThan(piezas.length);
      for (const parte of partes) {
        expect(piezas.filter((p) => p.parte_casa_id === parte.id).length).toBeGreaterThanOrEqual(1);
      }
      const nombres = partes.map((p) => p.nombre);
      expect(new Set(nombres).size).toBe(nombres.length);
      expect(nombres.every((n) =>
        ["Techo", "Muros exteriores", "Muros interiores", "Piso", "Entrepiso"].includes(n)
      )).toBe(true);
      const codigos = piezas.map((p) => p.codigo);
      expect(new Set(codigos).size).toBe(codigos.length);
      expect(codigos.every((c) => /^[A-Z]([1-9]|1[0-9]|2[0-5])$/.test(c))).toBe(true);
    }
  });

  it("HU-03 · Códigos repetibles en proyectos distintos (generador fijo)", async () => {
    const app = preparar();
    generadorPlano.generar = () => ({
      partes: [
        { nombre: "Techo", piezas: [{ codigo: "A3" }] },
        { nombre: "Piso", piezas: [{ codigo: "B7" }] },
      ],
    });
    const agente = await agenteEncargado(app);
    await crearProyecto(agente, "REP-01");
    await crearProyecto(agente, "REP-02");

    expect((await agente.post("/proyectos/REP-01/inyectar-piezas").type("form")).status).toBe(201);
    expect((await agente.post("/proyectos/REP-02/inyectar-piezas").type("form")).status).toBe(201);

    for (const codigo of ["REP-01", "REP-02"]) {
      const codigos = filas(
        "SELECT p.codigo FROM piezas p JOIN partes_casa pc ON pc.id = p.parte_casa_id WHERE pc.proyecto_id = (SELECT id FROM proyectos WHERE codigo = ?)",
        codigo
      ).map((p) => p.codigo);
      expect(codigos).toEqual(["A3", "B7"]);
      expect(new Set(codigos).size).toBe(codigos.length);
    }
  });

  it("HU-03 · Un código completo no puede repetirse dentro del mismo proyecto", async () => {
    const app = preparar();
    const agente = await agenteEncargado(app);
    await crearProyecto(agente, "UNICO-01");
    const proyectoId = fila("SELECT id FROM proyectos WHERE codigo = ?", "UNICO-01").id;
    const db = obtenerBd();
    const parteId = Number(
      db.prepare("INSERT INTO partes_casa (proyecto_id, nombre) VALUES (?, ?)").run(proyectoId, "Techo").lastInsertRowid
    );
    const insertarPieza = db.prepare(
      "INSERT INTO piezas (proyecto_id, parte_casa_id, codigo, estado) VALUES (?, ?, ?, 'Pendiente')"
    );
    insertarPieza.run(proyectoId, parteId, "A3");
    expect(() => insertarPieza.run(proyectoId, parteId, "A3")).toThrow(/UNIQUE constraint failed/);
  });

  it("HU-03 · Rechazo de un intento de inyección por otro rol (HU-01 CA3)", async () => {
    const app = preparar();
    const encargado = await agenteEncargado(app);
    await crearProyecto(encargado, "ROL-01");

    const operario = await agenteConRol(app, "Operario de Bodega");
    const res = await operario.post("/proyectos/ROL-01/inyectar-piezas").type("form");

    expect(res.status).toBe(403);
    expect(res.text).toContain("no autoriza");
    expect(filas("SELECT * FROM partes_casa")).toHaveLength(0);
    expect(filas("SELECT * FROM piezas")).toHaveLength(0);
    expect(fila("SELECT estado FROM proyectos WHERE codigo = ?", "ROL-01").estado).toBe(
      "Sin piezas cargadas"
    );
  });

  it("HU-03 · Proyecto sin opción de inyección después de cargar las piezas", async () => {
    const app = preparar();
    const agente = await agenteEncargado(app);
    await crearProyecto(agente, "Y-INYECTADO");
    await crearProyecto(agente, "PENDIENTE-01");
    await agente.post("/proyectos/Y-INYECTADO/inyectar-piezas").type("form");

    const listado = await agente.get("/proyectos");
    expect(listado.status).toBe(200);
    expect(listado.text).not.toContain("/proyectos/Y-INYECTADO/inyectar-piezas");
    expect(listado.text).toContain("/proyectos/PENDIENTE-01/inyectar-piezas");

    const antes = filas("SELECT codigo FROM piezas").length;
    const reintento = await agente.post("/proyectos/Y-INYECTADO/inyectar-piezas").type("form");
    expect(reintento.status).toBe(400);
    expect(reintento.text).toContain("ya tiene piezas inyectadas");
    expect(filas("SELECT codigo FROM piezas")).toHaveLength(antes);
  });

  it("HU-03 · CA2 adaptado: no existe carga de archivo inválido en la demo", async () => {
    const app = preparar();
    const agente = await agenteEncargado(app);
    await crearProyecto(agente, "CA2-ARCHIVO");

    const listado = await agente.get("/proyectos");
    expect(listado.text).not.toContain('type="file"');
    expect(listado.text).toContain("Plano/archivo simulado (demo)");
    expect(filas("SELECT * FROM piezas")).toHaveLength(0);
    expect(fila("SELECT estado FROM proyectos WHERE codigo = ?", "CA2-ARCHIVO").estado).toBe(
      "Sin piezas cargadas"
    );
  });

  it("HU-03 · CA2 adaptado: no se registran piezas parciales en la generación simulada", async () => {
    const app = preparar();
    const agente = await agenteEncargado(app);
    await crearProyecto(agente, "CA2-FILAS");
    await agente.post("/proyectos/CA2-FILAS/inyectar-piezas").type("form");

    const incompletas = filas(
      "SELECT p.id FROM piezas p WHERE p.codigo IS NULL OR p.codigo = '' OR p.estado <> 'Pendiente' OR p.parte_casa_id IS NULL"
    );
    expect(incompletas).toHaveLength(0);
    const partesSinPiezas = filas(
      "SELECT pc.id FROM partes_casa pc LEFT JOIN piezas p ON p.parte_casa_id = pc.id WHERE pc.proyecto_id = (SELECT id FROM proyectos WHERE codigo = ?) GROUP BY pc.id HAVING COUNT(p.id) = 0",
      "CA2-FILAS"
    );
    expect(partesSinPiezas).toHaveLength(0);
  });
});
