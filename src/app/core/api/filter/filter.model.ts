import { FilterParam, FilterStrategy } from './filter.strategy';

export class Filter {
  filters: Record<string, string | unknown>;
  strategy?: FilterStrategy;
  queryState?: Record<string, string | unknown> | FilterParam;

  constructor(
    filters: Record<string, string | unknown>,
    strategy?: FilterStrategy,
    queryState?: Record<string, string | unknown> | FilterParam
  ) {
    this.filters = filters;
    this.strategy = strategy;
    this.queryState = queryState;
  }

  get params(): Record<string, string | unknown> | FilterParam {
    if (this.queryState) {
      return this.queryState;
    }
    if (this.strategy) {
      return this.strategy(this.filters);
    }
    return this.filters;
  }
}
