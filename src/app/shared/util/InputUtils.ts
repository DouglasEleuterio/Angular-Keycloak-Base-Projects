import { StringUtils } from './StringUtils';

export class InputUtils {
  /**
   * Esse método recebe um objeto de tipo evento que contém informações sobre um input.
   * Esse método substitui espaços em branco por sublinhados,
   * Substitui caracteres acentuados em caracteres simples
   * Remove Caracteres especiais
   * @param event O objeto de tipo evento que contém informações sobre o tipo evento que disparou a função.
   * @returns Void.
   */
  public static limparTextoDeCaracteresEspeciaisEAcentos(event): void {
    const valor: string = event.target.value;
    // Define o novo valor do input sem caracteres especiais
    event.target.value = StringUtils.limparTextoDeCaracteresEspeciaisEAcentos(valor);
  }

  /**
   *  Remove todos os caracteres que não são letras, números, sublinhados ou espaços
   * @param event valor a ser convertido
   */
  public static removeCaracteresEspeciais(event): void {
    const valor: string = event.target.value;
    event.target.value = StringUtils.removeCaracteresEspeciais(valor);
  }
}
