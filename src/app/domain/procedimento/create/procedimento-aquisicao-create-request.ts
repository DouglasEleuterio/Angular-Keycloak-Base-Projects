export class ProcedimentoAquisicaoRequest {
  id?: number;
  regiaoOrigemId: number;
  procedimento?: string;
  nome: string;
  quantidadeSessoes: number;
  intervaloEntreSessoes: number;
  valor: number;
}
