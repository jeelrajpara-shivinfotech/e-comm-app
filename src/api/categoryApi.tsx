import { CategoryListPayload, CategoryResponse, CategoryOfProducPayload, CategoryProductsResponse } from "../interceptors/CategoryInterface";
import { CATEGORY_LIST, CATEGORY_OF_PRODUCTS } from "./apiRoutes";
import { authServices } from "./apiService";

export const getCategoryListApi = async (data: Partial<CategoryListPayload> = {}): Promise<CategoryResponse> => {
  try {
    const response = await authServices.post(CATEGORY_LIST, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategoryProductsApi = async (data: Partial<CategoryOfProducPayload> = {}): Promise<CategoryProductsResponse> => {
  try {
    const response = await authServices.post(CATEGORY_OF_PRODUCTS, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
