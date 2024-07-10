import { BaseActiveEntity } from '../../core/domain/base.active.entity';
import { Cliente } from '../cliente/cliente';

export class PreAgendamento extends BaseActiveEntity {
  cliente?: Cliente;
  nomeProcedimento: string;
  data?: Date;
}
