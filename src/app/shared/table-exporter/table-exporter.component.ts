import { Component, Input } from '@angular/core';
import { Filter } from 'src/app/core/api/filter/filter.model';
import { BaseEntity } from 'src/app/core/domain/base.entity';
import { BaseService } from 'src/app/core/domain/base.service';
import { LoadingService } from 'src/app/domain/loading/loading.service';
import { Encoding, ExporterRequest, ExporterType, ExporterTypeConfig } from '../../core/domain/model/exporter-request.model';
import { ExporterData } from '../../core/domain/model/exporter-data.model';
import { finalize } from 'rxjs/operators';
import { Sort } from '../../core/api/model/sort.model';

@Component({
  selector: 'app-table-exporter',
  templateUrl: './table-exporter.component.html',
  styleUrls: ['./table-exporter.component.scss']
})
export class TableExporterComponent {
  @Input()
  filter!: Filter;

  @Input()
  sort!: Sort[];

  @Input()
  service!: BaseService<BaseEntity, number | string>;

  @Input()
  title!: string;

  @Input()
  filename!: string;

  @Input()
  empty = false;

  @Input()
  configuration: ExporterTypeConfig;

  constructor(private loadingService: LoadingService) {}

  export(type: ExporterType, print: boolean): void {
    const request: ExporterRequest = {
      ...this.configuration[type.toString().toLowerCase()],
      title: this.title,
      ...this.filter?.params,
      filename: this.filename,
      sort: this.sort!
    };

    if (type == ExporterType.CSV) {
      request.properties.encoding = Encoding.ISO_8859_1;
    }

    if (print) {
      this.print(type, request);
    } else {
      this.download(type, request);
    }
  }

  print(type: ExporterType, request: ExporterRequest): void {
    this.loadingService.startLoading();
    this.service
      .export(type, request)
      .pipe(finalize(() => this.loadingService.stopLoading()))
      .subscribe((exporterData: ExporterData) => {
        const url = window.URL.createObjectURL(exporterData.blob);
        const iframe = document.createElement('iframe'); //load content in an iframe to print later
        document.body.appendChild(iframe);

        iframe.style.display = 'none';
        iframe.src = url;
        iframe.onload = function () {
          setTimeout(function () {
            iframe.focus();
            iframe.contentWindow.print();
          }, 1);
        };
      });
  }

  download(type: ExporterType, request: ExporterRequest): void {
    this.loadingService.startLoading();
    this.service
      .export(type, request)
      .pipe(finalize(() => this.loadingService.stopLoading()))
      .subscribe((exporterData: ExporterData) => {
        const data = window.URL.createObjectURL(exporterData.blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = exporterData.filename;
        link.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
        }, 400);
      });
  }

  get types(): typeof ExporterType {
    return ExporterType;
  }
}
