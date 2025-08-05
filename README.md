# 🐾 Catzo Pet Shop - Complete Full-Stack E-Commerce Application

**From Treats to Toys — Catzo Delivers Joy**

A modern, production-ready pet shop e-commerce application built with React, TypeScript, and Supabase.

## ✨ Features

### 🛒 **E-Commerce Functionality**
- Complete product catalog with categories (Cats, Birds, Fish, Food, Accessories)
- Advanced search and filtering system
- Shopping cart with persistent storage
- Real-time stock management
- Order placement and tracking system

### 🔐 **Authentication & User Management**
- Secure user registration and login
- Email verification system
- User profiles with contact information
- Protected routes and data access

### 💳 **Payment System (India-Friendly)**
- **Cash on Delivery (COD)** - Traditional cash payment
- **UPI Payment** - Pay via PhonePe, Google Pay, Paytm on delivery
- **Bank Transfer** - Advance payment for high-value orders

### 📧 **Communication System**
- Automated email confirmations via EmailJS
- WhatsApp integration for order notifications
- Real-time order status updates

### 📱 **Modern UI/UX**
- Responsive design for all devices
- Beautiful animations and micro-interactions
- Loading states and error handling
- Intuitive navigation and user experience

### 🔧 **Admin Features**
- Admin dashboard with key metrics
- Order management system
- Product inventory tracking
- Revenue analytics

## 🚀 Tech Stack

### **Frontend**
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form management

### **Backend**
- **Supabase** - PostgreSQL database with real-time features
- **Row Level Security (RLS)** - Secure data access
- **Edge Functions** - Serverless backend logic
- **Real-time subscriptions** - Live data updates

### **Integrations**
- **EmailJS** - Email service integration
- **WhatsApp API** - Customer notifications
- **Pexels** - High-quality product images

## 📦 Installation & Setup

### **Prerequisites**
- Node.js 18+ and npm
- Supabase account
- EmailJS account (optional)

### **1. Clone & Install**
```bash
git clone <your-repo-url>
cd catzo-pet-shop
npm install
```

### **2. Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Add your Supabase credentials to .env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# EmailJS configuration (optional)
VITE_EMAILJS_SERVICE_ID=service_l0lmsol
VITE_EMAILJS_TEMPLATE_ID=template_ueaxw5r
VITE_EMAILJS_PUBLIC_KEY=WhOowWnfA9wLbW9-O
```

### **3. Database Setup**
The database schema will be automatically created when you connect to Supabase. The migration includes:
- Complete table structure
- Row Level Security policies
- Sample data (20+ products)
- Proper indexes and constraints

### **4. Run Development Server**
```bash
npm run dev
```

## 🗄️ Database Schema

### **Tables**
- **categories** - Product categories
- **products** - Product catalog with pricing and inventory
- **profiles** - User profiles linked to authentication
- **cart_items** - Shopping cart functionality
- **orders** - Order management
- **order_items** - Individual order line items

### **Security**
- Row Level Security (RLS) enabled on all tables
- Authenticated users can only access their own data
- Public read access for products and categories
- Secure API endpoints with proper authorization

## 🎯 Usage

### **For Customers**
1. **Browse Products** - Explore cats, birds, fish, food, and accessories
2. **Add to Cart** - Select products and quantities
3. **Create Account** - Register with email and password
4. **Place Order** - Choose payment method and delivery details
5. **Track Orders** - Monitor order status and delivery

### **For Admins**
1. **Admin Access** - Login with admin email (admin@catzo.com)
2. **Dashboard** - View sales metrics and order statistics
3. **Order Management** - Track and update order statuses
4. **Inventory** - Monitor stock levels and product performance

## 🌐 Deployment

### **Frontend Deployment**
```bash
# Build for production
npm run build

# Deploy to Vercel, Netlify, or any static hosting
```

### **Backend (Supabase)**
- Database and API are automatically hosted by Supabase
- Edge functions deploy automatically
- Real-time features work out of the box

## 📱 Mobile Responsiveness

The application is fully responsive and works perfectly on:
- 📱 Mobile phones (iOS/Android)
- 📱 Tablets (iPad, Android tablets)
- 💻 Desktop computers
- 🖥️ Large screens

## 🔒 Security Features

- **Authentication** - Secure user login with JWT tokens
- **Authorization** - Role-based access control
- **Data Protection** - Row Level Security on all tables
- **Input Validation** - Form validation and sanitization
- **Error Handling** - Comprehensive error boundaries
- **HTTPS** - Secure data transmission

## 🎨 Customization

### **Branding**
- Update logo in `src/components/Logo.tsx`
- Modify colors in `tailwind.config.js`
- Change business information in components

### **Products**
- Add new categories in database
- Upload product images to Supabase Storage
- Update product information via admin panel

### **Payment Methods**
- Configure payment gateways
- Update payment flow in `OrderForm.tsx`
- Modify confirmation messages

## 📞 Support & Contact

- **Email**: catzowithao@gmail.com
- **Phone**: 8637498818
- **Business Hours**: 9 AM - 8 PM IST

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Supabase** - Amazing backend-as-a-service platform
- **Pexels** - Beautiful stock photos for products
- **Lucide** - Clean and consistent icons
- **Tailwind CSS** - Utility-first CSS framework

---

**Built with ❤️ for pet lovers in India** 🇮🇳🐾

*Catzo Pet Shop - From Treats to Toys — Catzo Delivers Joy*