import {
  GeneradorPlano,
  ParteConCantidadSimulada,
  PiezaSimulada,
  UniversoPiezasSimulado,
} from "./GeneradorPlano";

// HU-03, CU-03, OBS-1: adaptador simulado del plano/archivo. No carga ningún
// archivo real y no crea partes: recibe las partes guardadas por HU-02 y solo
// genera los códigos aleatorios de las piezas de cada parte.
const TOTAL_CODIGOS = 26 * 25;

export class GeneradorPlanoSimulado implements GeneradorPlano {
  constructor(private readonly rng: () => number = Math.random) {}

  generar(
    codigoProyecto: string,
    partes: ParteConCantidadSimulada[]
  ): UniversoPiezasSimulado {
    const universo = partes.map((parte) => ({
      nombre: parte.nombre,
      piezas: [] as PiezaSimulada[],
    }));

    const codigosUsados = new Set<number>();
    for (const [indiceParte, parte] of partes.entries()) {
      for (let i = 0; i < parte.cantidad; i++) {
        let indiceCodigo =
          (Math.floor(this.rng() * TOTAL_CODIGOS) + i) % TOTAL_CODIGOS;
        while (codigosUsados.has(indiceCodigo)) {
          indiceCodigo = (indiceCodigo + 1) % TOTAL_CODIGOS;
        }
        codigosUsados.add(indiceCodigo);
        universo[indiceParte].piezas.push({ codigo: this.formarCodigo(indiceCodigo) });
      }
    }

    const totalPiezas = codigosUsados.size;
    console.log(
      `[GeneradorPlanoSimulado] plano/archivo simulado para "${codigoProyecto}": ${partes.length} partes, ${totalPiezas} piezas (según cantidades previstas; sin archivo real)`
    );
    return { partes: universo };
  }

  private formarCodigo(indice: number): string {
    const letra = String.fromCharCode(65 + Math.floor(indice / 25));
    const numero = (indice % 25) + 1;
    return `${letra}${numero}`;
  }
}
