import { Filter } from '../filter/filter.model';
import { Sort } from './sort.model';
import { EnvService } from '../../../env/env.service';

export class Pagination {
  pageNumber = 0;
  first = 0;
  pageSize = 10;
  totalRecords: number;
  filter?: Filter;
  sort: Sort[] = [{ field: 'id', order: 'asc' }];
  multiSort?: boolean;
  paginatorKey: string;

  pageSizeOptions = [10, 20, 50];

  constructor() {
    if (EnvService.env.defaultPaginationSize != null) {
      this.pageSize = EnvService.env.defaultPaginationSize;
    }
    if (EnvService.env.defaultPaginationSizeOptions != null) {
      this.pageSizeOptions = EnvService.env.defaultPaginationSizeOptions;
    }
  }

  getParams(): Record<string, string> {
    const parameters = {
      page: this.pageNumber.toString(),
      size: this.pageSize.toString(),
      ...this.filter?.params
    };

    if (this.sort && this.sort.length > 0) {
      parameters['sort'] = this.sort.map(x => x.field + ',' + x.order);
    }
    return parameters;
  }

  getPaginateSize(): number {
    return this.pageNumber + 1;
  }
}
