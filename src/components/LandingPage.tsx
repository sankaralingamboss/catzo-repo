import React from 'react';
import { ArrowRight, Heart, ShoppingBag, Phone, Mail } from 'lucide-react';
import Logo from './Logo';
import { supabase } from '../lib/supabase';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const handleGetStarted = () => {
    console.log('Get Started clicked');
    onGetStarted();
  };

  const handleDemoLogin = () => {
    // Create demo user for immediate access
    const demoUser = {
      id: 'demo-user-' + Date.now(),
      email: 'demo@catzo.com',
      name: 'Demo User'
    };
    localStorage.setItem('demo-user', JSON.stringify(demoUser));
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Logo size="sm" />
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                <span>8637498818</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                <span>catzowithao@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">
          <Logo size="lg" />
          <p className="mt-6 text-xl text-gray-600 font-medium">
            From Treats to Toys — Catzo Delivers Joy.
          </p>
          
          <div className="mt-12 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
              Your One-Stop
              <span className="text-orange-500"> Pet Paradise</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Discover the finest selection of cats, birds, fish, and premium pet supplies. 
              From adorable companions to essential accessories, we bring joy to every pet family.
            </p>
            
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center"
            >
              Start Shopping
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            
            {/* Demo Mode Button */}
            {!supabase && (
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-3">
                  🚀 <strong>Quick Demo:</strong> Try the app instantly without signup
                </p>
                <button
                  onClick={handleDemoLogin}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  🎯 Try Demo Mode
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Healthy Pets</h3>
              <p className="text-gray-600">
                All our pets are health-certified and come with complete vaccination records
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Premium Supplies</h3>
              <p className="text-gray-600">
                Quality pet food, accessories, and equipment from trusted brands
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Expert Support</h3>
              <p className="text-gray-600">
                24/7 customer support and pet care guidance from our experts
              </p>
            </div>
          </div>
        </div>

        {/* Categories Preview */}
        <div className="py-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Shop by Category
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <img 
                src="https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress&cs=tinysrgb&w=400" 
                alt="Cats" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900">Cats</h3>
                <p className="text-gray-600 text-sm">Adorable feline companions</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <img 
                src="https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=400" 
                alt="Birds" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900">Birds</h3>
                <p className="text-gray-600 text-sm">Beautiful singing companions</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <img 
                src="https://images.pexels.com/photos/1335971/pexels-photo-1335971.jpeg?auto=compress&cs=tinysrgb&w=400" 
                alt="Fish" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900">Fish</h3>
                <p className="text-gray-600 text-sm">Colorful aquatic friends</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <img 
                src="https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?auto=compress&cs=tinysrgb&w=400" 
                alt="Pet Food" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900">Pet Food</h3>
                <p className="text-gray-600 text-sm">Premium nutrition for pets</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Logo size="sm" />
          <p className="mt-4 text-gray-400">From Treats to Toys — Catzo Delivers Joy.</p>
          <div className="mt-6 flex justify-center space-x-8">
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              <span>8637498818</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              <span>catzowithao@gmail.com</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;