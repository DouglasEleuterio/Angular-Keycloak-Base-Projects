import { BaseActiveEntity } from '../../core/domain/base.active.entity';
import { Documento } from '../documento/documento-model';
import { Procedimento } from '../procedimento/procedimento-model';

export class Termo extends BaseActiveEntity {
  versao: number;
  documento: Documento;
  procedimento: Procedimento;
}
