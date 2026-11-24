import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true
        },
        phone: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            trim: true
        }
    },
    { timestamps: true }
);

export default mongoose.model('Contact', contactSchema);