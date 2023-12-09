import { TipoSolicitanteEnum } from '../tipo-solicitante/tipo-solicitante.enum';
import { Colaborador } from './colaborador.model';
import { ContaBancaria } from '../conta-bancaria/conta-bancaria.model';
import { Magistrado } from './magistrado.model';
import { Servidor } from './servidor.model';

export class Solicitante {
  id?: number | string;
  tipoSolicitante: TipoSolicitanteEnum;
  cpf: string;
  nome: string;
  colaborador: Colaborador;
  servidor: Servidor;
  magistrado: Magistrado;
  contaBancaria: ContaBancaria;
}
