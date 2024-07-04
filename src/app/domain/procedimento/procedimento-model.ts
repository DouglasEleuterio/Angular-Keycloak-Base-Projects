import { Regiao } from './regiao.model';

export class Procedimento {
  id: number;
  idAux: number;
  nome: string;
  valor: number;
  situacao: boolean;
  quantidadeSessoes: number;
  intervaloEntreSessoes: number;
  regioes: Regiao[];
  dataCriacao: Date;
  dataAtualizacao: Date;
}
