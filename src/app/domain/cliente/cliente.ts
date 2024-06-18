import { BaseActiveEntity } from '../../core/domain/base.active.entity';

export class Cliente extends BaseActiveEntity {
  nome: string;
  email: string;
  cpf: string;
}
