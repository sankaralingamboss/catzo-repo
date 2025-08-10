/*
  # Complete Pet Shop Database Schema

  1. New Tables
    - `categories` - Product categories (cats, birds, fish, food, accessories)
    - `products` - Complete product catalog with pricing and inventory
    - `profiles` - User profiles linked to authentication
    - `cart_items` - Shopping cart functionality
    - `orders` - Order management system
    - `order_items` - Individual order line items

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and public access
    - Secure data access based on user roles

  3. Sample Data
    - 20+ products across all categories
    - Categories with descriptions
    - Realistic pricing in Indian Rupees (stored as paise)
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text NOT NULL,
  price integer NOT NULL, -- Price in paise (₹1 = 100 paise)
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  category text NOT NULL,
  image text NOT NULL,
  age text,
  stock integer DEFAULT 0,
  delivery_days integer DEFAULT 2,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  delivery_address text NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('cod', 'upi', 'bank_transfer')),
  total_amount integer NOT NULL, -- Amount in paise
  delivery_date date NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow anon insert"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  product_price integer NOT NULL, -- Price in paise
  quantity integer DEFAULT 1,
  subtotal integer NOT NULL, -- Subtotal in paise
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Users can create order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Allow anon insert"
  ON order_items
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart"
  ON cart_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
  ('cats', 'Adorable feline companions for your family'),
  ('birds', 'Beautiful singing birds and exotic species'),
  ('fish', 'Colorful aquatic pets for your aquarium'),
  ('food', 'Premium nutrition for all your pets'),
  ('accessories', 'Essential supplies and fun accessories')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, category, image, age, stock, delivery_days) VALUES
  -- Cats
  ('Persian Cat - Snow White', 'Beautiful Persian cat with long white fur and blue eyes. Very friendly and well-trained. Perfect for families with children.', 2500000, 'cats', 'https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress&cs=tinysrgb&w=400', '3 months', 2, 3),
  ('British Shorthair - Grey', 'Adorable British Shorthair with thick grey coat. Perfect family companion with calm temperament.', 3000000, 'cats', 'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=400', '4 months', 1, 2),
  ('Maine Coon - Brown', 'Large and friendly Maine Coon with beautiful brown markings. Great with kids and other pets.', 3500000, 'cats', 'https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg?auto=compress&cs=tinysrgb&w=400', '5 months', 1, 3),
  ('Siamese Cat - Cream', 'Elegant Siamese cat with striking blue eyes and cream coat. Very vocal and social.', 2800000, 'cats', 'https://images.pexels.com/photos/1276553/pexels-photo-1276553.jpeg?auto=compress&cs=tinysrgb&w=400', '6 months', 2, 2),
  ('Ragdoll Cat - Blue Point', 'Gentle Ragdoll cat with beautiful blue point coloring. Known for their docile nature.', 3200000, 'cats', 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=400', '4 months', 1, 3),

  -- Birds
  ('Canary Bird - Yellow', 'Beautiful singing canary with bright yellow feathers. Great for beginners and apartment living.', 350000, 'birds', 'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=400', '6 months', 5, 1),
  ('Cockatiel - Grey', 'Friendly cockatiel with distinctive crest. Very social and can learn to whistle tunes.', 450000, 'birds', 'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=400', '8 months', 3, 1),
  ('Budgerigar - Green', 'Colorful budgie perfect for first-time bird owners. Can learn to mimic words.', 200000, 'birds', 'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=400', '4 months', 8, 1),
  ('Lovebird Pair - Peach', 'Beautiful pair of peach-faced lovebirds. Perfect for breeding or companionship.', 800000, 'birds', 'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=400', '1 year', 2, 2),
  ('Finch - Mixed Colors', 'Colorful finches that are perfect for aviaries. Low maintenance and beautiful singers.', 150000, 'birds', 'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=400', '6 months', 10, 1),

  -- Fish
  ('Goldfish - Orange', 'Classic goldfish perfect for aquarium beginners. Hardy and easy to care for.', 15000, 'fish', 'https://images.pexels.com/photos/1335971/pexels-photo-1335971.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 20, 1),
  ('Betta Fish - Blue', 'Beautiful blue betta fish with flowing fins. Perfect for small aquariums.', 25000, 'fish', 'https://images.pexels.com/photos/1335971/pexels-photo-1335971.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 15, 1),
  ('Angelfish - Silver', 'Elegant angelfish with silver coloring. Great for community aquariums.', 35000, 'fish', 'https://images.pexels.com/photos/1335971/pexels-photo-1335971.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 12, 1),
  ('Guppy Fish - Mixed', 'Colorful guppies perfect for beginners. Easy to breed and maintain.', 8000, 'fish', 'https://images.pexels.com/photos/1335971/pexels-photo-1335971.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 25, 1),
  ('Neon Tetra - School of 10', 'Beautiful school of neon tetras. Perfect for community tanks.', 50000, 'fish', 'https://images.pexels.com/photos/1335971/pexels-photo-1335971.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 8, 1),

  -- Food
  ('Premium Cat Food - 5kg', 'High-quality dry cat food with essential nutrients for healthy growth and shiny coat.', 120000, 'food', 'https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 15, 1),
  ('Bird Seed Mix - 2kg', 'Nutritious seed mix for all types of birds. Contains sunflower seeds, millet, and more.', 45000, 'food', 'https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 20, 1),
  ('Fish Flakes - 500g', 'Premium fish flakes for tropical fish. Rich in vitamins and minerals.', 35000, 'food', 'https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 25, 1),
  ('Dog Treats - Chicken', 'Delicious chicken treats for training and rewards. Made with real chicken.', 25000, 'food', 'https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 30, 1),
  ('Kitten Milk Formula', 'Special milk formula for orphaned kittens. Easy to digest and nutritious.', 18000, 'food', 'https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 12, 1),

  -- Accessories
  ('Cat Collar - Leather', 'Stylish leather collar with adjustable strap and bell. Available in multiple colors.', 45000, 'accessories', 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 8, 2),
  ('Bird Cage - Large', 'Spacious bird cage suitable for medium to large birds. Includes perches and feeding bowls.', 350000, 'accessories', 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 5, 3),
  ('Aquarium - 50L', 'Complete aquarium setup with filter, heater, and LED lighting. Perfect for beginners.', 450000, 'accessories', 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 3, 5),
  ('Cat Scratching Post', 'Tall scratching post covered in sisal rope. Helps keep cats claws healthy.', 180000, 'accessories', 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 6, 2),
  ('Pet Carrier - Medium', 'Comfortable pet carrier for cats and small dogs. Airline approved with ventilation.', 220000, 'accessories', 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, 4, 2);