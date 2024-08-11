import { Profissional } from '../profissional/profissional.model';

export class ConfirmarAgendamento {
  id: string;
  profissional: Profissional;
  dataInicio: Date;
  dataFim: Date;
}
