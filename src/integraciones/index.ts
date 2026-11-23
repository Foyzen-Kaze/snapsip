// HU-03: único punto de selección del generador del plano/archivo (simulado en la demo).
import { GeneradorPlano } from "./GeneradorPlano";
import { GeneradorPlanoSimulado } from "./GeneradorPlanoSimulado";
// HU-05: único punto de selección del servicio de almacenamiento de evidencias (simulado).
import { ServicioAlmacenamientoEvidencias } from "./ServicioAlmacenamientoEvidencias";
import {
  FOTOS_DEMO,
  ServicioAlmacenamientoEvidenciasSimulado,
} from "./ServicioAlmacenamientoEvidenciasSimulado";

export const generadorPlano: GeneradorPlano = new GeneradorPlanoSimulado();

export const servicioAlmacenamientoEvidencias: ServicioAlmacenamientoEvidencias =
  new ServicioAlmacenamientoEvidenciasSimulado();

export type {
  GeneradorPlano,
  ParteCasaSimulada,
  PiezaSimulada,
  UniversoPiezasSimulado,
} from "./GeneradorPlano";
export { GeneradorPlanoSimulado, NOMBRES_PARTES } from "./GeneradorPlanoSimulado";
export type {
  EvidenciaAlmacenada,
  ServicioAlmacenamientoEvidencias,
} from "./ServicioAlmacenamientoEvidencias";
export { ErrorAlmacenamientoEvidencias } from "./ServicioAlmacenamientoEvidencias";
export {
  FOTOS_DEMO,
  ServicioAlmacenamientoEvidenciasSimulado,
  VARIABLE_FALLO_EVIDENCIA,
} from "./ServicioAlmacenamientoEvidenciasSimulado";
