import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { cargosEfetivosList, cargosFuncoesList } from 'src/app/domain/cargos/cargos.static';

@Pipe({ name: 'cargoPipe' })
export class CargoPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: string): string {
    let cargo = cargosEfetivosList.find(x => x.value === value);

    if (cargo === undefined) {
      cargo = cargosFuncoesList.find(x => x.value === value);
    }

    return cargo === undefined ? this.translateService.instant('shared.msg.not_defined'.toUpperCase()) : cargo.label;
  }
}
