import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { from } from '../../../../core/api/select/select';
import { Xml } from '../../../../domain/xml/xml.model';
import { XmlService } from '../../../../domain/xml/xml.service';

@Component({
  selector: 'app-xml-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  formGroup: FormGroup;

  listXml = [];

  constructor(private formBuilder: FormBuilder, private xmlService: XmlService) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      numeroNF: [null]
    });

  }
}
