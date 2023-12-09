import { AfterViewInit, Component, OnInit, Self } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterRefDirective } from '../../../../shared/filter/filter-ref.directive';
import { FilterParam } from '../../../../core/api/filter/filter.strategy';
import { ExpressionNode } from '@rsql/ast';
import builder from '@rsql/builder';
import { emit } from '@rsql/emitter';
import { simNaoOptionsList } from 'src/app/domain/situacao/simNao.static';

@Component({
  selector: 'app-indenizacao-transporte-filters',
  templateUrl: './filters.component.html'
})
export class FiltersComponent implements AfterViewInit, OnInit {
  formGroup: FormGroup;
  optSituacao = simNaoOptionsList;

  constructor(private formBuilder: FormBuilder, @Self() private filterRef: FilterRefDirective) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      normativo: [null],
      situacao: [null]
    });
  }

  ngAfterViewInit(): void {
    if (this.filterRef != null) {
      this.filterRef.setFormGroup(this.formGroup);
      this.filterRef.searchStrategy = () => this.construirQueryConsulta();
    }
  }

  construirQueryConsulta(): FilterParam {
    const restrictions: ExpressionNode[] = [];
    const normativo = this.formGroup.controls.normativo?.value;
    if (normativo != null && normativo.trim().length > 0) {
      restrictions.push(builder.eq('normativo', `*${normativo.trim()}*`));
    }

    const situacao = this.formGroup.controls.situacao?.value;
    if (situacao != null) {
      restrictions.push(builder.eq('situacao', situacao));
    }

    if (restrictions.length > 0) {
      return {
        search: emit(builder.and(...restrictions))
      };
    }

    return {};
  }
}
