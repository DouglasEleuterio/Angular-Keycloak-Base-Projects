import { Icms } from './icms.model';
import { Ipi } from './ipi.model';
import { Cofins } from './cofins.model';
import { Pis } from './pis.model';

export class Imposto {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ICMS: Icms;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  IPI: Ipi;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  COFINS: Cofins;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  PIS: Pis;
}
