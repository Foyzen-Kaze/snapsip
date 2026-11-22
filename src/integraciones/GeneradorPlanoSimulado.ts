import {
  GeneradorPlano,
  PiezaSimulada,
  UniversoPiezasSimulado,
} from "./GeneradorPlano";

// HU-03, CU-03: adaptador simulado del plano/archivo. No carga ningún archivo real.
export const NOMBRES_PARTES = [
  "Techo",
  "Muros exteriores",
  "Muros interiores",
  "Piso",
  "Entrepiso",
] as const;

const TOTAL_CODIGOS = 26 * 25;

export class GeneradorPlanoSimulado implements GeneradorPlano {
  constructor(private readonly rng: () => number = Math.random) {}

  generar(codigoProyecto: string): UniversoPiezasSimulado {
    const numeroPartes = 1 + Math.floor(this.rng() * 5);
    const numeroPiezas =
      numeroPartes + 1 + Math.floor(this.rng() * (100 - numeroPartes));

    const partes = this.elegirNombres(numeroPartes).map((nombre) => ({
      nombre,
      piezas: [] as PiezaSimulada[],
    }));

    const codigosUsados = new Set<number>();

    for (let i = 0; i < numeroPiezas; i++) {
      const indiceParte = i < numeroPartes ? i : Math.floor(this.rng() * numeroPartes);
      let indiceCodigo = (Math.floor(this.rng() * TOTAL_CODIGOS) + i) % TOTAL_CODIGOS;
      while (codigosUsados.has(indiceCodigo)) {
        indiceCodigo = (indiceCodigo + 1) % TOTAL_CODIGOS;
      }
      codigosUsados.add(indiceCodigo);
      partes[indiceParte].piezas.push({ codigo: this.formarCodigo(indiceCodigo) });
    }

    console.log(
      `[GeneradorPlanoSimulado] plano/archivo simulado para "${codigoProyecto}": ${numeroPartes} partes, ${numeroPiezas} piezas (sin archivo real)`
    );
    return { partes };
  }

  private formarCodigo(indice: number): string {
    const letra = String.fromCharCode(65 + Math.floor(indice / 25));
    const numero = (indice % 25) + 1;
    return `${letra}${numero}`;
  }

  private elegirNombres(cantidad: number): string[] {
    const disponibles = [...NOMBRES_PARTES];
    const elegidos: string[] = [];
    for (let i = 0; i < cantidad; i++) {
      const indice = Math.floor(this.rng() * disponibles.length);
      elegidos.push(...disponibles.splice(indice, 1));
    }
    return elegidos;
  }
}
