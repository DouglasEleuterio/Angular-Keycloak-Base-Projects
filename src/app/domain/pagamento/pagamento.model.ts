import { EFormaPagamento } from './forma-pagamento.enum';

export class Pagamento {
  dataCriacao?: Date;
  dataAtualizacao?: Date;
  situacao?: boolean;
  id?: number;

  dataPagamento?: Date;
  formaPagamento?: EFormaPagamento;
  valorPagamento?: number;
  taxa?: number;
}
