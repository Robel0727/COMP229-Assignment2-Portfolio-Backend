
import mongoose from 'mongoose';

const qualificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Qualification title is required'],
            trim: true
        },
        institution: {
            type: String,
            required: [true, 'Institution is required'],
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        date: {
            type: Date
        }
    },
    { timestamps: true }
);

export default mongoose.model('Qualification', qualificationSchema);
