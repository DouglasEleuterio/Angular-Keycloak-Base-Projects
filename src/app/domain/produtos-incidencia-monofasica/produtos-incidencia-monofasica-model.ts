import { BaseEntity } from '../../core/domain/base.entity';
import { InfNfe } from '../xml/infnfe.model';
import { Imposto } from '../xml/imposto/imposto.model';
import { Det } from '../xml/det.model';

export class ProdutoIncidenciaMonofasica extends BaseEntity{
  nome: string;
  cProd: string;
  cEAN: string;
  xProd: string;
  ncm: string;
  cfop: string;
  uCom: string;
  qCom: string;
  vUnCom: string;
  vProd: string;
  cEANTrib: string;
  uTrib: string;
  qTrib: string;
  vUnTrib: string;
  indTot: string;
  det: Det;
}
