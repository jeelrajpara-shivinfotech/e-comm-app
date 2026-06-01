import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WishlistItem } from '../interceptors/WishlistInterface';
import { addToWishlistApi, getWishlistListApi, deleteWishlistApi } from '../api/wishlistApi';
import { handleApiResponse } from '../utils/commonFunctions';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  loading: boolean;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productVariantId: number) => Promise<boolean>;
  removeFromWishlist: (wishlistId: number) => Promise<boolean>;
  isProductFavorited: (productId: number, variantIds?: number[]) => boolean;
  getWishlistItemId: (productId: number, variantIds?: number[]) => number | null;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    const payload = {
      search: '',
      pageSize: 50,
      page: 1,
      sortValue: 'desc',
      sortKey: 'createdAt',
    };
    const apiCall = getWishlistListApi(payload);
    await handleApiResponse(
      apiCall,
      (response) => {
        if (response && response.data) {
          const items = response.data.wishlist || response.data.wishlists || response.data.items || [];
          setWishlistItems(items);
        }
      },
      undefined,
      false,
      false
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (productVariantId: number): Promise<boolean> => {
    let success = false;
    const apiCall = addToWishlistApi({ product_variant_id: productVariantId });
    await handleApiResponse(
      apiCall,
      () => {
        success = true;
        fetchWishlist();
      },
      undefined,
      true,
      true
    );
    return success;
  };

  const removeFromWishlist = async (wishlistId: number): Promise<boolean> => {
    let success = false;
    const apiCall = deleteWishlistApi(wishlistId);
    await handleApiResponse(
      apiCall,
      () => {
        success = true;
        setWishlistItems((prev) => prev.filter((item) => item.id !== wishlistId));
      },
      undefined,
      true,
      true
    );
    return success;
  };
  const isProductFavorited = useCallback(
    (productId: number, variantIds: number[] = []): boolean => {
      return wishlistItems.some((item) => {
        if (variantIds.length > 0 && variantIds.includes(item.product_variant_id)) {
          return true;
        }
        const variant = item.product_variant;
        if (variant?.product_id === productId) {
          return true;
        }
        return false;
      });
    },
    [wishlistItems]
  );
  const getWishlistItemId = useCallback(
    (productId: number, variantIds: number[] = []): number | null => {
      const match = wishlistItems.find((item) => {
        if (variantIds.length > 0 && variantIds.includes(item.product_variant_id)) {
          return true;
        }
        const variant = item.product_variant;
        if (variant?.product_id === productId) {
          return true;
        }
        return false;
      });
      return match ? match.id : null;
    },
    [wishlistItems]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        isProductFavorited,
        getWishlistItemId,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
