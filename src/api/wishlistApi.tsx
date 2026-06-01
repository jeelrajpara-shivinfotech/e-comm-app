import { Add_WISHLIST, LIST_WISHLIST, DELETE_WISHLIST } from './apiRoutes';
import { authServices } from './apiService';
import { WishlistListResponse } from '../interceptors/WishlistInterface';

export const addToWishlistApi = async (data: {
  product_variant_id: number;
}): Promise<any> => {
  const response = await authServices.post(Add_WISHLIST, data);
  return response.data;
};

export const getWishlistListApi = async (data: {
  search?: string;
  pageSize?: number;
  page?: number;
  sortValue?: string;
  sortKey?: string;
}): Promise<WishlistListResponse> => {
  const response = await authServices.post(LIST_WISHLIST, data);
  console.log(response.data);
  return response.data;
};

export const deleteWishlistApi = async (id: number) => {
  const response = await authServices.delete(`${DELETE_WISHLIST}${id}`);
  return response.data;
};
