import { ESituacaoRegistro } from './situacao-registro.enum';
import { Historico } from '../historico/historico.model';

export class Auditoria {
  id: number;
  situacaoRegistro: ESituacaoRegistro;
  dado: string;
  historico: Historico;
}
