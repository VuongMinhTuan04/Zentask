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
        const cleanTitle = title?.trim();

        if (!cleanTitle) {
            throw new Error("Title is required");
        }

        const memberIds = Array.isArray(members) ? members : [];
        const uniqueMembers = [...new Set(memberIds.map(String))].filter(
            (id) => id !== String(userId)
        );

        const participantIds = [...new Set([String(userId), ...uniqueMembers])];
        const existingTasks = await Task.find({ title: cleanTitle })
            .populate("createdBy", "fullname username")
            .populate("members", "fullname username");

        const conflictTask = existingTasks.find((task) => {
            const existingParticipantIds = [
                String(task.createdBy?._id),
                ...(task.members || []).map((m) => String(m._id)),
            ];

            return existingParticipantIds.some((id) => participantIds.includes(id));
        });

        const hasMembers = uniqueMembers.length > 0;

        if (conflictTask) {
            if (!hasMembers) {
                throw new Error("Task này đã tồn tại");
            }

            const conflictingNames = [];
            const creatorId = String(conflictTask.createdBy?._id);

            if (participantIds.includes(creatorId)) {
                conflictingNames.push(
                    conflictTask.createdBy?.fullname || conflictTask.createdBy?.username
                );
            }

            (conflictTask.members || []).forEach((m) => {
                if (participantIds.includes(String(m._id))) {
                    conflictingNames.push(m.fullname || m.username);
                }
            });

            const uniqueNames = [...new Set(conflictingNames)].filter(Boolean);

            if (uniqueNames.length === 1) {
                throw new Error(
                    `Thành viên ${uniqueNames[0]} đã có task "${cleanTitle}" này`
                );
            }

            throw new Error(
                `Các thành viên ${uniqueNames.join(", ")} đã có task "${cleanTitle}" này`
            );
        }

        const task = await Task.create({
            title: cleanTitle,
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
};

export const updateTaskService = async (id, data, userId) => {
    try {
        const task = await Task.findById(id);

        if (!task) {
            throw new Error("Task not found");
        }

        const isOwner = task.createdBy.toString() === userId;

        if (!isOwner) {
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