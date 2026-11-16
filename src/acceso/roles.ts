// HU-01: roles de demostración (CU-01, TO-BE Autenticación de usuarios)
export const ROLES_DEMO = [
  "Operario de Bodega",
  "Encargado de Despacho",
] as const;

export type RolDemo = (typeof ROLES_DEMO)[number];

export function esRolValido(rol: string | undefined | null): rol is RolDemo {
  return !!rol && (ROLES_DEMO as readonly string[]).includes(rol);
}

export function funcionesPorRol(rol: RolDemo): string[] {
  if (rol === "Encargado de Despacho") {
    return [
      "Crear proyecto (HU-02, pendiente)",
      "Inyectar piezas desde plano/archivo (HU-03, pendiente)",
      "Generar guía de despacho (HU-08, pendiente)",
      "Registrar envío con evidencia (HU-09, pendiente)",
      "Operación protegida de ejemplo (solo Encargado de Despacho)",
    ];
  }
  return [
    "Crear torre (HU-04, pendiente)",
    "Asignar pieza a torre con evidencia (HU-05, pendiente)",
    "Consultar piezas pendientes (HU-06, pendiente)",
    "Cierre manual de torre (HU-07, pendiente)",
    "Eliminar torre vacía con código (HU-10, pendiente)",
    "Desasignar pieza de una torre (HU-11, pendiente)",
  ];
}
