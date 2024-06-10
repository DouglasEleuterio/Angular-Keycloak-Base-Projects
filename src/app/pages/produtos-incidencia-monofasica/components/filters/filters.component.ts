import { AfterViewInit, Component, OnInit, Self } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterRefDirective } from '../../../../shared/filter/filter-ref.directive';
import { FilterParam } from '../../../../core/api/filter/filter.strategy';
import { ExpressionNode } from '@rsql/ast';
import builder from '@rsql/builder';
import { emit } from '@rsql/emitter';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-produtos-incidencia-monofasica-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements AfterViewInit, OnInit {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, @Self() private filterRef: FilterRefDirective) {}

  ngAfterViewInit(): void {
    if (this.filterRef != null) {
      this.filterRef.setFormGroup(this.formGroup);
      this.filterRef.searchStrategy = () => this.construirQueryConsulta();
    }
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      dataEmissaoInicio: [null],
      dataEmissaoFim: [null],
      cnpj: [null]
    });
  }

  private construirQueryConsulta(): FilterParam {
    const restrictions: ExpressionNode[] = [];

    const dataEmissaoInicio: string = this.formGroup.controls.dataEmissaoInicio?.value;
    if (dataEmissaoInicio != null && dataEmissaoInicio !== '') {
      const formattedDate = this.formattedDataString(dataEmissaoInicio, true);
      restrictions.push(builder.ge('dataEmissaoInicio', `${formattedDate}`));
    }

    const dataEmissaoFim: string = this.formGroup.controls.dataEmissaoFim?.value;
    if (dataEmissaoFim != null && dataEmissaoFim !== '') {
      const formattedDateFim = this.formattedDataString(dataEmissaoFim, false);
      restrictions.push(builder.le('dataEmissaoFim', `${formattedDateFim}`));
    }

    const cnpj = this.formGroup.controls.cnpj?.value;
    if (cnpj != null && cnpj.trim().length > 0) {
      restrictions.push(builder.eq('cnpj', `${cnpj.trim()}`));
    }

    if (restrictions.length > 0) {
      return {
        search: emit(builder.and(...restrictions))
      };
    }
    return {};
  }

  formattedDataString(data: string, isInicio: boolean): string {
    const datepipe: DatePipe = new DatePipe('en-US');
    const maskInicio = 'yyyy-MM-dd';
    const maskFim = 'yyyy-MM-dd';

    const dateParse: Date = new Date(Date.parse(data));
    return datepipe.transform(dateParse, isInicio ? maskInicio : maskFim);
  }
}
