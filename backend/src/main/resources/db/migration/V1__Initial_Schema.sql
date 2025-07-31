-- Initial schema for Atomix Cafeteria Management System
-- Version 1.0

-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('EMPLOYEE', 'VENDOR', 'ADMIN', 'CAFETERIA_MANAGER')),
    floor_id VARCHAR(50),
    department VARCHAR(100),
    profile_image VARCHAR(500),
    phone_number VARCHAR(20),
    employee_id VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    provider VARCHAR(50),
    provider_id VARCHAR(100),
    food_card_balance DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Vendors table
CREATE TABLE vendors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20),
    contact_person VARCHAR(100),
    business_license VARCHAR(100),
    logo_url VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED', 'INACTIVE')),
    is_active BOOLEAN DEFAULT TRUE,
    operating_hours VARCHAR(200),
    location_description TEXT,
    vendor_type VARCHAR(50) NOT NULL DEFAULT 'PERMANENT' CHECK (vendor_type IN ('PERMANENT', 'TEMPORARY', 'SEASONAL', 'EVENT_BASED')),
    temporary_start_date TIMESTAMP,
    temporary_end_date TIMESTAMP,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Vendor floor mappings
CREATE TABLE vendor_floor_mappings (
    vendor_id BIGINT NOT NULL,
    floor_id VARCHAR(50) NOT NULL,
    PRIMARY KEY (vendor_id, floor_id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

-- Menu items table
CREATE TABLE menu_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    category VARCHAR(50) NOT NULL CHECK (category IN ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACKS', 'BEVERAGES', 'DESSERTS', 'SALADS', 'SOUPS')),
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    preparation_time INTEGER CHECK (preparation_time >= 0),
    vendor_id BIGINT NOT NULL,
    floor_id VARCHAR(50),
    calories INTEGER CHECK (calories >= 0),
    protein_grams INTEGER CHECK (protein_grams >= 0),
    fat_grams INTEGER CHECK (fat_grams >= 0),
    carbs_grams INTEGER CHECK (carbs_grams >= 0),
    votes_count INTEGER DEFAULT 0 CHECK (votes_count >= 0),
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    rating_count INTEGER DEFAULT 0 CHECK (rating_count >= 0),
    quantity_available INTEGER CHECK (quantity_available >= 0),
    is_limited_quantity BOOLEAN DEFAULT FALSE,
    available_from TIMESTAMP,
    available_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

-- Menu item ingredients
CREATE TABLE menu_item_ingredients (
    menu_item_id BIGINT NOT NULL,
    ingredient VARCHAR(100) NOT NULL,
    PRIMARY KEY (menu_item_id, ingredient),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- Menu item tags
CREATE TABLE menu_item_tags (
    menu_item_id BIGINT NOT NULL,
    tag VARCHAR(50) NOT NULL,
    PRIMARY KEY (menu_item_id, tag),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    vendor_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED', 'REFUNDED')),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    discount_amount DECIMAL(10,2) DEFAULT 0.00 CHECK (discount_amount >= 0),
    tax_amount DECIMAL(10,2) DEFAULT 0.00 CHECK (tax_amount >= 0),
    pickup_time TIMESTAMP,
    payment_status VARCHAR(50) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED')),
    payment_method VARCHAR(50) CHECK (payment_method IN ('FOOD_CARD', 'CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'NET_BANKING', 'WALLET', 'CASH', 'RAZORPAY', 'STRIPE')),
    payment_transaction_id VARCHAR(100),
    special_instructions TEXT,
    estimated_preparation_time INTEGER,
    actual_preparation_time INTEGER,
    order_confirmed_at TIMESTAMP,
    preparation_started_at TIMESTAMP,
    ready_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

-- Order items table
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    menu_item_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    special_instructions TEXT,
    menu_item_name VARCHAR(200) NOT NULL,
    menu_item_description TEXT,
    menu_item_image_url VARCHAR(500),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_floor_id ON users(floor_id);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE INDEX idx_vendors_status ON vendors(status);
CREATE INDEX idx_vendors_vendor_type ON vendors(vendor_type);
CREATE INDEX idx_vendors_is_active ON vendors(is_active);

CREATE INDEX idx_menu_items_vendor_id ON menu_items(vendor_id);
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_is_available ON menu_items(is_available);
CREATE INDEX idx_menu_items_floor_id ON menu_items(floor_id);
CREATE INDEX idx_menu_items_rating ON menu_items(rating);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_order_number ON orders(order_number);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item_id ON order_items(menu_item_id);

-- MySQL automatically updates the updated_at column with ON UPDATE CURRENT_TIMESTAMP
-- No triggers needed for MySQL 