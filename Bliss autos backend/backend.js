const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.json());

// Enable basic CORS for development
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

//MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bliss_autos'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Connected to the database!');
    
    // Create inquiries table
    const createInquiriesTable = `
    CREATE TABLE IF NOT EXISTS inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;
    
    // Create chat_sessions table to store chatbot customer leads & history
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
});

//Serve static files from the project root (parent directory)
app.use(express.static(path.join(__dirname, '..')));
// Parse JSON bodies
app.use(express.json());

//Routes to get car data
app.get('/api/car', (req, res) => {
    const sql ='SELECT * FROM car';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

//Register endpoint
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query('INSERT INTO customer(name,email,password)VALUES (?, ?, ?)',
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

//login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.query( 'SELECT * FROM customer WHERE email = ?', [email], async(err,results) => {
        if (err) {
            console.error('Error logging in:',err);
            return res.status(500).send('Error logging in');
        }
        if (results.length === 0) {
            return res.status(401).send('No user found');
        }
        const Customer = results[0];
        const match = await bcrypt.compare(password, Customer.password);
        if (!match) {
            return res.status(401).send('Incorrect password');
        }
        const token = jwt.sign({userId: Customer.id}, 'your_jwt_secret', {expiresIn: '1h'});
        res.json({token});
    });    
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).send('Name, email, and message are required.');
    }
    db.query('INSERT INTO inquiries (name, email, message) VALUES (?, ?, ?)',
        [name, email, message],
        (err) => {
            if (err) {
                console.error('Error saving inquiry:', err);
                return res.status(500).send('Error saving inquiry');
            }
            res.status(201).send('Inquiry submitted successfully');
        }
    );
});

// Chatbot endpoint
app.post('/api/chat', async (req, res) => {
    const { name, email, message, history } = req.body;
    if (!name || !email || !message) {
        return res.status(400).send('Name, email, and message are required.');
    }

    let responseText = '';
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (geminiApiKey) {
        try {
            const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
            
            const prompt = `You are a helpful customer service chatbot for "Bliss Autos", a premium car dealership.
Our inventory includes vehicles like Honda Civic (Ksh 2,340,000), Chevrolet Camaro (Ksh 3,640,000), BMW 3 Series (Ksh 3,250,000), Toyota Corolla (Ksh 2,600,000), Audi A4 (Ksh 3,510,000), Mercedes-Benz C-Class (Ksh 4,550,000), Hyundai Elantra (Ksh 2,470,000), Nissan Altima (Ksh 2,860,000), Subaru Outback (Ksh 3,120,000), Volkswagen Passat (Ksh 3,380,000), Ford Mustang (Ksh 3,900,000), Kia Optima (Ksh 2,730,000), Honda Accord (Ksh 2,665,000), Ford Fusion (Ksh 2,990,000), Chevrolet Malibu (Ksh 2,925,000), Toyota Camry (Ksh 3,185,000), Hyundai Sonata (Ksh 3,055,000), Nissan Maxima (Ksh 3,705,000).
We support financing, bank transfers, and cash payments.

Customer Name: ${name}
Customer Email: ${email}
Conversation history:
${(history || []).map(h => `${h.sender}: ${h.text}`).join('\n')}
Customer: ${message}
AI:`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });
            const data = await response.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
                responseText = data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Invalid response structure from Gemini API');
            }
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            responseText = `Hello ${name}! Thank you for reaching out. I'm currently having trouble reaching my AI brain, but I've saved your inquiry. Our team will contact you at ${email} shortly regarding: "${message}"`;
        }
    } else {
        const msgLower = message.toLowerCase();
        if (msgLower.includes('price') || msgLower.includes('cost') || msgLower.includes('how much')) {
            responseText = `Hello ${name}! Our cars range from Ksh 2,340,000 (Honda Civic) to Ksh 4,550,000 (Mercedes-Benz C-Class). What specific brand or budget are you looking at?`;
        } else if (msgLower.includes('financing') || msgLower.includes('loan') || msgLower.includes('pay')) {
            responseText = `Hi ${name}, we support Bank Transfer, Cash Payment, and flexible financing terms. You can view all our offers on the Dashboard.`;
        } else if (msgLower.includes('hours') || msgLower.includes('open') || msgLower.includes('time')) {
            responseText = `Hi ${name}, Bliss Autos is open Monday to Saturday from 8:00 AM to 6:00 PM.`;
        } else {
            responseText = `Thank you for contacting Bliss Autos, ${name}! Your inquiry about "${message}" has been saved. One of our sales representatives will follow up with you at ${email} shortly.`;
        }
    }

    const updatedHistory = [...(history || []), { sender: 'Customer', text: message }, { sender: 'AI', text: responseText }];
    const historyJson = JSON.stringify(updatedHistory);

    db.query('SELECT id FROM chat_sessions WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error checking chat session:', err);
            return res.json({ response: responseText });
        }
        if (results.length > 0) {
            db.query('UPDATE chat_sessions SET chat_history = ?, name = ? WHERE email = ?', [historyJson, name, email], (err) => {
                if (err) console.error('Error updating chat history:', err);
            });
        } else {
            db.query('INSERT INTO chat_sessions (name, email, chat_history) VALUES (?, ?, ?)', [name, email, historyJson], (err) => {
                if (err) console.error('Error inserting chat session:', err);
            });
        }
    });

    res.json({ response: responseText });
});

// Serve homepage for root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Bliss autos.html'));
});

//start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
