import { BaseActiveEntity } from '../../core/domain/base.active.entity';

enum EGenero {
  MASCULINO = 'Masculino',
  FEMININO = 'Feminino'
}

export class Cliente extends BaseActiveEntity {
  nome: string;
  email: string;
  cpf: string;
  genero: EGenero;
}
