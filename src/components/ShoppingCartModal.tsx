import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ShoppingCartModalProps {
  onClose: () => void;
  onCheckout: () => void;
}

const ShoppingCartModal: React.FC<ShoppingCartModalProps> = ({ onClose, onCheckout }) => {
  const { 
    cartItems, 
    updateCartQuantity, 
    removeFromCart, 
    getTotalPrice 
  } = useApp();

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      updateCartQuantity(cartItemId, quantity);
    }
  };

  const removeItem = (cartItemId: string) => {
    removeFromCart(cartItemId);
  };

  const total = getTotalPrice();
  const delivery = total > 2000 ? 0 : 99;
  const finalTotal = total + delivery;

  if (cartItems.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Add some amazing pets and supplies to get started!</p>
          <button
            onClick={onClose}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-96 p-6">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100 last:border-b-0">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600">₹{item.price.toLocaleString('en-IN')} each</p>
                {item.age && (
                  <p className="text-sm text-gray-500">Age: {item.age}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
                <button
                  onClick={() => removeItem(item.cartItemId)}
                  className="text-red-500 hover:text-red-700 transition-colors mt-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t p-6">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery:</span>
              <span>{delivery === 0 ? 'Free' : `₹${delivery.toLocaleString('en-IN')}`}</span>
            </div>
            {total > 2000 && (
              <div className="text-sm text-green-600">
                🎉 You qualify for free delivery!
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
          
          <button
            onClick={onCheckout}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartModal;