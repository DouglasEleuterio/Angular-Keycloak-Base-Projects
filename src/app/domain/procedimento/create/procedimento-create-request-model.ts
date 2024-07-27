import { RegiaoCreateRequest } from './regiao-create-request-model';
import { BaseEntity } from '../../../core/domain/base.entity';

export class ProcedimentoCreateRequest extends BaseEntity {
  nome: string;
  regioes: RegiaoCreateRequest[];
}
