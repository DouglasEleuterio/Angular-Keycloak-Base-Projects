export class DataUtils {

  public static formatarDataParaFullcalendar(data): string {
    const dataObj = new Date(data);
    // Obtém os componentes da data
    const ano = dataObj.getFullYear();
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0'); // Mês começa em 0 (janeiro = 0)
    const dia = dataObj.getDate().toString().padStart(2, '0');

    // Formata a data no formato desejado
    return `${ano}-${mes}-${dia}`;
  }
}
