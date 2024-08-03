import { Aquisicao } from './aquisicao-model';

export class AquisicaoProcedimento {
  id: number;
  nome: string;
  intervaloEntreSessoes: number;
  quantidadeSessoes: number;
  valor: number;
  procedimento: string;
  aquisicao: Aquisicao;
}
