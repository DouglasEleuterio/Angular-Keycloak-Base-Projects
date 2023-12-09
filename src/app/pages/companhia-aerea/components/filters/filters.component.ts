import { AfterViewInit, Component, OnInit, Self } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExpressionNode } from '@rsql/ast';
import builder from '@rsql/builder';
import { emit } from '@rsql/emitter';
import { FilterParam } from 'src/app/core/api/filter/filter.strategy';
import { simNaoOptionsList } from 'src/app/domain/situacao/simNao.static';
import { FilterRefDirective } from 'src/app/shared/filter/filter-ref.directive';

@Component({
  selector: 'app-companhia-aerea-filters',
  templateUrl: './filters.component.html'
})
export class FiltersComponent implements AfterViewInit, OnInit {
  formGroup: FormGroup;
  optSituacao = simNaoOptionsList;
  constructor(private formBuilder: FormBuilder, @Self() private filterRef: FilterRefDirective) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      nome: [null],
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

    const nome = this.formGroup.controls.nome.value;
    if (nome != null && nome.trim().length > 0) {
      restrictions.push(builder.eq('nome', `*${nome.trim()}*`));
    }

    const situacao = this.formGroup.controls.situacao.value;
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
