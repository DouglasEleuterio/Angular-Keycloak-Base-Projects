import { AfterViewInit, Component, ContentChild, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FilterRefDirective } from './filter-ref.directive';
import { Filter } from '../../core/api/filter/filter.model';

@Component({
  selector: 'app-filter',
  template: `
    <app-filter-panel [header]="'filter' | appTranslate : 'shared'" (clearEvent)="clear()" (searchEvent)="search()">
      <ng-content></ng-content>
    </app-filter-panel>
  `
})
export class FilterComponent implements AfterViewInit, OnChanges {
  @ContentChild(FilterRefDirective)
  filterRef: FilterRefDirective;

  @Input()
  filters!: Filter;

  @Output()
  filtersChange = new EventEmitter<Filter>();

  @Output()
  onSearch = new EventEmitter<void>();

  @Output()
  onClear = new EventEmitter<void>();

  private initialized = false;
  private _firstChangeFilters: Record<string, unknown>;

  ngAfterViewInit(): void {
    if (!this.initialized && this._firstChangeFilters != null) {
      this.filterRef.formGroup.patchValue(this._firstChangeFilters?.filters);
      this.initialized = true;
    }
  }

  search(): void {
    this.filtersChange.emit(new Filter(this.convertFromGroup(), this.filterRef.searchStrategy));
    this.onSearch.emit();
  }

  clear(): void {
    this.onClear.emit();
    this.filterRef.resetFormGroup();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filters.firstChange && changes.filters.currentValue != null) {
      this.initialized = false;
      this._firstChangeFilters = changes.filters.currentValue;
    }
  }

  convertFromGroup(): Record<string, unknown> {
    return this.filterRef.formGroup.getRawValue();
  }
}
