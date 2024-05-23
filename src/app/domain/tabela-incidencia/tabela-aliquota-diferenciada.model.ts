import { BaseActiveEntity } from '../../core/domain/base.active.entity';
import { EnumValue } from '@angular/compiler-cli/src/ngtsc/partial_evaluator';

export class TabelaAliquotaDiferenciada extends BaseActiveEntity {
  id: number;
  ncm: string;
  inicioVigencia: Date;
  fimVigencia: Date;
  enumSituacao: EnumValue;
}
