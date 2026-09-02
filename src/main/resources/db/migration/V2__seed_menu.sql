INSERT INTO category (name) VALUES
                                ('Burgers'),
                                ('Chicken & Sandwiches'),
                                ('McNuggets'),
                                ('Snack Wraps'),
                                ('Breakfast'),
                                ('Fries & Sides'),
                                ('Beverages'),
                                ('McCafe'),
                                ('Desserts & Shakes');

INSERT INTO menu_item (category_id, name, description, price, is_available) VALUES
                                                                                -- Burgers
                                                                                ((SELECT id FROM category WHERE name = 'Burgers'), 'Big Mac', 'Two beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun', 5.99, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Burgers'), 'Double Big Mac', 'Four beef patties with special sauce, lettuce, cheese, pickles and onions', 8.13, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Burgers'), 'Quarter Pounder with Cheese', 'Fresh beef patty with melted cheese, onions, pickles, ketchup and mustard', 6.49, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Burgers'), 'McDouble', 'Two beef patties with cheese, pickles, onions, ketchup and mustard', 3.19, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Burgers'), 'Cheeseburger', 'Classic beef patty with cheese, pickles, onions, ketchup and mustard', 2.19, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Burgers'), 'Hamburger', 'Classic beef patty with pickles, onions, ketchup and mustard', 1.89, TRUE),

                                                                                -- Chicken & Sandwiches
                                                                                ((SELECT id FROM category WHERE name = 'Chicken & Sandwiches'), 'McCrispy', 'Crispy all-white-meat chicken filet, shredded lettuce and pickles on a potato roll', 6.29, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Chicken & Sandwiches'), 'Spicy McCrispy', 'Crispy spicy chicken filet, shredded lettuce and pickles on a potato roll', 6.29, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Chicken & Sandwiches'), 'McChicken', 'Crispy chicken patty with shredded lettuce and mayo', 2.49, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Chicken & Sandwiches'), 'Filet-O-Fish', 'Wild-caught Alaska Pollock filet with tartar sauce and cheese on a steamed bun', 5.79, TRUE),

                                                                                -- McNuggets
                                                                                ((SELECT id FROM category WHERE name = 'McNuggets'), '4 pc Chicken McNuggets', 'Crispy bite-sized chicken nuggets', 3.49, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'McNuggets'), '10 pc Chicken McNuggets', 'Crispy bite-sized chicken nuggets', 7.49, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'McNuggets'), '20 pc Chicken McNuggets', 'Crispy bite-sized chicken nuggets, great for sharing', 11.99, TRUE),

                                                                                -- Snack Wraps
                                                                                ((SELECT id FROM category WHERE name = 'Snack Wraps'), 'Ranch Snack Wrap', 'Crispy chicken strip, shredded lettuce, cheese and ranch in a soft tortilla', 2.99, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Snack Wraps'), 'Spicy Snack Wrap', 'Crispy spicy chicken strip, shredded lettuce, cheese and spicy sauce in a soft tortilla', 2.99, TRUE),

                                                                                -- Breakfast
                                                                                ((SELECT id FROM category WHERE name = 'Breakfast'), 'Egg McMuffin', 'Freshly cracked egg, Canadian bacon and cheese on an English muffin', 4.19, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Breakfast'), 'Sausage McMuffin with Egg', 'Sausage, freshly cracked egg and cheese on an English muffin', 4.59, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Breakfast'), 'Sausage Biscuit', 'Warm buttermilk biscuit with a savory sausage patty', 2.49, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Breakfast'), 'Bacon, Egg & Cheese Biscuit', 'Crispy bacon, freshly cracked egg and cheese on a warm biscuit', 4.39, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Breakfast'), 'Hotcakes', 'Three fluffy hotcakes with butter and syrup', 4.29, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Breakfast'), 'Hash Browns', 'Golden, crispy shredded potatoes', 2.19, TRUE),

                                                                                -- Fries & Sides
                                                                                ((SELECT id FROM category WHERE name = 'Fries & Sides'), 'World Famous Fries (Small)', 'Golden, crispy fries salted to perfection', 1.99, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Fries & Sides'), 'World Famous Fries (Medium)', 'Golden, crispy fries salted to perfection', 3.56, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Fries & Sides'), 'World Famous Fries (Large)', 'Golden, crispy fries salted to perfection', 4.29, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Fries & Sides'), 'Apple Slices', 'Fresh sliced apples', 1.50, TRUE),

                                                                                -- Beverages
                                                                                ((SELECT id FROM category WHERE name = 'Beverages'), 'Coca-Cola (Medium)', 'Ice-cold Coca-Cola', 1.99, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Beverages'), 'Sprite (Medium)', 'Ice-cold Sprite', 1.99, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Beverages'), 'Sweet Tea (Medium)', 'Freshly brewed sweet tea', 1.79, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Beverages'), 'Bottled Water', 'Purified bottled water', 1.69, TRUE),

                                                                                -- McCafe
                                                                                ((SELECT id FROM category WHERE name = 'McCafe'), 'Premium Roast Coffee (Medium)', 'Freshly brewed 100% Arabica coffee', 1.99, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'McCafe'), 'Iced Caramel Macchiato', 'Espresso with vanilla, milk and caramel drizzle over ice', 4.29, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'McCafe'), 'McCafe Frappe (Mocha)', 'Blended coffee frappe topped with whipped cream and mocha drizzle', 4.79, TRUE),

                                                                                -- Desserts & Shakes
                                                                                ((SELECT id FROM category WHERE name = 'Desserts & Shakes'), 'Hot Fudge Sundae', 'Vanilla soft serve topped with hot fudge', 2.49, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Desserts & Shakes'), 'Oreo McFlurry', 'Vanilla soft serve blended with Oreo cookie pieces', 4.19, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Desserts & Shakes'), 'Apple Pie', 'Warm hand-held pie with a flaky crust', 1.99, TRUE),
                                                                                ((SELECT id FROM category WHERE name = 'Desserts & Shakes'), 'Chocolate Shake (Medium)', 'Rich, creamy chocolate shake', 3.79, TRUE);