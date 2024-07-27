import { BaseEntity } from '../../../core/domain/base.entity';

export class RegiaoCreateRequest extends BaseEntity {
  nome: string;
  quantidadeSessoes: number;
  intervaloEntreSessoes: number;
  valor: number;
}
