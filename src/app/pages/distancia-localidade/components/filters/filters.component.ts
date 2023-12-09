import { AfterViewInit, Component, OnInit, Self } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterRefDirective } from '../../../../shared/filter/filter-ref.directive';
import { FilterParam } from '../../../../core/api/filter/filter.strategy';
import { ExpressionNode } from '@rsql/ast';
import builder from '@rsql/builder';
import { emit } from '@rsql/emitter';
import { simNaoOptionsList } from 'src/app/domain/situacao/simNao.static';
import { IntegradorLocalidadeService } from 'src/app/domain/integrador/integrador-localidade/integrador-localidade.service';
import { IntegradorLocalidade } from 'src/app/domain/integrador/integrador-localidade/integrador-localidade.model';

@Component({
  selector: 'app-distancia-localidade-filters',
  templateUrl: './filters.component.html'
})
export class FiltersComponent implements AfterViewInit, OnInit {
  formGroup: FormGroup;
  optSituacao = simNaoOptionsList;
  ufList = ['AM', 'MT', 'PB'];
  localidadeList = [];
  localidadeDestinoList = [];

  filteredLocalidades: IntegradorLocalidade[];

  constructor(
    private formBuilder: FormBuilder,
    @Self() private filterRef: FilterRefDirective,
    private integradorLocalidadeService: IntegradorLocalidadeService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      ufOrigem: [''],
      localidadeOrigem: [''],
      ufDestino: [''],
      localidadeDestino: ['']
    });
    this.onUfChange();
    this.onUfDestinoChange();
    this.calledSubscribeUfChanges();
    this.calledSubscribeUfDestinoChanges();
  }

  ngAfterViewInit(): void {
    if (this.filterRef != null) {
      this.filterRef.setFormGroup(this.formGroup);
      this.filterRef.searchStrategy = () => this.construirQueryConsulta();
    }
  }

  calledSubscribeUfChanges(): void {
    this.formGroup.controls.ufOrigem.valueChanges.subscribe(value => {
      value ? null : this.onUfChange();
    });
  }

  calledSubscribeUfDestinoChanges(): void {
    this.formGroup.controls.ufDestino.valueChanges.subscribe(value => {
      value ? null : this.onUfChange();
    });
  }

  onUfChange(): void {
    const selectedUf = this.formGroup.get('ufOrigem').value;
    if (selectedUf) {
      this.formGroup.get('localidadeOrigem').setValue(null);
      this.filterLocalidadesOrigem(selectedUf);
      this.formGroup.controls.localidadeOrigem.enable();
    } else {
      this.formGroup.get('localidadeOrigem').setValue(null);
      this.localidadeList = [];
      this.formGroup.controls.localidadeOrigem.disable();
    }
  }

  onUfDestinoChange(): void {
    const selectedUfDestino = this.formGroup.get('ufDestino').value;
    if (selectedUfDestino) {
      this.formGroup.get('localidadeDestino').setValue(null);
      this.filterLocalidadesDestino(selectedUfDestino);
      this.formGroup.controls.localidadeDestino.enable();
    } else {
      this.formGroup.get('localidadeDestino').setValue(null);
      this.localidadeDestinoList = [];
      this.formGroup.controls.localidadeDestino.disable();
    }
  }

  construirQueryConsulta(): FilterParam {
    const restrictions: ExpressionNode[] = [];
    const ufOrigem = this.formGroup.controls['ufOrigem'].value;
    if (ufOrigem) {
      restrictions.push(builder.eq('ufOrigem', ufOrigem));
    }
    const localidadeOrigem = this.formGroup.controls['localidadeOrigem'].value;
    if (localidadeOrigem) {
      restrictions.push(builder.eq('localidadeOrigem.id', localidadeOrigem.id));
    }

    const ufDestino = this.formGroup.controls['ufDestino'].value;
    if (ufDestino) {
      restrictions.push(builder.eq('ufDestino', ufDestino));
    }
    const localidadeDestino = this.formGroup.controls['localidadeDestino'].value;
    if (localidadeDestino) {
      restrictions.push(builder.eq('localidadeDestino.id', localidadeDestino.id));
    }

    if (restrictions.length > 0) {
      return {
        search: emit(builder.and(...restrictions))
      };
    }
    return {};
  }

  filterLocalidadesOrigem(uf: string): void {
    this.integradorLocalidadeService.getLocalidadesByUf(uf).subscribe(data => {
      this.localidadeList = data.sort((a, b) => (a.descricaoLocalidade > b.descricaoLocalidade ? 1 : -1));
    });
  }

  filterLocalidadesDestino(uf: string): void {
    this.integradorLocalidadeService.getLocalidadesByUf(uf).subscribe(data => {
      this.localidadeDestinoList = data.sort((a, b) => (a.descricaoLocalidade > b.descricaoLocalidade ? 1 : -1));
    });
  }
}
