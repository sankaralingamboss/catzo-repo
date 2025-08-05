import { useState, useEffect } from 'react';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { useAuth } from './useAuth';
import { CartItem } from './useCart';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  paymentMethod: 'cod' | 'upi' | 'bank_transfer';
  totalAmount: number;
  deliveryDate: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    productPrice: number;
    quantity: number;
    subtotal: number;
  }>;
}

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            product_name,
            product_price,
            quantity,
            subtotal
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', handleSupabaseError(error));
        return;
      }

      const formattedOrders: Order[] = data.map(order => ({
        id: order.id,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        deliveryAddress: order.delivery_address,
        paymentMethod: order.payment_method as Order['paymentMethod'],
        totalAmount: order.total_amount / 100, // Convert from paise to rupees
        deliveryDate: order.delivery_date,
        status: order.status as Order['status'],
        notes: order.notes || undefined,
        createdAt: order.created_at,
        items: order.order_items.map(item => ({
          id: item.id,
          productId: item.product_id,
          productName: item.product_name,
          productPrice: item.product_price / 100, // Convert from paise to rupees
          quantity: item.quantity,
          subtotal: item.subtotal / 100 // Convert from paise to rupees
        }))
      }));

      setOrders(formattedOrders);
    } catch (err) {
      console.error('Error fetching orders:', handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryAddress: string;
    paymentMethod: 'cod' | 'upi' | 'bank_transfer';
    deliveryDate: string;
    notes?: string;
  }, cartItems: CartItem[]) => {
    if (!user || cartItems.length === 0) return null;

    try {
      const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      const orderNumber = `ORD${Date.now()}`;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: user.id,
          customer_name: orderData.customerName,
          customer_email: orderData.customerEmail,
          customer_phone: orderData.customerPhone,
          delivery_address: orderData.deliveryAddress,
          payment_method: orderData.paymentMethod,
          total_amount: Math.round(totalAmount * 100), // Convert to paise
          delivery_date: orderData.deliveryDate,
          notes: orderData.notes || null
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        return null;
      }

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_price: Math.round(item.price * 100), // Convert to paise
        quantity: item.quantity,
        subtotal: Math.round(item.price * item.quantity * 100) // Convert to paise
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        // Rollback order creation
        await supabase.from('orders').delete().eq('id', order.id);
        return null;
      }

      // Update product stock
      for (const item of cartItems) {
        const newStock = Math.max(0, item.stock - item.quantity);
        await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.id);
      }

      // Clear cart
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      // Refresh orders
      await fetchOrders();

      return {
        id: order.id,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        deliveryAddress: order.delivery_address,
        paymentMethod: order.payment_method as Order['paymentMethod'],
        totalAmount: order.total_amount / 100,
        deliveryDate: order.delivery_date,
        status: order.status as Order['status'],
        notes: order.notes || undefined,
        createdAt: order.created_at,
        items: orderItems.map((item, index) => ({
          id: `temp-${index}`,
          productId: item.product_id,
          productName: item.product_name,
          productPrice: item.product_price / 100,
          quantity: item.quantity,
          subtotal: item.subtotal / 100
        }))
      };
    } catch (err) {
      console.error('Error creating order:', err);
      return null;
    }
  };

  return {
    orders,
    loading,
    createOrder,
    refetch: fetchOrders
  };
};