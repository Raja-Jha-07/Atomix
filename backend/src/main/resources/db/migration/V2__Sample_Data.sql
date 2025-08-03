-- Sample data for Atomix Cafeteria Management System
-- Version 2.0

-- Insert sample users
INSERT INTO users (email, password, first_name, last_name, role, floor_id, department, employee_id, food_card_balance, is_active, email_verified) VALUES
('admin@atomix.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Admin', 'User', 'ADMIN', 'ALL', 'IT', 'EMP001', 1000.00, true, true),
('manager@atomix.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Cafeteria', 'Manager', 'CAFETERIA_MANAGER', 'ALL', 'F&B', 'EMP002', 500.00, true, true),
('john.doe@atomix.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'John', 'Doe', 'EMPLOYEE', 'F1', 'Engineering', 'EMP003', 250.00, true, true),
('jane.smith@atomix.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Jane', 'Smith', 'EMPLOYEE', 'F2', 'HR', 'EMP004', 300.00, true, true),
('vendor1@atomix.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'South', 'Kitchen', 'VENDOR', 'F1', 'F&B', 'VEN001', 0.00, true, true),
('vendor2@atomix.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'North', 'Delights', 'VENDOR', 'F2', 'F&B', 'VEN002', 0.00, true, true);

-- Insert sample vendors
INSERT INTO vendors (name, description, contact_email, contact_phone, contact_person, status, vendor_type, is_active, operating_hours, average_rating, total_reviews) VALUES
('South Kitchen', 'Authentic South Indian cuisine with traditional flavors', 'southkitchen@atomix.com', '+91-9876543210', 'Ravi Kumar', 'APPROVED', 'PERMANENT', true, '08:00-20:00', 4.5, 125),
('North Delights', 'Delicious North Indian and Punjabi food', 'northdelights@atomix.com', '+91-9876543211', 'Priya Sharma', 'APPROVED', 'PERMANENT', true, '09:00-21:00', 4.2, 98),
('Healthy Bites', 'Nutritious salads, soups and healthy options', 'healthybites@atomix.com', '+91-9876543212', 'Dr. Anjali Nair', 'APPROVED', 'PERMANENT', true, '07:00-18:00', 4.3, 87),
('Snack Corner', 'Quick snacks, beverages and desserts', 'snackcorner@atomix.com', '+91-9876543213', 'Rajesh Gupta', 'APPROVED', 'PERMANENT', true, '08:00-22:00', 4.0, 156),
('Global Express', 'International cuisines - Chinese, Italian, Continental', 'globalexpress@atomix.com', '+91-9876543214', 'Maria Rodriguez', 'APPROVED', 'PERMANENT', true, '11:00-21:00', 4.4, 73);

-- Insert vendor floor mappings
INSERT INTO vendor_floor_mappings (vendor_id, floor_id) VALUES
(1, 'F1'), (1, 'F2'),  -- South Kitchen available on F1 and F2
(2, 'F1'), (2, 'F3'),  -- North Delights available on F1 and F3
(3, 'F1'), (3, 'F2'), (3, 'F3'),  -- Healthy Bites on all floors
(4, 'F1'), (4, 'F2'), (4, 'F3'),  -- Snack Corner on all floors
(5, 'F2'), (5, 'F3');  -- Global Express on F2 and F3

-- Insert sample menu items for South Kitchen
INSERT INTO menu_items (name, description, price, category, vendor_id, floor_id, is_available, preparation_time, calories, rating, rating_count) VALUES
('Masala Dosa', 'Crispy crepe with spiced potato filling, served with chutney and sambar', 85.00, 'BREAKFAST', 1, 'F1', true, 15, 320, 4.6, 89),
('Idli Sambar', 'Steamed rice cakes served with lentil curry and coconut chutney', 65.00, 'BREAKFAST', 1, 'F1', true, 10, 240, 4.4, 76),
('Chicken Biryani', 'Aromatic basmati rice cooked with tender chicken and spices', 150.00, 'LUNCH', 1, 'F1', true, 25, 580, 4.7, 112),
('Vegetable Curry', 'Mixed vegetables cooked in coconut-based curry', 95.00, 'LUNCH', 1, 'F1', true, 20, 280, 4.3, 54),
('Filter Coffee', 'Traditional South Indian filter coffee', 25.00, 'BEVERAGES', 1, 'F1', true, 5, 15, 4.5, 203);

-- Insert sample menu items for North Delights
INSERT INTO menu_items (name, description, price, category, vendor_id, floor_id, is_available, preparation_time, calories, rating, rating_count) VALUES
('Butter Chicken', 'Tender chicken in rich tomato and butter curry', 165.00, 'LUNCH', 2, 'F1', true, 30, 620, 4.8, 94),
('Paneer Butter Masala', 'Cottage cheese cubes in creamy tomato gravy', 145.00, 'LUNCH', 2, 'F1', true, 25, 480, 4.5, 78),
('Aloo Paratha', 'Stuffed flatbread with spiced potatoes, served with yogurt', 75.00, 'BREAKFAST', 2, 'F1', true, 15, 350, 4.4, 67),
('Chole Bhature', 'Spiced chickpeas with fried bread', 95.00, 'LUNCH', 2, 'F1', true, 20, 520, 4.6, 85),
('Lassi', 'Sweet or salted yogurt drink', 35.00, 'BEVERAGES', 2, 'F1', true, 5, 120, 4.2, 91);

-- Insert sample menu items for Healthy Bites
INSERT INTO menu_items (name, description, price, category, vendor_id, floor_id, is_available, preparation_time, calories, rating, rating_count) VALUES
('Mediterranean Salad', 'Fresh greens with olives, feta cheese, and olive oil dressing', 120.00, 'SALADS', 3, 'F1', true, 10, 280, 4.5, 65),
('Quinoa Bowl', 'Nutritious quinoa with roasted vegetables and tahini dressing', 135.00, 'LUNCH', 3, 'F1', true, 15, 420, 4.4, 47),
('Tomato Basil Soup', 'Fresh tomato soup with basil and herbs', 55.00, 'SOUPS', 3, 'F1', true, 12, 150, 4.3, 38),
('Grilled Chicken Salad', 'Lean grilled chicken with mixed greens and balsamic vinaigrette', 155.00, 'SALADS', 3, 'F1', true, 18, 380, 4.6, 52),
('Green Smoothie', 'Spinach, banana, apple and ginger smoothie', 65.00, 'BEVERAGES', 3, 'F1', true, 8, 180, 4.1, 41);

-- Insert sample menu items for Snack Corner
INSERT INTO menu_items (name, description, price, category, vendor_id, floor_id, is_available, preparation_time, calories, rating, rating_count) VALUES
('Samosa', 'Crispy pastry filled with spiced potatoes and peas', 25.00, 'SNACKS', 4, 'F1', true, 8, 180, 4.2, 145),
('Chocolate Brownie', 'Rich chocolate brownie with nuts', 45.00, 'DESSERTS', 4, 'F1', true, 5, 320, 4.4, 87),
('Fresh Lime Soda', 'Refreshing lime drink with soda', 30.00, 'BEVERAGES', 4, 'F1', true, 3, 45, 4.1, 78),
('Vegetable Sandwich', 'Grilled sandwich with fresh vegetables and cheese', 65.00, 'SNACKS', 4, 'F1', true, 12, 280, 4.0, 63),
('Ice Cream', 'Vanilla, chocolate, or strawberry flavors', 35.00, 'DESSERTS', 4, 'F1', true, 2, 200, 4.3, 92);

-- Insert sample menu items for Global Express
INSERT INTO menu_items (name, description, price, category, vendor_id, floor_id, is_available, preparation_time, calories, rating, rating_count) VALUES
('Chicken Fried Rice', 'Chinese-style fried rice with chicken and vegetables', 125.00, 'LUNCH', 5, 'F2', true, 20, 480, 4.3, 68),
('Margherita Pizza', 'Classic Italian pizza with tomato, mozzarella, and basil', 195.00, 'LUNCH', 5, 'F2', true, 25, 650, 4.5, 54),
('Chicken Pasta', 'Creamy pasta with grilled chicken and herbs', 165.00, 'LUNCH', 5, 'F2', true, 22, 590, 4.4, 41),
('Spring Rolls', 'Crispy vegetable spring rolls with sweet chili sauce', 85.00, 'SNACKS', 5, 'F2', true, 15, 250, 4.2, 37),
('Tiramisu', 'Classic Italian coffee-flavored dessert', 75.00, 'DESSERTS', 5, 'F2', true, 5, 380, 4.6, 29);

-- Insert menu item ingredients
INSERT INTO menu_item_ingredients (menu_item_id, ingredient) VALUES
(1, 'Rice'), (1, 'Urad Dal'), (1, 'Potato'), (1, 'Onion'), (1, 'Spices'),
(2, 'Rice'), (2, 'Urad Dal'), (2, 'Lentils'), (2, 'Coconut'),
(6, 'Chicken'), (6, 'Tomato'), (6, 'Butter'), (6, 'Cream'), (6, 'Spices'),
(11, 'Lettuce'), (11, 'Tomato'), (11, 'Cucumber'), (11, 'Olives'), (11, 'Feta Cheese');

-- Insert menu item tags
INSERT INTO menu_item_tags (menu_item_id, tag) VALUES
(1, 'Popular'), (1, 'Traditional'), (1, 'Gluten-Free'),
(2, 'Healthy'), (2, 'Traditional'), (2, 'Vegan'),
(6, 'Popular'), (6, 'Spicy'), (6, 'Non-Veg'),
(11, 'Healthy'), (11, 'Vegetarian'), (11, 'Low-Carb'),
(12, 'Healthy'), (12, 'Protein-Rich'), (12, 'Gluten-Free');

-- Insert sample orders (for demonstration)
INSERT INTO orders (order_number, user_id, vendor_id, status, total_amount, payment_status, payment_method, created_at, order_confirmed_at) VALUES
('ORD001', 3, 1, 'COMPLETED', 235.00, 'PAID', 'FOOD_CARD', CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
('ORD002', 4, 2, 'READY', 165.00, 'PAID', 'FOOD_CARD', CURRENT_TIMESTAMP - INTERVAL '30 minutes', CURRENT_TIMESTAMP - INTERVAL '25 minutes'),
('ORD003', 3, 3, 'PREPARING', 120.00, 'PAID', 'UPI', CURRENT_TIMESTAMP - INTERVAL '15 minutes', CURRENT_TIMESTAMP - INTERVAL '12 minutes');

-- Insert order items
INSERT INTO order_items (order_id, menu_item_id, quantity, price, menu_item_name, menu_item_description) VALUES
(1, 1, 2, 85.00, 'Masala Dosa', 'Crispy crepe with spiced potato filling'),
(1, 3, 1, 150.00, 'Chicken Biryani', 'Aromatic basmati rice with chicken'),
(2, 6, 1, 165.00, 'Butter Chicken', 'Tender chicken in rich tomato curry'),
(3, 11, 1, 120.00, 'Mediterranean Salad', 'Fresh greens with olives and feta'); 