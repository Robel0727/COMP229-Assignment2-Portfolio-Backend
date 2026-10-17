
import QualificationModel from '../models/qualification-model.js';

// GET: Retrieve all qualifications
export const getAllQualifications = async (req, res) => {
    try {
        const qualifications = await QualificationModel.find();
        return res.status(200).json(qualifications);
    } catch (error) {
        console.error('Get qualifications error:', error.message);
        return res.status(500).json({
            message: 'Failed to retrieve qualifications'
        });
    }
};

// GET: Retrieve one qualification
export const getQualificationById = async (req, res) => {
    try {
        const qualification = await QualificationModel.findById(req.params.id);

        if (!qualification) {
            return res.status(404).json({
                message: 'Qualification not found'
            });
        }

        return res.status(200).json(qualification);
    } catch (error) {
        return res.status(400).json({
            message: 'Invalid qualification ID'
        });
    }
};

// POST: Create a qualification
export const createQualification = async (req, res) => {
    try {
        const { title, institution, description, date } = req.body;

        if (
            typeof title !== 'string' || !title.trim() ||
            typeof institution !== 'string' || !institution.trim()
        ) {
            return res.status(400).json({
                message: 'Title and institution are required'
            });
        }

        const qualification = await QualificationModel.create({
            title: title.trim(),
            institution: institution.trim(),
            description,
            date
        });

        return res.status(201).json(qualification);
    } catch (error) {
        console.error('Create qualification error:', error.message);
        return res.status(400).json({
            message: 'Failed to create qualification'
        });
    }
};

// PUT: Update a qualification
export const updateQualification = async (req, res) => {
    try {
        const qualification = await QualificationModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!qualification) {
            return res.status(404).json({
                message: 'Qualification not found'
            });
        }

        return res.status(200).json(qualification);
    } catch (error) {
        return res.status(400).json({
            message: 'Failed to update qualification'
        });
    }
};

// DELETE: Delete a qualification
export const deleteQualification = async (req, res) => {
    try {
        const qualification = await QualificationModel.findByIdAndDelete(
            req.params.id
        );

        if (!qualification) {
            return res.status(404).json({
                message: 'Qualification not found'
            });
        }

        return res.status(200).json({
            message: 'Qualification deleted successfully'
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Failed to delete qualification'
        });
    }
};
