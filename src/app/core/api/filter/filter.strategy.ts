import { ExpressionNode } from '@rsql/ast';
import builder from '@rsql/builder';
import { emit } from '@rsql/emitter';

export interface FilterParam {
  search?: string;
}

export type FilterStrategy = (filters?: Record<string, unknown>) => Record<string, string | unknown> | FilterParam;

export function baseRsqlFilter(filters?: Record<string, unknown>, and?: boolean): Record<string, string | unknown> | FilterParam {
  if (filters) {
    const listCriteria: ExpressionNode[] = keys(filters)
      .map(key => {
        const valueFilter = filters[key] as string;
        if (valueFilter != null && valueFilter.trim().length > 0) {
          return builder.eq(key, `*${filters[key]}*`);
        }
        return null;
      })
      .filter(x => x != null);
    if (listCriteria.length > 0) {
      const query: string = emit(and ? builder.and(...listCriteria) : builder.or(...listCriteria));
      return {
        search: query
      };
    }
  }
  return {};
}

export function keys<T>(object: T): (keyof T)[] {
  return Object.keys(object) as (keyof T)[];
}
