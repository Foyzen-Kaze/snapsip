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

// OBS-1: todas las puntas de creación envían las cinco cantidades previstas.
const CANTIDADES_VALIDAS = {
  piso: "2",
  muros_exteriores: "3",
  muros_interiores: "1",
  entrepiso: "0",
  techo: "4",
};

function filas(sql: string, ...args: unknown[]): any[] {
  return obtenerBd().prepare(sql).all(...args) as any[];
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
    // DADO que el encargado dispone del cliente, código, metraje y las cinco cantidades
    const app = preparar();
    const agente = await agenteEncargado(app);

    // CUANDO solicita crear el proyecto con esos datos
    const res = await agente.post("/proyectos").type("form").send({
      cliente: "Cliente A",
      codigo: "CASA-001",
      metraje: "120",
      ...CANTIDADES_VALIDAS,
    });

    // ENTONCES el sistema registra el proyecto y crea las partes con cantidad positiva
    expect(res.status).toBe(201);
    expect(res.text).toContain("Cliente A");
    expect(res.text).toContain("CASA-001");
    expect(res.text).toContain("120");
    expect(res.text).toContain("Pendiente de aprobación");
    expect(res.text).toContain("4 (definidas al crear el proyecto)");
    expect(res.text).toContain("0 (sin piezas registradas)");
    expect(res.text).toContain("<td>Piso</td>");
    expect(res.text).toContain("<td>Muros exteriores</td>");
    expect(res.text).toContain("<td>Techo</td>");
    expect(res.text).not.toContain("<td>Entrepiso</td>");

    const fila = obtenerBd()
      .prepare("SELECT cliente, codigo, metraje, estado FROM proyectos WHERE codigo = ?")
      .get("CASA-001") as any;
    expect(fila).toBeTruthy();
    expect(fila.cliente).toBe("Cliente A");
    expect(fila.metraje).toBe("120");
    expect(fila.estado).toBe("Pendiente de aprobación");

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
    expect(
      filas(
        "SELECT p.id FROM piezas p JOIN partes_casa pc ON pc.id = p.parte_casa_id WHERE pc.proyecto_id = (SELECT id FROM proyectos WHERE codigo = ?)",
        "CASA-001"
      )
    ).toHaveLength(0);
  });

  it("HU-02 · Rechazo de un código de proyecto duplicado (CA2)", async () => {
    const app = preparar();
    const agente = await agenteEncargado(app);
    await agente.post("/proyectos").type("form").send({
      cliente: "Cliente Original",
      codigo: "DUP-01",
      metraje: "100",
      ...CANTIDADES_VALIDAS,
    });

    const res = await agente.post("/proyectos").type("form").send({
      cliente: "Otro Cliente",
      codigo: "DUP-01",
      metraje: "200",
      ...CANTIDADES_VALIDAS,
    });

    expect(res.status).toBe(400);
    expect(res.text).toContain("código está duplicado");
    const filasProyecto = filas(
      "SELECT cliente, codigo, metraje, estado FROM proyectos WHERE codigo = ?",
      "DUP-01"
    );
    expect(filasProyecto).toHaveLength(1);
    expect(filasProyecto[0].cliente).toBe("Cliente Original");
    expect(filasProyecto[0].metraje).toBe("100");
    // El rechazo no agrega partes ni piezas al proyecto existente.
    expect(
      filas(
        "SELECT id FROM partes_casa WHERE proyecto_id = (SELECT id FROM proyectos WHERE codigo = ?)",
        "DUP-01"
      )
    ).toHaveLength(4);
  });

  it("HU-02 · Rechazo de la creación de una torre antes de inyectar las piezas (CA3)", async () => {
    const app = preparar();
    const agente = await agenteEncargado(app);
    await agente.post("/proyectos").type("form").send({
      cliente: "Cliente Torre",
      codigo: "TORRE-CA3",
      metraje: "80",
      piso: "1",
      muros_exteriores: "0",
      muros_interiores: "0",
      entrepiso: "0",
      techo: "0",
    });

    const proyecto = obtenerBd()
      .prepare("SELECT codigo, estado FROM proyectos WHERE codigo = ?")
      .get("TORRE-CA3") as any;
    expect(proyecto).toBeTruthy();
    expect(proyecto.estado).toBe("Pendiente de aprobación");

    const conteos = obtenerBd()
      .prepare(
        "SELECT (SELECT COUNT(*) FROM partes_casa WHERE proyecto_id = (SELECT id FROM proyectos WHERE codigo = ?)) AS partes, (SELECT COUNT(*) FROM piezas p JOIN partes_casa pc ON pc.id = p.parte_casa_id WHERE pc.proyecto_id = (SELECT id FROM proyectos WHERE codigo = ?)) AS piezas"
      )
      .get("TORRE-CA3", "TORRE-CA3") as any;
    expect(conteos.partes).toBe(1);
    expect(conteos.piezas).toBe(0);

    const listado = await agente.get("/proyectos");
    expect(listado.status).toBe(200);
    expect(listado.text).toContain("TORRE-CA3");
    expect(listado.text).toContain("Pendiente de aprobación");
  });

  it("HU-02 · Rechazo por cantidades de partes inválidas (CA4)", async () => {
    const casosInvalidos = [
      { ...CANTIDADES_VALIDAS, piso: "-1" },
      { ...CANTIDADES_VALIDAS, piso: "1.5" },
      { ...CANTIDADES_VALIDAS, piso: "abc" },
      { piso: "0", muros_exteriores: "0", muros_interiores: "0", entrepiso: "0", techo: "0" },
      { piso: "50", muros_exteriores: "51", muros_interiores: "0", entrepiso: "0", techo: "0" },
    ];

    for (const [i, cantidades] of casosInvalidos.entries()) {
      const app = preparar();
      const agente = await agenteEncargado(app);
      const codigo = `INVALIDA-${i}`;
      const res = await agente.post("/proyectos").type("form").send({
        cliente: "Cliente inválido",
        codigo,
        metraje: "100",
        ...cantidades,
      });

      expect(res.status).toBe(400);
      expect(res.text).toContain(
        "Las cantidades de las partes deben ser enteros no negativos y el total debe estar entre 1 y 100."
      );
      expect(
        obtenerBd().prepare("SELECT id FROM proyectos WHERE codigo = ?").get(codigo)
      ).toBeUndefined();
      expect(filas("SELECT id FROM partes_casa")).toHaveLength(0);
    }
  });
});
