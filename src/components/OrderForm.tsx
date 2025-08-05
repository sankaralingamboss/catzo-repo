import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ShoppingCart, User, Phone, Mail, MapPin, Calendar, CreditCard, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import emailjs from '@emailjs/browser';

interface OrderFormData {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  paymentMethod: 'cod' | 'upi' | 'bank_transfer';
  deliveryDate: string;
}

export default function OrderForm() {
  const { 
    user,
    cartItems, 
    getTotalPrice, 
    createOrder,
    clearCart 
  } = useApp();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<OrderFormData>();

  const sendOrderConfirmationEmail = async (order: any) => {
    try {
      console.log('📧 Starting email send process...');
      console.log('Customer email:', order.email);
      console.log('Order details:', order);
      
      // Initialize EmailJS - this is critical!
      await emailjs.init('WhOowWnfA9wLbW9-O');
      console.log('✅ EmailJS initialized successfully');
      
      // Prepare email parameters - matching your template exactly
      const emailParams = {
        to_email: order.email,           // Recipient email
        to_name: order.customerName,     // Recipient name
        customer_name: order.customerName,
        customer_email: order.email,
        order_id: order.orderNumber,
        order_number: order.orderNumber,
        order_items: order.items.map(item => 
          `• ${item.productName} - Qty: ${item.quantity} - ₹${(item.productPrice * item.quantity).toLocaleString('en-IN')}`
        ).join('\n'),
        total_amount: order.totalAmount.toLocaleString('en-IN'),
        delivery_address: order.deliveryAddress,
        customer_phone: order.customerPhone,
        payment_method: order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 
                       order.paymentMethod === 'upi' ? 'UPI Payment' : 'Bank Transfer',
        order_date: new Date(order.createdAt).toLocaleDateString('en-IN'),
        delivery_date: new Date(order.deliveryDate).toLocaleDateString('en-IN'),
        expected_delivery: new Date(order.deliveryDate).toLocaleDateString('en-IN'),
        shop_phone: '8637498818',
        shop_email: 'catzowithao@gmail.com',
        shop_contact: '8637498818',      // Alternative field name
        message: `Thank you for your order! Your order #${order.orderNumber} has been confirmed and will be delivered on ${new Date(order.deliveryDate).toLocaleDateString('en-IN')}.`
      };
      
      console.log('📧 Email parameters prepared:', emailParams);
      console.log('📧 Sending to:', order.email);
      
      // Send email with your exact IDs
      const response = await emailjs.send(
        'service_l0lmsol',    // Your Service ID
        'template_ueaxw5r',   // Your Template ID
        emailParams,
        'WhOowWnfA9wLbW9-O'   // Your Public Key
      );
      
      console.log('✅ Email sent successfully!');
      console.log('Response:', response);
      
      // Show success message to user
      alert(`✅ Order confirmation email sent to ${order.email}!`);
      
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      console.error('Error details:', error.message);
      
      // Show detailed error to user
      alert(`❌ Email failed to send to ${order.email}. Error: ${error.message}. Order still placed successfully - check WhatsApp for confirmation.`);
    }
  };

  const onSubmit = async (data: OrderFormData) => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createOrder({
        customerName: data.customerName,
        customerEmail: data.email,
        customerPhone: data.phone,
        deliveryAddress: data.address,
        paymentMethod: data.paymentMethod,
        deliveryDate: data.deliveryDate,
        notes: ''
      }, cartItems);

      if (!order) {
        alert('Failed to create order. Please try again.');
        return;
      }

      // Send email confirmation
      console.log('🚀 About to send email confirmation...');
      await sendOrderConfirmationEmail(order);
      console.log('📧 Email confirmation process completed');

      // Set order as placed
      setPlacedOrder(order);
      setOrderPlaced(true);
      reset();

      // Open WhatsApp with customer's number
      const customerPhone = data.phone.startsWith('+91') ? data.phone : `+91${data.phone.replace(/\D/g, '')}`;
      const whatsappMessage = `🐾 *Catzo Pet Shop - Order Confirmation*\n\n` +
        `Dear ${data.customerName},\n\n` +
        `Your order has been confirmed! 🎉\n\n` +
        `📋 *Order Details:*\n` +
        `Order ID: ${order.orderNumber}\n` +
        `Order Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}\n` +
        `Delivery Date: ${new Date(order.deliveryDate).toLocaleDateString('en-IN')}\n\n` +
        `🛍️ *Items Ordered:*\n` +
        order.items.map(item => 
          `• ${item.productName} - Qty: ${item.quantity} - ₹${(item.productPrice * item.quantity).toLocaleString('en-IN')}`
        ).join('\n') + '\n\n' +
        `💰 *Total Amount:* ₹${order.totalAmount.toLocaleString('en-IN')}\n` +
        `💳 *Payment Method:* ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                                order.paymentMethod === 'upi' ? 'UPI Payment' : 'Bank Transfer'}\n\n` +
        `📍 *Delivery Address:*\n${order.deliveryAddress}\n\n` +
        `📞 *Contact:* ${data.phone}\n\n` +
        `For any queries, contact us:\n` +
        `📞 Phone: 8637498818\n` +
        `📧 Email: catzowithao@gmail.com\n\n` +
        `Thank you for choosing Catzo Pet Shop!\n` +
        `🐾 From Treats to Toys — Catzo Delivers Joy`;

      const whatsappUrl = `https://wa.me/${customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');

    } catch (error) {
      console.error('Order submission error:', error);
      alert('There was an error placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced && placedOrder) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully! 🎉</h2>
          <p className="text-gray-600 mb-6">
            Thank you {placedOrder.customerName}! Your order #{placedOrder.orderNumber} has been confirmed.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-2">Order Summary:</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Order ID:</strong> {placedOrder.orderNumber}</p>
              <p><strong>Delivery Date:</strong> {new Date(placedOrder.deliveryDate).toLocaleDateString('en-IN')}</p>
              <p><strong>Total Amount:</strong> ₹{placedOrder.totalAmount.toLocaleString('en-IN')}</p>
              <p><strong>Payment:</strong> {placedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                                          placedOrder.paymentMethod === 'upi' ? 'UPI Payment' : 'Bank Transfer'}</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              📧 Order confirmation email sent to: <strong>{placedOrder.customerEmail}</strong>
            </p>
            <p className="text-sm text-gray-600">
              📱 WhatsApp confirmation opened for: <strong>{placedOrder.customerPhone}</strong>
            </p>
            <p className="text-xs text-gray-500">
              For any queries, contact us at 📞 8637498818 or 📧 catzowithao@gmail.com
            </p>
          </div>

          <button
            onClick={() => {
              setOrderPlaced(false);
              setPlacedOrder(null);
            }}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-600">Add some items to your cart before placing an order.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                    <span>Total:</span>
                    <span>₹{getTotalPrice().toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information Form */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name || ''}
                    {...register('customerName', { required: 'Name is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register('phone', { 
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: 'Please enter a valid 10-digit phone number'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter 10-digit phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Delivery Address
                  </label>
                  <textarea
                    {...register('address', { required: 'Address is required' })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your complete delivery address"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Preferred Delivery Date
                  </label>
                  <input
                    type="date"
                    {...register('deliveryDate', { required: 'Delivery date is required' })}
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.deliveryDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.deliveryDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CreditCard className="w-4 h-4 inline mr-1" />
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="cod"
                        {...register('paymentMethod', { required: 'Please select a payment method' })}
                        className="mr-2"
                      />
                      <span>💵 Cash on Delivery (COD)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="upi"
                        {...register('paymentMethod', { required: 'Please select a payment method' })}
                        className="mr-2"
                      />
                      <span>📱 UPI Payment (Pay on Delivery)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="bank_transfer"
                        {...register('paymentMethod', { required: 'Please select a payment method' })}
                        className="mr-2"
                      />
                      <span>🏦 Bank Transfer (Advance Payment)</span>
                    </label>
                  </div>
                  {errors.paymentMethod && (
                    <p className="text-red-500 text-sm mt-1">{errors.paymentMethod.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Place Order - ₹{getTotalPrice().toLocaleString('en-IN')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
      </div>
    </div>
  );
}