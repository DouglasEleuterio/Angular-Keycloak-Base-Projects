import { ProcedimentoSemRegiao } from './procedimentosemregiao-model';

export class Regiao {
  id?: number;
  nome?: string;
  valor?: number;
  quantidadeSessoes?: number;
  intervaloEntreSessoes?: number;
  procedimento?: ProcedimentoSemRegiao;
}
