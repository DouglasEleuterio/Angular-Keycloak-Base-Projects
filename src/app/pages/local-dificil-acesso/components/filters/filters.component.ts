import { AfterViewInit, Component, OnInit, Self } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExpressionNode } from '@rsql/ast';
import builder from '@rsql/builder';
import { emit } from '@rsql/emitter';
import { FilterParam } from 'src/app/core/api/filter/filter.strategy';
import { IntegradorLocalidade } from 'src/app/domain/integrador/integrador-localidade/integrador-localidade.model';
import { IntegradorLocalidadeService } from 'src/app/domain/integrador/integrador-localidade/integrador-localidade.service';
import { simNaoOptionsList } from 'src/app/domain/situacao/simNao.static';
import { FilterRefDirective } from 'src/app/shared/filter/filter-ref.directive';

@Component({
  selector: 'app-local-dificil-acesso-filters',
  templateUrl: './filters.component.html'
})
export class FiltersComponent implements AfterViewInit, OnInit {
  formGroup: FormGroup;
  optSituacao = simNaoOptionsList;
  localidadeMap = { MT: ['Cuiabá', 'Rondonópolis', 'Alta Floresta'] };
  selectedLocalidades = this.localidadeMap['MT'];
  localidadeList = [];

  filteredLocalidades: IntegradorLocalidade[];

  constructor(
    private formBuilder: FormBuilder,
    @Self() private filterRef: FilterRefDirective,
    private integradorLocalidadeService: IntegradorLocalidadeService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      localidade: [''],
      nome: [''],
      condicoes: ['']
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

    const localidade = this.formGroup.controls.localidade.value;
    if (localidade != null && localidade.descricaoLocalidade.trim().length > 0) {
      restrictions.push(builder.eq('localidade.descricaoLocalidade', `*${localidade.descricaoLocalidade.trim()}*`));
    }

    const nome = this.formGroup.controls['nome'].value;
    if (nome != null && nome.trim().length > 0) {
      restrictions.push(builder.eq('nome', `*${nome.trim()}*`));
    }

    const condicoes = this.formGroup.controls['condicoes'].value;
    if (condicoes != null && condicoes.trim().length > 0) {
      restrictions.push(builder.eq('condicoes', `*${condicoes.trim()}*`));
    }

    if (restrictions.length > 0) {
      return {
        search: emit(builder.and(...restrictions))
      };
    }

    return {};
  }

  filterLocalidades(event: any): void {
    setTimeout(() => {
      const nome = event.query;
      const uf = 'MT';

      this.integradorLocalidadeService.getLocalidadesByUfAndNome(uf, nome).subscribe(data => {
        this.filteredLocalidades = data.sort((a, b) => (a.descricaoLocalidade > b.descricaoLocalidade ? 1 : -1));
      });
    }, 500);
  }

  onSelectAutoComplete(integradorLocalidade: IntegradorLocalidade): void {
    this.formGroup.controls.localidade.setValue(integradorLocalidade);
  }
}
