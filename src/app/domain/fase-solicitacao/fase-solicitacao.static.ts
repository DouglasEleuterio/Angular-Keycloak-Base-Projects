import { Options } from '../options/options.interface';
import { FaseSolicitacaoEnum } from './fase-solicitacao.enum';

export const faseSolicitacaoOptionsStatic: Options[] = [
  { label: FaseSolicitacaoEnum.SOLICITACAO_LABEL, value: FaseSolicitacaoEnum.SOLICITACAO },
  { label: FaseSolicitacaoEnum.TRIAGEM_LABEL, value: FaseSolicitacaoEnum.TRIAGEM },
  { label: FaseSolicitacaoEnum.AUTORIZACAO_LABEL, value: FaseSolicitacaoEnum.AUTORIZACAO },
  { label: FaseSolicitacaoEnum.INSTRUCAO_LABEL, value: FaseSolicitacaoEnum.INSTRUCAO },
  { label: FaseSolicitacaoEnum.CALCULO_LABEL, value: FaseSolicitacaoEnum.CALCULO },
  { label: FaseSolicitacaoEnum.PAGAMENTO_LABEL, value: FaseSolicitacaoEnum.PAGAMENTO },
  { label: FaseSolicitacaoEnum.PRESTACAO_CONTAS_LABEL, value: FaseSolicitacaoEnum.PRESTACAO_CONTAS }
];
