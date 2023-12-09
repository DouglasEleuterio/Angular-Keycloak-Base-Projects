import { BaseActiveEntity } from 'src/app/core/domain/base.active.entity';
import { Contato } from './contato.model';

export class CompanhiaAerea extends BaseActiveEntity {
  nome: string;
  sigla: string;
  cnpj: string;
  listaContato: Contato[];
}
