import { BaseEntity } from 'src/app/core/domain/base.entity';
import { SituacaoSolicitacaoFase } from '../situacao-solicitacao-fase/situacao-solicitacao-fase.model';

export class SituacaoSolicitacao extends BaseEntity {
  descricao: string;
  chave: string;
  situacaoSolicitacaoFase: SituacaoSolicitacaoFase;
}
