import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

import { PaginatorComponent } from 'src/app/core/ui/components/pagination/paginator.component';

import { LoadingService } from 'src/app/domain/loading/loading.service';
import { SolicitanteService } from 'src/app/domain/solicitante/solicitante.service';
import { Solicitante } from 'src/app/domain/solicitante/solicitante.model';
import { TipoSolicitanteEnum } from 'src/app/domain/tipo-solicitante/tipo-solicitante.enum';

@Component({
  selector: 'app-modal-pesquisa-servidor',
  templateUrl: './modal-pesquisa-servidor.component.html',
  styleUrls: ['./modal-pesquisa-servidor.component.scss']
})
export class ServidorListComponent extends PaginatorComponent implements OnInit {
  formGroup: FormGroup;
  tableData: Solicitante[] = [];
  selectedProduct: Solicitante;

  @Output() onSelect: EventEmitter<Solicitante> = new EventEmitter();
  @Output() onClose: EventEmitter<void> = new EventEmitter();

  constructor(public service: SolicitanteService, private formBuilder: FormBuilder, private loadingService: LoadingService) {
    super('PaginationPesquisarServidor');
    this.setDefaultSort(true);
  }

  ngOnInit(): void {
    this.buildForm();
    this.setDefaultSort(true);
  }

  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      nome: [null]
    });
  }

  clear(): void {
    this.tableData = [];
    this.buildForm();
    this.clearFilter();
  }

  select(): void {
    this.onSelect.emit(this.selectedProduct);
  }

  close(): void {
    this.onClose.emit();
  }

  fetch(): void {
    this.loadingService.startLoading();

    const nome = this.form.nome?.value;

    if (nome) {
      this.service.getSolicitantesByNome(nome, TipoSolicitanteEnum.SERVIDOR).subscribe({
        next: data => {
          this.tableData = data;
          this.pagination.totalRecords = data.length;
        },
        complete: () => this.loadingService.stopLoading()
      });
    }
  }

  get form(): { [key: string]: AbstractControl } {
    return this.formGroup.controls;
  }

  setDefaultSort(reset?: boolean) {
    if (reset) {
      this.pagination.sort = [
        {
          field: 'nome',
          order: 'asc'
        }
      ];
    }
  }
}
