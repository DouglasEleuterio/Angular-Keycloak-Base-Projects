export class Colaborador {
  id?: number | string;
  dataNascimento: Date;
  regimePrevidencia: string;
  cargoFuncao: string;
  classificacaoCargoFuncao: string;
  unidadeResponsavelSolicitacao: string;
  recebeAuxilioAlimentacao?: boolean;
  valorAuxilioAlimentacao?: number;
  recebeAuxilioTransporte?: boolean;
  valorAuxilioTransporte?: number;
}
