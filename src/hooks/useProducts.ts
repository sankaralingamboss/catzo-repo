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
    if (!supabase) {
      // Demo products for when Supabase is not connected
      const demoProducts: Product[] = [
        {
          id: '1',
          name: 'Persian Cat - Snow White',
          category: 'cats',
          price: 25000,
          image: 'https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Beautiful Persian cat with long white fur and blue eyes. Very friendly and well-trained.',
          age: '3 months',
          stock: 2,
          deliveryDays: 3
        },
        {
          id: '2',
          name: 'British Shorthair - Grey',
          category: 'cats',
          price: 30000,
          image: 'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Adorable British Shorthair with thick grey coat. Perfect family companion.',
          age: '4 months',
          stock: 1,
          deliveryDays: 2
        },
        {
          id: '3',
          name: 'Canary Bird - Yellow',
          category: 'birds',
          price: 3500,
          image: 'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Beautiful singing canary with bright yellow feathers. Great for beginners.',
          age: '6 months',
          stock: 5,
          deliveryDays: 1
        },
        {
          id: '4',
          name: 'Goldfish - Orange',
          category: 'fish',
          price: 150,
          image: 'https://images.pexels.com/photos/1335971/pexels-photo-1335971.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Classic goldfish perfect for aquarium beginners. Easy to care for.',
          stock: 20,
          deliveryDays: 1
        },
        {
          id: '5',
          name: 'Premium Cat Food - 5kg',
          category: 'food',
          price: 1200,
          image: 'https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'High-quality dry cat food with essential nutrients for healthy growth.',
          stock: 15,
          deliveryDays: 1
        },
        {
          id: '6',
          name: 'Cat Collar - Leather',
          category: 'accessories',
          price: 450,
          image: 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Stylish leather collar with adjustable strap and bell.',
          stock: 8,
          deliveryDays: 2
        }
      ];
      
      setProducts(demoProducts);
      setLoading(false);
      return;
    }
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
    if (!supabase) {
      // Update local state for demo mode
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, stock: newStock }
          : product
      ));
      return true;
    }
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