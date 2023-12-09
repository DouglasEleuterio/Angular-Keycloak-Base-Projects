export class ExporterData {
  filename: string;
  blob: Blob;

  constructor(filename: string, blob: Blob) {
    this.filename = filename;
    this.blob = blob;
  }
}
