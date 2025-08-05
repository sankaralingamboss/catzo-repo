import { useState, useEffect } from 'react';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { useAuth } from './useAuth';
import { Product } from './useProducts';

export interface CartItem extends Product {
  quantity: number;
  cartItemId: string;
}

export const useCart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          products (
            id,
            name,
            description,
            price,
            category,
            image,
            age,
            stock,
            delivery_days
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching cart:', handleSupabaseError(error));
        return;
      }

      const formattedCartItems: CartItem[] = data
        .filter(item => item.products) // Filter out items with deleted products
        .map(item => ({
          id: item.products.id,
          cartItemId: item.id,
          name: item.products.name,
          category: item.products.category as CartItem['category'],
          price: item.products.price / 100, // Convert from paise to rupees
          image: item.products.image,
          description: item.products.description,
          age: item.products.age || undefined,
          stock: item.products.stock,
          deliveryDays: item.products.delivery_days,
          quantity: item.quantity
        }));

      setCartItems(formattedCartItems);
    } catch (err) {
      console.error('Error fetching cart:', handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!user) return false;

    try {
      // Check if item already exists in cart
      const existingItem = cartItems.find(item => item.id === product.id);

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('id', existingItem.cartItemId);

        if (error) {
          console.error('Error updating cart item:', error);
          return false;
        }

        setCartItems(prev => prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: newQuantity }
            : item
        ));
      } else {
        // Add new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product.id,
            quantity
          })
          .select()
          .single();

        if (error) {
          console.error('Error adding to cart:', error);
          return false;
        }

        const newCartItem: CartItem = {
          ...product,
          quantity,
          cartItemId: data.id
        };

        setCartItems(prev => [...prev, newCartItem]);
      }

      return true;
    } catch (err) {
      console.error('Error adding to cart:', err);
      return false;
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (!user) return false;

    try {
      if (quantity <= 0) {
        return await removeFromCart(cartItemId);
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId);

      if (error) {
        console.error('Error updating quantity:', error);
        return false;
      }

      setCartItems(prev => prev.map(item => 
        item.cartItemId === cartItemId 
          ? { ...item, quantity }
          : item
      ));

      return true;
    } catch (err) {
      console.error('Error updating quantity:', err);
      return false;
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) {
        console.error('Error removing from cart:', error);
        return false;
      }

      setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
      return true;
    } catch (err) {
      console.error('Error removing from cart:', err);
      return false;
    }
  };

  const clearCart = async () => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing cart:', error);
        return false;
      }

      setCartItems([]);
      return true;
    } catch (err) {
      console.error('Error clearing cart:', err);
      return false;
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getItemCount,
    refetch: fetchCart
  };
};