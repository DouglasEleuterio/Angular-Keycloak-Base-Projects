import { BaseActiveEntity } from '../../core/domain/base.active.entity';
import { NFe } from './nfe.model';

export class Xml extends BaseActiveEntity {
  versao: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  NFe: NFe;
}
