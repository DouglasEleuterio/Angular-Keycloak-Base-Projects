import { BaseActiveEntity } from 'src/app/core/domain/base.active.entity';
import { Justificativa } from '../justificativa/justificativa.model';
import { SituacaoSolicitacao } from '../situacao-solicitacao/situacao-solicitacao.model';
import { Solicitacao } from '../solicitacao/solicitacao.model';

export class HistoricoSituacaoSolicitacao extends BaseActiveEntity {
  dataSituacaoSolicitacao: Date;
  solicitacao: Solicitacao;
  situacaoSolicitacaoAnterior: SituacaoSolicitacao;
  situacaoSolicitacaoNova: SituacaoSolicitacao;
  analiseSolicitacao: string;
  justificativa: Justificativa;
  detalhamentoJustificativa: string;
  idResponsavelMudanca: string;
  statusAnaliseSolicitacao: boolean;
}
