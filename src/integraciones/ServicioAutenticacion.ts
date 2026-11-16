// HU-01, CU-01, DSS-03, TO-BE Autenticación de usuarios
// Integración externa documentada (Servicio de autenticación). En Opción 2 (selector de rol de demostración)
// no participa en el flujo principal; se declara y simula sin autenticación real.

export interface ResultadoAutenticacion {
  valido: boolean;
  rol?: string;
  mensaje?: string;
}

export interface ServicioAutenticacion {
  verificarCredenciales(
    identificador: string,
    contrasena: string
  ): ResultadoAutenticacion;
}
