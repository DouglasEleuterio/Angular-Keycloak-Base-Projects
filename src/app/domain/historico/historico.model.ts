import { EEvento } from './evento.enum';
import { ETipoEntidade } from './tipo-entidade.enum';
import { Auditoria } from '../auditoria/auditoria.model';

export class Historico {
  id: number;
  tipoEvento: EEvento;
  dataOcorrencia: Date;
  nomeUsuario: string;
  tipoEntidade: ETipoEntidade;
  idEntidadeGeradora: number;
  auditorias: Auditoria[];
}
