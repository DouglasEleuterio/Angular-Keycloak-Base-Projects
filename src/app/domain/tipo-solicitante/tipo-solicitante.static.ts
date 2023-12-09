import { Options } from '../options/options.interface';
import { TipoSolicitanteEnum } from './tipo-solicitante.enum';

export const tipoSolicitanteOptionsStatic: Options[] = [
  { label: TipoSolicitanteEnum.COLABORADOR_LABEL, value: TipoSolicitanteEnum.COLABORADOR },
  { label: TipoSolicitanteEnum.COLABORADOR_EVENTUAL_LABEL, value: TipoSolicitanteEnum.COLABORADOR_EVENTUAL },
  { label: TipoSolicitanteEnum.SERVIDOR_LABEL, value: TipoSolicitanteEnum.SERVIDOR }
];

export const tipoSolicitanteAdministradorOptionsStatic: Options[] = [
  ...tipoSolicitanteOptionsStatic,
  { label: TipoSolicitanteEnum.MAGISTRADO_LABEL, value: TipoSolicitanteEnum.MAGISTRADO }
];
