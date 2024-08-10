import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Profissional } from '../../domain/profissional/profissional.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfissionalService } from '../../domain/profissional/profissional.service';

@Component({
  selector: 'app-select-profissional',
  templateUrl: './select-profissional.component.html',
  styleUrls: ['./select-profissional.component.scss']
})
export class SelectProfissionalComponent implements OnInit {
  profissionais: Profissional[] = [];
  formGroup: FormGroup;
  profissionalId: number;
  @Output() profissionalChanged: EventEmitter<number> = new EventEmitter<number>();

  constructor(private formBuilder: FormBuilder, private profissionalService: ProfissionalService) {}

  ngOnInit(): void {
    this.buildFormGroup();
    this.profissionalService.carregarProfissionais(this.profissionais);
  }

  buildFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      profissional: [null, Validators.required]
    });
  }

  onProfissionalChange() {
    this.profissionalChanged.emit(this.profissionalId);
  }
}
