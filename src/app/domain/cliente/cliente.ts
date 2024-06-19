import { BaseActiveEntity } from '../../core/domain/base.active.entity';
import { EGenero } from './genero.enum';
import { Endereco } from '../endereco/endereco.model';

export class Cliente extends BaseActiveEntity {
  nome: string;
  cpf: string;
  email: string;
  telefone: number;
  dataNascimento: Date;
  genero: EGenero;
  endereco: Endereco;
  dataCriacao: Date;
  dataAtualizacao: Date;
}
