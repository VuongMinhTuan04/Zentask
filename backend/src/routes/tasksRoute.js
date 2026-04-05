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
import { jwtMiddleware } from '../middlewares/authMiddleware.js';
import { searchUsers } from '../controllers/userController.js';

const router = express.Router();

router.get('/tasks/', jwtMiddleware, showTask);
router.get("/users/search", jwtMiddleware, searchUsers);
router.get('/tasks/sort', jwtMiddleware, sortTask);
router.get('/tasks/pagination', jwtMiddleware, pagination);
router.post('/tasks/create', jwtMiddleware, createTask);
router.patch('/tasks/:id', jwtMiddleware, validateObjectId, updateTask);
router.delete('/tasks/:id', jwtMiddleware, validateObjectId, deleteTask);

export default router;