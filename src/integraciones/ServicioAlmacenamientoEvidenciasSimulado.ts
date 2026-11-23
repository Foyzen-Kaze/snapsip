import {
  ErrorAlmacenamientoEvidencias,
  EvidenciaAlmacenada,
  ServicioAlmacenamientoEvidencias,
} from "./ServicioAlmacenamientoEvidencias";

// HU-05, Decisión B: exactamente tres fotos de demostración, elegibles con un clic.
// Ninguna queda preseleccionada en la vista (no se envía valor por defecto).
export const FOTOS_DEMO = [
  { id: "foto-1", etiqueta: "Foto 1 · Panel apilado", referencia: "demo/foto-1.jpg" },
  { id: "foto-2", etiqueta: "Foto 2 · Panel en su torre", referencia: "demo/foto-2.jpg" },
  { id: "foto-3", etiqueta: "Foto 3 · Ubicación general", referencia: "demo/foto-3.jpg" },
] as const;

export type IdFotoDemo = (typeof FOTOS_DEMO)[number]["id"];

// Disparador explícito de prueba para CA4: no es una opción visible en la interfaz.
export const VARIABLE_FALLO_EVIDENCIA = "EVIDENCIA_FORZAR_FALLO";

export class ServicioAlmacenamientoEvidenciasSimulado
  implements ServicioAlmacenamientoEvidencias
{
  almacenar(fotografia: string): EvidenciaAlmacenada {
    if (process.env[VARIABLE_FALLO_EVIDENCIA] === "1") {
      throw new ErrorAlmacenamientoEvidencias("Falla simulada del almacenamiento de evidencias.");
    }
    const foto = FOTOS_DEMO.find((opcion) => opcion.id === fotografia);
    if (!foto) {
      throw new ErrorAlmacenamientoEvidencias("La fotografía seleccionada no es válida.");
    }
    return {
      referencia: foto.referencia,
      fechaHoraCaptura: new Date().toISOString(),
    };
  }
}
