import { Sort } from '../../../api/model/sort.model';
import { Filter } from '../../../api/filter/filter.model';

export class PaginatorState {
  first = 0;
  pageNumber = 0;
  pageSize = 1;
  totalRecords: number;
  filters: Record<string, unknown>;
  filter: Filter;
  sort: Sort[] = [];
  multiSort: boolean;
  paginatorKey: string;
}
