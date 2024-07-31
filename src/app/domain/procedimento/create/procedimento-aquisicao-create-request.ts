export class ProcedimentoAquisicaoRequest {
  id?: number;
  procedimentoOrigemId: number;
  procedimento?: string;
  nome: string;
  quantidadeSessoes: number;
  intervaloEntreSessoes: number;
  valor: number;
}
