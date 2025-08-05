/*
  # Initial Schema for Catzo Pet Shop

  1. New Tables
    - `profiles` - User profiles linked to auth.users
    - `categories` - Product categories (cats, birds, fish, food, accessories)
    - `products` - All products with details
    - `orders` - Customer orders
    - `order_items` - Items in each order
    - `cart_items` - Shopping cart items

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Public read access for products and categories
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text NOT NULL,
  price integer NOT NULL, -- Price in paise (₹1 = 100 paise)
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  category text NOT NULL, -- For backward compatibility
  image text NOT NULL,
  age text,
  stock integer NOT NULL DEFAULT 0,
  delivery_days integer NOT NULL DEFAULT 2,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  delivery_address text NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('cod', 'upi', 'bank_transfer')),
  total_amount integer NOT NULL, -- Amount in paise
  delivery_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  product_price integer NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  subtotal integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Cart items table (for persistent cart)
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read)
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO public
  USING (true);

-- Products policies (public read)
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  TO public
  USING (is_active = true);

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Cart items policies
CREATE POLICY "Users can manage own cart"
  ON cart_items FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert categories
INSERT INTO categories (name, description) VALUES
  ('cats', 'Adorable feline companions'),
  ('birds', 'Beautiful singing companions'),
  ('fish', 'Colorful aquatic friends'),
  ('food', 'Premium nutrition for pets'),
  ('accessories', 'Essential pet supplies and accessories')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, category, image, age, stock, delivery_days) VALUES
  -- Cat Products
  ('Premium Cat Food - Royal Canin', 'High-quality dry cat food for adult cats with balanced nutrition', 189900, 'food', 'https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 50, 2),
  ('Persian Kitten', 'Beautiful Persian kitten, well-trained and healthy', 2500000, 'cats', 'https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress&cs=tinysrgb&w=400', '3 months', 3, 1),
  ('British Shorthair Cat', 'Gentle and calm British Shorthair, perfect family companion', 3500000, 'cats', 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&w=400', '6 months', 2, 1),
  
  -- Bird Products
  ('Love Birds Pair', 'Beautiful pair of love birds, very social and colorful', 350000, 'birds', 'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=400', '1 year', 8, 2),
  ('Canary Bird', 'Bright yellow canary with beautiful singing voice', 250000, 'birds', 'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=400', '8 months', 12, 2),
  ('Premium Bird Cage - Large', 'Spacious bird cage with multiple perches and feeding stations', 450000, 'accessories', 'https://images.pexels.com/photos/7210754/pexels-photo-7210754.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 15, 3),
  
  -- Fish Products
  ('Goldfish', 'Beautiful golden fish, easy to care for beginners', 15000, 'fish', 'https://images.pexels.com/photos/1335971/pexels-photo-1335971.jpeg?auto=compress&cs=tinysrgb&w=400', '6 months', 25, 1),
  ('Betta Fish', 'Colorful Betta fish with flowing fins, perfect for small aquariums', 25000, 'fish', 'https://images.pexels.com/photos/1335971/pexels-photo-1335971.jpeg?auto=compress&cs=tinysrgb&w=400', '4 months', 18, 1),
  ('Fish Tank - 50L Complete Set', 'Complete aquarium set with filter, heater, and LED lights', 850000, 'accessories', 'https://images.pexels.com/photos/1374295/pexels-photo-1374295.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 8, 3),
  ('Fish Food Premium', 'High-quality fish flakes for tropical and goldfish', 45000, 'food', 'https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 40, 2),
  
  -- Additional Accessories
  ('Aquarium Stones - Decorative', 'Colorful decorative stones for fish tanks', 29900, 'accessories', 'https://images.pexels.com/photos/1374295/pexels-photo-1374295.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 30, 2),
  ('Fish Tank Decor - Castle', 'Beautiful castle decoration for aquariums', 65000, 'accessories', 'https://images.pexels.com/photos/1374295/pexels-photo-1374295.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 20, 2),
  ('Pet Toy - Interactive Ball', 'Interactive toy ball for cats and small dogs', 39900, 'accessories', 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 25, 1),
  ('Automatic Pet Feeder', 'Programmable automatic feeder for pets', 250000, 'accessories', 'https://images.pexels.com/photos/6568461/pexels-photo-6568461.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 12, 3),
  ('Pet Leash - Adjustable', 'Strong and comfortable adjustable pet leash', 59900, 'accessories', 'https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 35, 1),
  ('Bird Cage - Medium Size', 'Medium-sized bird cage perfect for small birds', 280000, 'accessories', 'https://images.pexels.com/photos/7210754/pexels-photo-7210754.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 18, 2)
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();