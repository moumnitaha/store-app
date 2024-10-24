CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255) NOT NULL UNIQUE,
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  price INT DEFAULT 0,
  description TEXT,
  images VARCHAR(255)[],
  quantity INT DEFAULT 0,
  rate INT DEFAULT 0,
  orders INT DEFAULT 0,
  refunds INT DEFAULT 0,
  category VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO products (
  title,
  price,
  description,
  images,
  quantity,
  rate,
  orders,
  refunds,
  category,
  created_at,
  updated_at
) VALUES (
  'Grey Hoodie',      -- title
  100,                -- price
  'This is a sample product. This is a sample product. This is a sample product. This is a sample product. This is a sample product. ', -- description
  ARRAY['/products/simple_item.jpg'], -- images (as an array)
  10,                    -- quantity
  4,                   -- rate
  0,                     -- orders
  0,                     -- refunds
  'Clothes',     -- category
  CURRENT_TIMESTAMP,     -- created_at
  CURRENT_TIMESTAMP      -- updated_at
);


