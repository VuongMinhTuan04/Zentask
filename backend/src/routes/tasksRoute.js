import express from 'express';
import {
    createTask,
    deleteTask,
    editTask,
    pagination,
    showTask,
    sortTask,
    updateTask
} from '../controllers/tasksController.js';
import { validateObjectId } from '../middlewares/validateMiddleware.js';

const router = express.Router();

router.get('/tasks/', showTask);
router.get('/tasks/sort', sortTask);
router.get('/tasks/pagination', pagination);
router.post('/tasks/create', createTask);
router.get('/tasks/:id', validateObjectId, editTask);
router.patch('/tasks/:id', validateObjectId, updateTask);
router.delete('/tasks/:id', validateObjectId, deleteTask);

export default router;