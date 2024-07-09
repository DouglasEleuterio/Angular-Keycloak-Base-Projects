import { Cliente } from '../../../../domain/cliente/cliente';
import { Observable, of } from 'rxjs';
import { Procedimento } from '../../../../domain/procedimento/procedimento-model';

export class FormDatas {
  public static getClientes(): Observable<Cliente[]> {
    return of(this.buildClientes());
  }

  static getProcedimentos() {
    return of(this.buildProcedimentos());
  }

  private static buildClientes(): Cliente[] {
    const clientes: Cliente[] = [];

    clientes.push({ id: 1, nome: 'Paula Cristina' }, { id: 2, nome: 'Inonete Almeida' });
    return clientes;
  }

  private static buildProcedimentos() {
    const procedimentos: Procedimento[] = [];

    procedimentos.push(
      {
        id: 1,
        nome: 'Depilação a Lazer',
        regioes: [
          {
            id: 1,
            nome: 'Axilas',
            valor: 70,
            quantidadeSessoes: 3,
            intervaloEntreSessoes: 15,
            procedimento: { id: 1, nome: 'Depilação a Lazer' }
          },
          {
            id: 2,
            nome: 'Virilha Simples',
            valor: 100,
            quantidadeSessoes: 3,
            intervaloEntreSessoes: 15,
            procedimento: { id: 1, nome: 'Depilação a Lazer' }
          },
          {
            id: 3,
            nome: 'Virilha Completa',
            valor: 150,
            quantidadeSessoes: 3,
            intervaloEntreSessoes: 15,
            procedimento: { id: 1, nome: 'Depilação a Lazer' }
          }
        ]
      },
      {
        id: 2,
        nome: 'Limpeza de Pele',
        regioes: [
          {
            id: 4,
            nome: 'Rosto',
            valor: 70,
            quantidadeSessoes: 3,
            intervaloEntreSessoes: 15,
            procedimento: { id: 2, nome: 'Limpeza de Pele' }
          }
        ]
      },
      {
        id: 3,
        nome: 'Botox',
        regioes: [
          {
            id: 5,
            nome: 'Terço Superior - Masculino',
            valor: 850,
            quantidadeSessoes: 1,
            intervaloEntreSessoes: 30,
            procedimento: { id: 3, nome: 'Botox' }
          },
          {
            id: 6,
            nome: 'Terço Superior - Feminino',
            valor: 800,
            quantidadeSessoes: 1,
            intervaloEntreSessoes: 30,
            procedimento: { id: 3, nome: 'Botox' }
          },
          {
            id: 7,
            nome: 'Full face',
            valor: 1200,
            quantidadeSessoes: 1,
            intervaloEntreSessoes: 30,
            procedimento: { id: 3, nome: 'Botox' }
          }
        ]
      }
    );
    return procedimentos;
  }
}
