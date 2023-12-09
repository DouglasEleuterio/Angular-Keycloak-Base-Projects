import builder, { Builder } from '@rsql/builder';
import { ExpressionNode } from '@rsql/ast';
import { Sort } from '../model/sort.model';
import { emit } from '@rsql/emitter';
import { Pagination } from '../model/pagination';
import { ObjectUtils } from '../../../shared/util/object.util';

export function extractProperties(expression: string): string[] {
  const regex = /\s*=>\s*([^)\]]+)/;
  const matches = regex.exec(expression);
  if (matches && matches.length > 1) {
    const propertyStr = matches[1];
    return propertyStr
      .split(',')
      .map(property => property.trim())
      .map(property => property.replace(/^[^.]+\./, ''));
  }
  return [];
}

export function extractProperty(expression: string): string {
  const properties = extractProperties(expression);
  if (properties != null && properties.length >= 1) {
    return properties[0];
  }
  return null;
}

export class QueryBuilder<T> {
  public columns?: string[] = [];
  public expression?: ExpressionNode;
  public pageNumber?: number;
  public sizeNumber?: number;
  public sort?: Sort[] = [];
  public extraParams: Record<string, string>;

  public build(): Record<string, string> {
    const queryParams = {
      ...this.extraParams,
      page: this.pageNumber?.toString(),
      size: this.sizeNumber?.toString(),
      sort: this.sort.map(x => x.field + ',' + x.order).join(','),
      columns: this.columns.join(',')
    } as Record<string, string>;
    if (this.expression != null) {
      queryParams.search = emit(this.expression);
    }
    return ObjectUtils.objectWithoutNullOrUndefined(queryParams);
  }

  public getQuery(): QueryBuilder<T> {
    return this;
  }

  select<U>(expression: (obj: T) => U[]): QueryBuilder<T> {
    this.columns = extractProperties(expression.toString());
    return this;
  }

  selectAll(): QueryBuilder<T> {
    this.columns = ['*'];
    return this;
  }

  where(condition: (builder: Builder) => ExpressionNode): QueryBuilder<T> {
    this.expression = condition(builder);
    return this;
  }

  page(pageNumber: number): QueryBuilder<T> {
    this.pageNumber = pageNumber;
    return this;
  }

  size(sizeNumber: number): QueryBuilder<T> {
    this.sizeNumber = sizeNumber;
    return this;
  }

  asc<U>(expression: (obj: T) => U): QueryBuilder<T> {
    const field = extractProperty(expression.toString());
    this.sort.push({
      field: field,
      order: 'asc'
    });
    return this;
  }

  desc<U>(expression: (obj: T) => U): QueryBuilder<T> {
    const field = extractProperty(expression.toString());
    this.sort.push({
      field: field,
      order: 'desc'
    });
    return this;
  }
}

class QueryBuilderFrom<T> {
  protected query: QueryBuilder<T>;

  constructor(initialQuery?: QueryBuilder<T>) {
    this.query = initialQuery == null ? new QueryBuilder<T>() : initialQuery;
  }

  select<U>(expression: (obj: T) => U[]): SelectQueryBuilder<T> {
    return new SelectQueryBuilder<T>(this.query.select(expression));
  }

  selectAll(): SelectQueryBuilder<T> {
    return new SelectQueryBuilder<T>(this.query.selectAll());
  }
}

class SelectQueryBuilder<T> {
  protected query: QueryBuilder<T>;

  constructor(query: QueryBuilder<T>) {
    this.query = query;
  }

  where(condition: (builder: Builder) => ExpressionNode): WhereQueryBuilder<T> {
    return new WhereQueryBuilder<T>(this.query.where(condition));
  }

  page(pageNumber: number): PageQueryBuilder<T> {
    return new PageQueryBuilder<T>(this.query.page(pageNumber));
  }

  size(sizeNumber: number): SizeQueryBuilder<T> {
    return new SizeQueryBuilder<T>(this.query.size(sizeNumber));
  }

  asc<U>(expression: (obj: T) => U): SizeQueryBuilder<T> {
    return new SizeQueryBuilder<T>(this.query.asc(expression));
  }

  desc<U>(expression: (obj: T) => U): SizeQueryBuilder<T> {
    return new SizeQueryBuilder<T>(this.query.desc(expression));
  }

  build(): Record<string, unknown> {
    return this.query.build();
  }

  getQuery(): QueryBuilder<T> {
    return this.query.getQuery();
  }
}

class WhereQueryBuilder<T> {
  protected query: QueryBuilder<T>;

  constructor(query: QueryBuilder<T>) {
    this.query = query;
  }

  page(pageNumber: number): PageQueryBuilder<T> {
    return new PageQueryBuilder<T>(this.query.page(pageNumber));
  }

  size(sizeNumber: number): SizeQueryBuilder<T> {
    return new SizeQueryBuilder<T>(this.query.size(sizeNumber));
  }

  asc<U>(expression: (obj: T) => U): SizeQueryBuilder<T> {
    return new SizeQueryBuilder<T>(this.query.asc(expression));
  }

  desc<U>(expression: (obj: T) => U): SizeQueryBuilder<T> {
    return new SizeQueryBuilder<T>(this.query.desc(expression));
  }

  build(): Record<string, unknown> {
    return this.query.build();
  }

  getQuery(): QueryBuilder<T> {
    return this.query.getQuery();
  }
}

class PageQueryBuilder<T> {
  protected query: QueryBuilder<T>;

  constructor(query: QueryBuilder<T>) {
    this.query = query;
  }

  size(sizeNumber: number): SizeQueryBuilder<T> {
    return new SizeQueryBuilder<T>(this.query.size(sizeNumber));
  }

  build(): Record<string, unknown> {
    return this.query.build();
  }

  getQuery(): QueryBuilder<T> {
    return this.query.getQuery();
  }
}

class SizeQueryBuilder<T> {
  protected query: QueryBuilder<T>;

  constructor(query: QueryBuilder<T>) {
    this.query = query;
  }

  asc<U>(expression: (obj: T) => U): SizeQueryBuilder<T> {
    return new SizeQueryBuilder<T>(this.query.asc(expression));
  }

  desc<U>(expression: (obj: T) => U): SizeQueryBuilder<T> {
    return new SizeQueryBuilder<T>(this.query.desc(expression));
  }

  build(): Record<string, unknown> {
    return this.query.build();
  }

  getQuery(): QueryBuilder<T> {
    return this.query.getQuery();
  }
}

export function from<T>(): QueryBuilderFrom<T> {
  return new QueryBuilderFrom<T>();
}

export function fromPagination<T>(pagination: Pagination): QueryBuilderFrom<T> {
  const initialQuery = new QueryBuilder<T>();
  initialQuery.sizeNumber = pagination.pageSize;
  initialQuery.pageNumber = pagination.pageNumber;
  initialQuery.sort = pagination.sort;
  initialQuery.extraParams = pagination.filter != null ? (pagination.filter.params as Record<string, string>) : null;
  return new QueryBuilderFrom<T>(initialQuery);
}
