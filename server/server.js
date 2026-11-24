import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import express from 'express';

import authMiddleware from './middlewares/auth.js';

import projectsRoutes from './routes/projects-routes.js';
import userRoutes from './routes/user-routes.js';
import contactsRoutes from './routes/contacts-routes.js';
import qualificationsRoutes from './routes/qualifications-routes.js';
import cors from 'cors';

const app = express();

// Middleware
// Middleware
app.use(express.json());

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174']
}));

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to My Portfolio application.'
    });
});

// API routes
app.use('/api/projects', authMiddleware, projectsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/qualifications', qualificationsRoutes);

// Connect to MongoDB before starting the server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB database connection established successfully');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    });