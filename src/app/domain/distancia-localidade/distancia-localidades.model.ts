import { BaseActiveEntity } from '../../core/domain/base.active.entity';
import { IntegradorLocalidade } from '../integrador/integrador-localidade/integrador-localidade.model';

export class DistanciaLocalidade extends BaseActiveEntity {
  ufOrigem: string;
  localidadeOrigem: IntegradorLocalidade;
  ufDestino: string;
  localidadeDestino: IntegradorLocalidade;
  distancia: number;
}
