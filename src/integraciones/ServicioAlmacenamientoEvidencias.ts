// HU-05, CU-05, DSS-01, RP-05: actor externo «Servicio de almacenamiento de evidencias».
// En la demo se simula con un adaptador; en el sistema real RP-05 exige la fotografía real.

export interface EvidenciaAlmacenada {
  referencia: string;
  fechaHoraCaptura: string;
}

export interface ServicioAlmacenamientoEvidencias {
  almacenar(fotografia: string): EvidenciaAlmacenada;
}

export class ErrorAlmacenamientoEvidencias extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "ErrorAlmacenamientoEvidencias";
  }
}
