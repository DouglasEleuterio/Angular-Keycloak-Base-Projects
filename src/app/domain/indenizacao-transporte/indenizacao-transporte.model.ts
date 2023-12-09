import { BaseActiveEntity } from '../../core/domain/base.active.entity';

export class IndenizacaoTransporte extends BaseActiveEntity {
  normativo: string;
  dataNormativo: Date;
  vigenciaInicial: Date;
  vigenciaFinal: Date;
  consumoPadrao: number;
  politicaValorTransporte: string;
  combustivelPadrao: string;
}
