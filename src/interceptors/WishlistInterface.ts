import { CommonResponse, PaginatedList } from './CommonInterface';

export interface WishlistProductImage {
  image_path: string;
}

export interface WishlistProductVariant {
  id: number;
  product_title_name: string;
  color: string;
  size: string;
  price: number;
  image: WishlistProductImage;
  description?: string;
  product_id?: number;
}

export interface WishlistItem {
  id: number;
  user_id: number;
  product_variant_id: number;
  createdAt: string;
  updatedAt: string;
  product_variant?: WishlistProductVariant;
}

export interface WishlistListPayload {
  search: string;
  pageSize: number;
  page: number;
  sortValue: string;
  sortKey: string;
}

export interface WishlistListResponse extends CommonResponse<PaginatedList<WishlistItem, 'wishlist'>> {}
