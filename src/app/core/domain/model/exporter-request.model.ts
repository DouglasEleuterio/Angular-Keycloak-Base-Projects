export class ExporterTypeConfig {
  pdf: ExporterConfig;
  csv: ExporterConfig;
  excel: ExporterConfig;
}

export class ExporterConfig {
  columns: Array<string>;
  properties: ExporterProperties;
}

export class ExporterRequest {
  title: string;
  search: string;
  columns: Array<string>;
  properties: ExporterProperties;
}

export class ExporterProperties {
  fontSize: number;
  orientation: Orientation;
  encoding: Encoding;
}

export enum ExporterType {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV'
}

export enum Orientation {
  PORTRAIT = 'PORTRAIT',
  LANDSCAPE = 'LANDSCAPE'
}

export enum Encoding {
  ISO_8859_1 = 'ISO_8859_1',
  UTF_8 = 'UTF_8'
}
