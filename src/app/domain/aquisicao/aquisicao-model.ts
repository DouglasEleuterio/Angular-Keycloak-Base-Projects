import { BaseActiveEntity } from '../../core/domain/base.active.entity';
import { Cliente } from '../cliente/cliente';
import { Procedimento } from '../procedimento/procedimento-model';
import { Pagamento } from '../pagamento/pagamento.model';

export class Aquisicao extends BaseActiveEntity {
  dataCriacao: Date;
  dataAtualizacao: Date;
  situacao: boolean;
  id: number;
  dataAquisicao: Date;
  valorAquisicao: number;
  valorDesconto: number | null;
  cliente: Cliente;
  pagamentos: Pagamento[];
  procedimentosDaAquisicao: Procedimento[];
}
