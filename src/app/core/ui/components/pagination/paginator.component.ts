import { PaginatorState } from './paginator.state';
import { LazyLoadEvent, SortMeta } from 'primeng/api';
import { Pagination } from '../../../api/model/pagination';
import { PermissionComponent } from '../permission/permission.component';
import { fromOrder, Sort, toOrder } from '../../../api/model/sort.model';
import { Filter } from '../../../api/filter/filter.model';
import { Encoding, ExporterProperties, ExporterTypeConfig, Orientation } from '../../../domain/model/exporter-request.model';

/**
 * Abstract class for pagination. This class save pagination state in current session user.
 * Obs. The table state is cleared on user logout.
 *
 */
export abstract class PaginatorComponent extends PermissionComponent {
  public pagination: Pagination;
  private readonly paginatorStateKey: string;

  protected constructor(paginatorKey: string, multiSort?: boolean) {
    super();
    this.paginatorStateKey = 'table_paginatorState';
    this.pagination = this.getPaginator();
    if (this.pagination.paginatorKey !== paginatorKey) {
      this.pagination = new Pagination();
      this.pagination.multiSort = multiSort == null ? false : multiSort;
    }
    this.pagination.paginatorKey = paginatorKey;
  }

  private static getStorage(): Storage {
    return window.localStorage;
  }

  private static restorePagination(state: PaginatorState): Pagination {
    const pagination = new Pagination();
    pagination.filter = new Filter(state?.filter?.filters, null, state?.filter?.queryState);
    pagination.pageNumber = state.pageNumber;
    pagination.pageSize = state.pageSize;
    pagination.sort = state.sort;
    pagination.totalRecords = state.totalRecords;
    pagination.paginatorKey = state.paginatorKey;
    pagination.multiSort = state.multiSort;
    return pagination;
  }

  filter(): void {
    this.pagination.first = 0;
    this.pagination.pageNumber = 0;
    this.fetch();
    this.savePaginatorState();
  }

  clearFilter(): void {
    this.pagination.first = 0;
    this.pagination.pageNumber = 0;
    this.pagination.filter = null;
    this.pagination.sort = [];
    this.pagination.multiSort = false;
    if (this.setDefaultSort) {
      this.setDefaultSort(true);
    }
    this.fetch();
    this.savePaginatorState();
  }

  paginate($event: LazyLoadEvent): void {
    this.pagination.first = $event.first;
    this.pagination.pageSize = $event.rows;
    this.pagination.pageNumber = Math.abs($event.first / this.pagination.pageSize);
    if ($event.multiSortMeta && $event.multiSortMeta.length > 0) {
      this.pagination.sort = $event.multiSortMeta.map(x => {
        const sort = new Sort();
        sort.field = x.field;
        sort.order = toOrder(x.order);
        return sort;
      });
      this.pagination.multiSort = true;
    } else if ($event.sortField != null) {
      const sort = new Sort();
      sort.field = $event.sortField;
      sort.order = toOrder($event.sortOrder);
      this.pagination.sort = [sort];
      this.pagination.multiSort = false;
    }
    this.fetch();
    this.savePaginatorState();
  }

  protected savePaginatorState(): void {
    const paginationState = {
      ...this.pagination,
      filter: {
        ...this.pagination.filter,
        queryState: this.pagination.filter?.params
      }
    };
    PaginatorComponent.getStorage().setItem(this.paginatorStateKey, JSON.stringify(paginationState));
  }

  private getPaginator(): Pagination {
    const storage = PaginatorComponent.getStorage();
    const stateString = storage.getItem(this.paginatorStateKey);
    if (stateString) {
      const paginatorState: PaginatorState = JSON.parse(stateString);
      const pagination = PaginatorComponent.restorePagination(paginatorState);
      if (this.afterRestoreFilters) {
        this.afterRestoreFilters();
      }
      return pagination;
    }
    return new Pagination();
  }

  get sortOrder(): number {
    if (this.pagination.multiSort == null || !this.pagination.multiSort) {
      if (this.pagination.sort != null && this.pagination.sort.length > 0) {
        return fromOrder(this.pagination.sort[0].order);
      }
    }
    return 1;
  }

  get sortField(): string {
    if (this.pagination.multiSort == null || !this.pagination.multiSort) {
      if (this.pagination.sort != null && this.pagination.sort.length > 0) {
        return this.pagination.sort[0].field;
      }
    }
    return null;
  }

  get multiSortMeta(): SortMeta[] {
    if (this.pagination.multiSort != null && this.pagination.multiSort) {
      return this.pagination.sort.map<SortMeta>(s => {
        return {
          field: s.field,
          order: fromOrder(s.order)
        };
      });
    }
    return null;
  }

  setDefaultSort?(reset?: boolean): void;

  afterRestoreFilters?(): void;

  abstract fetch(): void;

  generateExporterConfig(baseColumns: string[], pdfColumns?: string[], fontSize?: number): ExporterTypeConfig {
    const properties: ExporterProperties = {
      fontSize: fontSize == null ? 12 : fontSize,
      orientation: Orientation.PORTRAIT,
      encoding: Encoding.UTF_8
    };
    return {
      pdf: {
        columns: pdfColumns ? pdfColumns : baseColumns,
        properties: properties
      },
      csv: {
        columns: baseColumns,
        properties: properties
      },
      excel: {
        columns: baseColumns,
        properties: properties
      }
    };
  }
}
