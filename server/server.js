import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

import express from 'express'; // ES6 and newer javascript

import authMiddleware from './middlewares/auth.js';

import projectsRoutes from './routes/projects-routes.js';
import userRoutes from './routes/user-routes.js';
import contactsRoutes from './routes/contacts-routes.js';
import qualificationsRoutes from './routes/qualifications-routes.js';


// Establish DB Connection
mongoose.connect(process.env.MONGO_URI);
const connection = mongoose.connection; 
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

const app = express(); 

app.use(express.json()); // for parsing application/json
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to My Portfolio application.'
    });
});

app.use('/api/projects', authMiddleware, projectsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/qualifications', qualificationsRoutes);


app.listen(5000);

console.log('Server is running on http://localhost:5000');