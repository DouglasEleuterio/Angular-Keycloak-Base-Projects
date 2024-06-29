import { BaseActiveEntity } from '../../core/domain/base.active.entity';
import { Cliente } from '../cliente/cliente';
import { Procedimento } from '../procedimento/procedimento-model';
import { Pagamento } from '../pagamento/pagamento.model';

export class Aquisicao extends BaseActiveEntity {
  dataCriacao: Date;
  dataAtualizacao: Date;
  situacao: boolean;
  id: number;

  cliente: Cliente;
  procedimentos: Procedimento;
  dataAquisicao: Date;
  valorAquisicao: number;
  valorDesconto: number | null;
  pagamentos: Pagamento[];
}
