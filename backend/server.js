const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./models');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const usersRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', usersRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Full-stack app backend is running!' });
});

// Database connection and server start
const startServer = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Database connected successfully');

        // Sync database (create tables if they don't exist)
        await db.sequelize.sync();
        console.log('Database synchronized');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
};

startServer();