import { BaseActiveEntity } from 'src/app/core/domain/base.active.entity';
import { TipoLocalidade } from '../tipo-localidade/tipo-localidade.model';

export class ValorDiaria extends BaseActiveEntity {
  valor: number;
  tipoLocalidade: TipoLocalidade; // obrig.
  normativo: string; // obrig | unico
  dataNormativo: Date; // obrig.
  cargo: string[]; // cargo efetivo
}
