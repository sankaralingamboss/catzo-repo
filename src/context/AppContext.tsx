import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, AuthUser } from '../hooks/useAuth';
import { useProducts, Product } from '../hooks/useProducts';
import { useCart, CartItem } from '../hooks/useCart';
import { useOrders, Order } from '../hooks/useOrders';

interface AppContextType {
  // Auth
  user: AuthUser | null;
  authLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<any>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<any>;
  
  // Products
  products: Product[];
  productsLoading: boolean;
  productsError: string | null;
  refetchProducts: () => Promise<void>;
  updateStock: (productId: string, newStock: number) => Promise<boolean>;
  
  // Cart
  cartItems: CartItem[];
  cartLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<boolean>;
  updateCartQuantity: (cartItemId: string, quantity: number) => Promise<boolean>;
  removeFromCart: (cartItemId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  getTotalPrice: () => number;
  getItemCount: () => number;
  refetchCart: () => Promise<void>;
  
  // Orders
  orders: Order[];
  ordersLoading: boolean;
  createOrder: (orderData: any, cartItems: CartItem[]) => Promise<Order | null>;
  refetchOrders: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const products = useProducts();
  const cart = useCart();
  const orders = useOrders();

  const contextValue: AppContextType = {
    // Auth
    user: auth.user,
    authLoading: auth.loading,
    signIn: auth.signIn,
    signUp: auth.signUp,
    signOut: auth.signOut,
    updateProfile: auth.updateProfile,
    
    // Products
    products: products.products,
    productsLoading: products.loading,
    productsError: products.error,
    refetchProducts: products.refetch,
    updateStock: products.updateStock,
    
    // Cart
    cartItems: cart.cartItems,
    cartLoading: cart.loading,
    addToCart: cart.addToCart,
    updateCartQuantity: cart.updateQuantity,
    removeFromCart: cart.removeFromCart,
    clearCart: cart.clearCart,
    getTotalPrice: cart.getTotalPrice,
    getItemCount: cart.getItemCount,
    refetchCart: cart.refetch,
    
    // Orders
    orders: orders.orders,
    ordersLoading: orders.loading,
    createOrder: orders.createOrder,
    refetchOrders: orders.refetch
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};