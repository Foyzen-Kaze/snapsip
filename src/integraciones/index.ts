// HU-03: único punto de selección del generador del plano/archivo (simulado en la demo).
import { GeneradorPlano } from "./GeneradorPlano";
import { GeneradorPlanoSimulado } from "./GeneradorPlanoSimulado";

export const generadorPlano: GeneradorPlano = new GeneradorPlanoSimulado();

export type {
  GeneradorPlano,
  ParteCasaSimulada,
  PiezaSimulada,
  UniversoPiezasSimulado,
} from "./GeneradorPlano";
export { GeneradorPlanoSimulado, NOMBRES_PARTES } from "./GeneradorPlanoSimulado";
