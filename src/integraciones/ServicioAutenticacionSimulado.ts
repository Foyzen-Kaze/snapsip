import { ResultadoAutenticacion, ServicioAutenticacion } from "./ServicioAutenticacion";

// HU-01, CU-01, DSS-03: adaptador simulado (sin autenticación real). No se usa en el flujo principal de Opción 2.
export class ServicioAutenticacionSimulado implements ServicioAutenticacion {
  verificarCredenciales(
    identificador: string,
    _contrasena: string
  ): ResultadoAutenticacion {
    console.log(
      `[ServicioAutenticacionSimulado] verificación simulada para identificador="${identificador}" (Opción 2: no participa en flujo principal)`
    );
    return {
      valido: false,
      mensaje:
        "Servicio de autenticación simulado: el flujo activo usa selector de rol de demostración (sin credenciales).",
    };
  }
}
