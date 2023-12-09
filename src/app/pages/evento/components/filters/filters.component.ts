import { AfterViewInit, Component, OnInit, Self } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterRefDirective } from '../../../../shared/filter/filter-ref.directive';
import { FilterParam } from '../../../../core/api/filter/filter.strategy';
import { ExpressionNode } from '@rsql/ast';
import builder from '@rsql/builder';
import { emit } from '@rsql/emitter';
import { situacaoCondicaoOptionsList } from 'src/app/domain/situacao-condicao/situacao-condicao.static';
import { TipoEvento } from 'src/app/domain/tipo-evento/tipo-evento.model';
import { from } from 'src/app/core/api/select/select';
import { TipoEventoService } from 'src/app/domain/tipo-evento/tipo-evento.service';
import { DatePipe } from '@angular/common';
import { SituacaoCondicaoEnum } from 'src/app/domain/situacao-condicao/situacao-condicao.enum';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/core/ui/notifications/alert.service';

@Component({
  selector: 'app-evento-filters',
  templateUrl: './filters.component.html'
})
export class FiltersComponent implements AfterViewInit, OnInit {
  formGroup: FormGroup;

  listTipoEvento = [];
  unidadeList = ['Unidade 1', 'Unidade 2', 'Unidade 3'];
  optSituacaoCondicao = situacaoCondicaoOptionsList;
  selectedSituacao = this.optSituacaoCondicao.slice(0, 1).map(a => a.value);

  constructor(
    private formBuilder: FormBuilder,
    @Self() private filterRef: FilterRefDirective,
    private tipoEventoService: TipoEventoService,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      nomeEvento: [null],
      tipoEvento: [null],
      organizadora: [null],
      dataInicioInicial: [null],
      dataInicioFinal: [null],
      dataTerminoInicial: [null],
      dataTerminoFinal: [null],
      situacaoCondicao: [null],
      unidade: [null]
    });

    this.getTipoEvento();
  }

  ngAfterViewInit(): void {
    if (this.filterRef != null) {
      this.filterRef.setFormGroup(this.formGroup);
      this.filterRef.searchStrategy = () => this.construirQueryConsulta();
    }
  }

  getTipoEvento(): void {
    const query = from<TipoEvento>()
      .select((u: TipoEvento) => [u.id, u.descricao])
      .asc(x => x.descricao)
      .getQuery();

    this.tipoEventoService.fetchSelect<TipoEvento[]>(query).subscribe(data => (this.listTipoEvento = data));
  }

  construirQueryConsulta(): FilterParam {
    const restrictions: ExpressionNode[] = [];

    const nomeEvento = this.formGroup.controls.nomeEvento?.value;
    if (nomeEvento != null && nomeEvento.trim().length > 0) {
      restrictions.push(builder.eq('nomeEvento', `*${nomeEvento.trim()}*`));
    }

    const tipoEvento = this.formGroup.controls.tipoEvento?.value;
    if (tipoEvento != null) {
      restrictions.push(builder.eq('tipoEvento.id', tipoEvento.id));
    }

    const organizadora = this.formGroup.controls.organizadora?.value;
    if (organizadora != null && organizadora.trim().length > 0) {
      restrictions.push(builder.eq('organizadora', `*${organizadora.trim()}*`));
    }

    const unidade = this.formGroup.controls.unidade?.value;
    if (unidade != null) {
      restrictions.push(builder.eq('unidade', `*${unidade}*`));
    }

    const situacaoCondicao = this.formGroup.controls.situacaoCondicao?.value;
    const listComparison: ExpressionNode[] = [];
    if (situacaoCondicao != null && situacaoCondicao.length > 0) {
      for (const index in situacaoCondicao) {
        if (situacaoCondicao[index] == 'CANCELADO') {
          listComparison.push(builder.comparison('situacaoCondicao', '==', SituacaoCondicaoEnum.CANCELADO));
        }
        if (situacaoCondicao[index] == 'ABERTO') {
          listComparison.push(builder.comparison('situacaoCondicao', '==', SituacaoCondicaoEnum.ABERTO));
        }
        if (situacaoCondicao[index] == 'FINALIZADO') {
          listComparison.push(builder.comparison('situacaoCondicao', '==', SituacaoCondicaoEnum.FINALIZADO));
        }
      }
      restrictions.push(builder.or(...listComparison));
    }

    const dataInicioInicial: string = this.formGroup.controls.dataInicioInicial?.value;
    if (dataInicioInicial != null && dataInicioInicial !== '') {
      const formattedDate = this.formattedDataString(dataInicioInicial, true);
      restrictions.push(builder.ge('dataInicio', `${formattedDate}`));
    }

    const dataInicioFinal: string = this.formGroup.controls.dataInicioFinal?.value;
    if (dataInicioFinal != null && dataInicioFinal !== '') {
      const formattedDate = this.formattedDataString(dataInicioFinal, false);
      restrictions.push(builder.le('dataInicio', `${formattedDate}`));
    }

    const dataTerminoInicial: string = this.formGroup.controls.dataTerminoInicial?.value;
    if (dataTerminoInicial != null && dataTerminoInicial !== '') {
      const formattedDate = this.formattedDataString(dataTerminoInicial, true);
      restrictions.push(builder.ge('dataTermino', `${formattedDate}`));
    }

    const dataTerminoFinal: string = this.formGroup.controls.dataTerminoFinal?.value;
    if (dataTerminoFinal != null && dataTerminoFinal !== '') {
      const formattedDate = this.formattedDataString(dataTerminoFinal, false);
      restrictions.push(builder.le('dataTermino', `${formattedDate}`));
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
    const maskInicio = 'yyyy-MM-ddT00:00';
    const maskFim = 'yyyy-MM-ddT23:59';

    const dateParse: Date = new Date(Date.parse(data));
    return datepipe.transform(dateParse, isInicio ? maskInicio : maskFim);
  }
}
