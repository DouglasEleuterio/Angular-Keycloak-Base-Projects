import { BaseActiveEntity } from 'src/app/core/domain/base.active.entity';
import { Solicitacao } from '../solicitacao/solicitacao.model';
import { LocalDificilAcesso } from '../local-dificil-acesso/local-dificil-acesso.model';
import { IntegradorLocalidade } from '../integrador/integrador-localidade/integrador-localidade.model';
import { MeioTransporteEnum } from '../meio-transporte/meio-transporte.enum';

export class TrechoViagem extends BaseActiveEntity {
  solicitacao: Solicitacao;
  origemUF: string;
  origemCidade: IntegradorLocalidade;
  localDificilAcessoOrigem: LocalDificilAcesso;
  destinoUF: string;
  destinoCidade: IntegradorLocalidade;
  localDificilAcessoDestino: LocalDificilAcesso;
  dataPartida: Date;
  meioTransporte: MeioTransporteEnum;
  sugestaoHorarioPartidaInicial: string;
  sugestaoHorarioPartidaFinal: string;
  utilizaTransporteOficial: boolean;
  utilizaDespachoBagagem: boolean;
  justificativaNaoRetornoOrigem: string;
  posicaoTrecho: number;
  trechoSolicitacaoOriginal: boolean;
}
