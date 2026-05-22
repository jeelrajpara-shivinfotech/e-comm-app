import { CommonResponse, PaginatedList } from './CommonInterface';

export interface CategoryListPayload {
  page: number;
  pageSize: number;
  sortKey: string;
  sortValue: string;
  search: string;
}

export interface Category {
  id: number;
  category_name: string;
  category_image: string;
  description: string;
  created_at: string;
  product: Product[];
}

export interface Product {
  name: string;
  category_id: number;
  variants: Variants[];
}

export interface Variants {
  id: number;
  product_title_name: string;
  product_id: number;
  description: string;
  color: string;
  quantity: number;
  size: string;
  price: number;
  image: ProductImage;
}

export interface ProductImage {
  image_path: string;
}

export interface CategoryResponse
  extends CommonResponse<PaginatedList<Category, 'categories'>> {}

export interface CategoryOfProducPayload {
  category_id: number;
  page: number;
  pageSize: number;
  sortKey: string;
  sortValue: string;
  search: string;
}

export interface CategoryProductVariant {
  id: number;
  product_title_name: string;
  product_id: number;
  description: string;
  color: string;
  quantity: number;
  size: string;
  price: number;
  image: {
    image_path: string;
  };
}

export interface CategoryProduct {
  id: number;
  name: string;
  category_id: number;
  isDeleted: boolean;
  created_at: string;
  updated_at: string;
  createdAt: string;
  updatedAt: string;
  variants: CategoryProductVariant[];
}

export interface CategoryWithProducts {
  id: number;
  category_name: string;
  category_image: string;
  description: string;
  created_at: string;
  products: CategoryProduct[];
}

export interface CategoryProductsResponse
  extends CommonResponse<PaginatedList<CategoryWithProducts, 'categories'>> {}
