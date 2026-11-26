import { obtenerBd } from "../db/conexion";

// HU-12 / EST-04: estados canónicos del ciclo de vida de Proyecto.
export const ESTADOS_PROYECTO = {
  PENDIENTE: "Pendiente de aprobación",
  APROBADO: "Aprobado",
  RECHAZADO: "Rechazado",
  EN_PREPARACION: "En preparación",
  COMPLETO: "Proyecto completo",
} as const;
export type EstadoProyecto = (typeof ESTADOS_PROYECTO)[keyof typeof ESTADOS_PROYECTO];

// HU-02, CU-02, TO-BE Crear proyecto, RP-02
export interface Proyecto {
  id: number;
  codigo: string;
  cliente: string;
  metraje: string;
  estado: string;
}

export interface ProyectoConConteo extends Proyecto {
  partes: number;
  piezas: number;
}

// OBS-1 (2026-11-26, opción 2 «Al crear proyecto»): lista única de las cinco
// partes de la casa. La usa el formulario, la validación y la creación de ParteCasa.
export const PARTES_CASA = [
  { campo: "piso", nombre: "Piso" },
  { campo: "muros_exteriores", nombre: "Muros exteriores" },
  { campo: "muros_interiores", nombre: "Muros interiores" },
  { campo: "entrepiso", nombre: "Entrepiso" },
  { campo: "techo", nombre: "Techo" },
] as const;

export type CampoParteCasa = (typeof PARTES_CASA)[number]["campo"];

export interface DatosCrearProyecto {
  codigo: unknown;
  cliente: unknown;
  metraje: unknown;
  piso?: unknown;
  muros_exteriores?: unknown;
  muros_interiores?: unknown;
  entrepiso?: unknown;
  techo?: unknown;
}

export interface ParteCasaResumen {
  nombre: string;
  cantidad_prevista: number;
}

export type ResultadoCrearProyecto =
  | { ok: true; proyecto: Proyecto }
  | {
      ok: false;
      motivo: "DUPLICADO" | "OBLIGATORIOS" | "PARTES_INVALIDAS";
      mensaje: string;
    };

const MENSAJE_PARTES_INVALIDAS =
  "Las cantidades de las partes deben ser enteros no negativos y el total debe estar entre 1 y 100.";

function normalizar(valor: unknown): string {
  return typeof valor === "string" ? valor.trim() : "";
}

// Acepta el texto del formulario y los números; rechaza decimales, negativos y
// cualquier otro valor no entero. Un campo ausente equivale a 0.
function parsearCantidad(valor: unknown): number | undefined {
  if (valor === undefined || valor === null || valor === "") return 0;
  const texto =
    typeof valor === "number"
      ? String(valor)
      : typeof valor === "string"
        ? valor.trim()
        : "";
  if (!/^\d+$/.test(texto)) return undefined;
  const numero = Number(texto);
  return Number.isSafeInteger(numero) ? numero : undefined;
}

export function crearProyecto(datos: DatosCrearProyecto): ResultadoCrearProyecto {
  const codigo = normalizar(datos.codigo);
  const cliente = normalizar(datos.cliente);
  const metraje = normalizar(datos.metraje);

  if (!codigo || !cliente || !metraje) {
    return {
      ok: false,
      motivo: "OBLIGATORIOS",
      mensaje: "Los campos cliente, código y metraje son obligatorios.",
    };
  }

  const cantidades = {} as Record<CampoParteCasa, number>;
  const valores = datos as Record<string, unknown>;
  for (const parte of PARTES_CASA) {
    const cantidad = parsearCantidad(valores[parte.campo]);
    if (cantidad === undefined) {
      return {
        ok: false,
        motivo: "PARTES_INVALIDAS",
        mensaje: MENSAJE_PARTES_INVALIDAS,
      };
    }
    cantidades[parte.campo] = cantidad;
  }
  const total = PARTES_CASA.reduce((suma, parte) => suma + cantidades[parte.campo], 0);
  if (total < 1 || total > 100) {
    return {
      ok: false,
      motivo: "PARTES_INVALIDAS",
      mensaje: MENSAJE_PARTES_INVALIDAS,
    };
  }

  const db = obtenerBd();
  db.exec("BEGIN");
  try {
    const existente = db
      .prepare("SELECT id, codigo, cliente, metraje, estado FROM proyectos WHERE codigo = ?")
      .get(codigo) as Proyecto | undefined;
    if (existente) {
      // CA2: conserva el proyecto existente sin modificaciones
      db.exec("ROLLBACK");
      return {
        ok: false,
        motivo: "DUPLICADO",
        mensaje: "El código está duplicado.",
      };
    }

    const info = db
      .prepare(
        "INSERT INTO proyectos (codigo, cliente, metraje, estado) VALUES (?, ?, ?, ?)"
      )
      .run(codigo, cliente, metraje, ESTADOS_PROYECTO.PENDIENTE);
    const proyectoId = Number(info.lastInsertRowid);

    // OBS-1: solo se crean las partes con cantidad positiva y se guarda su
    // cantidad prevista. El proyecto nace sin piezas.
    const insertarParte = db.prepare(
      "INSERT INTO partes_casa (proyecto_id, nombre, cantidad_prevista) VALUES (?, ?, ?)"
    );
    for (const parte of PARTES_CASA) {
      const cantidad = cantidades[parte.campo];
      if (cantidad > 0) insertarParte.run(proyectoId, parte.nombre, cantidad);
    }

    const proyecto = db
      .prepare("SELECT id, codigo, cliente, metraje, estado FROM proyectos WHERE id = ?")
      .get(proyectoId) as Proyecto;
    db.exec("COMMIT");
    return { ok: true, proyecto };
  } catch (e: any) {
    db.exec("ROLLBACK");
    // Defensa por restricción UNIQUE en BD
    if (e && (e.code === "SQLITE_CONSTRAINT_UNIQUE" || String(e.message).includes("UNIQUE"))) {
      return {
        ok: false,
        motivo: "DUPLICADO",
        mensaje: "El código está duplicado.",
      };
    }
    throw e;
  }
}

export function listarPartesDeProyecto(codigo: string): ParteCasaResumen[] {
  const db = obtenerBd();
  return db
    .prepare(
      "SELECT nombre, cantidad_prevista FROM partes_casa WHERE proyecto_id = (SELECT id FROM proyectos WHERE codigo = ?) ORDER BY id"
    )
    .all(codigo) as ParteCasaResumen[];
}

function existeTabla(nombre: string): boolean {
  const db = obtenerBd();
  return Boolean(
    db
      .prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?")
      .get(nombre)
  );
}

export function listarProyectos(): ProyectoConConteo[] {
  const db = obtenerBd();
  const proyectos = db
    .prepare("SELECT id, codigo, cliente, metraje, estado FROM proyectos ORDER BY id DESC")
    .all() as Proyecto[];

  if (!existeTabla("partes_casa") || !existeTabla("piezas")) {
    return proyectos.map((proyecto) => ({ ...proyecto, partes: 0, piezas: 0 }));
  }

  const conteos = db
    .prepare(
      "SELECT pc.proyecto_id AS proyectoId, COUNT(DISTINCT pc.id) AS partes, COUNT(p.id) AS piezas FROM partes_casa pc LEFT JOIN piezas p ON p.parte_casa_id = pc.id GROUP BY pc.proyecto_id"
    )
    .all() as { proyectoId: number; partes: number; piezas: number }[];
  const porProyecto = new Map(conteos.map((conteo) => [conteo.proyectoId, conteo]));

  return proyectos.map((proyecto) => {
    const conteo = porProyecto.get(proyecto.id);
    return {
      ...proyecto,
      partes: conteo?.partes ?? 0,
      piezas: conteo?.piezas ?? 0,
    };
  });
}

export function obtenerProyectoPorCodigo(codigo: string): Proyecto | undefined {
  const db = obtenerBd();
  return db
    .prepare("SELECT id, codigo, cliente, metraje, estado FROM proyectos WHERE codigo = ?")
    .get(codigo) as Proyecto | undefined;
}

// HU-12 / CU-12 / RP-17: transiciones EST-04 desde «Pendiente de aprobación».
export type ResultadoDecisionProyecto =
  | { ok: true; proyecto: Proyecto }
  | {
      ok: false;
      motivo: "NO_ENCONTRADO" | "ESTADO_INVALIDO";
      mensaje: string;
    };

function decidirProyecto(
  id: unknown,
  estadoDestino: EstadoProyecto,
  accion: string
): ResultadoDecisionProyecto {
  const texto = typeof id === "string" ? id.trim() : String(id ?? "");
  const proyectoId = /^\d+$/.test(texto) ? Number(texto) : undefined;
  if (proyectoId === undefined) {
    return {
      ok: false,
      motivo: "NO_ENCONTRADO",
      mensaje: "No existe el proyecto solicitado; no se modificaron datos.",
    };
  }

  const db = obtenerBd();
  const proyecto = db
    .prepare("SELECT id, codigo, cliente, metraje, estado FROM proyectos WHERE id = ?")
    .get(proyectoId) as Proyecto | undefined;
  if (!proyecto) {
    return {
      ok: false,
      motivo: "NO_ENCONTRADO",
      mensaje: "No existe el proyecto solicitado; no se modificaron datos.",
    };
  }
  // CA3: cualquier otro estado se conserva sin modificar datos.
  if (proyecto.estado !== ESTADOS_PROYECTO.PENDIENTE) {
    return {
      ok: false,
      motivo: "ESTADO_INVALIDO",
      mensaje: `El proyecto está en estado «${proyecto.estado}»; solo se puede ${accion} desde «${ESTADOS_PROYECTO.PENDIENTE}». No se modificaron datos.`,
    };
  }

  db.prepare("UPDATE proyectos SET estado = ? WHERE id = ?").run(estadoDestino, proyectoId);
  const actualizado = db
    .prepare("SELECT id, codigo, cliente, metraje, estado FROM proyectos WHERE id = ?")
    .get(proyectoId) as Proyecto;
  return { ok: true, proyecto: actualizado };
}

export function aprobarProyecto(id: unknown): ResultadoDecisionProyecto {
  return decidirProyecto(id, ESTADOS_PROYECTO.APROBADO, "aprobar");
}

export function rechazarProyecto(id: unknown): ResultadoDecisionProyecto {
  return decidirProyecto(id, ESTADOS_PROYECTO.RECHAZADO, "rechazar");
}
