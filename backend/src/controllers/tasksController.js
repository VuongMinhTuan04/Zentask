import { 
    getAllTaskService,
    createTaskService,
    updateTaskService,
    deleteTaskService,
    sortTaskService,
    paginationService
} from "../services/taskService.js";

export const showTask = async (req, res) => {
    try {
        const task = await getAllTaskService(req.user.userId);

        res.status(200).json({ message: "Show Tasks Success", data: task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTask = async (req, res) => {
    try {
        const task = await createTaskService(req.body, req.user.userId);

        res.status(201).json({ message: "Create Task Success", data: task });
    } catch (error) {
        if (error.message === "Title already exists") {
            return res.status(409).json({ message: error.message });
        }

        if (error.message === "Forbidden") {
            return res.status(403).json({ message: error.message });
        }

        res.status(400).json({ message: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await updateTaskService(req.params.id, req.body, req.user.userId);

        res.status(200).json({ message: "Update Task Success", data: task });
    } catch (error) {
        if (error.message === "Task not found") {
            return res.status(404).json({ message: error.message });
        }

        if (error.message === "Invalid status") {
            return res.status(400).json({ message: error.message });
        }

        if (error.message === "Forbidden") {
            return res.status(403).json({ message: error.message });
        }

        res.status(500).json({ message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        await deleteTaskService(req.params.id, req.user.userId);
        
        res.status(200).json({ message: "Delete Task Success" });
    } catch (error) {
        if (error.message === "Task not found") {
            return res.status(404).json({ message: error.message });
        }

        if (error.message === "Forbidden") {
            return res.status(403).json({ message: error.message });
        }

        res.status(500).json({ message: error.message });
    }
};

export const sortTask = async (req, res) => {
    try {
        const task = await sortTaskService(req.user.userId, req.query.sort, req.query.order);

        res.status(200).json({ message: 'Sort Task Success', data: task });
    } catch (error) {
        if (error.message === "Task not found") {
            return res.status(404).json({ message: error.message });
        }

        if (error.message === "Invalid sort field") {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ message: error.message });
    }
}

export const pagination = async (req, res) => {
    try {
        const task = await paginationService(
            req.user.userId,
            req.query.page,
            req.query.limit,
            req.query.sort,
            req.query.order
        );

        res.status(200).json({
            message: 'Pagination Task Success',
            ...task
        });
    } catch (error) {
        if (error.message === "Task not found") {
            return res.status(404).json({ message: error.message });
        }

        res.status(500).json({ message: error.message });
    }
}