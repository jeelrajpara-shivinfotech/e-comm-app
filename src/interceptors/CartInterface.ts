export interface CartProductImage {
  id?: number;
  image_path: string;
}

export interface CartProductVariant {
  id?: number;
  product_title_name: string;
  product_id: number;
  description: string;
  color: string;
  size: string;
  price: number;
  image: CartProductImage;
}

export interface CartProductData {
  name: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  product_variant_id: number;
  cart_id: number;
  quantity: number;
  price_total: number;
  productVariant?: CartProductVariant;
  productData?: CartProductData;
}

export interface CartData {
  id: number;
  user_id: number;
  total_quantity: number;
  sub_total: number;
  total_price: number;
  cart_items: CartItem[];
}

export interface CartListResponse {
  statusCode: number;
  status: string;
  message?: string;
  data: CartData;
}
