import { Pipe, PipeTransform } from '@angular/core';
import { meioTransporteOptionsList } from 'src/app/domain/meio-transporte/meio-transporte.static';

@Pipe({ name: 'meioTransportePipe' })
export class MeioTransportePipe implements PipeTransform {
  transform(value: string) {
    const label = meioTransporteOptionsList.find(x => x.value === value)?.label;
    return label === undefined ? '' : label;
  }
}
