
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Project name is required'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Project description is required'],
            trim: true
        },
        startDate: {
            type: Date
        },
        endDate: {
            type: Date,
            validate: {
                validator: function (value) {
                    return !value ||
                        !this.startDate ||
                        value >= this.startDate;
                },
                message: 'End date cannot be before start date'
            }
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Project', projectSchema);

