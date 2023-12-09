import { BaseActiveEntity } from '../../core/domain/base.active.entity';

export class Servidor extends BaseActiveEntity {
  nome: string;
  ramal: number;
  matricula: number;
  cpf: number;
  cargo: string;
  funcao: string;
  unidade: string;
}
