-- Create products table for Jibreel Series store
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category_en TEXT NOT NULL,
  category_ar TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  colors TEXT[] NOT NULL DEFAULT '{}',
  sizes TEXT[] NOT NULL DEFAULT '{}',
  stock_status TEXT NOT NULL DEFAULT 'In Stock',
  rating DECIMAL(2,1) DEFAULT 4.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  address TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample products
INSERT INTO products (name_en, name_ar, description_en, description_ar, price, category_en, category_ar, images, colors, sizes) VALUES
('Classic White Dress Shirt', 'قميص أبيض كلاسيكي', 'Premium cotton dress shirt perfect for formal occasions', 'قميص قطني فاخر مثالي للمناسبات الرسمية', 299, 'Shirts', 'قمصان', ARRAY['/mens-white-dress-shirt.png', '/white-dress-shirt-front.png', '/white-dress-shirt-back.png'], ARRAY['White', 'Light Blue'], ARRAY['S', 'M', 'L', 'XL']),
('Classic Blue Jeans', 'جينز أزرق كلاسيكي', 'Comfortable denim jeans for everyday wear', 'جينز دنيم مريح للارتداء اليومي', 450, 'Jeans', 'جينز', ARRAY['/mens-classic-blue-jeans.png', '/blue-jeans-side.png', '/blue-jeans-back-pocket.png'], ARRAY['Blue', 'Black', 'Dark Blue'], ARRAY['28', '30', '32', '34', '36']),
('Navy Wool Blazer', 'بليزر صوفي كحلي', 'Elegant wool blazer for professional settings', 'بليزر صوفي أنيق للبيئات المهنية', 899, 'Blazers', 'بليزرات', ARRAY['/mens-navy-wool-blazer.png', '/navy-blazer-detail.png'], ARRAY['Navy', 'Charcoal', 'Black'], ARRAY['S', 'M', 'L', 'XL']),
('Casual T-Shirt', 'تي شيرت كاجوال', 'Soft and comfortable t-shirt for casual wear', 'تي شيرت ناعم ومريح للارتداء العادي', 149, 'T-Shirts', 'تي شيرت', ARRAY['/mens-casual-tee.png', '/folded-casual-tshirt.png', '/casual-tshirt-texture.png'], ARRAY['White', 'Black', 'Gray', 'Navy'], ARRAY['S', 'M', 'L', 'XL', 'XXL']),
('Formal Black Trousers', 'بنطلون رسمي أسود', 'Elegant formal trousers for professional settings', 'بنطلون رسمي أنيق للبيئات المهنية', 399, 'Trousers', 'بناطيل', ARRAY['/elegant-formal-black-trousers.png'], ARRAY['Black', 'Navy', 'Charcoal'], ARRAY['28', '30', '32', '34', '36']),
('Premium Leather Jacket', 'جاكيت جلدي فاخر', 'Premium leather jacket with modern styling', 'جاكيت جلدي فاخر بتصميم عصري', 1299, 'Jackets', 'جاكيتات', ARRAY['/mens-casual-tee.png'], ARRAY['Black', 'Brown'], ARRAY['S', 'M', 'L', 'XL']);
