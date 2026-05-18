import { LoginPayload, LoginResponse } from "../interceptors/LoginInterface";
import { SignupPayload, SignupResponse } from "../interceptors/SignUpInterface";
import { LOGIN, SIGNUP, COUNTRY_LIST, STATE_LIST, CITY_LIST } from "./apiRoutes";
import { nonAuthServices } from "./apiService";

export const loginApi = async (data: LoginPayload): Promise<LoginResponse> => {
  const response = await nonAuthServices.post(LOGIN, data);
  return response.data;
};

export const getCountryListApi = async () => {
  const response = await nonAuthServices.get(COUNTRY_LIST);
  return response.data;
};

export const getStateListApi = async (countryId: number) => {
  const response = await nonAuthServices.get(`${STATE_LIST}${countryId}`);
  return response.data;
};

export const getCityListApi = async (stateId: number) => {
  const response = await nonAuthServices.get(`${CITY_LIST}${stateId}`);
  return response.data;
};

export const signupApi = async (data: SignupPayload): Promise<SignupResponse> => {
  const response = await nonAuthServices.post(SIGNUP, data);
  return response.data;
};