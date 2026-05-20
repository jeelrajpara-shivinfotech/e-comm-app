export interface CommonResponse<T = unknown> {
  statusCode: number;
  status: 'Success' | 'Error';
  message: string;
  data: T;
}
