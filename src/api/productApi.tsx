import {
  ProductListResponse,
} from '../interceptors/ProductInterface';
import { PRODUCT_LIST } from './apiRoutes';
import { authServices } from './apiService';

export const getProductListApi = async (
  data: object,
): Promise<ProductListResponse> => {
  const response = await authServices.post(PRODUCT_LIST, data);
  return response.data;
};
