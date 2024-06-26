import { Estado } from './estado.model';

export class Cidade {
  id: number;
  nome: string;
  codigoIBGE: string;
  estado: Estado;
  dataCriacao: Date;
  dataAtualizacao: Date;
}
