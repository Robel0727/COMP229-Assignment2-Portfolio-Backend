import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

import {
    createProject,
    deleteProject,
    getAllProjects,
    getProjectById,
    updateProject
} from '../controllers/projects-controllers.js';

const router = express.Router();

// READ: Public access
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

// CREATE: Authentication and administrator authorization
router.post('/', authMiddleware, adminMiddleware, createProject);

// UPDATE: Authentication and administrator authorization
router.put('/:id', authMiddleware, adminMiddleware, updateProject);

// DELETE: Authentication and administrator authorization
router.delete('/:id', authMiddleware, adminMiddleware, deleteProject);

export default router;