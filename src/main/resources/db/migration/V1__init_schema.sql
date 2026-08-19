CREATE TABLE category (
                          id BIGSERIAL PRIMARY KEY,
                          name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE menu_item (
                           id BIGSERIAL PRIMARY KEY,
                           category_id BIGINT NOT NULL REFERENCES category(id),
                           name VARCHAR(150) NOT NULL,
                           description TEXT,
                           price NUMERIC(10,2) NOT NULL,
                           is_available BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE app_user (
                          id BIGSERIAL PRIMARY KEY,
                          email VARCHAR(255) NOT NULL UNIQUE,
                          password_hash VARCHAR(255) NOT NULL,
                          role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',
                          created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE orders (
                        id BIGSERIAL PRIMARY KEY,
                        user_id BIGINT NOT NULL REFERENCES app_user(id),
                        status VARCHAR(20) NOT NULL DEFAULT 'PLACED',
                        total NUMERIC(10,2) NOT NULL,
                        created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE order_item (
                            id BIGSERIAL PRIMARY KEY,
                            order_id BIGINT NOT NULL REFERENCES orders(id),
                            menu_item_id BIGINT NOT NULL REFERENCES menu_item(id),
                            quantity INT NOT NULL CHECK (quantity > 0),
                            unit_price NUMERIC(10,2) NOT NULL
);

CREATE INDEX idx_menu_item_category ON menu_item(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_item_order ON order_item(order_id);