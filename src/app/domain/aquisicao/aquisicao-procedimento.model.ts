import { Aquisicao } from './aquisicao-model';
import { Profissional } from '../profissional/profissional.model';

export class AquisicaoProcedimento {
  id: number;
  nome: string;
  intervaloEntreSessoes: number;
  quantidadeSessoes: number;
  valor: number;
  procedimento: string;
  aquisicao: Aquisicao;
  profissional: Profissional;
}
