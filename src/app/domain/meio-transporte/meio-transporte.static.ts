import { MeioTransporteEnum } from './meio-transporte.enum';

export const meioTransporteOptionsList = [
  { label: MeioTransporteEnum.AEREO_LABEL, value: MeioTransporteEnum.AEREO },
  { label: MeioTransporteEnum.RODOVIARIO_LABEL, value: MeioTransporteEnum.RODOVIARIO },
  { label: MeioTransporteEnum.FERROVIARIO_LABEL, value: MeioTransporteEnum.FERROVIARIO },
  { label: MeioTransporteEnum.FLUVIAL_LABEL, value: MeioTransporteEnum.FLUVIAL },
  { label: MeioTransporteEnum.VEICULO_OFICIAL_LABEL, value: MeioTransporteEnum.VEICULO_OFICIAL },
  { label: MeioTransporteEnum.VEICULO_PROPRIO_LABEL, value: MeioTransporteEnum.VEICULO_PROPRIO }
];
