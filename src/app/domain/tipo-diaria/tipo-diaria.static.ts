import { Options } from '../options/options.interface';
import { TipoDiariaEnum } from './tipo-diaria.enum';

export const tipoDiariaOptionsStatic: Options[] = [
  { label: TipoDiariaEnum.NACIONAL_LABEL, value: TipoDiariaEnum.NACIONAL },
  { label: TipoDiariaEnum.INTERNACIONAL_LABEL, value: TipoDiariaEnum.INTERNACIONAL }
];
