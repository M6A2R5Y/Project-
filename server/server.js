require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const db = require('./config/db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Serve static files from the client directory if running in production bundle mode
app.use(express.static('../client'));

// Routes to get car data
app.get('/api/cars', (req, res) => {
    const sql = 'SELECT * FROM cars';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching cars:', err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// Alias for vehicles endpoint
app.get('/api/vehicles', (req, res) => {
    const sql = 'SELECT * FROM cars';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching vehicles:', err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// Register endpoint
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).send('Missing name, email, or password');
    }
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query('INSERT INTO Customer(name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword], 
        (err) => {
            if (err) {
                console.error('Error registering user:', err);
                return res.status(500).send('Error registering user');
            }
            res.status(201).send('User registered successfully');
        }
    );
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Missing email or password');
    }

    db.query('SELECT * FROM Customer WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('Error logging in:', err);
            return res.status(500).send('Error logging in');
        }
        if (results.length === 0) {
            return res.status(401).send('No user found');
        }
        const customer = results[0];
        const match = await bcrypt.compare(password, customer.password);
        if (!match) {
            return res.status(401).send('Incorrect password');
        }
        const token = jwt.sign(
            { userId: customer.id }, 
            process.env.JWT_SECRET || 'your_jwt_secret', 
            { expiresIn: '1h' }
        );
        res.json({ token });
    });    
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
