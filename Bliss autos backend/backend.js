const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
app.use(bodyParser.json());

//MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@Kinyanjui9630',
    database: 'bliss_autos'
    });

db.connect(err => {
    if (err) {
        throw err;
        }
        console.log('Connected to the database!');
});
//Serve ststic files from the public
app.use(express.static('public'));
// Parse JSON bodies
app.use(express.json());

//Routes to get car data
app.get('/api/vehicles', (req, res) => {
    const sql ='SELECT * FROM cars';
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

    Connection.query('INSERT INTO Customer(name,email,password)VALUES (?, ?, ?)',
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
    Connection.query( 'SELECT * FROM Customer WHERE email = ?', [email], async(err,results) =>{
        if (err) {
            console.error('Error logging in:',err);
            return res.status(500).send('Error logging in');
        }
        if (results.length === 0) {
            return res.status(401).send('No user found');
        }
        const Customer = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send('Inrpassword');
        }
        const token = jwt.sign({userId: user.id}, 'your_jwt_secret', {expiresIn: '1h'});
        res.json({token});
    });    
});

//start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

});
