import { BaseActiveEntity } from 'src/app/core/domain/base.active.entity';
import { TipoEvento } from '../tipo-evento/tipo-evento.model';
import { SituacaoCondicaoEnum } from '../situacao-condicao/situacao-condicao.enum';

export class Evento extends BaseActiveEntity {
  nomeEvento: string;
  tipoEvento: TipoEvento;
  descricao: string;
  dataInicio: Date;
  dataTermino: Date;
  numeroDocumento: string;
  numeroProcesso: string;
  unidade: string;
  organizadora: string;
  condicoes: string;
  permiteDiasManutencao: boolean;
  situacaoCondicao: SituacaoCondicaoEnum;
}
