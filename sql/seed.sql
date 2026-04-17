USE instrument_eshop;

INSERT INTO categories (name) VALUES
  ('Guitars'),
  ('Keyboards'),
  ('Drums'),
  ('Audio Gear')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (name, description, price, stock, image_url, category_id)
SELECT
  'Yamaha F310 Acoustic Guitar',
  'Entry-level acoustic guitar with bright tone and comfortable neck.',
  179.99,
  25,
  'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
  c.id
FROM categories c
WHERE c.name = 'Guitars'
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Yamaha F310 Acoustic Guitar');

INSERT INTO products (name, description, price, stock, image_url, category_id)
SELECT
  'Fender Stratocaster HSS',
  'Versatile electric guitar for clean and high-gain tones.',
  899.00,
  12,
  'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=800&q=80',
  c.id
FROM categories c
WHERE c.name = 'Guitars'
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Fender Stratocaster HSS');

INSERT INTO products (name, description, price, stock, image_url, category_id)
SELECT
  'Casio CT-S300 Keyboard',
  '61-key portable keyboard with touch response and USB MIDI.',
  249.50,
  18,
  'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=800&q=80',
  c.id
FROM categories c
WHERE c.name = 'Keyboards'
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Casio CT-S300 Keyboard');

INSERT INTO products (name, description, price, stock, image_url, category_id)
SELECT
  'Roland TD-02KV Electronic Drum Kit',
  'Compact electronic drum set with responsive mesh snare.',
  649.00,
  9,
  'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=800&q=80',
  c.id
FROM categories c
WHERE c.name = 'Drums'
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Roland TD-02KV Electronic Drum Kit');

INSERT INTO products (name, description, price, stock, image_url, category_id)
SELECT
  'Focusrite Scarlett 2i2 (4th Gen)',
  '2-in/2-out USB audio interface for studio-quality recording.',
  219.00,
  20,
  'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=800&q=80',
  c.id
FROM categories c
WHERE c.name = 'Audio Gear'
  AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Focusrite Scarlett 2i2 (4th Gen)');

INSERT INTO users (name, email, password, role)
SELECT
  'Admin',
  'admin@instrument-eshop.com',
  '$2b$10$5lQukzfA6ePSB5e9JOipu.ea1x.XMp9OdaUoJ5tu7LOLmhJyZon1a',
  'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@instrument-eshop.com');
