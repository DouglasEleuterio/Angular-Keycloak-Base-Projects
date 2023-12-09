import { DatePipe } from '@angular/common';

export class HorasServidor {
  horas: number;
  dias: number;
  minutos: number;
}

export default class TimeUtil {
  static somarHorasServidor(
    folgasPorServidorEvento: Map<string, HorasServidor[]>,
    somaPorServidorEvento: Map<string, HorasServidor>
  ): void {
    for (const [servidorEvento, folgas] of folgasPorServidorEvento.entries()) {
      const [servidor, descricaoEvento] = servidorEvento.split('-');
      const soma = folgas.reduce(
        (somaParcial, folga) => {
          somaParcial.horas += folga.horas;
          somaParcial.dias += folga.dias;
          somaParcial.minutos += folga.minutos;
          if (somaParcial.minutos >= 60) {
            somaParcial.horas += Math.floor(somaParcial.minutos / 60);
            somaParcial.minutos = somaParcial.minutos % 60;
          }

          if (somaParcial.horas >= 24) {
            somaParcial.dias += Math.floor(somaParcial.horas / 24);
            somaParcial.horas = somaParcial.horas % 24;
          }
          return somaParcial;
        },
        { horas: 0, dias: 0, minutos: 0 }
      );
      const servidorEventoKey = `${servidor}-${descricaoEvento}`;
      if (!somaPorServidorEvento.has(servidorEventoKey)) {
        somaPorServidorEvento.set(servidorEventoKey, { horas: 0, dias: 0, minutos: 0 });
      }
      const somaAnterior = somaPorServidorEvento.get(servidorEventoKey);
      somaPorServidorEvento.set(servidorEventoKey, {
        horas: somaAnterior.horas + soma.horas,
        dias: somaAnterior.dias + soma.dias,
        minutos: somaAnterior.minutos + soma.minutos
      });
    }
  }

  static formattedDateFilterByAno(ano: number, isInicio = false): string {
    const date = new Date().setFullYear(ano);
    const datePipe = new DatePipe('en-US');
    const mask = isInicio ? 'yyyy-01-01T00:00' : 'yyyy-12-31T23:59';

    return datePipe.transform(date, mask);
  }

  static formattedDateFilterByDia(data: string, isInicio = false): string {
    const datepipe: DatePipe = new DatePipe('en-US');
    const mask = isInicio ? 'yyyy-MM-ddT00:00' : 'yyyy-MM-ddT23:59';

    const dateParse: Date = new Date(Date.parse(data));
    return datepipe.transform(dateParse, mask);
  }

  static formattedDateView(data: Date): string {
    return new DatePipe('en-US').transform(data, 'dd/MM/yyyy');
  }
}
