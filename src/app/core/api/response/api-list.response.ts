import { Pagination } from '../model/pagination';

export class ApiListResponse<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: Pagination;
  size: number;
  sort: unknown;
  totalElements: number;
  totalPages: number;
}
