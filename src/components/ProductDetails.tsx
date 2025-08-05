import React from 'react';
import { X, ShoppingCart, Clock, Package, Star } from 'lucide-react';
import { Product } from '../hooks/useProducts';
import { useApp } from '../context/AppContext';

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onClose }) => {
  const { addToCart } = useApp();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cats': return 'bg-orange-100 text-orange-800';
      case 'birds': return 'bg-blue-100 text-blue-800';
      case 'fish': return 'bg-cyan-100 text-cyan-800';
      case 'food': return 'bg-green-100 text-green-800';
      case 'accessories': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + product.deliveryDays);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-64 object-cover rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(product.category)}`}>
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {product.name}
          </h2>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-sm text-gray-600">(4.8 - 127 reviews)</span>
            </div>
          </div>
          
          {product.age && (
            <div className="mb-4">
              <span className="font-semibold text-gray-700">Age: </span>
              <span className="text-gray-600">{product.age}</span>
            </div>
          )}
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-500 mr-3" />
              <div>
                <div className="font-semibold text-gray-900">Delivery</div>
                <div className="text-sm text-gray-600">
                  {product.deliveryDays} days ({deliveryDate.toLocaleDateString()})
                </div>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Package className="w-5 h-5 text-green-500 mr-3" />
              <div>
                <div className="font-semibold text-gray-900">In Stock</div>
                <div className="text-sm text-gray-600">
                  {product.stock} available
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="text-3xl font-bold text-orange-600">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
              <div className="text-sm text-gray-500">
                Free delivery on orders over ₹2000
              </div>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;