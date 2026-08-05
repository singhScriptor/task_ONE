require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const database = require('./config/db-connection');
const cookieParser = require('cookie-parser');


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

// Accessing routes files
const signupRoutes = require('./routes/signupRoutes');
const signinRoutes = require('./routes/signinRoutes');
const expenseRoutes = require('./routes/expensesRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const premiumRoute = require('./routes/premiumRoutes');
const generativeAiRoutes = require('./routes/genaiRoutes');

// Middleware & Error Handling
const errorhandling = require('./middleware/errorHandler');

// Routes (MOUNT /api/expenses/ai BEFORE /api/expenses)
app.use('/users', signupRoutes);
app.use('/users', signinRoutes);
app.use('/api/expenses/ai', generativeAiRoutes); // <-- Specific sub-route first
app.use('/api/expenses', expenseRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/premium', subscriptionRoutes);
app.use('/api/premium', premiumRoute);


// Frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// HTML Pages
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/signup/signup.html'));
});

app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/signin/signin.html'));
});

app.get('/expenses', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/expenseTracker/expense.html'));
});

app.get('/', (req, res) => {
    res.redirect('/signin');
});

// Error handling middleware
app.use(errorhandling);

database.sync()
    .then(() => {
        app.listen(port, () => {
            console.log('Server is listening on port 3000...');
        });
    })
    .catch((err) => {
        console.log(err.message);
    });