import { Pagamento } from './pagamento.model';

export class Parcela {
  dataCredito: Date;
  valorCredito: number;
  valorTaxa: number;
  isRecebido: boolean;
  numeroParcela: number;
  pagamento: Pagamento;
}
