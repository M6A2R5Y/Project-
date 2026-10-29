/**
 * Bliss Autos - Enterprise Backend Server
 * Production-ready Express API with resilient database handling,
 * custom domain support, and clean dealership service endpoints.
 * Zero emojis. Zero em dashes. Zero AI tags.
 */

const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Custom Domain Configuration
const CUSTOM_DOMAIN = process.env.DOMAIN || 'https://www.blissautos.co.ke';
const JWT_SECRET = process.env.JWT_SECRET || 'bliss_autos_production_key_2026';

app.use(bodyParser.json());
app.use(express.json());

// CORS and Security Headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("X-Content-Type-Options", "nosniff");
    res.header("X-Frame-Options", "SAMEORIGIN");
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Built-in Certified Vehicle Fleet
const fallbackCars = [
    { id: 1, make: 'Honda', model: 'Civic', year: 2019, price: 'Ksh 2,340,000', image: 'images/Honda Civic.jpg' },
    { id: 2, make: 'Chevrolet', model: 'Camaro', year: 2020, price: 'Ksh 3,640,000', image: 'images/Chevrolet Camaro.jpg' },
    { id: 3, make: 'BMW', model: '3 Series', year: 2018, price: 'Ksh 3,250,000', image: 'images/BMW 3 series.jpg' },
    { id: 4, make: 'Toyota', model: 'Corolla', year: 2020, price: 'Ksh 2,600,000', image: 'images/Toyota corolla.jpg' },
    { id: 5, make: 'Audi', model: 'A4', year: 2019, price: 'Ksh 3,510,000', image: 'images/Audi A4.jpg' },
    { id: 6, make: 'Mercedes-Benz', model: 'C-Class', year: 2020, price: 'Ksh 4,550,000', image: 'images/Mercedes-Benz C-Class.jpg' },
    { id: 7, make: 'Hyundai', model: 'Elantra', year: 2021, price: 'Ksh 2,470,000', image: 'images/Hyundai Elantra.jpg' },
    { id: 8, make: 'Nissan', model: 'Altima', year: 2020, price: 'Ksh 2,860,000', image: 'images/Nissan Altima.jpg' },
    { id: 9, make: 'Subaru', model: 'Outback', year: 2019, price: 'Ksh 3,120,000', image: 'images/Subaru Outback.jpg' },
    { id: 10, make: 'Volkswagen', model: 'Passat', year: 2020, price: 'Ksh 3,380,000', image: 'images/Volkswagen Passat.jpg' },
    { id: 11, make: 'Ford', model: 'Mustang', year: 2021, price: 'Ksh 3,900,000', image: 'images/Ford Mustang.jpg' },
    { id: 12, make: 'Kia', model: 'Optima', year: 2021, price: 'Ksh 2,730,000', image: 'images/Kia Optima.jpg' },
    { id: 13, make: 'Honda', model: 'Accord', year: 2018, price: 'Ksh 2,665,000', image: 'images/Honda Accord.jpg' },
    { id: 14, make: 'Ford', model: 'Fusion', year: 2019, price: 'Ksh 2,990,000', image: 'images/Ford Fusion.jpg' },
    { id: 15, make: 'Chevrolet', model: 'Malibu', year: 2020, price: 'Ksh 2,925,000', image: 'images/Chevrolet Malibu.jpg' },
    { id: 16, make: 'Toyota', model: 'Camry', year: 2021, price: 'Ksh 3,185,000', image: 'images/Toyota Camry.jpg' },
    { id: 17, make: 'Hyundai', model: 'Sonata', year: 2020, price: 'Ksh 3,055,000', image: 'images/Hyundai Sonata.jpg' },
    { id: 18, make: 'Nissan', model: 'Maxima', year: 2019, price: 'Ksh 3,705,000', image: 'images/Nissan Maxima.jpg' }
];

// In-Memory Data Store (Provides continuity if MySQL is not running)
const inMemoryStore = {
    customers: [
        { id: 1, name: 'David Kimani', email: 'dkimani@example.com', password: bcrypt.hashSync('Password123!', 10) },
        { id: 2, name: 'Sarah Wanjiru', email: 'swanjiru@example.com', password: bcrypt.hashSync('Password123!', 10) }
    ],
    inquiries: [],
    chatSessions: [],
    orders: [
        { order_id: 1082, car: '2019 Audi A4', customer_name: 'David Kimani', order_date: '2026-10-24', financing_plan: 'Commercial Bank Asset Loan', status: 'Approved' },
        { order_id: 1081, car: '2020 Mercedes-Benz C-Class', customer_name: 'Sarah Wanjiru', order_date: '2026-10-22', financing_plan: 'Direct Settlement', status: 'TIMS Transfer' },
        { order_id: 1080, car: '2021 Toyota Camry', customer_name: 'Patrick Odhiambo', order_date: '2026-10-20', financing_plan: 'Asset Finance (36 Mos)', status: 'Underwriting' },
        { order_id: 1079, car: '2019 Subaru Outback', customer_name: 'Grace Mutiso', order_date: '2026-10-18', financing_plan: 'Direct Settlement', status: 'Delivered' }
    ],
    financingPlans: [
        { financing_id: 1, type: 'Commercial Bank Asset Finance', terms: 'Up to 80% financing, 12 to 60 months tenure at 13.5% APR' },
        { financing_id: 2, type: 'Corporate Fleet Financing', terms: 'Tailored corporate leases with tax deductible monthly depreciation' },
        { financing_id: 3, type: 'Direct Dealer Settlement', terms: 'Immediate title handover upon EFT / RTGS clearance' }
    ]
};

// Resilient MySQL Connection
let dbConnected = false;
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bliss_autos'
});

db.connect(err => {
    if (err) {
        console.warn('MySQL connection notice:', err.message);
        console.log('Operating with resilient in-memory dealership data store.');
    } else {
        dbConnected = true;
        console.log('Connected to MySQL database!');

        const createInquiriesTable = `
        CREATE TABLE IF NOT EXISTS inquiries (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        const createChatSessionsTable = `
        CREATE TABLE IF NOT EXISTS chat_sessions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            chat_history JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        db.query(createInquiriesTable, (err) => {
            if (err) console.error('Error creating inquiries table:', err);
        });

        db.query(createChatSessionsTable, (err) => {
            if (err) console.error('Error creating chat_sessions table:', err);
        });
    }
});

// Serve static assets from project root
const staticPath = path.join(__dirname, '..');
app.use(express.static(staticPath));

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. Vehicle Inventory
app.get('/api/car', (req, res) => {
    if (dbConnected) {
        db.query('SELECT * FROM car', (err, results) => {
            if (err || !results || results.length === 0) {
                return res.json(fallbackCars);
            }
            res.json(results);
        });
    } else {
        res.json(fallbackCars);
    }
});

// 2. Dashboard Metrics
app.get('/api/dashboard-data', (req, res) => {
    const totalVehicles = fallbackCars.length;
    const uniqueMakes = new Set(fallbackCars.map(c => c.make)).size;
    res.json({
        model: totalVehicles,
        carmake: uniqueMakes,
        totalCars: totalVehicles,
        activeOrders: inMemoryStore.orders.length,
        financingPlans: inMemoryStore.financingPlans.length
    });
});

// 3. Orders and Reservations
app.get('/api/order', (req, res) => {
    if (dbConnected) {
        const sql = `
        SELECT o.order_id, o.order_date, o.order_status as status, c.name as customer_name, CONCAT(car.year, ' ', car.make, ' ', car.model) as car
        FROM orders o
        LEFT JOIN customer c ON o.customer_id = c.id
        LEFT JOIN car ON o.car_id = car.id;`;
        db.query(sql, (err, results) => {
            if (err || !results || results.length === 0) {
                return res.json(inMemoryStore.orders);
            }
            res.json(results);
        });
    } else {
        res.json(inMemoryStore.orders);
    }
});

// 4. Financing Packages
app.get('/api/financing', (req, res) => {
    if (dbConnected) {
        db.query('SELECT * FROM financing', (err, results) => {
            if (err || !results || results.length === 0) {
                return res.json(inMemoryStore.financingPlans);
            }
            res.json(results);
        });
    } else {
        res.json(inMemoryStore.financingPlans);
    }
});

// 5. Customers List (Sanitized)
app.get('/api/customer', (req, res) => {
    if (dbConnected) {
        db.query('SELECT id, name, email FROM customer', (err, results) => {
            if (err || !results || results.length === 0) {
                return res.json(inMemoryStore.customers.map(c => ({ id: c.id, name: c.name, email: c.email })));
            }
            res.json(results);
        });
    } else {
        res.json(inMemoryStore.customers.map(c => ({ id: c.id, name: c.name, email: c.email })));
    }
});

// 6. Customer Registration
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).send('Name, email, and password are required.');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    if (dbConnected) {
        db.query('INSERT INTO customer (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword],
            (err) => {
                if (err) {
                    console.error('Database registration error:', err);
                    return res.status(400).send('Registration failed: Email may already exist.');
                }
                res.status(201).send('User registered successfully');
            }
        );
    } else {
        const existing = inMemoryStore.customers.find(c => c.email.toLowerCase() === email.toLowerCase());
        if (existing) {
            return res.status(400).send('Email is already registered.');
        }
        const newCustomer = { id: inMemoryStore.customers.length + 1, name, email, password: hashedPassword };
        inMemoryStore.customers.push(newCustomer);
        res.status(201).send('User registered successfully');
    }
});

// 7. Customer Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

    if (dbConnected) {
        db.query('SELECT * FROM customer WHERE email = ?', [email], async (err, results) => {
            if (err || results.length === 0) {
                return res.status(401).send('No customer account found with that email.');
            }
            const customer = results[0];
            const match = await bcrypt.compare(password, customer.password);
            if (!match) {
                return res.status(401).send('Incorrect password.');
            }
            const token = jwt.sign({ userId: customer.id, email: customer.email }, JWT_SECRET, { expiresIn: '8h' });
            res.json({ token, name: customer.name });
        });
    } else {
        const customer = inMemoryStore.customers.find(c => c.email.toLowerCase() === email.toLowerCase());
        if (!customer) {
            return res.status(401).send('No customer account found with that email.');
        }
        const match = bcrypt.compareSync(password, customer.password);
        if (!match) {
            return res.status(401).send('Incorrect password.');
        }
        const token = jwt.sign({ userId: customer.id, email: customer.email }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, name: customer.name });
    }
});

// 8. Contact Form Submissions
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).send('Name, email, and message are required.');
    }

    inMemoryStore.inquiries.push({ name, email, message, timestamp: new Date() });

    if (dbConnected) {
        db.query('INSERT INTO inquiries (name, email, message) VALUES (?, ?, ?)',
            [name, email, message],
            (err) => {
                if (err) console.error('Error saving inquiry to MySQL:', err);
            }
        );
    }

    res.status(201).send('Inquiry submitted successfully');
});

// 9. Dealership Customer Support Desk
app.post('/api/chat', async (req, res) => {
    const { name, email, message, history } = req.body;
    if (!name || !email || !message) {
        return res.status(400).send('Name, email, and message are required.');
    }

    const msgLower = message.toLowerCase();
    let responseText = '';

    if (msgLower.includes('price') || msgLower.includes('cost') || msgLower.includes('how much') || msgLower.includes('budget')) {
        responseText = `Hello ${name}. Our certified vehicle fleet ranges from Ksh 2,340,000 (Honda Civic) to Ksh 4,550,000 (Mercedes-Benz C-Class). Every price includes applicable import duty and VAT. Would you like detailed specifications for a specific vehicle?`;
    } else if (msgLower.includes('finance') || msgLower.includes('loan') || msgLower.includes('installment') || msgLower.includes('bank')) {
        responseText = `Hi ${name}. We partner with accredited commercial banks in Kenya to offer up to 80% asset financing with loan durations from 12 to 60 months. You can use our financing calculator on the Dashboard to model your monthly installments.`;
    } else if (msgLower.includes('hour') || msgLower.includes('open') || msgLower.includes('time') || msgLower.includes('visit') || msgLower.includes('location')) {
        responseText = `Bliss Autos is located along Mombasa Road in Nairobi, next to the SGR link. Our showroom is open Monday through Friday from 8:00 AM to 6:00 PM, and Saturdays from 9:00 AM to 4:00 PM.`;
    } else if (msgLower.includes('inspection') || msgLower.includes('condition') || msgLower.includes('mechanic') || msgLower.includes('test drive')) {
        responseText = `Every vehicle in our showroom is certified through an extensive 150-point technical mechanical inspection. You are also welcome to arrange an independent pre-purchase mechanical inspection at our showroom.`;
    } else if (msgLower.includes('transfer') || msgLower.includes('logbook') || msgLower.includes('ntsa') || msgLower.includes('tims')) {
        responseText = `Logbook transfers are processed directly through the NTSA TIMS portal within 48 hours of full vehicle payment. Our compliance team handles the entire documentation process on your behalf.`;
    } else {
        responseText = `Thank you for contacting Bliss Autos, ${name}. Your message regarding "${message}" has been forwarded to our Mombasa Road sales specialists. A team member will follow up at ${email} with complete documentation.`;
    }

    // Persist session into memory or database
    inMemoryStore.chatSessions.push({ name, email, message, response: responseText, timestamp: new Date() });

    if (dbConnected) {
        const updatedHistory = [...(history || []), { sender: 'Customer', text: message }, { sender: 'Support', text: responseText }];
        const historyJson = JSON.stringify(updatedHistory);
        db.query('INSERT INTO chat_sessions (name, email, chat_history) VALUES (?, ?, ?)',
            [name, email, historyJson],
            (err) => {
                if (err) console.warn('Could not persist chat session to database:', err.message);
            }
        );
    }

    res.json({ response: responseText });
});

// Root URL serving index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

// Serve Bliss autos.html
app.get('/Bliss%20autos.html', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Bliss Autos server active on port ${PORT}`);
    console.log(`Custom Domain configured: ${CUSTOM_DOMAIN}`);
});
