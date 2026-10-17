
import mongoose from 'mongoose';
import ProjectModel from '../models/project-model.js';

// GET: Retrieve all projects
export const getAllProjects = async (req, res) => {
    try {
        const projects = await ProjectModel.find();
        return res.status(200).json(projects);
    } catch (error) {
        console.error('Error retrieving projects:', error.message);
        return res.status(500).json({
            message: 'Failed to retrieve projects'
        });
    }
};

// GET: Retrieve a project by ID
export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: 'Invalid project ID'
            });
        }

        const project = await ProjectModel.findById(id);

        if (!project) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        return res.status(200).json(project);
    } catch (error) {
        console.error('Error retrieving project:', error.message);
        return res.status(500).json({
            message: 'Failed to retrieve project'
        });
    }
};

// POST: Create a new project
export const createProject = async (req, res) => {
    try {
        const { name, description, startDate, endDate } = req.body;

        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                message: 'Project name is required'
            });
        }

        if (typeof description !== 'string' || !description.trim()) {
            return res.status(400).json({
                message: 'Project description is required'
            });
        }

        if (startDate && Number.isNaN(Date.parse(startDate))) {
            return res.status(400).json({
                message: 'Invalid start date'
            });
        }

        if (endDate && Number.isNaN(Date.parse(endDate))) {
            return res.status(400).json({
                message: 'Invalid end date'
            });
        }

        if (startDate && endDate &&
            new Date(endDate) < new Date(startDate)) {
            return res.status(400).json({
                message: 'End date cannot be before start date'
            });
        }

        const newProject = new ProjectModel({
            name: name.trim(),
            description: description.trim(),
            startDate,
            endDate
        });

        const savedProject = await newProject.save();
        return res.status(201).json(savedProject);
    } catch (error) {
        console.error('Error creating project:', error.message);

        if (error.name === 'ValidationError' ||
            error.name === 'CastError') {
            return res.status(400).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: 'Failed to create project'
        });
    }
};

// PUT: Update a project by ID
export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: 'Invalid project ID'
            });
        }

        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: 'Provide at least one field to update'
            });
        }

        const existingProject = await ProjectModel.findById(id);

        if (!existingProject) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        const updateData = { ...req.body };

        if (updateData.name !== undefined) {
            if (typeof updateData.name !== 'string' ||
                !updateData.name.trim()) {
                return res.status(400).json({
                    message: 'Project name cannot be empty'
                });
            }

            updateData.name = updateData.name.trim();
        }

        if (updateData.description !== undefined) {
            if (typeof updateData.description !== 'string' ||
                !updateData.description.trim()) {
                return res.status(400).json({
                    message: 'Project description cannot be empty'
                });
            }

            updateData.description = updateData.description.trim();
        }

        const startDate = updateData.startDate !== undefined
            ? updateData.startDate
            : existingProject.startDate;

        const endDate = updateData.endDate !== undefined
            ? updateData.endDate
            : existingProject.endDate;

        if (startDate && Number.isNaN(Date.parse(startDate))) {
            return res.status(400).json({
                message: 'Invalid start date'
            });
        }

        if (endDate && Number.isNaN(Date.parse(endDate))) {
            return res.status(400).json({
                message: 'Invalid end date'
            });
        }

        if (startDate && endDate &&
            new Date(endDate) < new Date(startDate)) {
            return res.status(400).json({
                message: 'End date cannot be before start date'
            });
        }

        const updatedProject = await ProjectModel.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error.message);

        if (error.name === 'ValidationError' ||
            error.name === 'CastError') {
            return res.status(400).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: 'Failed to update project'
        });
    }
};

// DELETE: Delete a project by ID
export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: 'Invalid project ID'
            });
        }

        const deletedProject = await ProjectModel.findByIdAndDelete(id);

        if (!deletedProject) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        return res.status(200).json({
            message: 'Project deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting project:', error.message);

        return res.status(500).json({
            message: 'Failed to delete project'
        });
    }
};
