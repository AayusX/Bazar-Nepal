CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    reputation INT NOT NULL DEFAULT 0,
    items_sold INT NOT NULL DEFAULT 0,
    join_date TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    icon VARCHAR(50) NOT NULL
);

CREATE TABLE products (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'NPR',
    category_id VARCHAR(255) NOT NULL REFERENCES categories(id),
    location VARCHAR(255) NOT NULL,
    seller_id VARCHAR(255) NOT NULL REFERENCES users(id),
    posted_at TIMESTAMP NOT NULL DEFAULT NOW(),
    views INT NOT NULL DEFAULT 0,
    is_escrow_eligible BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE product_images (
    product_id VARCHAR(255) NOT NULL REFERENCES products(id),
    image_url VARCHAR(500) NOT NULL
);

CREATE TABLE price_history (
    id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL REFERENCES products(id),
    date TIMESTAMP NOT NULL DEFAULT NOW(),
    price DOUBLE PRECISION NOT NULL
);

CREATE TABLE saved_items (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id),
    product_id VARCHAR(255) NOT NULL REFERENCES products(id),
    UNIQUE(user_id, product_id)
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_posted_at ON products(posted_at DESC);
CREATE INDEX idx_saved_items_user ON saved_items(user_id);

INSERT INTO categories (id, name, icon) VALUES
    ('cat-1', 'Electronics', '📱'),
    ('cat-2', 'Vehicles', '🚗'),
    ('cat-3', 'Furniture', '🪑'),
    ('cat-4', 'Property', '🏠'),
    ('cat-5', 'Fashion', '👕'),
    ('cat-6', 'Services', '🔧');
