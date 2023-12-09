import { BaseActiveEntity } from 'src/app/core/domain/base.active.entity';
import { IntegradorLocalidade } from '../integrador/integrador-localidade/integrador-localidade.model';

export class LocalDificilAcesso extends BaseActiveEntity {
  localidade: IntegradorLocalidade;
  nome: string;
  distancia: number;
  tempo: number;
  condicoes: string;
  resolucao: string;
}
