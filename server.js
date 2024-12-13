const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your database username
    password: 'password', // Replace with your database password
    database: 'NSR_Store'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// API to fetch all products
app.get('/products', (req, res) => {
    const query = 'SELECT * FROM Products';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Failed to fetch products' });
        } else {
            res.json(results);
        }
    });
});

// API to fetch cart items
app.get('/cart', (req, res) => {
    const query = `
        SELECT Cart.id AS cart_id, Products.id AS product_id, Products.name, Products.price, Products.image, Cart.quantity
        FROM Cart
        JOIN Products ON Cart.product_id = Products.id
    `;
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Failed to fetch cart items' });
        } else {
            res.json(results);
        }
    });
});

// API to add a product to the cart
app.post('/cart', (req, res) => {
    const { product_id } = req.body;

    if (!product_id) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    const checkQuery = 'SELECT * FROM Cart WHERE product_id = ?';
    db.query(checkQuery, [product_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length > 0) {
            const updateQuery = 'UPDATE Cart SET quantity = quantity + 1 WHERE product_id = ?';
            db.query(updateQuery, [product_id], (err) => {
                if (err) {
                    res.status(500).json({ error: 'Failed to update cart' });
                } else {
                    res.json({ message: 'Product quantity updated in the cart' });
                }
            });
        } else {
            const insertQuery = 'INSERT INTO Cart (product_id, quantity) VALUES (?, ?)';
            db.query(insertQuery, [product_id, 1], (err) => {
                if (err) {
                    res.status(500).json({ error: 'Failed to add product to cart' });
                } else {
                    res.json({ message: 'Product added to cart' });
                }
            });
        }
    });
});

// API to update the quantity of a cart item
app.put('/cart/:cart_id', (req, res) => {
    const { cart_id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
        return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const query = 'UPDATE Cart SET quantity = ? WHERE id = ?';
    db.query(query, [quantity, cart_id], (err) => {
        if (err) {
            res.status(500).json({ error: 'Failed to update cart item' });
        } else {
            res.json({ message: 'Cart item updated successfully' });
        }
    });
});

// API to remove an item from the cart
app.delete('/cart/:cart_id', (req, res) => {
    const { cart_id } = req.params;

    const query = 'DELETE FROM Cart WHERE id = ?';
    db.query(query, [cart_id], (err) => {
        if (err) {
            res.status(500).json({ error: 'Failed to remove cart item' });
        } else {
            res.json({ message: 'Item removed from cart successfully' });
        }
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
