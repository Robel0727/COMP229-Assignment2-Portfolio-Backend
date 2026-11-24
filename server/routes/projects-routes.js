import express from 'express';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import {
    createProject,
    deleteProject,
    getAllProjects,
    getProjectById,
    updateProject
} from '../controllers/projects-controllers.js';

const router = express.Router();

// REST API simulate CRUD

// READs
router.get("/", getAllProjects);
router.get("/:id", getProjectById);

// CREATE
router.post("/", adminMiddleware, createProject);

// UPDATE
router.put("/:id", adminMiddleware, updateProject);

// DELETE
router.delete("/:id", adminMiddleware, deleteProject);

export default router;