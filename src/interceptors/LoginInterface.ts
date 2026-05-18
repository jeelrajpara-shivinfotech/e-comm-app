export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  statusCode: number;
  status: 'Success' | 'Error';
  message: string;
  data: LoginResponseData;
}

export interface LoginResponseData {
  token: string;
}