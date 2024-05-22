import { BaseActiveEntity } from '../../core/domain/base.active.entity';

export class TabelaAliquotaDiferenciada extends BaseActiveEntity {
  id: number;
  ncm: string;
  inicioVigencia: Date;
  fimVigencia: Date;
}
