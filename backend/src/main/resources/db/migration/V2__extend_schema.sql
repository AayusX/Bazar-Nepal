ALTER TABLE users
    ADD COLUMN whatsapp VARCHAR(20),
    ADD COLUMN phone_visibility VARCHAR(20) NOT NULL DEFAULT 'private',
    ADD COLUMN whatsapp_visibility VARCHAR(20) NOT NULL DEFAULT 'private',
    ADD COLUMN email_visibility VARCHAR(20) NOT NULL DEFAULT 'private',
    ADD COLUMN online_status VARCHAR(20) NOT NULL DEFAULT 'offline',
    ADD COLUMN account_status VARCHAR(20) NOT NULL DEFAULT 'active',
    ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN trust_score INT NOT NULL DEFAULT 0,
    ADD COLUMN rating DOUBLE PRECISION NOT NULL DEFAULT 0,
    ADD COLUMN rating_count INT NOT NULL DEFAULT 0,
    ADD COLUMN last_seen TIMESTAMP,
    ADD COLUMN district VARCHAR(100),
    ADD COLUMN province VARCHAR(100),
    ADD COLUMN country VARCHAR(100),
    ADD COLUMN latitude DOUBLE PRECISION,
    ADD COLUMN longitude DOUBLE PRECISION,
    ADD COLUMN allow_phone_calls BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN allow_whats_app BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN allow_chat BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN contact_preference VARCHAR(20) NOT NULL DEFAULT 'chat';

ALTER TABLE products
    ADD COLUMN negotiable BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN condition VARCHAR(100),
    ADD COLUMN brand VARCHAR(100),
    ADD COLUMN quantity INT NOT NULL DEFAULT 1,
    ADD COLUMN stock_status VARCHAR(20) NOT NULL DEFAULT 'in_stock',
    ADD COLUMN subcategory VARCHAR(100),
    ADD COLUMN district VARCHAR(100),
    ADD COLUMN province VARCHAR(100),
    ADD COLUMN country VARCHAR(100),
    ADD COLUMN latitude DOUBLE PRECISION,
    ADD COLUMN longitude DOUBLE PRECISION,
    ADD COLUMN favorite_count INT NOT NULL DEFAULT 0,
    ADD COLUMN chat_count INT NOT NULL DEFAULT 0,
    ADD COLUMN is_boosted BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN is_delivery_available BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN is_pickup_available BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN is_sold BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN moderation_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    ADD COLUMN moderation_notes TEXT;

CREATE TABLE product_videos (
    product_id VARCHAR(255) NOT NULL REFERENCES products(id),
    video_url VARCHAR(500) NOT NULL
);

CREATE TABLE product_tags (
    product_id VARCHAR(255) NOT NULL REFERENCES products(id),
    tag VARCHAR(255) NOT NULL
);

CREATE TABLE conversations (
    id VARCHAR(255) PRIMARY KEY,
    buyer_id VARCHAR(255) NOT NULL REFERENCES users(id),
    seller_id VARCHAR(255) NOT NULL REFERENCES users(id),
    product_id VARCHAR(255) REFERENCES products(id),
    last_message TEXT NOT NULL DEFAULT '',
    last_message_at TIMESTAMP NOT NULL DEFAULT NOW(),
    unread_buyer INT NOT NULL DEFAULT 0,
    unread_seller INT NOT NULL DEFAULT 0,
    buyer_archived BOOLEAN NOT NULL DEFAULT FALSE,
    seller_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE messages (
    id VARCHAR(255) PRIMARY KEY,
    conversation_id VARCHAR(255) NOT NULL REFERENCES conversations(id),
    sender_id VARCHAR(255) NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    content_type VARCHAR(50) DEFAULT 'text',
    attachment_url VARCHAR(500),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    is_delivered BOOLEAN NOT NULL DEFAULT FALSE,
    sent_at TIMESTAMP NOT NULL DEFAULT NOW(),
    delivered_at TIMESTAMP NOT NULL DEFAULT NOW(),
    read_at TIMESTAMP
);

CREATE TABLE notifications (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    image_url VARCHAR(500),
    action_url VARCHAR(500),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE reports (
    id VARCHAR(255) PRIMARY KEY,
    reporter_id VARCHAR(255) NOT NULL REFERENCES users(id),
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(255) NOT NULL,
    reason VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    reviewed_by VARCHAR(255) REFERENCES users(id),
    reviewed_at TIMESTAMP,
    review_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_sold ON products(is_sold);
CREATE INDEX idx_products_moderation ON products(moderation_status);
CREATE INDEX idx_products_location ON products(district, province);
CREATE INDEX idx_conversations_buyer ON conversations(buyer_id);
CREATE INDEX idx_conversations_seller ON conversations(seller_id);
CREATE INDEX idx_conversations_product ON conversations(product_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);
CREATE INDEX idx_reports_reporter ON reports(reporter_id);
CREATE INDEX idx_reports_status ON reports(status);
