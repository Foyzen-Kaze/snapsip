// HU-03, CU-03, RP-03: origen del universo de piezas (plano/archivo simulado en la demo).
export interface PiezaSimulada {
  codigo: string;
}

// OBS-1: las partes vienen de HU-02; el plano/archivo simulado solo entrega códigos.
export interface ParteConCantidadSimulada {
  nombre: string;
  cantidad: number;
}

export interface ParteCasaSimulada {
  nombre: string;
  piezas: PiezaSimulada[];
}

export interface UniversoPiezasSimulado {
  partes: ParteCasaSimulada[];
}

export interface GeneradorPlano {
  generar(
    codigoProyecto: string,
    partes: ParteConCantidadSimulada[]
  ): UniversoPiezasSimulado;
}
