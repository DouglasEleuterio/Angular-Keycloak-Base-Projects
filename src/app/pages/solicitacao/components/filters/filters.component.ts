import { AfterViewInit, Component, OnInit, Self } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { ExpressionNode } from '@rsql/ast';
import builder from '@rsql/builder';
import { emit } from '@rsql/emitter';

import { FilterRefDirective } from 'src/app/shared/filter/filter-ref.directive';
import TimeUtil from 'src/app/shared/util/time.util';

import { from } from 'src/app/core/api/select/select';
import { ValidationService } from 'src/app/core/ui/notifications/validation.service';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';
import { FilterParam } from 'src/app/core/api/filter/filter.strategy';

import { SituacaoSolicitacao } from 'src/app/domain/situacao-solicitacao/situacao-solicitacao.model';
import { SituacaoSolicitacaoFase } from 'src/app/domain/situacao-solicitacao-fase/situacao-solicitacao-fase.model';
import { SituacaoSolicitacaoFaseEnum } from 'src/app/domain/situacao-solicitacao-fase/situacao-solicitacao-fase.enum';

import { SituacaoSolicitacaoService } from 'src/app/domain/situacao-solicitacao/situacao-solicitacao.service';
import { SituacaoSolicitacaoFaseService } from 'src/app/domain/situacao-solicitacao-fase/situacao-solicitacao-fase.service';

@Component({
  selector: 'app-solicitacao-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements AfterViewInit, OnInit {
  formGroup: FormGroup;

  listSolicitacaoFase: SituacaoSolicitacaoFase[] = [];
  listSituacaoSolicitacao: SituacaoSolicitacao[] = [];

  constructor(
    @Self() private filterRef: FilterRefDirective,
    private formBuilder: FormBuilder,
    private situacaoSolicitacaoFaseService: SituacaoSolicitacaoFaseService,
    private situacaoSolicitacaoService: SituacaoSolicitacaoService,
    private validationService: ValidationService,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getForm();
    this.getSolicitacaoFase();
    this.calledSolicitacaoFase();
    this.calledDates();
  }

  ngAfterViewInit(): void {
    if (this.filterRef != null) {
      this.filterRef.setFormGroup(this.formGroup);
      this.filterRef.searchStrategy = () => this.construirQueryConsulta();
    }
  }

  getForm(): void {
    this.formGroup = this.formBuilder.group({
      eventos: [null],
      numero: [null],
      ano: [null],
      nome: [null],
      dataSolicitacaoInicial: [null],
      dataSolicitacaoFinal: [null],
      inicioViagemInicial: [null],
      inicioViagemFinal: [null],
      terminoViagemInicial: [null],
      terminoViagemFinal: [null],
      faseSolicitacao: [new Array<SituacaoSolicitacaoFase>()],
      situacaoSolicitacao: [{ value: new Array<SituacaoSolicitacao>(), disabled: true }]
    });
  }

  getSolicitacaoFase(): void {
    const query = from<SituacaoSolicitacaoFase>()
      .select((u: SituacaoSolicitacaoFase) => [u.id, u.descricao])
      .asc(x => x.descricao)
      .getQuery();

    this.situacaoSolicitacaoFaseService.fetchSelect<SituacaoSolicitacaoFase[]>(query).subscribe(data => (this.listSolicitacaoFase = data));
  }

  calledSolicitacaoFase(): void {
    this.form.faseSolicitacao?.valueChanges?.subscribe((value: SituacaoSolicitacaoFase[]) => {
      value?.length > 0 ? this.onChangeSolicitacaoFase() : this.disableStSolicitacao();
    });
  }

  calledDates(): void {
    this.calledCompareDates('dataSolicitacaoInicial', 'dataSolicitacaoFinal');
    this.calledCompareDates('inicioViagemInicial', 'inicioViagemFinal');
    this.calledCompareDates('terminoViagemInicial', 'terminoViagemFinal');
  }

  calledCompareDates(formInicial: string, formFinal: string): void {
    this.form[formInicial]?.valueChanges?.subscribe(inicial => {
      const final = this.form[formFinal]?.value;
      this.compareDates(inicial, final, formInicial);
    });

    this.form[formFinal]?.valueChanges.subscribe(final => {
      const inicial = this.form[formInicial]?.value;
      this.compareDates(inicial, final, formFinal);
    });
  }

  compareDates(inicial: Date, final: Date, controlName: string) {
    if (inicial && final && inicial > final) {
      const translateValue = controlName.includes('Inicial') ? 'inicio' : 'termino';
      const msg = this.translateService.instant(`solicitacao.message.error_dates_${translateValue}`.toUpperCase());

      this.alertService.defaultError(msg);
      this.form[controlName].setValue(null);
    }
  }

  getSituacaoSolicitacao(): void {
    const faseSolicitacao: SituacaoSolicitacaoFase[] = this.form.faseSolicitacao?.value;
    const fasesSolicitacaoId: (string | number)[] = faseSolicitacao.map(x => x.id);

    this.situacaoSolicitacaoService.findSituacaoSolicitacaoByFase(fasesSolicitacaoId).subscribe({
      next: data => (this.listSituacaoSolicitacao = data),
      error: error => this.validationService.handleErrorAlert(error),
      complete: () => {
        if (this.listSituacaoSolicitacao.length > 0) {
          this.form.situacaoSolicitacao.enable();
        }
      }
    });
  }

  disableStSolicitacao(): void {
    this.form.situacaoSolicitacao.setValue(new Array<SituacaoSolicitacao>());
    this.form.situacaoSolicitacao.disable();
    this.form.situacaoSolicitacao.updateValueAndValidity();
  }

  removeChipFase(fase: SituacaoSolicitacaoFase): void {
    const elem = this.fasesSelecteds.find(x => x.id === fase.id);
    const index = this.fasesSelecteds.indexOf(elem);
    this.fasesSelecteds.splice(index, 1);

    this.form.situacaoSolicitacao?.setValue(this.situacoesSelecteds.filter(x => x.situacaoSolicitacaoFase.id !== fase.id));

    this.onChangeSolicitacaoFase();
  }

  removeChipStSolicitacao(stSolicitacao: SituacaoSolicitacao): void {
    const elem = this.situacoesSelecteds.find(x => x.id === stSolicitacao.id);
    const index = this.situacoesSelecteds.indexOf(elem);
    this.situacoesSelecteds.splice(index, 1);
  }

  onChangeSolicitacaoFase(): void {
    this.fasesSelecteds?.length > 0 ? this.getSituacaoSolicitacao() : this.disableStSolicitacao();
  }

  get form(): { [key: string]: AbstractControl } {
    return this.formGroup.controls;
  }

  get faseEnum(): unknown {
    return SituacaoSolicitacaoFaseEnum;
  }

  get fasesSelecteds(): SituacaoSolicitacaoFase[] {
    return this.form.faseSolicitacao?.value;
  }

  get situacoesSelecteds(): SituacaoSolicitacao[] {
    return this.form.situacaoSolicitacao?.value;
  }

  construirQueryConsulta(): FilterParam {
    const restrictions: ExpressionNode[] = [];

    const eventos = this.form.eventos?.value;
    if (eventos != null && eventos.trim().length > 0) {
      restrictions.push(builder.eq('eventos.nomeEvento', `*${eventos.trim()}*`));
    }

    const numero = this.form.numero?.value;
    if (numero != null) {
      restrictions.push(builder.eq('id', `*${numero}*`));
    }

    const ano: number = this.form.ano?.value;
    if (ano != null) {
      const dataInicio = TimeUtil.formattedDateFilterByAno(ano, true);
      const dataFim = TimeUtil.formattedDateFilterByAno(ano);

      restrictions.push(builder.ge('dataCriacao', `${dataInicio}`));
      restrictions.push(builder.le('dataCriacao', `${dataFim}`));
    }

    const nome = this.form.nome?.value;
    if (nome != null && nome.trim().length > 0) {
      restrictions.push(builder.eq('solicitante.nome', `*${nome.trim()}*`));
    }

    const dataSolicitacaoInicial: string = this.form.dataSolicitacaoInicial?.value;
    if (dataSolicitacaoInicial != null && dataSolicitacaoInicial !== '') {
      const dataInicio = TimeUtil.formattedDateFilterByDia(dataSolicitacaoInicial, true);
      restrictions.push(builder.ge('dataCriacao', `${dataInicio}`));
    }

    const dataSolicitacaoFinal: string = this.form.dataSolicitacaoFinal?.value;
    if (dataSolicitacaoFinal != null && dataSolicitacaoFinal !== '') {
      const dataFim = TimeUtil.formattedDateFilterByDia(dataSolicitacaoFinal);
      restrictions.push(builder.le('dataCriacao', `${dataFim}`));
    }

    const inicioViagemInicial: string = this.form.inicioViagemInicial?.value;
    if (inicioViagemInicial != null && inicioViagemInicial !== '') {
      // TODO, daniel - quando renderson fizer a sobrescrita do filtro no backend
      // const dataInicio = TimeUtil.formattedDateFilterByDia(inicioViagemInicial, true);
      // restrictions.push(builder.ge('dataCriacao', `${dataInicio}`));
    }

    const inicioViagemFinal: string = this.form.inicioViagemFinal?.value;
    if (inicioViagemFinal != null && inicioViagemFinal !== '') {
      // TODO, daniel - quando renderson fizer a sobrescrita do filtro no backend
      // const dataFim = TimeUtil.formattedDateFilterByDia(inicioViagemFinal);
      // restrictions.push(builder.le('dataCriacao', `${dataFim}`));
    }

    const terminoViagemInicial: string = this.form.terminoViagemInicial?.value;
    if (terminoViagemInicial != null && terminoViagemInicial !== '') {
      // TODO, daniel - quando renderson fizer a sobrescrita do filtro no backend
      // const dataInicio = TimeUtil.formattedDateFilterByDia(terminoViagemInicial, true);
      // restrictions.push(builder.ge('dataCriacao', `${dataInicio}`));
    }

    const terminoViagemFinal: string = this.form.terminoViagemFinal?.value;
    if (terminoViagemFinal != null && terminoViagemFinal !== '') {
      // TODO, daniel - quando renderson fizer a sobrescrita do filtro no backend
      // const dataFim = TimeUtil.formattedDateFilterByDia(terminoViagemFinal);
      // restrictions.push(builder.le('dataCriacao', `${dataFim}`));
    }

    const faseSolicitacao: SituacaoSolicitacaoFase[] = this.form.faseSolicitacao?.value;
    if (faseSolicitacao?.length > 0) {
      const faseSolicitacaoId: (string | number)[] = faseSolicitacao.map(x => x.id);
      restrictions.push(builder.in('situacaoSolicitacao.situacaoSolicitacaoFase.id', faseSolicitacaoId));
    }

    const stSolicitacao: SituacaoSolicitacaoFase[] = this.form.situacaoSolicitacao?.value;
    if (stSolicitacao?.length > 0) {
      const stSolicitacaoId: (string | number)[] = stSolicitacao.map(x => x.id);
      restrictions.push(builder.in('situacaoSolicitacao.id', stSolicitacaoId));
    }

    if (restrictions.length > 0) {
      return {
        search: emit(builder.and(...restrictions))
      };
    }

    return {};
  }
}
