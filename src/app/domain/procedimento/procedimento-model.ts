import { BaseEntity } from '../../core/domain/base.entity';
import { ProcedimentoEnum } from './procedimento-enum';

export class Procedimento extends BaseEntity {
  id: number;
  nome: ProcedimentoEnum;
  regiao: string;
  quantidadeSessoes: number;
  intervaloEntreSessoes: number;
  valor: number;
}
