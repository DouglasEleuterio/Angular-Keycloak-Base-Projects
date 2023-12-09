import { Options } from '../options/options.interface';
import { TipoRegimePrevidenciaEnum } from './tipo-regime-previdencia.enum';

export const tipoRegimePrevidenciaOptionsStatic: Options[] = [
  { label: TipoRegimePrevidenciaEnum.PROPRIO_STRING, value: TipoRegimePrevidenciaEnum.PROPRIO },
  { label: TipoRegimePrevidenciaEnum.GERAL_STRING, value: TipoRegimePrevidenciaEnum.GERAL }
];
