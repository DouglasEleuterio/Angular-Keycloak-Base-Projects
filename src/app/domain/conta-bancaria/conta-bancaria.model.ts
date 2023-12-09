import { BaseActiveEntity } from 'src/app/core/domain/base.active.entity';

export class ContaBancaria extends BaseActiveEntity {
  banco: string;
  agencia?: string;
  contaCorrente?: string;
  codigoOperacao?: string;
}
