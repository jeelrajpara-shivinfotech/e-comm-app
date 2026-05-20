import { CommonResponse } from './CommonInterface';
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse extends CommonResponse<LoginResponseData> {}

export interface LoginResponseData {
  token: string;
}