import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem } from '../interceptors/CartInterface';
import { addToCartApi, viewCartApi, deleteCartApi } from '../api/cartApi';
import { handleApiResponse } from '../utils/commonFunctions';

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, productVariantId: number, quantity: number, showToast?: boolean) => Promise<boolean>;
  removeFromCart: (cartId: number) => Promise<boolean>;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [cartCount, setCartCount] = useState<number>(0);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    const payload = {
      search: '',
      pageSize: 100,
      page: 1,
      sortValue: 'desc',
      sortKey: 'createdAt',
    };
    const apiCall = viewCartApi();
    await handleApiResponse(
      apiCall,
      (response) => {
        if (response && response.data) {
          const items = response.data.cart_items || response.data.cart || response.data.carts || response.data.items || [];
          setCartItems(items);
          const backendTotal = response.data.total_price !== undefined ? response.data.total_price : response.data.sub_total;
          const backendCount = response.data.total_quantity;

          if (backendTotal !== undefined) {
            setCartTotal(Number(backendTotal));
          } else {
            const calculatedTotal = items.reduce((acc: number, item: CartItem) => {
              const price = item.productVariant?.price || 0;
              return acc + price * item.quantity;
            }, 0);
            setCartTotal(calculatedTotal);
          }

          if (backendCount !== undefined) {
            setCartCount(Number(backendCount));
          } else {
            const calculatedCount = items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
            setCartCount(calculatedCount);
          }
        }
      },
      undefined,
      false,
      false,
      () => {
        setCartItems([]);
        setCartTotal(0);
        setCartCount(0);
      }
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (
    productId: number,
    productVariantId: number,
    quantity: number,
    showToast = true
  ): Promise<boolean> => {
    let success = false;
    const payload = {
      cart_items: [
        {
          product_id: productId,
          product_variant_id: productVariantId,
          quantity: quantity,
        },
      ],
    };
    const apiCall = addToCartApi(payload);
    await handleApiResponse(
      apiCall,
      () => {
        success = true;
        fetchCart();
      },
      undefined,
      showToast,
      true
    );
    return success;
  };

  const removeFromCart = async (cartId: number): Promise<boolean> => {
    let success = false;
    const apiCall = deleteCartApi(cartId);
    await handleApiResponse(
      apiCall,
      () => {
        success = true;
        fetchCart();
      },
      undefined,
      true,
      true
    );
    return success;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        fetchCart,
        addToCart,
        removeFromCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
