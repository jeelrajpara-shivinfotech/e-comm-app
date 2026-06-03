import { ADD_TO_CART, VIEW_CART, DELETE_CART } from './apiRoutes';
import { authServices } from './apiService';

export const addToCartApi = async (data: {
  cart_items: {
    product_id: number;
    product_variant_id: number;
    quantity: number;
  }[];
}) => {
  const response = await authServices.post(ADD_TO_CART, data);
  return response.data;
};

export const viewCartApi = async () => {
  const response = await authServices.get(VIEW_CART);
  return response.data;
};

export const deleteCartApi = async (id: number) => {
  const response = await authServices.delete(`${DELETE_CART}${id}`);
  return response.data;
};
