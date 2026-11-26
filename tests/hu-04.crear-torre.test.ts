import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import fs from "fs";
import path from "path";
import os from "os";
import { crearApp } from "../src/app";
import { reiniciarBdParaPruebas, cerrarBd, obtenerBd } from "../src/db/conexion";
import { ejecutarSeed } from "../src/db/seed";

const rutaBdPrueba = path.join(os.tmpdir(), `snapsip-hu04-test-${process.pid}.db`);

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

function filas(sql: string, ...args: unknown[]): any[] {
  return obtenerBd().prepare(sql).all(...args) as any[];
}

function fila(sql: string, ...args: unknown[]): any {
  return obtenerBd().prepare(sql).get(...args) as any;
}

// 3.1 Datos de ejemplo: proyecto en preparación, proyecto sin piezas y proyecto ajeno con su parte.
// Ninguna ParteCasa se crea sin al menos una Pieza (08-modelo-dominio.md:22).
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
  const crearParte = (nombre: string): number => {
    const parteCasaId = Number(
      db.prepare("INSERT INTO partes_casa (proyecto_id, nombre) VALUES (?, ?)").run(proyectoId, nombre)
        .lastInsertRowid
    );
    db.prepare(
      "INSERT INTO piezas (proyecto_id, parte_casa_id, codigo, estado) VALUES (?, ?, ?, 'Pendiente')"
    ).run(proyectoId, parteCasaId, `P-${nombre}`);
    return parteCasaId;
  };
  return { proyectoId, crearParte };
}

describe("HU-04 · Crear torre", () => {
  let app: ReturnType<typeof crearApp>;

  beforeEach(() => {
    app = preparar();
  });

  afterAll(() => {
    cerrarBd();
    if (fs.existsSync(rutaBdPrueba)) fs.unlinkSync(rutaBdPrueba);
  });

  it("HU-04 · Creación de una torre para una parte de la casa", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const universo = insertarUniverso("TORRE-01", "Constructora Norte");
    const techo = universo.crearParte("Techo");
    universo.crearParte("Piso");

    const formulario = await agente.get("/torres/nuevo").query({ proyectoId: String(universo.proyectoId) });
    expect(formulario.status).toBe(200);
    expect(formulario.text).toContain("Constructora Norte (TORRE-01)");
    expect(formulario.text).toContain(">Techo</option>");
    expect(formulario.text).toContain("addEventListener('change'");

    const res = await agente.post("/torres").type("form").send({
      proyectoId: String(universo.proyectoId),
      parteCasaId: String(techo),
    });

    expect(res.status).toBe(201);
    expect(res.text).toContain("Torre creada");
    expect(res.text).toContain("Constructora Norte (TORRE-01)");
    expect(res.text).toContain("Techo");
    expect(res.text).toContain("TOR-TORRE-01-1");
    expect(res.text).toContain("Abierta");
    expect(res.text).toContain("sin piezas asignadas");

    const torre = fila("SELECT * FROM torres");
    expect(torre.proyecto_id).toBe(universo.proyectoId);
    expect(torre.parte_casa_id).toBe(techo);
    expect(torre.numero).toBe(1);
    expect(torre.codigo).toBe("TOR-TORRE-01-1");
    expect(torre.estado).toBe("Abierta");
    expect(torre.fecha_hora_eliminacion).toBeNull();
    expect(torre.eliminada_por).toBeNull();
    expect(filas("SELECT * FROM piezas WHERE estado <> 'Pendiente'")).toHaveLength(0);
  });

  it.each(["Pendiente de aprobación", "Aprobado", "Rechazado"])(
    "HU-02 / HU-04 · Rechazo de la creación de una torre antes de inyectar las piezas («%s»)",
    async (estado) => {
      const agente = await agenteConRol(app, "Operario de Bodega");
      const sinPiezas = insertarUniverso(
        `TORRE-SIN-${estado.slice(0, 3).toUpperCase()}`,
        "Cliente Sin Piezas",
        estado
      );

      const res = await agente.post("/torres").type("form").send({
        proyectoId: String(sinPiezas.proyectoId),
        parteCasaId: "1",
      });

      expect(res.status).toBe(400);
      expect(res.text).toContain("primero deben inyectarse las piezas del proyecto desde el archivo");
      expect(filas("SELECT * FROM torres")).toHaveLength(0);
      expect(
        fila("SELECT estado FROM proyectos WHERE id = ?", sinPiezas.proyectoId).estado
      ).toBe(estado);
    }
  );

  it("HU-04 · Creación de una segunda torre para la misma parte", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const universo = insertarUniverso("TORRE-02");
    const techo = universo.crearParte("Techo");
    const datos = { proyectoId: String(universo.proyectoId), parteCasaId: String(techo) };

    expect((await agente.post("/torres").type("form").send(datos)).status).toBe(201);
    const segunda = await agente.post("/torres").type("form").send(datos);

    expect(segunda.status).toBe(201);
    expect(segunda.text).toContain("TOR-TORRE-02-2");
    const torres = filas("SELECT * FROM torres ORDER BY numero");
    expect(torres.map((t) => t.numero)).toEqual([1, 2]);
    expect(torres.every((t) => t.estado === "Abierta")).toBe(true);
    expect(torres.every((t) => t.parte_casa_id === techo)).toBe(true);
    expect(filas("SELECT * FROM piezas WHERE estado <> 'Pendiente'")).toHaveLength(0);
  });

  it("HU-04 · Numeración independiente entre proyectos", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const uno = insertarUniverso("TORRE-A");
    const techoUno = uno.crearParte("Techo");
    const dos = insertarUniverso("TORRE-B");
    const techoDos = dos.crearParte("Techo");

    const primera = await agente.post("/torres").type("form").send({
      proyectoId: String(uno.proyectoId),
      parteCasaId: String(techoUno),
    });
    const segunda = await agente.post("/torres").type("form").send({
      proyectoId: String(dos.proyectoId),
      parteCasaId: String(techoDos),
    });

    expect(primera.status).toBe(201);
    expect(segunda.status).toBe(201);
    expect(primera.text).toContain("TOR-TORRE-A-1");
    expect(segunda.text).toContain("TOR-TORRE-B-1");
    expect(filas("SELECT numero FROM torres ORDER BY id").map((t) => t.numero)).toEqual([1, 1]);
  });

  it("HU-04 · Rechazo de una parte de la casa ajena al proyecto", async () => {
    const agente = await agenteConRol(app, "Operario de Bodega");
    const proyecto = insertarUniverso("TORRE-PROP");
    proyecto.crearParte("Techo");
    const ajeno = insertarUniverso("TORRE-AJENO");
    const pisoAjeno = ajeno.crearParte("Piso");

    const res = await agente.post("/torres").type("form").send({
      proyectoId: String(proyecto.proyectoId),
      parteCasaId: String(pisoAjeno),
    });

    expect(res.status).toBe(400);
    expect(res.text).toContain("La parte de la casa no pertenece al proyecto seleccionado.");
    expect(filas("SELECT * FROM torres")).toHaveLength(0);
  });

  it("HU-04 · Rechazo por rol no autorizado", async () => {
    const universo = insertarUniverso("TORRE-ROL", "Cliente Confidencial");
    const techo = universo.crearParte("Techo");
    const encargado = await agenteConRol(app, "Encargado de Despacho");

    const formulario = await encargado.get("/torres/nuevo");
    const res = await encargado.post("/torres").type("form").send({
      proyectoId: String(universo.proyectoId),
      parteCasaId: String(techo),
    });

    expect(formulario.status).toBe(403);
    expect(res.status).toBe(403);
    expect(res.text).toContain("no autoriza");
    expect(res.text).not.toContain("Cliente Confidencial");
    expect(res.text).not.toContain("TORRE-ROL");
    expect(res.text).not.toContain("TOR-");
    expect(filas("SELECT * FROM torres")).toHaveLength(0);
  });
});
