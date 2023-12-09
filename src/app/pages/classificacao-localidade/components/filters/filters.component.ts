import { AfterViewInit, Component, OnInit, Self } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterRefDirective } from '../../../../shared/filter/filter-ref.directive';
import { FilterParam } from '../../../../core/api/filter/filter.strategy';
import { ExpressionNode } from '@rsql/ast';
import builder from '@rsql/builder';
import { emit } from '@rsql/emitter';
import { simNaoOptionsList } from 'src/app/domain/situacao/simNao.static';
import { TipoLocalidade } from 'src/app/domain/tipo-localidade/tipo-localidade.model';
import { TipoLocalidadeService } from 'src/app/domain/tipo-localidade/tipo-localidade.service';
import { from } from 'src/app/core/api/select/select';

@Component({
  selector: 'app-classificacao-localidade-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements AfterViewInit, OnInit {
  formGroup: FormGroup;
  ufList = ['AM', 'MT', 'PB'];
  optSituacao = simNaoOptionsList;
  localidadeMap = { AM: ['Manaus', 'Cidade'], MT: ['Cuiabá'], PB: ['João Pessoa', 'Campina Grande', 'Souza'] };
  localidadeList = [];
  tipoLocalidadeList = [];

  constructor(
    private formBuilder: FormBuilder,
    @Self() private filterRef: FilterRefDirective,
    protected serviceTipoLocalidade: TipoLocalidadeService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      uf: [''],
      localidade: [''],
      tipoLocalidade: ['']
    });
    this.getTipoLocalidadeList();
    this.onUfChange();
    this.calledSubscribeUfChanges();
  }

  getTipoLocalidadeList(): void {
    const query = from<TipoLocalidade>()
      .select((u: TipoLocalidade) => [u.id, u.descricao])
      .asc(x => x.descricao)
      .getQuery();

    this.serviceTipoLocalidade.fetchSelect<TipoLocalidade[]>(query).subscribe(data => (this.tipoLocalidadeList = data));
  }

  ngAfterViewInit(): void {
    if (this.filterRef != null) {
      this.filterRef.setFormGroup(this.formGroup);
      this.filterRef.searchStrategy = () => this.construirQueryConsulta();
    }
  }

  calledSubscribeUfChanges(): void {
    this.formGroup.controls.uf.valueChanges.subscribe(value => {
      value ? null : this.onUfChange();
    });
  }

  onUfChange(): void {
    const selectedUf = this.formGroup.get('uf').value;
    if (selectedUf) {
      const selectedLocalidades = this.localidadeMap[selectedUf];
      this.formGroup.get('localidade').setValue(null);
      this.localidadeList = selectedLocalidades.map(label => ({ value: label, label }));
      this.formGroup.controls.localidade.enable();
    } else {
      this.formGroup.get('localidade').setValue(null);
      this.localidadeList = [];
      this.formGroup.controls.localidade.disable();
    }
  }

  construirQueryConsulta(): FilterParam {
    const restrictions: ExpressionNode[] = [];
    const uf = this.formGroup.controls['uf'].value;
    if (uf) {
      restrictions.push(builder.eq('uf', uf));
    }
    const localidade = this.formGroup.controls['localidade'].value;
    if (localidade) {
      restrictions.push(builder.eq('localidade', localidade));
    }

    const tiposLocalidade = this.formGroup.controls.tipoLocalidade?.value;
    const tiposLocalidadeId = [];
    if (tiposLocalidade) {
      for (const index in tiposLocalidade) {
        tiposLocalidadeId.push(tiposLocalidade[index].id);
      }
      restrictions.push(builder.in('tipoLocalidade.id', tiposLocalidadeId));
    }

    if (restrictions.length > 0) {
      return {
        search: emit(builder.and(...restrictions))
      };
    }
    return {};
  }
}
