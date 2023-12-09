import { BaseActiveEntity } from 'src/app/core/domain/base.active.entity';

export class IntegradorLocalidade extends BaseActiveEntity {
  codigoLocalidade: string;
  descricaoLocalidade: string;
  uf: string;
}
