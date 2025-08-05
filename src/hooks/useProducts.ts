import { useState, useEffect } from 'react';
import { supabase, handleSupabaseError } from '../lib/supabase';

export interface Product {
  id: string;
  name: string;
  category: 'cats' | 'birds' | 'fish' | 'food' | 'accessories';
  price: number;
  image: string;
  description: string;
  age?: string;
  stock: number;
  deliveryDays: number;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        setError(handleSupabaseError(error));
        return;
      }

      const formattedProducts: Product[] = data.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category as Product['category'],
        price: product.price / 100, // Convert from paise to rupees
        image: product.image,
        description: product.description,
        age: product.age || undefined,
        stock: product.stock,
        deliveryDays: product.delivery_days
      }));

      setProducts(formattedProducts);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId: string, newStock: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId);

      if (error) {
        console.error('Error updating stock:', error);
        return false;
      }

      // Update local state
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, stock: newStock }
          : product
      ));

      return true;
    } catch (err) {
      console.error('Error updating stock:', err);
      return false;
    }
  };

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    updateStock
  };
};