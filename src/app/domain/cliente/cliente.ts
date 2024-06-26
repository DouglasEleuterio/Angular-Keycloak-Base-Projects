import { BaseActiveEntity } from '../../core/domain/base.active.entity';
import { EGenero } from './genero.enum';
import { Endereco } from '../endereco/endereco.model';

export class Cliente extends BaseActiveEntity {
  dataCriacao: Date;
  dataAtualizacao: Date;
  situacao: boolean;
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: number;
  endereco: Endereco;
  dataNascimento: Date;
  genero: EGenero;
}
