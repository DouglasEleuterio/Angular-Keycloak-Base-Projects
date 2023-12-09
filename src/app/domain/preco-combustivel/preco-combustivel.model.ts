import { BaseActiveEntity } from '../../core/domain/base.active.entity';

export class PrecoCombustivel extends BaseActiveEntity {
  normativo: string;
  dataNormativo: Date;
  precoGasolina: number;
  precoEtanol: number;
  precoDiesel: number;
  precoGNV: number;
}
