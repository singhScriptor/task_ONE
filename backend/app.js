require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const database = require('./config/db-connection');
const cookieParser = require('cookie-parser');
const compression = require('compression')
const morgan = require('morgan')


const app = express();
const port = process.env.PORT || 3000

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(compression())
app.use(morgan('dev'))


// accessing routes files
const signupRoutes = require('./routes/signupRoutes');
const signinRoutes = require('./routes/signinRoutes');
const expenseRoutes = require('./routes/expensesRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const premiumRoute = require('./routes/premiumRoutes');
const generativeAiRoutes = require('./routes/genaiRoutes');
const forgotRoutes = require('./routes/forgotRoutes')
const reportRoutes = require('./routes/reportRoutes')



// middleware & error handling
const errorhandling = require('./middleware/errorHandler');

// routes
app.use('/users', signupRoutes);
app.use('/users', signinRoutes);
app.use('/api/expenses/ai', generativeAiRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/premium', subscriptionRoutes);
app.use('/api/premium', premiumRoute);
app.use('/password',forgotRoutes)
app.use('/api',reportRoutes)




// frontend static files
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

app.get('/forgot-password', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/forgotPassword/forgot.html'));
});

app.get('/password/resetpassword/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/resetPassword/reset.html'));
});

app.get('/', (req, res) => {
    res.redirect('/signin');
});

// error handling middleware
app.use(errorhandling);

database.authenticate()
    .then(() => {
        console.log('Database connected successfully.');
        app.listen(port, () => {
            console.log('Server is listening ...');
        });
    })
    .catch((err) => {
        console.log(err.message);
    });