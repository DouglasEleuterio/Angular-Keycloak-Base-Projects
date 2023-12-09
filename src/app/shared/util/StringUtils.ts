export class StringUtils {
  /**
   * Esse método substitui espaços em branco por sublinhados,
   * Substitui caracteres acentuados em caracteres simples
   * Remove Caracteres especiais
   * e atualiza o valor.
   * @param valor String que contém o valor a ser transformado
   * @returns string. Valor convertido.
   */
  public static limparTextoDeCaracteresEspeciaisEAcentos(valor: string): string {
    return valor
      .trim() //Remove espaços em branco
      .normalize('NFD') // Normaliza o valor atual para decompor caracteres acentuados em caracteres simples e acentos separados
      .replace(/[\u0300-\u036f]/g, '') // Remove todos os acentos do texto
      .replace(/([a-zA-Z]) +([a-zA-Z])/g, '$1_$2') // Substitui todos os espaços entre palavras por um sublinhado
      .replace(/[^\w\s]+/g, '') // Remove todos os caracteres que não são letras, números, sublinhados ou espaços
      .replace(/([ _]+[^\s_]+)/g, '_$1') // Substitui grupos de espaço em branco ou _ seguidos de caracteres por um único _
      .replace(/[ _]+/g, '_'); // Substitui múltiplos espaços em branco ou _ consecutivos por um único _
  }

  /**
   *  Remove todos os caracteres que não são letras, números, sublinhados ou espaços
   * @param valor valor a ser convertido
   * @return valor valor convertido
   */
  public static removeCaracteresEspeciais(valor: string): string {
    return valor.trim().replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ0-9_ ]+/g, '');
  }
}
