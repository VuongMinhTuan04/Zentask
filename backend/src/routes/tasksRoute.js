import express from 'express';
import {
    createTask,
    deleteTask,
    pagination,
    showTask,
    sortTask,
    updateTask
} from '../controllers/tasksController.js';
import { validateObjectId } from '../middlewares/validateMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { searchUsers } from '../controllers/userController.js';

const router = express.Router();

router.get('/tasks/', authMiddleware, showTask);
router.get("/users/search", authMiddleware, searchUsers);
router.get('/tasks/sort', authMiddleware, sortTask);
router.get('/tasks/pagination', authMiddleware, pagination);
router.post('/tasks/create', authMiddleware, createTask);
router.patch('/tasks/:id', authMiddleware, validateObjectId, updateTask);
router.delete('/tasks/:id', authMiddleware, validateObjectId, deleteTask);

export default router;