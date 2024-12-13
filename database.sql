-- Create the database
CREATE DATABASE NSR_Store;

-- Use the database
USE NSR_Store;

-- Create the products table
CREATE TABLE Products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255) NOT NULL
);

-- Create the cart table
CREATE TABLE Cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

-- Insert initial data into the products table
INSERT INTO Products (name, price, image) VALUES
('Gianelli Exhaust', 300, 'image/1.png'),
('34mm carburetor', 25, 'image/2.png'),
('Malossi 180cc Kit', 480, 'image/3.png');
