const extensaonNameAndMime = {
  pdf: {
    mime: 'application/pdf',
    extension: '.pdf'
  },
  doc: {
    mime: 'application/msword',
    extension: '.doc'
  },
  docx: {
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    extension: '.docx'
  },
  xls: {
    mime: 'application/vnd.ms-excel',
    extension: '.xls'
  },
  xlsx: {
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extension: '.xlsx'
  },
  jpg: {
    mime: 'image/jpeg',
    extension: '.jpg'
  },
  png: {
    mime: 'image/png',
    extension: '.png'
  },
  zip: {
    mime: 'application/zip',
    extension: '.zip'
  },
  default: 'Valor não encontrado ou não permitido.'
};

export class ArquivoUtils {
  public static base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  public static fileSizeFormated(size: number): string {
    if (size) {
      const calculated = (size / 1048576).toFixed(2);
      return `${calculated} MB`;
    }

    return null;
  }

  public static mimeToExtensao(mimeName: string): string {
    switch (mimeName) {
      case extensaonNameAndMime.pdf.mime:
        return extensaonNameAndMime.pdf.extension;

      case extensaonNameAndMime.doc.mime:
        return extensaonNameAndMime.doc.extension;

      case extensaonNameAndMime.docx.mime:
        return extensaonNameAndMime.docx.extension;

      case extensaonNameAndMime.xls.mime:
        return extensaonNameAndMime.xls.extension;

      case extensaonNameAndMime.xlsx.mime:
        return extensaonNameAndMime.xlsx.extension;

      case extensaonNameAndMime.jpg.mime:
        return extensaonNameAndMime.jpg.extension;

      case extensaonNameAndMime.png.mime:
        return extensaonNameAndMime.png.extension;

      case extensaonNameAndMime.zip.mime:
        return extensaonNameAndMime.zip.extension;

      default:
        return extensaonNameAndMime.default;
    }
  }
}
