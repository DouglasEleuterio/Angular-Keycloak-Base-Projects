import { PreAgendamento } from '../../../domain/pre-agendamento/pre-agendamento';
import { Observable, of } from 'rxjs';

export class ListDatas {
  static getAgendamentos(): Observable<PreAgendamento[]> {
    return of(this.buildPreAgendamentos());
  }

  static buildPreAgendamentos(): PreAgendamento[] {
    const date = new Date();
    return [
      {
        nomeProcedimento: 'Depilação a Lazer - Axilas',
        data: new Date(date.setMonth(date.getMonth() + 1)),
        cliente: { nome: 'Paula Cristina' }
      },
      {
        nomeProcedimento: 'Depilação a Lazer - Axilas',
        data: new Date(date.setMonth(date.getMonth() + 2)),
        cliente: { nome: 'Paula Cristina' }
      },
      {
        nomeProcedimento: 'Depilação a Lazer - Axilas',
        data: new Date(date.setMonth(date.getMonth() + 3)),
        cliente: { nome: 'Paula Cristina' }
      },
      {
        nomeProcedimento: 'Depilação a Lazer - Axilas',
        data: new Date(date.setMonth(date.getMonth() + 4)),
        cliente: { nome: 'Paula Cristina' }
      }
    ];
  }
}
