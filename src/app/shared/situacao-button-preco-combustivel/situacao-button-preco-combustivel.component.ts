import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { from } from 'src/app/core/api/select/select';
import { PrecoCombustivel } from 'src/app/domain/preco-combustivel/preco-combustivel.model';
import { PrecoCombustivelService } from 'src/app/domain/preco-combustivel/preco-combustivel.service';

@Component({
  selector: 'app-situacao-button-preco-combustivel',
  templateUrl: './situacao-button-preco-combustivel.component.html',
  styleUrls: ['./situacao-button-preco-combustivel.component.scss']
})
export class SituacaoButtonPrecoCombustivelComponent implements OnInit {
  @Input() entityId: number | string;
  @Input() ativo: boolean;

  @Output() onUpdateStatus = new EventEmitter<number | string>();

  inputValue: boolean;

  constructor(
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    public service: PrecoCombustivelService
  ) {}

  ngOnInit(): void {
    this.inputValue = this.ativo;
  }

  updateStatus(): void {
    const query = from<PrecoCombustivel>()
      .select((u: PrecoCombustivel) => [u.id, u.situacao])
      .getQuery();

    this.service.fetchSelect<PrecoCombustivel[]>(query).subscribe({
      next: data => {
        const filtrado = data.filter(element => element.situacao);
        const mensagem =
          filtrado.length > 0 ? `preco_combustivel.message.activate_with_record_active`.toUpperCase() : `shared.msg.activate`.toUpperCase();

        this.confirmationService.confirm({
          message: this.translateService.instant(this.ativo ? `shared.msg.disable`.toUpperCase() : mensagem),
          header: this.translateService.instant(this.ativo ? 'shared.titles.inativar'.toUpperCase() : 'shared.titles.ativar'.toUpperCase()),
          icon: 'pi pi-exclamation-triangle',
          accept: () => this.onUpdateStatus.emit(this.entityId),
          reject: () => (this.inputValue = this.ativo)
        });
      }
    });
  }
}
