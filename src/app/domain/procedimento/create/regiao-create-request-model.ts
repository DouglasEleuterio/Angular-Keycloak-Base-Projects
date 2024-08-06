import { BaseEntity } from '../../../core/domain/base.entity';
import { Profissional } from '../../profissional/profissional.model';

export class RegiaoCreateRequest extends BaseEntity {
  nome: string;
  quantidadeSessoes: number;
  intervaloEntreSessoes: number;
  duracao?: number;
  valor: number;
  profissional?: Profissional;
}
