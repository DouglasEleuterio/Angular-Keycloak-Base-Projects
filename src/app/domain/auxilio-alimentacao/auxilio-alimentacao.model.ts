import { BaseActiveEntity } from 'src/app/core/domain/base.active.entity';

export class AuxilioAlimentacao extends BaseActiveEntity {
  orgao: string;
  dias: number;
}
