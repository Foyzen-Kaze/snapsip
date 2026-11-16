import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import fs from "fs";
import path from "path";
import os from "os";
import { crearApp } from "../src/app";
import { reiniciarBdParaPruebas, cerrarBd } from "../src/db/conexion";
import { ejecutarSeed } from "../src/db/seed";

const rutaBdPrueba = path.join(os.tmpdir(), `snapsip-hu01-test-${process.pid}.db`);

function preparar() {
  process.env.DB_PATH = rutaBdPrueba;
  reiniciarBdParaPruebas(rutaBdPrueba);
  ejecutarSeed();
  const app = crearApp();
  return app;
}

describe("HU-01 · Autenticación de usuarios (acceso por rol de demostración)", () => {
  beforeEach(() => {
    preparar();
  });

  afterAll(() => {
    cerrarBd();
    if (fs.existsSync(rutaBdPrueba)) fs.unlinkSync(rutaBdPrueba);
  });

  it("HU-01 · Acceso concedido al seleccionar un rol de demostración (adaptación de CA1)", async () => {
    // DADO que la aplicación ofrece los roles de demostración Operario de Bodega y Encargado de Despacho
    const app = preparar();
    const agente = request.agent(app);
    const inicio = await agente.get("/");
    expect(inicio.status).toBe(200);
    expect(inicio.text).toContain("Operario de Bodega");
    expect(inicio.text).toContain("Encargado de Despacho");

    // CUANDO el usuario solicita acceder seleccionando un rol de demostración válido
    const res = await agente
      .post("/acceso/rol")
      .type("form")
      .send({ rol: "Encargado de Despacho" })
      .redirects(1);

    // ENTONCES el sistema concede el acceso y habilita únicamente las funciones autorizadas para ese rol
    expect(res.status).toBe(200);
    expect(res.text).toContain("Acceso concedido");
    expect(res.text).toContain("Encargado de Despacho");
    expect(res.text).toContain("Crear proyecto (HU-02)");
    expect(res.text).not.toContain("Crear torre (HU-04, pendiente)");
  });

  it("HU-01 · No se concede acceso sin rol de demostración establecido (CA2 adaptado en demo)", async () => {
    // DADO que el usuario no ha establecido un rol de demostración
    const app = preparar();

    // CUANDO intenta acceder a una función protegida sin seleccionar un rol válido
    const res = await request(app).get("/operaciones/despacho/ejemplo");

    // ENTONCES el sistema no concede acceso a las funciones protegidas y solicita establecer un rol de demostración
    expect(res.status).toBe(401);
    expect(res.text).toContain("Debe establecer un rol de demostración");
    expect(res.text).toContain("selector de rol de demostración");
  });

  it("HU-01 · Rechazo de una operación no autorizada para el rol (CA3)", async () => {
    // DADO que un usuario tiene acceso con un rol de demostración y su rol no autoriza una determinada operación protegida
    const app = preparar();
    const agente = request.agent(app);
    await agente.post("/acceso/rol").type("form").send({ rol: "Operario de Bodega" });

    // CUANDO solicita realizar esa operación
    const res = await agente.get("/operaciones/despacho/ejemplo");

    // ENTONCES el sistema rechaza la solicitud y conserva los datos sin modificaciones
    expect(res.status).toBe(403);
    expect(res.text).toContain("Su rol no autoriza esta operación protegida");
    expect(res.text).toContain("no se modificaron datos");
    expect(app.locals.contadorOperacionesProtegidas).toBe(0);
  });

  it("HU-01 · Cambio de rol de demostración", async () => {
    // DADO que un usuario tiene acceso con un rol de demostración
    const app = preparar();
    const agente = request.agent(app);
    const primero = await agente
      .post("/acceso/rol")
      .type("form")
      .send({ rol: "Operario de Bodega" })
      .redirects(1);
    expect(primero.text).toContain("Acceso concedido");
    expect(primero.text).toContain("Operario de Bodega");
    expect(primero.text).toContain("Crear torre (HU-04, pendiente)");
    expect(primero.text).not.toContain("Crear proyecto (HU-02, pendiente)");

    // CUANDO selecciona un rol de demostración diferente
    const segundo = await agente
      .post("/acceso/rol")
      .type("form")
      .send({ rol: "Encargado de Despacho" })
      .redirects(1);

    // ENTONCES el sistema actualiza el contexto de acceso al nuevo rol y habilita únicamente las funciones autorizadas para el nuevo rol
    expect(segundo.status).toBe(200);
    expect(segundo.text).toContain("Acceso concedido");
    expect(segundo.text).toContain("Encargado de Despacho");
    expect(segundo.text).toContain("Crear proyecto (HU-02)");
    expect(segundo.text).not.toContain("Crear torre (HU-04, pendiente)");
  });
});
