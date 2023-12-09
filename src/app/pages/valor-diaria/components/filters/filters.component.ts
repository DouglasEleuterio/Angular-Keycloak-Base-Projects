import { AfterViewInit, Component, OnInit, Self } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExpressionNode } from '@rsql/ast';
import builder from '@rsql/builder';
import { emit } from '@rsql/emitter';
import { FilterParam } from 'src/app/core/api/filter/filter.strategy';
import { from } from 'src/app/core/api/select/select';
import { simNaoOptionsList } from 'src/app/domain/situacao/simNao.static';
import { TipoLocalidade } from 'src/app/domain/tipo-localidade/tipo-localidade.model';
import { TipoLocalidadeService } from 'src/app/domain/tipo-localidade/tipo-localidade.service';
import { FilterRefDirective } from 'src/app/shared/filter/filter-ref.directive';

@Component({
  selector: 'app-valor-diaria-filters',
  templateUrl: './filters.component.html'
})
export class FiltersComponent implements AfterViewInit, OnInit {
  formGroup: FormGroup;
  optSituacao = simNaoOptionsList;

  listTipoLocalidade: TipoLocalidade[] = [];

  constructor(
    private tipoLocalidadeService: TipoLocalidadeService,
    private formBuilder: FormBuilder,
    @Self() private filterRef: FilterRefDirective
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      normativo: [null],
      tipoLocalidade: [null],
      situacao: [null]
    });

    this.getTipoLocalidade();
  }

  ngAfterViewInit(): void {
    if (this.filterRef != null) {
      this.filterRef.setFormGroup(this.formGroup);
      this.filterRef.searchStrategy = () => this.construirQueryConsulta();
    }
  }

  getTipoLocalidade(): void {
    const query = from<TipoLocalidade>()
      .select((u: TipoLocalidade) => [u.id, u.descricao])
      .asc(x => x.descricao)
      .getQuery();

    this.tipoLocalidadeService.fetchSelect<TipoLocalidade[]>(query).subscribe(data => (this.listTipoLocalidade = data));
  }

  construirQueryConsulta(): FilterParam {
    const restrictions: ExpressionNode[] = [];

    const normativo = this.formGroup.controls.normativo?.value;
    if (normativo != null && normativo.trim().length > 0) {
      restrictions.push(builder.eq('normativo', `*${normativo.trim()}*`));
    }

    const tiposLocalidade = this.formGroup.controls.tipoLocalidade?.value;
    const tiposLocalidadeId = [];
    if (tiposLocalidade) {
      for (const index in tiposLocalidade) {
        tiposLocalidadeId.push(tiposLocalidade[index].id);
      }
      restrictions.push(builder.in('tipoLocalidade.id', tiposLocalidadeId));
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
