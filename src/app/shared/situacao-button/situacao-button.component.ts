import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-situacao-button',
  templateUrl: './situacao-button.component.html',
  styleUrls: ['./situacao-button.component.scss']
})
export class SituacaoButtonComponent implements OnInit {
  @Input() entityId: number | string;
  @Input() ativo: boolean;

  @Output() onUpdateStatus = new EventEmitter<number | string>();

  inputValue: boolean;

  constructor(private translateService: TranslateService, private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.inputValue = this.ativo;
  }

  updateStatus(): void {
    this.confirmationService.confirm({
      message: this.translateService.instant(this.ativo ? `shared.msg.disable`.toUpperCase() : `shared.msg.activate`.toUpperCase()),
      header: this.translateService.instant(this.ativo ? 'shared.titles.inativar'.toUpperCase() : 'shared.titles.ativar'.toUpperCase()),
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.onUpdateStatus.emit(this.entityId),
      reject: () => (this.inputValue = this.ativo)
    });
  }
}
