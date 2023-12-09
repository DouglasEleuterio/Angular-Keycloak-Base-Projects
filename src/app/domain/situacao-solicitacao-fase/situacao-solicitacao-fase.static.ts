import { Options } from '../options/options.interface';
import { SituacaoSolicitacaoFaseEnum } from './situacao-solicitacao-fase.enum';

export const situacaoSolicitacaoFaseOptionsStatic: Options[] = [
  { label: SituacaoSolicitacaoFaseEnum.SOLICITACAO_LABEL, value: SituacaoSolicitacaoFaseEnum.SOLICITACAO },
  { label: SituacaoSolicitacaoFaseEnum.TRIAGEM_LABEL, value: SituacaoSolicitacaoFaseEnum.TRIAGEM },
  { label: SituacaoSolicitacaoFaseEnum.AUTORIZACAO_LABEL, value: SituacaoSolicitacaoFaseEnum.AUTORIZACAO },
  { label: SituacaoSolicitacaoFaseEnum.INSTRUCAO_LABEL, value: SituacaoSolicitacaoFaseEnum.INSTRUCAO },
  { label: SituacaoSolicitacaoFaseEnum.CALCULO_LABEL, value: SituacaoSolicitacaoFaseEnum.CALCULO },
  { label: SituacaoSolicitacaoFaseEnum.PAGAMENTO_LABEL, value: SituacaoSolicitacaoFaseEnum.PAGAMENTO }
];
