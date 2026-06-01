import { CommonResponse } from './CommonInterface';
export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  gender: string;
  address: {
    country_id: number | '';
    state_id: number | '';
    city_id: number | '';
    postal_code: number | '';
    label: string;
    address_line1: string;
    address_line2: string;
  };
}

export interface SignupResponse extends CommonResponse<SignupResponseData> {}

export interface SignupResponseData {
  id: string;
}
