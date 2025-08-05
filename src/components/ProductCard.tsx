import React from 'react';
import { ShoppingCart, Clock, Package } from 'lucide-react';
import { Product } from '../hooks/useProducts';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart } = useApp();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden"
      onClick={() => onViewDetails(product)}
    >
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(product.category)}`}>
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </span>
        </div>
        {product.stock < 5 && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Low Stock
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        {product.age && (
          <p className="text-sm text-gray-600 mb-2">
            Age: {product.age}
          </p>
        )}
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>{product.deliveryDays} days</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Package className="w-4 h-4 mr-1" />
            <span>{product.stock} in stock</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-orange-600">
            ₹{product.price.toLocaleString('en-IN')}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;