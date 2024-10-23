CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  age INT,
  email VARCHAR(255) NOT NULL UNIQUE,
  is_verified BOOLEAN DEFAULT FALSE,
  avatar VARCHAR(255),
  hobbies VARCHAR(255)[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  password VARCHAR(255) NOT NULL,
  refresh_token VARCHAR(255),
  verification_token VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  price INT DEFAULT 0,
  description TEXT,
  images VARCHAR(255)[],
  quantity INT DEFAULT 0,
  rate DECIMAL(2, 1) DEFAULT 0.0,
  orders INT DEFAULT 0,
  refunds INT DEFAULT 0,
  category VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  quantity INT DEFAULT 1 NOT NULL
);

INSERT INTO users (
  first_name,
  last_name,
  age,
  email,
  is_verified,
  avatar,
  hobbies,
  created_at,
  updated_at,
  password,
  refresh_token,
  verification_token
) VALUES (
  'John',                -- first_name
  'Doe',                 -- last_name
  30,                    -- age
  'john.doe@example.com', -- email
  TRUE,                  -- is_verified
  'https://profile.intra.42.fr/images/default.png',          -- avatar
  ARRAY['Reading', 'Coding'], -- hobbies (as an array)
  CURRENT_TIMESTAMP,     -- created_at
  CURRENT_TIMESTAMP,     -- updated_at
  'hashed_password',     -- password (you'd hash this)
  'sample_refresh_token',-- refresh_token
  'sample_verification_token' -- verification_token
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
  'Sample Product',      -- title
  100,                -- price
  'This is a sample product.', -- description
  ARRAY['https://example.com/image.jpg'], -- images (as an array)
  10,                    -- quantity
  5.0,                   -- rate
  0,                     -- orders
  0,                     -- refunds
  'Sample Category',     -- category
  CURRENT_TIMESTAMP,     -- created_at
  CURRENT_TIMESTAMP      -- updated_at
);


