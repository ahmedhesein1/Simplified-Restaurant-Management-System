-- Create the Staffs table
CREATE TABLE Staffs (
    id SERIAL PRIMARY KEY,                  -- Unique identifier for each staff member
    name VARCHAR(100) NOT NULL,            -- Staff name
    email VARCHAR(100) UNIQUE NOT NULL,    -- Unique email address
    password VARCHAR(255) NOT NULL,        -- Encrypted password
    role ENUM('admin', 'staff') NOT NULL,  -- Role: admin or staff
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Creation timestamp
);

-- Create the Menus table
CREATE TABLE Menus (
    id SERIAL PRIMARY KEY,                  -- Unique identifier for each menu item
    name VARCHAR(100) NOT NULL,            -- Name of the menu item
    description TEXT NOT NULL,             -- Description of the menu item
    price DECIMAL(10, 2) NOT NULL,         -- Price of the menu item
    category VARCHAR(50) NOT NULL,         -- Category of the menu item
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Creation timestamp
);

-- Create the Orders table
CREATE TABLE Orders (
    id SERIAL PRIMARY KEY,                  -- Unique identifier for each order
    staff_id INT NOT NULL,                 -- Foreign key linking to Staffs
    status ENUM('pending', 'complete', 'expired') DEFAULT 'pending', -- Order status
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Order creation timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Order update timestamp
    FOREIGN KEY (staff_id) REFERENCES Staffs (id) ON DELETE CASCADE -- Link orders to staff
);

-- Create the MenuOrders table
CREATE TABLE MenuOrders (
    id SERIAL PRIMARY KEY,                  -- Unique identifier for each menu-order relationship
    order_id INT NOT NULL,                 -- Foreign key linking to Orders
    menu_id INT NOT NULL,                  -- Foreign key linking to Menus
    quantity INT NOT NULL CHECK (quantity > 0), -- Quantity of the menu item
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Creation timestamp
    FOREIGN KEY (order_id) REFERENCES Orders (id) ON DELETE CASCADE, -- Link to orders
    FOREIGN KEY (menu_id) REFERENCES Menus (id) ON DELETE CASCADE -- Link to menus
);

-- Indexes for optimized querying
CREATE INDEX idx_menus_category ON Menus (category);
CREATE INDEX idx_orders_status ON Orders (status);
CREATE INDEX idx_menuorders_order_menu ON MenuOrders (order_id, menu_id);

-- Sample Data (Optional)
-- Insert sample staff data
INSERT INTO Staffs (name, email, password, role) VALUES
('Admin User', 'admin@example.com', 'hashed_password_admin', 'admin'),
('Staff User', 'staff@example.com', 'hashed_password_staff', 'staff');

-- Insert sample menu items
INSERT INTO Menus (name, description, price, category) VALUES
('Burger', 'Delicious beef burger', 9.99, 'Main Course'),
('Fries', 'Crispy golden fries', 3.99, 'Side Dish'),
('Soda', 'Refreshing soda drink', 1.99, 'Beverage');

-- Insert a sample order and associated menu items
INSERT INTO Orders (staff_id, status) VALUES (2, 'pending');
INSERT INTO MenuOrders (order_id, menu_id, quantity) VALUES
(1, 1, 2), -- 2 Burgers
(1, 2, 1); -- 1 Fries
