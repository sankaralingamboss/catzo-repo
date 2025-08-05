import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Users, ShoppingCart, TrendingUp, Eye, EyeOff } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { products, orders, user } = useApp();
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Simple admin check - in production, you'd have proper role-based access
  const isAdmin = user?.email === 'admin@catzo.com' || user?.email === 'catzowithao@gmail.com';

  if (!isAdmin) {
    return null;
  }

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!showAdminPanel ? (
        <button
          onClick={() => setShowAdminPanel(true)}
          className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          title="Admin Panel"
        >
          <Eye className="w-5 h-5" />
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-2xl w-96 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-bold text-gray-900">Admin Dashboard</h3>
            <button
              onClick={() => setShowAdminPanel(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <Package className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-xs text-blue-600">Products</p>
                    <p className="text-lg font-bold text-blue-900">{totalProducts}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <ShoppingCart className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-xs text-green-600">Orders</p>
                    <p className="text-lg font-bold text-green-900">{totalOrders}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                  <div>
                    <p className="text-xs text-purple-600">Revenue</p>
                    <p className="text-lg font-bold text-purple-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-orange-600 mr-2" />
                  <div>
                    <p className="text-xs text-orange-600">Pending</p>
                    <p className="text-lg font-bold text-orange-900">{pendingOrders}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Orders */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Recent Orders</h4>
              <div className="space-y-2">
                {recentOrders.length > 0 ? (
                  recentOrders.map(order => (
                    <div key={order.id} className="bg-gray-50 p-2 rounded text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{order.orderNumber}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">
                        {order.customerName} - ₹{order.totalAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No orders yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;