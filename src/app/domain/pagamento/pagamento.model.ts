import { EFormaPagamento } from './forma-pagamento.enum';
import { Parcela } from './parcela.model';

export class Pagamento {
  dataCriacao: Date;
  dataAtualizacao: Date;
  situacao: boolean;
  id: number;

  dataPagamento: Date;
  formaPagamento: EFormaPagamento;
  quantidadeParcelas: number;
  taxa: number;
  parcelas: Parcela[];
}
