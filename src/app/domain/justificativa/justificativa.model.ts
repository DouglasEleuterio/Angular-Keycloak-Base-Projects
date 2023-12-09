import { BaseActiveEntity } from 'src/app/core/domain/base.active.entity';

export class Justificativa extends BaseActiveEntity {
  descricao: string;
  autorizacao: boolean;
  calculo: boolean;
  pagamento: boolean;
  prestacaoConta: boolean;
}
