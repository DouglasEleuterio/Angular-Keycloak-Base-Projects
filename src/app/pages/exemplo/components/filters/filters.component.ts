import { AfterViewInit, Component, OnInit, Self } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterRefDirective } from '../../../../shared/filter/filter-ref.directive';
import { FilterParam } from '../../../../core/api/filter/filter.strategy';
import { ExpressionNode } from '@rsql/ast';
import builder from '@rsql/builder';
import { emit } from '@rsql/emitter';

@Component({
  selector: 'app-exemplo-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements AfterViewInit, OnInit {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, @Self() private filterRef: FilterRefDirective) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      nome: [''],
      descricao: ['']
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
    const nome = this.formGroup.controls['nome'].value;
    if (nome != null && nome.trim().length > 0) {
      restrictions.push(builder.eq('nome', `*${nome.trim()}*`));
    }
    const sigla = this.formGroup.controls['descricao'].value;
    if (sigla != null && sigla.trim().length > 0) {
      restrictions.push(builder.eq('descricao', sigla.trim()));
    }
    if (restrictions.length > 0) {
      return {
        search: emit(builder.and(...restrictions))
      };
    }
    return {};
  }
}
