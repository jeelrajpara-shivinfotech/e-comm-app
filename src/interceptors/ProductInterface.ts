import { CommonResponse, PaginatedList } from './CommonInterface';
export interface ProductListPayload {
  page?: number;
  pageSize?: number;
  sortKey: string;
  sortValue: string;
  search: string;
}

export interface Category {
  id: number;
  category_name: string;
}

export interface ProductImage {
  image_path: string;
}

export interface Variant {
  id: number;
  product_title_name: string;
  color: string;
  price: number;
  image: ProductImage;
}

export interface Product {
  id: number;
  name: string;
  category: Category;
  variants: Variant[];
}

export interface ProductListResponse extends CommonResponse<PaginatedList<Product, 'products'>> {}
