import { Regiao } from './regiao.model';
import { BaseEntity } from '../../core/domain/base.entity';

export class Procedimento extends BaseEntity {
  nome?: string;
  regioes?: Regiao[];
}
