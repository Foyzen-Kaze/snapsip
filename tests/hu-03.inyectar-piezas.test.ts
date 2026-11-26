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

// Cantidades previstas definidas en HU-02 (OBS-1): 4 partes, 10 piezas.
const CANTIDADES_VALIDAS = {
  piso: "2",
  muros_exteriores: "3",
  muros_interiores: "1",
  entrepiso: "0",
  techo: "4",
};

function preparar(rng: () => number = () => 0.01) {
  process.env.DB_PATH = rutaBdPrueba;
  reiniciarBdParaPruebas(rutaBdPrueba);
  ejecutarSeed();
  generadorPlano.generar = (codigo, partes) =>
    new GeneradorPlanoSimulado(rng).generar(codigo, partes);
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
  codigo: string,
  cantidades: Record<string, string> = CANTIDADES_VALIDAS
): Promise<void> {
  const res = await agente.post("/proyectos").type("form").send({
    cliente: `Cliente ${codigo}`,
    codigo,
    metraje: "120",
    ...cantidades,
  });
  expect(res.status).toBe(201);
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
    expect(res.text).toContain("Cantidad prevista");
    expect(res.text).toContain("plano/archivo está simulado");

    const proyecto = fila("SELECT estado FROM proyectos WHERE codigo = ?", "CASA-001");
    expect(proyecto.estado).toBe("En preparación");
    const partes = filas(
      "SELECT nombre, cantidad_prevista FROM partes_casa WHERE proyecto_id = (SELECT id FROM proyectos WHERE codigo = ?) ORDER BY id",
      "CASA-001"
    );
    expect(partes).toEqual([
      { nombre: "Piso", cantidad_prevista: 2 },
      { nombre: "Muros exteriores", cantidad_prevista: 3 },
      { nombre: "Muros interiores", cantidad_prevista: 1 },
      { nombre: "Techo", cantidad_prevista: 4 },
    ]);
    for (const parte of partes) {
      const piezas = filas(
        "SELECT p.codigo, p.estado FROM piezas p JOIN partes_casa pc ON pc.id = p.parte_casa_id WHERE pc.proyecto_id = (SELECT id FROM proyectos WHERE codigo = ?) AND pc.nombre = ?",
        "CASA-001",
        parte.nombre
      );
      expect(piezas).toHaveLength(parte.cantidad_prevista);
      expect(piezas.every((p) => p.estado === "Pendiente")).toBe(true);
    }

    const piezas = filas(
      "SELECT p.codigo FROM piezas p JOIN partes_casa pc ON pc.id = p.parte_casa_id WHERE pc.proyecto_id = (SELECT id FROM proyectos WHERE codigo = ?)",
      "CASA-001"
    );
    expect(piezas).toHaveLength(10);
    expect(piezas.every((p) => /^[A-Z]([1-9]|1[0-9]|2[0-5])$/.test(p.codigo))).toBe(true);
    const codigos = piezas.map((p) => p.codigo);
    expect(new Set(codigos).size).toBe(codigos.length);
    const columnas = filas("PRAGMA table_info(piezas)").map((c) => c.name);
    expect(columnas).toContain("proyecto_id");
    expect(columnas).toContain("estado");
    // HU-05 agrega `torre_id` en la migración 005; HU-03 no asigna ninguna torre (queda nula).
    expect(columnas).toContain("torre_id");
    expect(filas("SELECT * FROM piezas WHERE torre_id IS NOT NULL")).toHaveLength(0);
    // HU-04 crea la tabla `torres` en la migración 004; HU-03 no debe registrar ninguna torre.
    expect(filas("SELECT * FROM torres")).toHaveLength(0);
  });

  it("HU-03 · El universo simulado respeta las cantidades previstas (1–100 piezas)", async () => {
    const configuraciones = [
      {
        piso: "1", muros_exteriores: "0", muros_interiores: "0", entrepiso: "0", techo: "0",
      },
      {
        piso: "5", muros_exteriores: "10", muros_interiores: "15", entrepiso: "20", techo: "25",
      },
      {
        piso: "0", muros_exteriores: "40", muros_interiores: "30", entrepiso: "20", techo: "10",
      },
    ];

    for (const [i, cantidades] of configuraciones.entries()) {
      const app = preparar(() => [0, 0.2, 0.5, 0.999999][i % 4]);
      const agente = await agenteEncargado(app);
      const codigo = `LIM-${i}`;
      await crearProyecto(agente, codigo, cantidades);
      const res = await agente.post(`/proyectos/${codigo}/inyectar-piezas`).type("form");
      expect(res.status).toBe(201);

      const partes = filas(
        "SELECT id, nombre, cantidad_prevista FROM partes_casa WHERE proyecto_id = (SELECT id FROM proyectos WHERE codigo = ?) ORDER BY id",
        codigo
      );
      const piezas = filas(
        "SELECT p.id, p.codigo, p.parte_casa_id FROM piezas p JOIN partes_casa pc ON pc.id = p.parte_casa_id WHERE pc.proyecto_id = (SELECT id FROM proyectos WHERE codigo = ?)",
        codigo
      );
      const total = Object.values(cantidades).reduce((suma, valor) => suma + Number(valor), 0);
      expect(total).toBeGreaterThanOrEqual(1);
      expect(total).toBeLessThanOrEqual(100);
      expect(piezas).toHaveLength(total);
      for (const parte of partes) {
        expect(parte.cantidad_prevista).toBeGreaterThan(0);
        expect(piezas.filter((p) => p.parte_casa_id === parte.id)).toHaveLength(
          parte.cantidad_prevista
        );
      }
      const nombres = partes.map((p) => p.nombre);
      expect(new Set(nombres).size).toBe(nombres.length);
      expect(
        nombres.every((n) =>
          ["Techo", "Muros exteriores", "Muros interiores", "Piso", "Entrepiso"].includes(n)
        )
      ).toBe(true);
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
    const cantidades = {
      piso: "1", muros_exteriores: "0", muros_interiores: "0", entrepiso: "0", techo: "1",
    };
    await crearProyecto(agente, "REP-01", cantidades);
    await crearProyecto(agente, "REP-02", cantidades);

    expect((await agente.post("/proyectos/REP-01/inyectar-piezas").type("form")).status).toBe(201);
    expect((await agente.post("/proyectos/REP-02/inyectar-piezas").type("form")).status).toBe(201);

    for (const codigo of ["REP-01", "REP-02"]) {
      const porParte = filas(
        "SELECT pc.nombre AS parte, p.codigo FROM piezas p JOIN partes_casa pc ON pc.id = p.parte_casa_id WHERE pc.proyecto_id = (SELECT id FROM proyectos WHERE codigo = ?) ORDER BY pc.id",
        codigo
      );
      expect(porParte.map((p) => p.parte)).toEqual(["Piso", "Techo"]);
      expect(porParte.map((p) => p.codigo)).toEqual(["B7", "A3"]);
      expect(new Set(porParte.map((p) => p.codigo)).size).toBe(2);
    }
  });

  it("HU-03 · Un código completo no puede repetirse dentro del mismo proyecto", async () => {
    const app = preparar();
    const agente = await agenteEncargado(app);
    await crearProyecto(agente, "UNICO-01");
    const proyectoId = fila("SELECT id FROM proyectos WHERE codigo = ?", "UNICO-01").id;
    const parteId = fila(
      "SELECT id FROM partes_casa WHERE proyecto_id = ? AND nombre = 'Techo'",
      proyectoId
    ).id;
    const db = obtenerBd();
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
    const partesAntes = filas("SELECT id, nombre, cantidad_prevista FROM partes_casa").length;

    const operario = await agenteConRol(app, "Operario de Bodega");
    const res = await operario.post("/proyectos/ROL-01/inyectar-piezas").type("form");

    expect(res.status).toBe(403);
    expect(res.text).toContain("no autoriza");
    expect(filas("SELECT * FROM piezas")).toHaveLength(0);
    expect(filas("SELECT id, nombre, cantidad_prevista FROM partes_casa")).toHaveLength(partesAntes);
    expect(fila("SELECT estado FROM proyectos WHERE codigo = ?", "ROL-01").estado).toBe(
      "Sin piezas cargadas"
    );
  });

  it("HU-03 · Proyecto sin opción de inyección después de cargar las piezas", async () => {
    const app = preparar();
    const agente = await agenteEncargado(app);
    await crearProyecto(agente, "Y-INYECTADO");
    await crearProyecto(agente, "PENDIENTE-01");

    const listadoAntes = await agente.get("/proyectos");
    expect(
      listadoAntes.text.split("/proyectos/PENDIENTE-01/inyectar-piezas").length - 1
    ).toBe(1);

    await agente.post("/proyectos/Y-INYECTADO/inyectar-piezas").type("form");

    const listado = await agente.get("/proyectos");
    expect(listado.status).toBe(200);
    expect(listado.text).not.toContain("/proyectos/Y-INYECTADO/inyectar-piezas");
    expect(listado.text).toContain("/proyectos/PENDIENTE-01/inyectar-piezas");

    const piezasAntes = filas("SELECT codigo FROM piezas").length;
    const partesAntes = filas("SELECT id, cantidad_prevista FROM partes_casa").length;
    const reintento = await agente.post("/proyectos/Y-INYECTADO/inyectar-piezas").type("form");
    expect(reintento.status).toBe(400);
    expect(reintento.text).toContain("ya tiene piezas inyectadas");
    expect(filas("SELECT codigo FROM piezas")).toHaveLength(piezasAntes);
    expect(filas("SELECT id, cantidad_prevista FROM partes_casa")).toHaveLength(partesAntes);
  });

  it("HU-03 · CA2 adaptado: no existe carga de archivo inválido en la demo", async () => {
    const app = preparar();
    const agente = await agenteEncargado(app);
    await crearProyecto(agente, "CA2-ARCHIVO");

    const listado = await agente.get("/proyectos");
    expect(listado.text).not.toContain('type="file"');
    expect(listado.text).toContain("Plano/archivo simulado (demo)");
    expect(filas("SELECT * FROM piezas")).toHaveLength(0);
    expect(filas("SELECT * FROM partes_casa")).toHaveLength(4);
    expect(fila("SELECT estado FROM proyectos WHERE codigo = ?", "CA2-ARCHIVO").estado).toBe(
      "Sin piezas cargadas"
    );
  });

  it("HU-03 · CA2 adaptado: no se registran piezas parciales en la generación simulada", async () => {
    const app = preparar();
    const agente = await agenteEncargado(app);
    await crearProyecto(agente, "CA2-FILAS");
    const res = await agente.post("/proyectos/CA2-FILAS/inyectar-piezas").type("form");
    expect(res.status).toBe(201);

    const incompletas = filas(
      "SELECT p.id FROM piezas p WHERE p.codigo IS NULL OR p.codigo = '' OR p.estado <> 'Pendiente' OR p.parte_casa_id IS NULL"
    );
    expect(incompletas).toHaveLength(0);
    const partesSinCantidad = filas(
      "SELECT id FROM partes_casa WHERE cantidad_prevista IS NULL OR cantidad_prevista < 1"
    );
    expect(partesSinCantidad).toHaveLength(0);
    const partesConConteoDistinto = filas(
      "SELECT pc.id FROM partes_casa pc LEFT JOIN piezas p ON p.parte_casa_id = pc.id WHERE pc.proyecto_id = (SELECT id FROM proyectos WHERE codigo = ?) GROUP BY pc.id HAVING COUNT(p.id) <> pc.cantidad_prevista",
      "CA2-FILAS"
    );
    expect(partesConConteoDistinto).toHaveLength(0);
  });
});
