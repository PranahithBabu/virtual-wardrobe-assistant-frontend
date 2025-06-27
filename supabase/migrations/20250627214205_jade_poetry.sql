-- Insert default user profile
INSERT INTO user_profiles (name, email, avatar_url, style_preferences, created_at, updated_at) 
VALUES (
    'Alex Doe', 
    'alex.doe@example.com', 
    'https://placehold.co/100x100.png',
    'I love a minimalist style with neutral colors. I occasionally like to add a pop of color with accessories. My go-to look is casual chic.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Insert sample closet items
INSERT INTO closet_items (name, category, color, image_url, data_ai_hint, last_worn, created_at, updated_at) VALUES
('White Cotton T-Shirt', 'Tops', 'White', 'https://placehold.co/400x600/png', 'white tshirt', '2023-10-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Blue Denim Jeans', 'Bottoms', 'Blue', 'https://placehold.co/400x600/png', 'blue jeans', '2023-10-18', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Black Leather Jacket', 'Outerwear', 'Black', 'https://placehold.co/400x600/png', 'leather jacket', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Floral Sundress', 'Dresses', 'Multicolor', 'https://placehold.co/400x600/png', 'floral dress', '2023-08-20', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('White Sneakers', 'Shoes', 'White', 'https://placehold.co/400x600/png', 'white sneakers', '2023-10-20', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tan Trench Coat', 'Outerwear', 'Tan', 'https://placehold.co/400x600/png', 'trench coat', '2023-05-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Black Trousers', 'Bottoms', 'Black', 'https://placehold.co/400x600/png', 'black trousers', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gray Hoodie', 'Tops', 'Gray', 'https://placehold.co/400x600/png', 'gray hoodie', '2023-10-19', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brown Loafers', 'Shoes', 'Brown', 'https://placehold.co/400x600/png', 'brown loafers', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Silk Scarf', 'Accessories', 'Red', 'https://placehold.co/400x600/png', 'silk scarf', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Denim Shorts', 'Bottoms', 'Blue', 'https://placehold.co/400x600/png', 'denim shorts', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Knit Sweater', 'Tops', 'Cream', 'https://placehold.co/400x600/png', 'knit sweater', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert seasons for items
INSERT INTO item_seasons (item_id, season) VALUES
(1, 'All'), (2, 'All'), (3, 'Autumn'), (3, 'Winter'), (4, 'Summer'),
(5, 'All'), (6, 'Spring'), (6, 'Autumn'), (7, 'All'), (8, 'All'),
(9, 'All'), (10, 'All'), (11, 'Summer'), (12, 'Winter');