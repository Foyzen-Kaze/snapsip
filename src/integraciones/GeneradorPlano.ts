// HU-03, CU-03, RP-03: origen del universo de piezas (plano/archivo simulado en la demo).
export interface PiezaSimulada {
  codigo: string;
}

export interface ParteCasaSimulada {
  nombre: string;
  piezas: PiezaSimulada[];
}

export interface UniversoPiezasSimulado {
  partes: ParteCasaSimulada[];
}

export interface GeneradorPlano {
  generar(codigoProyecto: string): UniversoPiezasSimulado;
}
