import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          name: string;
          description?: string | null;
        };
        Update: {
          name?: string;
          description?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          phone?: string | null;
          address?: string | null;
        };
        Update: {
          email?: string;
          name?: string;
          phone?: string | null;
          address?: string | null;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category_id: string | null;
          category: string;
          image: string;
          age: string | null;
          stock: number;
          delivery_days: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description: string;
          price: number;
          category_id?: string | null;
          category: string;
          image: string;
          age?: string | null;
          stock?: number;
          delivery_days?: number;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          description?: string;
          price?: number;
          category_id?: string | null;
          category?: string;
          image?: string;
          age?: string | null;
          stock?: number;
          delivery_days?: number;
          is_active?: boolean;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          delivery_address: string;
          payment_method: string;
          total_amount: number;
          delivery_date: string;
          status: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          order_number: string;
          user_id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          delivery_address: string;
          payment_method: string;
          total_amount: number;
          delivery_date: string;
          status?: string;
          notes?: string | null;
        };
        Update: {
          order_number?: string;
          user_id?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          delivery_address?: string;
          payment_method?: string;
          total_amount?: number;
          delivery_date?: string;
          status?: string;
          notes?: string | null;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_price: number;
          quantity: number;
          subtotal: number;
          created_at: string;
        };
        Insert: {
          order_id: string;
          product_id: string;
          product_name: string;
          product_price: number;
          quantity: number;
          subtotal: number;
        };
        Update: {
          order_id?: string;
          product_id?: string;
          product_name?: string;
          product_price?: number;
          quantity?: number;
          subtotal?: number;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          product_id: string;
          quantity: number;
        };
        Update: {
          quantity?: number;
        };
      };
    };
  };
}

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.error_description) {
    return error.error_description;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// Helper function to format currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to format date
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper function to format date and time
export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};