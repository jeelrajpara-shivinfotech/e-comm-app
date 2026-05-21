export interface CommonResponse<T = unknown> {
  statusCode: number;
  status: 'Success' | 'Error';
  message: string;
  data: T;
}
export interface PaginatedData {
  totalItems: number;
  totalPage: number;
  currentPage: number;
  pageSize: number;
  numberOfRows: number;
}

export type PaginatedList<T, K extends string = 'items'> = {
  [key in K]: T[];
} & PaginatedData;
