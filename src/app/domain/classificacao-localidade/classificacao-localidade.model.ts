import { BaseActiveEntity } from '../../core/domain/base.active.entity';
import { TipoLocalidade } from '../tipo-localidade/tipo-localidade.model';

export class ClassificacaoLocalidade extends BaseActiveEntity {
  uf: string;
  localidade: string;
  tipoLocalidade: TipoLocalidade;
}
