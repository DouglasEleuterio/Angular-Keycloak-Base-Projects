import { Options } from '../options/options.interface';
import { SituacaoSolicitacaoEnum } from './situacao-solicitacao.enum';

export const situacaoSolicitacaoOptionsStatic: Options[] = [
  { label: SituacaoSolicitacaoEnum.INICIADA_LABEL, value: SituacaoSolicitacaoEnum.INICIADA },
  { label: SituacaoSolicitacaoEnum.DEVOLVIDA_LABEL, value: SituacaoSolicitacaoEnum.DEVOLVIDA },
  { label: SituacaoSolicitacaoEnum.PARA_APROVAR_LABEL, value: SituacaoSolicitacaoEnum.PARA_APROVAR },
  { label: SituacaoSolicitacaoEnum.REPROVADA_LABEL, value: SituacaoSolicitacaoEnum.REPROVADA },
  { label: SituacaoSolicitacaoEnum.CANCELADA_LABEL, value: SituacaoSolicitacaoEnum.CANCELADA },
  { label: SituacaoSolicitacaoEnum.PARA_VERIFICAR_LABEL, value: SituacaoSolicitacaoEnum.PARA_VERIFICAR },
  { label: SituacaoSolicitacaoEnum.VERIFICANDO_LABEL, value: SituacaoSolicitacaoEnum.VERIFICANDO },
  { label: SituacaoSolicitacaoEnum.VERIFICADA_LABEL, value: SituacaoSolicitacaoEnum.VERIFICADA },
  { label: SituacaoSolicitacaoEnum.APROVADA_PARA_AUTORIZAR_LABEL, value: SituacaoSolicitacaoEnum.APROVADA_PARA_AUTORIZAR },
  { label: SituacaoSolicitacaoEnum.EM_ANALISE_LABEL, value: SituacaoSolicitacaoEnum.EM_ANALISE },
  { label: SituacaoSolicitacaoEnum.ANALISADA_LABEL, value: SituacaoSolicitacaoEnum.ANALISADA },
  { label: SituacaoSolicitacaoEnum.NAO_AUTORIZADA_LABEL, value: SituacaoSolicitacaoEnum.NAO_AUTORIZADA },
  { label: SituacaoSolicitacaoEnum.PARA_INSTRUCAO_LABEL, value: SituacaoSolicitacaoEnum.PARA_INSTRUCAO },
  { label: SituacaoSolicitacaoEnum.INSTRUINDO_LABEL, value: SituacaoSolicitacaoEnum.INSTRUINDO },
  { label: SituacaoSolicitacaoEnum.INSTRUIDA_LABEL, value: SituacaoSolicitacaoEnum.INSTRUIDA },
  { label: SituacaoSolicitacaoEnum.AUTORIZADA_PARA_CALCULAR_LABEL, value: SituacaoSolicitacaoEnum.AUTORIZADA_PARA_CALCULAR },
  { label: SituacaoSolicitacaoEnum.CALCULANDO_LABEL, value: SituacaoSolicitacaoEnum.CALCULANDO },
  { label: SituacaoSolicitacaoEnum.CALCULADA_PARA_PAGAR_LABEL, value: SituacaoSolicitacaoEnum.CALCULADA_PARA_PAGAR },
  { label: SituacaoSolicitacaoEnum.REALIZANDO_PAGAMENTO_LABEL, value: SituacaoSolicitacaoEnum.REALIZANDO_PAGAMENTO },
  { label: SituacaoSolicitacaoEnum.PAGAMENTO_REALIZADO_LABEL, value: SituacaoSolicitacaoEnum.PAGAMENTO_REALIZADO },
  { label: SituacaoSolicitacaoEnum.CONFERINDO_PAGAMENTO_LABEL, value: SituacaoSolicitacaoEnum.CONFERINDO_PAGAMENTO },
  {
    label: SituacaoSolicitacaoEnum.PARA_CORRIGIR_INFORMACOES_PAGAMENTO_LABEL,
    value: SituacaoSolicitacaoEnum.PARA_CORRIGIR_INFORMACOES_PAGAMENTO
  },
  {
    label: SituacaoSolicitacaoEnum.INFORMACOES_PAGAMENTO_CORRIGIDAS_LABEL,
    value: SituacaoSolicitacaoEnum.INFORMACOES_PAGAMENTO_CORRIGIDAS
  },
  { label: SituacaoSolicitacaoEnum.PAGAMENTO_CONFORMIDADE_LABEL, value: SituacaoSolicitacaoEnum.PAGAMENTO_CONFORMIDADE }
];
