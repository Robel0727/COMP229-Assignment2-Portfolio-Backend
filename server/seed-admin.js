import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/user-model.js';

const seedAdmin = async () => {
    try {
        const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
        const passwordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!process.env.MONGO_URI || !email || !passwordHash) {
            throw new Error('Missing required environment variables.');
        }

        await mongoose.connect(process.env.MONGO_URI);

        await User.collection.updateOne(
            { email },
            {
                $set: {
                    name: 'Administrator',
                    email,
                    password: passwordHash,
                    role: 'admin',
                    updatedAt: new Date()
                },
                $setOnInsert: {
                    createdAt: new Date()
                }
            },
            { upsert: true }
        );

        console.log('Administrator account created successfully!');
    } catch (error) {
        console.error('Administrator setup failed:', error.message);
    } finally {
        await mongoose.disconnect();
    }
};

seedAdmin();