import { Documento } from '../documento/documento-model';
import { BaseEntity } from '../../core/domain/base.entity';

export class ConfirmarAtendimento {
  data: Date;
  observacao: Documento;
  agendamento: BaseEntity;
  profissionais: BaseEntity[];
}
