import { STATUS } from "../constants/status.js";
import Task from "../models/Task.js";

const buildAccessibleQuery = (userId) => ({
    $or: [{ createdBy: userId }, { members: userId }],
});

export const getAllTaskService = async (userId) => {
    try {
        const query = buildAccessibleQuery(userId);

        return await Task.find(query)
            .populate("createdBy", "fullname username")
            .populate("members", "fullname username")
            .sort({ createdAt: "desc" });
    } catch (error) {
        throw error;
    }
}

export const createTaskService = async (data, userId) => {
    try {
        const { title, description, members = [] } = data;

        if (!title?.trim()) {
            throw new Error("Title is required");
        }

        const duplicate = await Task.findOne({ title: title.trim() });

        if (duplicate) {
            throw new Error("Title already exists");
        }

        const memberIds = Array.isArray(members) ? members : [];
        const uniqueMembers = [...new Set(memberIds.map(String))].filter((id) => id !== String(userId));

        const task = await Task.create({
            title: title.trim(),
            description,
            status: STATUS.TODO,
            createdBy: userId,
            members: uniqueMembers,
        });

        return await Task.findById(task._id)
            .populate("createdBy", "fullname username")
            .populate("members", "fullname username");
    } catch (error) {
        throw error;
    }
}

export const updateTaskService = async (id, data, userId) => {
    try {
        const task = await Task.findById(id);

        if (!task) {
            throw new Error("Task not found");
        }

        const canAccess = task.createdBy.toString() === userId || task.members.some((m) => m.toString() === userId);

        if (!canAccess) {
            throw new Error("Forbidden");
        }

        if (data.description !== undefined) {
            task.description = data.description;
        }

        if (data.status !== undefined) {
            if (!Object.values(STATUS).includes(data.status)) {
                throw new Error("Invalid status");
            }

            task.status = data.status;

            if (data.status === STATUS.DONE) {
                task.completedAt = new Date();
            } else {
                task.completedAt = undefined;
            }
        }

        if (Array.isArray(data.members)) {
            const uniqueMembers = [...new Set([task.createdBy.toString(), ...data.members])];
            task.members = uniqueMembers;
        }

        await task.save();

        return await Task.findById(id)
            .populate("createdBy", "fullname username")
            .populate("members", "fullname username");
    } catch (error) {
        throw error;
    }
}

export const deleteTaskService = async (id, userId) => {
    try {
        const task = await Task.findById(id);

        if (!task) {
            throw new Error("Task not found");
        }

        if (String(task.createdBy) !== String(userId)) {
            throw new Error("Forbidden");
        }

        await Task.findByIdAndDelete(id);
        return true;
    } catch (error) {
        throw error;
    }
};

export const sortTaskService = async (userId, sort, order) => {
    try {
        const field = ["title", "createdAt", "status"];
        const sortOrder = order?.toLowerCase() === "desc" ? "desc" : "asc";

        if (sort && !field.includes(sort)) {
            throw new Error("Invalid sort field");
        }

        const query = buildAccessibleQuery(userId);
        const option = sort ? { [sort]: sortOrder } : { createdAt: "desc" };

        return await Task.find(query)
            .populate("createdBy", "fullname username")
            .populate("members", "fullname username")
            .sort(option);
    } catch (error) {
        throw error;
    }
};

export const paginationService = async (userId, page = 1, limit = 5, sort, order) => {
    try {
        const parsedPage = Number.parseInt(page, 10);
        const parsedLimit = Number.parseInt(limit, 10);

        if (
            Number.isNaN(parsedPage) ||
            Number.isNaN(parsedLimit) ||
            parsedPage < 1 ||
            parsedLimit < 1
        ) {
            throw new Error("Invalid pagination values");
        }

        const allowedFields = ["title", "createdAt", "status"];
        if (sort && !allowedFields.includes(sort)) {
            throw new Error("Invalid sort field");
        }

        const sortOrder = order?.toLowerCase() === "desc" ? "desc" : "asc";
        const option = sort ? { [sort]: sortOrder } : { createdAt: "desc" };

        const query = buildAccessibleQuery(userId);
        const totalItems = await Task.countDocuments(query);
        const totalPages = Math.max(1, Math.ceil(totalItems / parsedLimit));
        const currentPage = Math.min(parsedPage, totalPages);
        const skip = (currentPage - 1) * parsedLimit;

        const data = await Task.find(query)
            .populate("createdBy", "fullname username")
            .populate("members", "fullname username")
            .sort(option)
            .skip(skip)
            .limit(parsedLimit);

        return { page: currentPage, limit: parsedLimit, totalItems, totalPages, data };
    } catch (error) {
        throw error;
    }
};