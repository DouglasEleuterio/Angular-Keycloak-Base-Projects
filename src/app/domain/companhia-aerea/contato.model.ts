import { BaseActiveEntity } from 'src/app/core/domain/base.active.entity';
import { IntegradorLocalidade } from '../integrador/integrador-localidade/integrador-localidade.model';

export class Contato extends BaseActiveEntity {
  nome: string;
  telefone: string;
  email: string;
  uf: string;
  cidade: IntegradorLocalidade;
  cargo: string;
}
