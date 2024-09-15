import { BaseActiveEntity } from '../../core/domain/base.active.entity';
import { AquisicaoProcedimento } from '../aquisicao/aquisicao-procedimento.model';
import { Profissional } from '../profissional/profissional.model';

export class Evento extends BaseActiveEntity {
  id?: number;
  allDay?: boolean;
  title?: string;
  start?: Date;
  end?: Date;
  backgroundColor?: string;
  confirmado?: boolean;
  aquisicaoProcedimento?: AquisicaoProcedimento;
  profissional?: Profissional;
}
