import {
  ProductDetailResponse,
  ProductListResponse,
} from '../interceptors/ProductInterface';
import { PRODUCT_LIST, VIEW_PRODUCT } from './apiRoutes';
import { authServices } from './apiService';

export const getProductListApi = async (
  data: object,
): Promise<ProductListResponse> => {
  const response = await authServices.post(PRODUCT_LIST, data);
  return response.data;
};

export const getProductDetailApi = async (
  productId: number,
): Promise<ProductDetailResponse> => {
  const response = await authServices.get(`${VIEW_PRODUCT}${productId}`);
  return response.data;
};
