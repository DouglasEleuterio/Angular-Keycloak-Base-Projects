import { BaseActiveEntity } from 'src/app/core/domain/base.active.entity';
import { TipoDiariaEnum } from '../tipo-diaria/tipo-diaria.enum';
import { TipoSolicitacaoEnum } from '../tipo-solicitacao/tipo-solicitacao.enum';
import { SituacaoSolicitacao } from '../situacao-solicitacao/situacao-solicitacao.model';
import { Solicitante } from '../solicitante/solicitante.model';
import { Evento } from '../evento/evento.model';
import { DocumentoComplementacao } from './documento-complementacao.model';
import { GrupoTrabalho } from '../grupo-trabalho/grupo-trabalho.model';
import { PerNoite } from '../pernoite/pernoite.model';
import { TrechoViagem } from '../trecho-viagem/trecho-viagem.model';
import { Bagagem } from '../bagagem/bagagem.model';

export class Solicitacao extends BaseActiveEntity {
  tipoDiaria: TipoDiariaEnum;
  tipoSolicitacao: TipoSolicitacaoEnum;
  solicitacaoOriginal: Solicitacao;
  documentoComplementacao: DocumentoComplementacao;
  justificativaComplementacao: string;
  solicitante: Solicitante;
  situacaoSolicitacao: SituacaoSolicitacao;
  participaGrupoTrabalho?: boolean;
  grupoTrabalho?: GrupoTrabalho;
  assessoraMembroTribunal?: boolean;
  justificativaSolicitacao?: string;
  haveraPernoite?: boolean;
  pernoite?: PerNoite;
  haveraBagagem?: boolean;
  eventos?: Evento[];
  trechoViagem?: TrechoViagem[];
  bagagem?: Bagagem;
}
